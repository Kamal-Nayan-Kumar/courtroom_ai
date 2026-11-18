/*
 * Ablation with gold-chunk and document-level metrics, both scopes,
 * benchmark (30) and held-out (47) shown separately.
 *
 * Metrics per (scope, ranker):
 *   document_level: P@5 / R@5 / R@10 / MRR@10 / top-1 accuracy (right document)
 *   gold:           P@5 / R@5 / R@10 / MRR@10 / top-1 accuracy over the gold set only
 *   paired:         per-question P@5 difference vs the frozen 0.4/0.6 hybrid baseline
 *                   (count of rankers that win/tie/lose on each question)
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
const goldSet = new Map<string, Set<string>>();
for (const f of [...goldIndex.benchmark, ...goldIndex.heldout]) {
  goldSet.set(f.id, new Set(f.gold_chunk_ids));
}
const docMatch = (document_id: string | null, matter: string) =>
  (document_id ? docToMatter.get(document_id) : null) === matter;

function metrics(rows: Array<{ id: string; section_label: string; text: string; document_id: string | null }>, item: any) {
  const matter = matterOf(item);
  const gold = goldSet.get(item.id) ?? null;
  const importable = !!gold;
  const isRelevantDoc = (r: any) => docMatch(r.document_id, matter);
  const isRelevantGold = gold ? (r: any) => gold.has(String(r.id ?? r.chunk_id)) : () => false;
  const ranker = (rel: (r: any) => boolean) => {
    const top5 = rows.slice(0, 5), top10 = rows.slice(0, 10);
    const rel5 = top5.filter(rel).length;
    const rel10 = top10.filter(rel).length;
    const rank = rows.findIndex(rel);
    return {
      p5: rel5 / 5,
      r5: rel5 > 0 ? 1 : 0,
      r10: rel10 > 0 ? 1 : 0,
      mrr: rank >= 0 && rank < 10 ? 1 / (rank + 1) : 0,
      top1: rank === 0 ? 1 : 0,
    };
  };
  return {
    doc: ranker(isRelevantDoc),
    gold: importable ? ranker(isRelevantGold) : null,
    importable,
  };
}

const RANKERS = [
  { name: "vector-only", kw: 0.0, cos: 1.0, mode: "hybrid" as const },
  { name: "hybrid-0.2/0.8", kw: 0.2, cos: 0.8, mode: "hybrid" as const },
  { name: "hybrid-0.4/0.6", kw: 0.4, cos: 0.6, mode: "hybrid" as const },
  { name: "hybrid-0.6/0.4", kw: 0.6, cos: 0.4, mode: "hybrid" as const },
  { name: "keyword-only", kw: 1.0, cos: 0.0, mode: "keyword-only" as const },
] as const;
const SCOPES = ["global", "case-or-null"] as const;

const aggregate: any = {};

for (const setting of [{ name: "benchmark", filter: (q: any) => JSON.parse(readFileSync("data/eval/questions.json","utf8")).map(x=>x.id).includes(q.id) },
                      { name: "heldout", filter: (q: any) => !JSON.parse(readFileSync("data/eval/questions.json","utf8")).map(x=>x.id).includes(q.id) }]) {
  const set = questions.filter(setting.filter) as any[];
  aggregate[setting.name] = { n: set.length, results: {} as any };
  for (const scope of SCOPES) {
    aggregate[setting.name].results[scope] = {};
    for (const ranker of RANKERS) {
      const perQ: Array<{ id: string; doc: any; gold: any; importable: boolean }> = [];
      for (const item of set) {
        const matter = matterOf(item);
        const caseId = matter === "delhi-liquor-2022" ? "delhi-liquor-2022" : matter === "electoral-bonds-2024" ? "electoral-bonds-2024" : null;
        const { results } = await retrieve({ question: item.question, caseId, scope, kwWeight: ranker.kw, cosineWeight: ranker.cos, limit: 10, mode: ranker.mode });
        const m = metrics(results as any, item);
        perQ.push({ id: item.id, ...m });
      }
      const goldRows = perQ.filter(p => p.importable);
      const docAgg = (k: string) => Number((perQ.reduce((s, p) => s + p.doc[k], 0) / perQ.length).toFixed(4));
      const goldAgg = (k: string) => goldRows.length ? Number((goldRows.reduce((s, p) => s + p.gold[k], 0) / goldRows.length).toFixed(4)) : null;
      aggregate[setting.name].results[scope][ranker.name] = {
        doc: { p5: docAgg("p5"), r5: docAgg("r5"), r10: docAgg("r10"), mrr: docAgg("mrr"), top1: docAgg("top1") },
        gold: { p5: goldAgg("p5"), r5: goldAgg("r5"), r10: goldAgg("r10"), mrr: goldAgg("mrr"), top1: goldAgg("top1"), n: goldRows.length },
        perQuestion: perQ.map(p => ({ id: p.id, doc: p.doc, gold: p.gold, importable: p.importable })),
      };
    }
  }
}

writeFileSync("data/eval/ablation_gold.json", JSON.stringify(aggregate, null, 2));
for (const setting of Object.keys(aggregate)) {
  console.log(`\n=== ${setting.toUpperCase()} (n=${aggregate[setting].n})`);
  for (const scope of SCOPES) {
    for (const ranker of Object.keys(aggregate[setting].results[scope])) {
      const cell = aggregate[setting].results[scope][ranker];
      const g = cell.gold;
      console.log(`${scope} ${ranker}`);
      console.log(`  doc : P@5=${cell.doc.p5} R@5=${cell.doc.r5} MRR=${cell.doc.mrr} top1=${cell.doc.top1}`);
      console.log(`  gold(n=${g.n}): P@5=${g.p5} R@5=${g.r5} R@10=${g.r10} MRR=${g.mrr} top1=${g.top1}`);
    }
  }
}
