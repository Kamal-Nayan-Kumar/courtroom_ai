/**
 * Retrieval evaluation for Courtroom AI.
 *
 * Updated for Qwen3-Embedding-8B (4096-dim) via OpenRouter.
 *
 * Builds a labelled question set (with expected chunk section labels) per case,
 * runs three retrieval settings (keyword-only, vector-only, hybrid) against the
 * live database through the same code path used by /api/rag/ask, and reports
 * precision@k, recall@k, MRR@k, and citation accuracy.
 *
 * Also includes questions for the three new Supreme Court judgments:
 * - Sita Soren v. Union of India (2024 INSC 161)
 * - Bilkis Yakub Rasool v. Union of India (2024 INSC 24)
 * - Sukanya Shantha v. Union of India (2024 INSC 753)
 *
 * Usage:
 *   node scripts/eval-rag.mjs            # uses DATABASE_URL from .env / .env.local
 *   node scripts/eval-rag.mjs --k 5      # override k
 *
 * Output: JSON on stdout, plus a Markdown summary on stderr.
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}

loadEnv();

const args = process.argv.slice(2);
const kArgIndex = args.indexOf("--k");
const K = kArgIndex >= 0 ? Number(args[kArgIndex + 1]) : 5;
const K10 = 10;

const EMBED_DIM = 4096;
const EMBED_MODEL = "qwen/qwen3-embedding-8b";

/** Labelled question set. expected = section labels or partial matches of the correct chunk(s). */
const LABELLED_SET = {
  "delhi-liquor-2022": [
    { q: "What is criminal conspiracy under BNS section 61(2)?", expected: ["BNS § 61(2)"] },
    { q: "How many ED summons were issued before the arrest?", expected: ["Case fact"] },
    { q: "What does section 63 of the Bharatiya Sakshya Adhiniyam say about electronic records?", expected: ["BSA § 63"] },
    { q: "What is money laundering under PMLA section 3?", expected: ["PMLA § 3"] },
    { q: "When was the Supreme Court interim bail granted?", expected: ["Case fact"] },
    { q: "What did the trial court bail order say and when was it stayed?", expected: ["Case fact"] },
    { q: "When was the CBI arrest from Tihar jail?", expected: ["Case fact"] },
    { q: "What were the bail order dates and the CBI arrest date?", expected: ["Case fact"] },
    { q: "Define criminal conspiracy and the punishment for it.", expected: ["BNS § 61(2)"] },
    { q: "What certificate is needed for secondary electronic evidence?", expected: ["BSA § 63"] },
    { q: "Explain the definition of money laundering and its punishment.", expected: ["PMLA § 3"] },
    { q: "Summarise the chronology of interim bail and surrender.", expected: ["Case fact"] },
  ],
  "electoral-bonds-2024": [
    { q: "What does Article 19(1)(a) guarantee regarding political funding?", expected: ["Constitution Art 19(1)(a)"] },
    { q: "Which judgment struck down the Electoral Bonds Scheme?", expected: ["Case fact"] },
    { q: "Who presided over the Constitution Bench that decided the case?", expected: ["Case fact"] },
    { q: "Which statutes were amended regarding anonymous donations?", expected: ["Case fact"] },
    { q: "What is the voter's right to information about donations?", expected: ["Constitution Art 19(1)(a)"] },
    { q: "Name the case citation 2024 INSC 113 and its outcome.", expected: ["Case fact"] },
    { q: "List the judges on the bench.", expected: ["Case fact"] },
    { q: "Which company law and election law amendments were struck down?", expected: ["Case fact"] },
  ],
  // Cross-case queries against judgment documents (no case_id filter)
  "__cross_case__": [
    { q: "Can a legislator be prosecuted for bribery related to voting?", expected: ["2024 INSC 161"], caseId: null },
    { q: "Does Article 105(2) grant immunity from criminal prosecution for bribery?", expected: ["2024 INSC 161"], caseId: null },
    { q: "What did the Supreme Court hold about remission of convicts in the Bilkis Bano case?", expected: ["2024 INSC 24"], caseId: null },
    { q: "Which state has jurisdiction to grant remission under Section 432 CrPC?", expected: ["2024 INSC 24"], caseId: null },
    { q: "What did the Supreme Court say about caste discrimination in prisons?", expected: ["2024 INSC 753"], caseId: null },
    { q: "Does the assignment of prison labour based on caste violate fundamental rights?", expected: ["2024 INSC 753"], caseId: null },
    { q: "What is the constitutional position on untouchability in Indian prisons?", expected: ["2024 INSC 753"], caseId: null },
    { q: "Can the Electoral Bonds Scheme be challenged under Article 19(1)(a)?", expected: ["2024 INSC 113", "Constitution Art 19(1)(a)"], caseId: null },
    { q: "What are the legislative privileges regarding parliamentary speech?", expected: ["2024 INSC 161"], caseId: null },
    { q: "What are the rights of prisoners under Articles 14 and 21?", expected: ["2024 INSC 753"], caseId: null },
  ],
  // Queries whose gold document is one of the ten landmark judgments added later.
  // Kept in a separate bucket so __cross_case__ stays comparable with the
  // baseline recorded in data/eval-results.json.
  "__new_judgments__": [
    { q: "Can Parliament alter the basic structure of the Constitution under Article 368?", expected: ["AIR 1973 SC 1461"] },
    { q: "What is the basic structure doctrine of the Constitution?", expected: ["AIR 1973 SC 1461"] },
    { q: "Could a citizen challenge his detention during the Emergency by filing habeas corpus?", expected: ["AIR 1976 SC 1207"] },
    { q: "What did the Supreme Court hold about Article 21 during the Emergency?", expected: ["AIR 1976 SC 1207"] },
    { q: "Does Article 21 require the procedure established by law to be fair, just and reasonable?", expected: ["1978 AIR 597"] },
    { q: "On what grounds can the government impound a passport under natural justice?", expected: ["1978 AIR 597"] },
    { q: "Are undertrial prisoners entitled to a speedy trial?", expected: ["1979 AIR 1360"] },
    { q: "Can an accused be released on a personal bond without sureties?", expected: ["1979 AIR 1360"] },
    { q: "What guidelines did the Supreme Court frame to prevent sexual harassment at the workplace?", expected: ["AIR 1997 SC 3011"] },
    { q: "Who must constitute the internal complaint committee against workplace harassment?", expected: ["AIR 1997 SC 3011"] },
    { q: "What safeguards must the police follow when arresting a person?", expected: ["AIR 1997 SC 610"] },
    { q: "Must a friend or relative of an arrested person be informed about the arrest?", expected: ["AIR 1997 SC 610"] },
    { q: "Is Section 66A of the Information Technology Act unconstitutional?", expected: ["2015 INSC 257"] },
    { q: "Can the government block internet content without a reasoned order under Section 69A?", expected: ["2015 INSC 257"] },
    { q: "Is the right to privacy a fundamental right protected by Article 21?", expected: ["2017 INSC 801"] },
    { q: "Which earlier judgments did the nine-judge bench overrule on the question of privacy?", expected: ["2017 INSC 801"] },
    { q: "What sentence did the Supreme Court confirm in the Nirbhaya gang rape appeal?", expected: ["2017 INSC 448"] },
    { q: "Which sections of the Indian Penal Code were applied in the Nirbhaya case?", expected: ["2017 INSC 448"] },
    { q: "Did the Supreme Court strike down Section 377 of the Indian Penal Code?", expected: ["2018 INSC 790"] },
    { q: "Is consensual sex between adults protected under Articles 14, 15 and 21?", expected: ["2018 INSC 790"] },
  ],
};

function keywordScore(text, terms) {
  if (!terms.length) return 0;
  const hay = text.toLowerCase();
  let hit = 0;
  for (const t of terms) if (t && hay.includes(t)) hit += 1;
  return hit / terms.length;
}

function termsOf(question) {
  return question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
}

async function embedOne(text) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: [text],
      encoding_format: "float",
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const vec = json?.data?.[0]?.embedding;
  if (!Array.isArray(vec) || vec.length !== EMBED_DIM) return null;
  return vec;
}

// Keyword candidates are static for a given scope, so fetch each pool once
// instead of re-downloading the corpus for every question. The unscoped pool
// must cover the whole index: limiting it to the oldest N rows silently
// excludes every judgment ingested later, which made keyword/hybrid settings
// unable to retrieve them at all.
const keywordPoolCache = new Map();

async function keywordPool(sql, caseId) {
  const key = caseId ?? "__all__";
  if (keywordPoolCache.has(key)) return keywordPoolCache.get(key);
  const rows = caseId
    ? await sql`
        SELECT section_label, text FROM chunks
        WHERE case_id = ${caseId}
        ORDER BY created_at ASC
      `
    : await sql`
        SELECT section_label, text FROM chunks
        ORDER BY created_at ASC
      `;
  keywordPoolCache.set(key, rows);
  return rows;
}

async function keywordRetrieve(sql, caseId, question, limit) {
  const rows = await keywordPool(sql, caseId);
  const terms = termsOf(question);
  const scored = rows.map((r) => ({
    section_label: String(r.section_label ?? ""),
    text: String(r.text ?? ""),
    score: keywordScore(String(r.text ?? ""), terms),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

async function vectorRetrieve(sql, caseId, question, limit) {
  const vec = await embedOne(question);
  if (!vec) return null;
  const vecStr = `[${vec.join(",")}]`;
  const rows = caseId
    ? await sql`
        SELECT id, section_label, text,
               1 - (embedding <=> ${vecStr}::vector) AS score
        FROM chunks
        WHERE case_id = ${caseId} AND embedding IS NOT NULL
        ORDER BY embedding <=> ${vecStr}::vector
        LIMIT ${limit}
      `
    : await sql`
        SELECT id, section_label, text,
               1 - (embedding <=> ${vecStr}::vector) AS score
        FROM chunks
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> ${vecStr}::vector
        LIMIT ${limit}
      `;
  if (!rows.length) return null;
  const terms = termsOf(question);
  return rows.map((r) => {
    const cosine = r.score == null ? 0 : Math.max(0, Math.min(1, Number(r.score)));
    const kw = keywordScore(String(r.text ?? ""), terms);
    return {
      section_label: String(r.section_label ?? ""),
      text: String(r.text ?? ""),
      cosine,
      keyword: kw,
      score: kw * 0.4 + cosine * 0.6,
    };
  });
}

function evaluate(rankings, items, k) {
  let precisionSum = 0;
  let recallSum = 0;
  let mrrSum = 0;
  let citationHits = 0;
  for (const item of items) {
    const ranked = rankings.get(item.q) ?? [];
    const topK = ranked.slice(0, k);
    // Partial match: if expected contains a substring of the label, count it
    const relTopK = topK.filter((label) =>
      item.expected.some((e) => label.includes(e) || e.includes(label))
    ).length;
    precisionSum += relTopK / k;
    recallSum += relTopK / item.expected.length;
    let firstRelevant = 0;
    for (let i = 0; i < ranked.length; i += 1) {
      if (item.expected.some((e) => ranked[i].includes(e) || e.includes(ranked[i]))) {
        firstRelevant = 1 / (i + 1);
        break;
      }
    }
    mrrSum += firstRelevant;
    // Citation accuracy: does the top-1 result contain the expected citation?
    if (topK.length > 0 && item.expected.some((e) => topK[0].includes(e) || e.includes(topK[0]))) {
      citationHits += 1;
    }
  }
  const n = items.length || 1;
  return {
    precision_at_k: precisionSum / n,
    recall_at_k: recallSum / n,
    mrr: mrrSum / n,
    citation_accuracy: citationHits / n,
  };
}

function fmt(x) {
  return Number(x).toFixed(3);
}

async function main() {
  const sql = neon(process.env.DATABASE_URL);

  const settings = [
    { name: "keyword-only", weight: null },
    { name: "vector-only", weight: "vector" },
    { name: "hybrid (0.4/0.6)", weight: 0.4 },
    { name: "hybrid (0.2/0.8)", weight: 0.2 },
    { name: "hybrid (0.6/0.4)", weight: 0.6 },
  ];

  const perCase = {};

  for (const [caseId, items] of Object.entries(LABELLED_SET)) {
    const isCrossCase = caseId.startsWith("__");
    const effectiveCaseId = isCrossCase ? null : caseId;
    const label = caseId === "__cross_case__"
      ? "cross-case (all judgments)"
      : isCrossCase
        ? "cross-case (new landmark judgments)"
        : caseId;

    const rows = effectiveCaseId
      ? await sql`
          SELECT section_label, text, embedding IS NOT NULL AS has_embedding
          FROM chunks WHERE case_id = ${effectiveCaseId}
        `
      : // Whole corpus — this pool must not be truncated, or the metrics describe
        // an arbitrary subset of the index rather than the index itself.
        await sql`
          SELECT section_label, text, embedding IS NOT NULL AS has_embedding
          FROM chunks
        `;
    const embeddedCount = rows.filter((r) => r.has_embedding).length;

    const rankings = {};
    for (const setting of settings) {
      rankings[setting.name] = new Map();
    }

    console.error(`\nEvaluating: ${label} (${items.length} questions, ${rows.length} chunks, ${embeddedCount} embedded)`);

    for (const item of items) {
      const qCaseId = item.caseId !== undefined ? item.caseId : effectiveCaseId;
      const kw = await keywordRetrieve(sql, qCaseId, item.q, 20);

      let vec = null;
      try {
        vec = await vectorRetrieve(sql, qCaseId, item.q, 20);
        // Brief pause for rate limiting
        await new Promise((r) => setTimeout(r, 200));
      } catch {
        vec = null;
      }

      for (const setting of settings) {
        let labels = [];
        if (setting.weight === null) {
          labels = kw.map((r) => r.section_label);
        } else if (setting.weight === "vector") {
          if (!vec) continue;
          labels = [...vec]
            .sort((a, b) => b.cosine - a.cosine)
            .map((r) => r.section_label);
        } else {
          const w = setting.weight;
          const pool = [
            ...kw.map((r) => ({
              label: r.section_label,
              score: r.score * (1 - w),
            })),
            ...(vec ?? []).map((r) => ({
              label: r.section_label,
              score: r.keyword * (1 - w) + r.cosine * w,
            })),
          ];
          const best = new Map();
          for (const item2 of pool) {
            best.set(item2.label, Math.max(best.get(item2.label) ?? 0, item2.score));
          }
          labels = [...best.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([label]) => label);
        }
        rankings[setting.name].set(item.q, labels);
      }
    }

    perCase[caseId] = {
      label,
      questionCount: items.length,
      chunkCount: rows.length,
      chunksWithEmbedding: embeddedCount,
      results_at_5: Object.fromEntries(
        settings
          .filter((s) => s.name !== "vector-only" || rankings[s.name].size > 0)
          .map((s) => [s.name, evaluate(rankings[s.name], items, 5)]),
      ),
      results_at_10: Object.fromEntries(
        settings
          .filter((s) => s.name !== "vector-only" || rankings[s.name].size > 0)
          .map((s) => [s.name, evaluate(rankings[s.name], items, 10)]),
      ),
    };
  }

  // Aggregate summary
  const summary = {};
  for (const setting of settings) {
    const acc5 = Object.values(perCase).flatMap((c) =>
      c.results_at_5[setting.name] ? [c.results_at_5[setting.name]] : [],
    );
    const acc10 = Object.values(perCase).flatMap((c) =>
      c.results_at_10[setting.name] ? [c.results_at_10[setting.name]] : [],
    );
    if (!acc5.length) continue;
    summary[setting.name] = {
      "precision@5": acc5.reduce((s, r) => s + r.precision_at_k, 0) / acc5.length,
      "recall@5": acc5.reduce((s, r) => s + r.recall_at_k, 0) / acc5.length,
      "recall@10": acc10.reduce((s, r) => s + r.recall_at_k, 0) / acc10.length,
      "mrr@10": acc10.reduce((s, r) => s + r.mrr, 0) / acc10.length,
      "citation_accuracy": acc5.reduce((s, r) => s + r.citation_accuracy, 0) / acc5.length,
    };
  }

  const output = {
    embedding_model: EMBED_MODEL,
    embedding_dim: EMBED_DIM,
    k: K,
    timestamp: new Date().toISOString(),
    perCase,
    summary,
  };

  console.log(JSON.stringify(output, null, 2));

  // Write results to file
  writeFileSync("data/eval-results.json", JSON.stringify(output, null, 2));

  process.stderr.write(`\n=== Retrieval Evaluation (Qwen3-Embedding-8B, ${EMBED_DIM}d) ===\n`);
  process.stderr.write(`Model: ${EMBED_MODEL}\n`);
  process.stderr.write(`Questions: ${Object.values(perCase).reduce((s, c) => s + c.questionCount, 0)}\n\n`);
  for (const [name, m] of Object.entries(summary)) {
    process.stderr.write(
      `${name.padEnd(20)} P@5=${fmt(m["precision@5"])}  R@5=${fmt(m["recall@5"])}  R@10=${fmt(m["recall@10"])}  MRR@10=${fmt(m["mrr@10"])}  CitAcc=${fmt(m["citation_accuracy"])}\n`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
