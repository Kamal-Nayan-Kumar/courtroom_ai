/*
 * Query-instruction prefix A/B for qwen3-embedding-8b:
 * same questions, same rankers, same scopes — prefix vs no-prefix.
 * Metrics: doc P@5/MRR, gold P@5/MRR (where gold exists).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
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
import { retrieve } from "../src/lib/retrieval.ts";
import { db } from "../src/lib/db.ts";

const questions = JSON.parse(readFileSync("data/eval/questions.json", "utf8"))
  .concat(JSON.parse(readFileSync("data/eval/heldout_questions.json", "utf8")));
const goldIndex = JSON.parse(readFileSync("data/eval/gold_chunks.json", "utf8"));
const benchIds = new Set(JSON.parse(readFileSync("data/eval/questions.json", "utf8")).map((q: any) => q.id));
const goldSet = new Map<string, Set<string>>();
for (const f of [...goldIndex.benchmark, ...goldIndex.heldout]) goldSet.set(f.id, new Set(f.gold_chunk_ids));

const dbHandle = db();
const docRows = await dbHandle`SELECT id, title FROM documents` as Array<{ id: string; title: string }>;
const docToMatter = new Map<string, string>();
for (const d of docRows) {
  const t = String(d.title).toLowerCase();
  let m = "unknown";
  if (/kejriwal|delhi/i.test(t)) m = "delhi-liquor-2022";
  else if (/electoral bonds|democratic reforms/i.test(t)) m = "electoral-bonds-2024";
  else if (/sita soren|insc 161/i.test(t)) m = "sita-soren-2024";
  else if (/bilkis|insc 24/i.test(t)) m = "bilkis-rasool-2024";
  else if (/sukanya|insc 753/i.test(t)) m = "sukanya-shantha-2024";
  docToMatter.set(String(d.id), m);
}
const matterOf = (x: any) => {
  const l = (x.expected_judgment ?? "").toLowerCase();
  if (/kejriwal|delhi/.test(l)) return "delhi-liquor-2022";
  if (/bonds|democratic/.test(l)) return "electoral-bonds-2024";
  if (/sita/.test(l)) return "sita-soren-2024";
  if (/bilkis/.test(l)) return "bilkis-rasool-2024";
  return "sukanya-shantha-2024";
};
const docMatch = (doc: string | null, matter: string) => (doc ? docToMatter.get(doc) : null) === matter;

async function metricsFor(rows: any[], item: any) {
  const matter = matterOf(item);
  const gold = goldSet.get(item.id) ?? null;
  const ranker = (rel: (r: any) => boolean) => {
    const top5 = rows.slice(0, 5), top10 = rows.slice(0, 10);
    const rel5 = top5.filter(rel).length, rel10 = top10.filter(rel).length;
    const rank = rows.findIndex(rel);
    return { p5: rel5 / 5, r5: rel5 > 0 ? 1 : 0, r10: rel10 > 0 ? 1 : 0, mrr: rank >= 0 && rank < 10 ? 1 / (rank + 1) : 0, top1: rank === 0 ? 1 : 0 };
  };
  const outcome: any = { doc: ranker((r: any) => docMatch(r.document_id, matter)) };
  outcome.gold = gold ? ranker((r: any) => gold.has(String(r.id))) : null;
  outcome.importable = !!gold;
  return outcome;
}

const combos = [
  { name: "vector-only", kw: 0.0, cos: 1.0, mode: "hybrid" as const },
  { name: "hybrid-0.4/0.6", kw: 0.4, cos: 0.6, mode: "hybrid" as const },
];
const scopes = ["global", "case-or-null"] as const;

for (const scope of scopes) {
  for (const c of combos) {
    for (const prefix of ["no-prefix", "prefix"] as const) {
      const rows: any[] = [];
      for (const q of questions) {
        const matter = matterOf(q);
        const caseId = matter === "delhi-liquor-2022" ? "delhi-liquor-2022" : matter === "electoral-bonds-2024" ? "electoral-bonds-2024" : null;
        const opts: any = { question: q.question, caseId, scope, kwWeight: c.kw, cosineWeight: c.cos, limit: 10, mode: c.mode };
        if (prefix === "prefix") opts.instructionPrefix = "yes";
        const { results } = await retrieve(opts);
        const m = await metricsFor(results as any, q);
        rows.push({ id: q.id, ...m });
      }
      const bench = rows.filter(r => benchIds.has(r.id));
      const hold = rows.filter(r => !benchIds.has(r.id));
      const agg = (set: any[], f: (r: any) => number | null) => {
        const vals = set.map(f).filter((v): v is number => v != null);
        return vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(4)) : null;
      };
      for (const [name, set] of [["bench", bench], ["heldout", hold]] as const) {
        const goldRows = set.filter(r => r.importable);
        console.log(`${scope} ${c.name} ${prefix} [${name}] n=${set.length} | doc P@5=${agg(set, r => r.doc.p5)} MRR=${agg(set, r => r.doc.mrr)} | gold(n=${goldRows.length}) P@5=${agg(goldRows, r => r.gold?.p5 ?? null)} MRR=${agg(goldRows, r => r.gold?.mrr ?? null)} top1=${agg(goldRows, r => r.gold?.top1 ?? null)}`);
      }
    }
  }
}
