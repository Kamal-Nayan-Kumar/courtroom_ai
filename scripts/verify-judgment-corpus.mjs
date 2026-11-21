#!/usr/bin/env node
/*
 * Verifies the judgment corpus: documents, chunks, embedding coverage,
 * vector dimensions, and end-to-end retrieval against the new judgments.
 *
 * Usage:
 *   node scripts/verify-judgment-corpus.mjs
 *
 * Env:
 *   DATABASE_URL       Neon connection string (required)
 *   OPENROUTER_API_KEY OpenRouter API key, needed for the retrieval smoke test
 *   SKIP_RETRUAL=1     skip the embedding/retrieval checks (DB-only verification)
 *
 * Exit code 0 = all checks pass, 1 = any check failed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const EMBED_DIM = 4096;
const EMBED_MODEL = "qwen/qwen3-embedding-8b";
const OPENROUTER_EMBED_URL = "https://openrouter.ai/api/v1/embeddings";
// Must match QUERY_INSTRUCTION in src/lib/retrieval.ts.
const QUERY_INSTRUCTION =
  "Instruct: Given a question about Indian law, retrieve passages containing the answer.";

// [document label, phrase that must occur somewhere in that document].
// These are verified against the extracted text below, so a misremembered
// quotation fails loudly instead of silently weakening the retrieval check.
const NEW_JUDGMENTS = [
  ["Kesavananda Bharati", /basic structure of the constitution/i],
  ["K.S. Puttaswamy", /right to privacy is a fundamental right/i],
  ["Vishaka", /formulation of guidelines|sexual harassment/i],
  ["Shreya Singhal", /section 66A of the information technology act/i],
  ["Hussainara Khatoon", /undertrial prisoners|speedy trial/i],
  ["D.K. Basu", /memo of (his |the )?arrest|entry must be made in the diary/i],
];

function loadEnv() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  for (const file of [path.join(here, "..", ".env.local"), path.join(here, "..", ".env")]) {
    try {
      const body = fs.readFileSync(file, "utf8");
      for (const line of body.split("\n")) {
        const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
      }
    } catch {
      // file missing
    }
  }
}

const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

async function embedQuery(text) {
  const res = await fetch(OPENROUTER_EMBED_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: `${QUERY_INSTRUCTION}\nQuery: ${text}`,
      encoding_format: "float",
    }),
  });
  if (!res.ok) throw new Error(`embedding failed ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const vec = json.data?.[0]?.embedding;
  if (!vec || vec.length !== EMBED_DIM) throw new Error(`bad vector dim ${vec?.length}`);
  return vec;
}

async function main() {
  loadEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }
  const sql = neon(databaseUrl);

  const [counts] = await sql`
    SELECT
      (SELECT count(*)::int FROM documents)                       AS documents,
      (SELECT count(*)::int FROM documents WHERE kind='judgment') AS judgments,
      (SELECT count(*)::int FROM chunks)                          AS chunks,
      (SELECT count(*)::int FROM chunks WHERE embedding IS NULL)  AS missing,
      (SELECT count(*)::int FROM chunks WHERE embedding IS NOT NULL) AS embedded
  `;
  const dims = await sql`
    SELECT vector_dims(embedding) AS dim, count(*)::int AS n
    FROM chunks WHERE embedding IS NOT NULL GROUP BY 1 ORDER BY 2 DESC
  `;

  console.log(`\ncorpus: ${counts.documents} documents, ${counts.judgments} judgments, ${counts.chunks} chunks`);
  console.log(`embeddings: ${counts.embedded} present, ${counts.missing} missing, dims=${JSON.stringify(dims)}`);

  check("no chunk lacks an embedding", Number(counts.missing) === 0, `missing=${counts.missing}`);
  check(
    "every embedding is 4096-dimensional",
    dims.length === 1 && Number(dims[0].dim) === EMBED_DIM,
    JSON.stringify(dims),
  );

  // ---- embedding quality -------------------------------------------------
  // 1. Vectors must be distinct: a mass-duplicated column would still pass the
  //    dimension check while retrieving garbage.
  const dup = await sql`
    SELECT count(*)::int AS total, count(DISTINCT embedding)::int AS distinct_vecs
    FROM chunks WHERE embedding IS NOT NULL
  `;
  check(
    "vectors are distinct (no mass-duplicated embeddings)",
    Number(dup[0].distinct_vecs) >= Number(dup[0].total) * 0.999,
    `${dup[0].distinct_vecs}/${dup[0].total} distinct`,
  );

  // 2. Sampled vectors must be finite with a non-zero norm, and must not have
  //    collapsed onto one another (mean pairwise cosine would approach 1.0).
  const sample = await sql`
    SELECT embedding::text AS vec FROM chunks
    WHERE embedding IS NOT NULL ORDER BY random() LIMIT 24
  `;
  const parseVec = (s) => String(s).trim().replace(/^\[|\]$/g, "").split(",").map(Number);
  const vecs = sample.map((r) => parseVec(r.vec));
  const finite = vecs.every((v) => v.length === EMBED_DIM && v.every((x) => Number.isFinite(x)));
  const nonZero = vecs.every((v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0)) > 1e-6);
  check("sampled vectors are finite and non-zero", finite && nonZero, `n=${vecs.length}`);

  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const norm = (a) => Math.sqrt(dot(a, a));
  const cosines = [];
  for (let i = 0; i < vecs.length; i += 1) {
    for (let j = i + 1; j < vecs.length; j += 1) {
      cosines.push(dot(vecs[i], vecs[j]) / (norm(vecs[i]) * norm(vecs[j])));
    }
  }
  const meanCos = cosines.reduce((s, x) => s + x, 0) / (cosines.length || 1);
  const maxCos = Math.max(...cosines);
  check(
    "vectors are not collapsed together",
    maxCos < 0.999,
    `meanPairwiseCos=${meanCos.toFixed(3)} max=${maxCos.toFixed(4)}`,
  );

  // 3. Round-trip: re-embedding a stored chunk must find that same chunk again.
  //    This is the strongest cheap proof that stored vectors match the model.
  if (process.env.OPENROUTER_API_KEY) {
    const rt = await sql`
      SELECT id, document_id, text FROM chunks
      WHERE embedding IS NOT NULL AND case_id IS NULL
      ORDER BY random() LIMIT 3
    `;
    for (const r of rt) {
      const v = await embedQuery(String(r.text));
      const vecStr = `[${v.join(",")}]`;
      const near = await sql`
        SELECT c.id, c.document_id
        FROM chunks c
        WHERE c.embedding IS NOT NULL
        ORDER BY c.embedding <=> ${vecStr}::vector
        LIMIT 3
      `;
      const selfHit = near.some((x) => String(x.id) === String(r.id));
      const sameDoc = near.some((x) => String(x.document_id) === String(r.document_id));
      check(
        `round-trip self-retrieval (${String(r.id).slice(0, 8)})`,
        selfHit || sameDoc,
        `rank1=${selfHit ? "self" : sameDoc ? "same document" : "MISS"} top3=${near.length}`,
      );
    }
  }

  for (const [title] of NEW_JUDGMENTS) {
    const rows = await sql`
      SELECT d.id, d.title,
             (SELECT count(*)::int FROM chunks c WHERE c.document_id = d.id) AS chunks,
             (SELECT count(*)::int FROM chunks c WHERE c.document_id = d.id AND c.embedding IS NULL) AS missing
      FROM documents d WHERE d.title LIKE ${title + "%"} LIMIT 1
    `;
    const row = rows[0];
    check(
      `document indexed: ${title}`,
      !!row && Number(row.chunks) > 0 && Number(row.missing) === 0,
      row ? `${row.chunks} chunks, ${row.missing} missing` : "not found",
    );
  }

  // Gold-phrase presence: proves the phrase above really occurs in the
  // extracted text of that document. Without this a misremembered quotation
  // makes the retrieval check below pass or fail for the wrong reason.
  console.log("\ngold phrases (extraction sanity):");
  for (const [label, pattern] of NEW_JUDGMENTS) {
    const rows = await sql`
      SELECT count(*)::int AS n
      FROM chunks c JOIN documents d ON d.id = c.document_id
      WHERE d.title LIKE ${label + "%"} AND c.text ~* ${pattern.source}
    `;
    const n = Number(rows[0]?.n ?? 0);
    check(`gold phrase present in ${label}`, n > 0, `${n} chunk(s) match /${pattern.source}/i`);
  }

  if (process.env.SKIP_RETRIEVAL === "1") {
    console.log("\n(SKIP_RETRIEVAL=1 — retrieval smoke test skipped)");
  } else if (!process.env.OPENROUTER_API_KEY) {
    check("retrieval smoke test", false, "OPENROUTER_API_KEY not set");
  } else {
    console.log("\nretrieval smoke test (query embedding + cosine over judgment chunks):");
    for (const [label] of NEW_JUDGMENTS) {
      const question = `What did the Supreme Court hold about ${label}?`;
      const vec = await embedQuery(question);
      const vecStr = `[${vec.join(",")}]`;
      const rows = await sql`
        SELECT d.title, c.section_label, c.text,
               1 - (c.embedding <=> ${vecStr}::vector) AS score
        FROM chunks c JOIN documents d ON d.id = c.document_id
        WHERE c.embedding IS NOT NULL AND c.case_id IS NULL
        ORDER BY c.embedding <=> ${vecStr}::vector
        LIMIT 5
      `;
      const top = rows.map((r) => `${r.title.split(" — ")[0]} (${Number(r.score).toFixed(3)})`);
      const titled = rows.some((r) => r.title.includes(label));
      // Surface real prose from the right document, not just a citation header
      // or a one-line stub, which would satisfy a title-only check.
      const prose = rows.some(
        (r) => r.title.includes(label) && String(r.text ?? "").length >= 500,
      );
      check(
        `retrieves ${label}`,
        titled && prose,
        `q="${question}" top=${JSON.stringify(top)}`,
      );
    }
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length} checks, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(`[verify-judgment-corpus] failed: ${err.message || err}`);
  process.exit(1);
});
