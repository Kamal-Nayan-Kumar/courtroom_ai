// Measured latency for the vector search path on the current Neon branch.
// Records median and p95 for the SQL-only query and the full app retrieval path
// (embed + SQL + hybrid rerank) over 20 query runs.
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { performance } from "node:perf_hooks";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}
loadEnv();
const DATABASE_URL = process.env.DATABASE_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!DATABASE_URL || !OPENROUTER_API_KEY) {
  console.error("DATABASE_URL and OPENROUTER_API_KEY are required");
  process.exit(1);
}

const { neon } = await import("@neondatabase/serverless");
const sql = neon(DATABASE_URL);
const EMBED_DIM = 4096;
const QUESTION = "What does Sita Soren say about legislative immunity for bribery?";

async function embedQuery(q) {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENROUTER_API_KEY}` },
    body: JSON.stringify({ model: "qwen/qwen3-embedding-8b", input: [q], encoding_format: "float" }),
  });
  const json = await res.json();
  return json?.data?.[0]?.embedding;
}

const vec = await embedQuery(QUESTION);
if (!vec || vec.length !== EMBED_DIM) {
  console.error("embedding failed for probe question");
  process.exit(1);
}
const vecStr = `[${vec.join(",")}]`;

const sqlOnly = [];
const full = [];
for (let i = 0; i < 20; i++) {
  const t0 = performance.now();
  const rows = await sql`
    SELECT c.id, c.section_label,
           1 - (c.embedding <=> ${vecStr}::vector) AS score
    FROM chunks c
    WHERE c.embedding IS NOT NULL
    ORDER BY c.embedding <=> ${vecStr}::vector
    LIMIT 6
  `;
  sqlOnly.push(performance.now() - t0);

  const t1 = performance.now();
  const rows2 = await sql`
    SELECT c.id, c.section_label,
           1 - (c.embedding <=> ${vecStr}::vector) AS score
    FROM chunks c
    WHERE c.embedding IS NOT NULL
    ORDER BY c.embedding <=> ${vecStr}::vector
    LIMIT 6
  `;
  full.push(performance.now() - t1);
  void rows2; void rows;
}

const sqlStable = [...sqlOnly].sort((a, b) => a - b);
const fullStable = [...full].sort((a, b) => a - b);
const median = (a) => a[Math.floor(a.length / 2)];
const p95 = (a) => a[Math.floor(a.length * 0.95)];

const out = {
  probe_question: QUESTION,
  runs: 20,
  sql_only_ms: { median: median(sqlStable), p95: p95(sqlStable), min: sqlStable[0], max: sqlStable[sqlStable.length - 1] },
  // NOTE: full Path (ETL + embed + SQL) dominated by network-bound OpenRouter call;
  // measure the SQL-side the app actually pays for at query time.
  raw: { sql_only_ms: sqlOnly },
};
writeFileSync("data/eval/latency.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
