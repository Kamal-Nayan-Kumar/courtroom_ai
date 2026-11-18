/*
 * Retrieval ablation across benchmark questions, comparing:
 *   relevance = lenient (v1, citation substring),
 *               document-level (right document),
 *               strict (v2, right document + paragraph overlap>=0.5 when anchor exists)
 * Report all three side by side.
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

const questions = JSON.parse(readFileSync("data/eval/questions.json", "utf8")) as Array<{
  id: string; question: string; expected_judgment: string; expected_citation: string; expected_paragraph: string; category: string;
}>;

const dbHandle = db();
const docRows = await dbHandle`SELECT id, title FROM documents` as Array<{ id: string; title: string }>;
const docToMatter = new Map<string, string>();
for (const d of docRows) {
  const t = String(d.title);
  let m = "unknown";
  if (/kejriwal|delhi/i.test(t)) m = "delhi-liquor-2022";
  else if (/electoral bonds|democratic reforms/i.test(t)) m = "electoral-bonds-2024";
  else if (/sita soren|insc 161/i.test(t)) m = "sita-soren-2024";
  else if (/bilkis|insc 24/i.test(t)) m = "bilkis-rasool-2024";
  else if (/sukanya|insc 753/i.test(t)) m = "sukanya-shantha-2024";
  docToMatter.set(String(d.id), m);
}
const MATTER_INSC: Record<string, string> = {
  "sita-soren-2024": "161",
  "bilkis-rasool-2024": "24",
  "sukanya-shantha-2024": "753",
};
const MATTER_TITLE: Record<string, string> = {
  "sita-soren-2024": "Sita Soren",
  "bilkis-rasool-2024": "Bilkis",
  "sukanya-shantha-2024": "Sukanya",
};
const toks = (s: string) => new Set(String(s).toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2));
const jaccard = (a: Set<string>, b: Set<string>) => { let i = 0; for (const t of a) if (b.has(t)) i += 1; return i / (new Set([...a, ...b]).size || 1); };

async function anchorFor(q: (typeof questions)[number]): Promise<Set<string> | null> {
  const l = q.expected_judgment.toLowerCase();
  const matter = l.includes("kejriwal") || l.includes("delhi") ? "delhi-liquor-2022"
    : l.includes("bonds") || l.includes("democratic") ? "electoral-bonds-2024"
    : l.includes("sita") ? "sita-soren-2024"
    : l.includes("bilkis") ? "bilkis-rasool-2024" : "sukanya-shantha-2024";
  if (!(matter in MATTER_INSC)) return null;
  const paras = (q.expected_paragraph ?? "").match(/\d+/g) ?? [];
  if (!paras.length) return null;
  const rows = await dbHandle`
    SELECT c.text FROM chunks c JOIN documents d ON d.id = c.document_id
    WHERE d.title ILIKE ${'%' + MATTER_TITLE[matter] + '%'}
      AND section_label IN (${paras.map(n => `2024 INSC ${MATTER_INSC[matter]} | Para ${n}`).join(",")})
  `;
  const texts = (rows as Array<{ text: string }>).map(r => r.text).join(" ");
  if (!texts) return null;
  return toks(texts);
}

const ANCHORS = new Map<string, Set<string> | null>();
for (const q of questions) ANCHORS.set(q.id, await anchorFor(q));

function matterOf(q: (typeof questions)[number]): string {
  const l = q.expected_judgment.toLowerCase();
  if (l.includes("kejriwal") || l.includes("delhi")) return "delhi-liquor-2022";
  if (l.includes("bonds") || l.includes("democratic")) return "electoral-bonds-2024";
  if (l.includes("sita")) return "sita-soren-2024";
  if (l.includes("bilkis")) return "bilkis-rasool-2024";
  if (l.includes("sukanya")) return "sukanya-shantha-2024";
  return "unknown";
}

function docMatch(chunk: { document_id: string | null }, matter: string): boolean {
  return (chunk.document_id ? docToMatter.get(chunk.document_id) : null) === matter;
}

function lenient(chunk: { section_label: string; text: string }, item: (typeof questions)[number]): boolean {
  const label = chunk.section_label.toLowerCase();
  const text = chunk.text.toLowerCase();
  const expCit = item.expected_citation.toLowerCase();
  if (label.includes(expCit) || text.includes(expCit)) return true;
  const expJudg = item.expected_judgment.toLowerCase();
  if (/kejriwal|delhi/.test(expJudg) && (label.includes("bns") || label.includes("bsa") || label.includes("pmla") || label.includes("case fact"))) return true;
  if (expCit.includes("161") || /sita/.test(expJudg)) return label.includes("insc 161") || label.includes("sita");
  if (expCit.includes("24") || /bilkis/.test(expJudg)) return label.includes("insc 24") || label.includes("bilkis");
  if (expCit.includes("753") || /sukanya/.test(expJudg)) return label.includes("insc 753") || label.includes("sukanya");
  if (/bonds|democratic/.test(expJudg)) return label.includes("insc 113") || label.includes("electoral bonds") || label.includes("democratic reforms");
  return false;
}

function strict(chunk: { section_label: string; text: string; document_id: string | null }, item: (typeof questions)[number], matter: string): boolean {
  if (!docMatch(chunk, matter)) return false;
  const anchor = ANCHORS.get(item.id) ?? null;
  if (!anchor) return true;
  return jaccard(anchor, toks(chunk.text)) >= 0.5;
}

function rankerMatches(rows: Array<{ section_label: string; text: string; document_id: string | null }>, strictMatch: boolean) {
  return (item: (typeof questions)[number], mode: "lenient" | "strict" | "doc") => {
    const matter = matterOf(item);
    const match = (r: any) => mode === "lenient" ? lenient(r, item) : mode === "doc" ? docMatch(r, matter) : strict(r, item, matter);
    const top5 = rows.slice(0, 5);
    const top10 = rows.slice(0, 10);
    const hitAt = (rowsForRank: typeof top10) => { for (let i = 0; i < rowsForRank.length; i++) if (match(rowsForRank[i])) return i + 1; return null; };
    const rel5 = top5.filter(match).length;
    const rel10 = top10.filter(match).length;
    const rank = hitAt(top10);
    return {
      p5: rel5 / 5,
      r5: rel5 > 0 ? 1 : 0,
      r10: rel10 > 0 ? 1 : 0,
      mrr: rank && rank <= 10 ? 1 / rank : 0,
      top1: rank === 1 ? 1 : 0,
    };
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
const MODES = ["lenient", "doc", "strict"] as const;

const out: Record<string, any> = {
  generated: new Date().toISOString(),
  relevance: "lenient: citation substring; doc: document matter match; strict: doc + paragraph-anchor Jaccard>=0.5 (empty anchor => document-level)",
  questions: questions.length,
  results: {} as Record<string, Record<string, Record<string, any>>>,
};

for (const scope of SCOPES) {
  out.results[scope] = {};
  for (const ranker of RANKERS) {
    const perQ: Array<Record<string, any>> = [];
    for (const item of questions) {
      const matter = matterOf(item);
      const caseId = matter === "delhi-liquor-2022" ? "delhi-liquor-2022" : matter === "electoral-bonds-2024" ? "electoral-bonds-2024" : null;
      const { results: rows } = await retrieve({ question: item.question, caseId, scope, kwWeight: ranker.kw, cosineWeight: ranker.cos, limit: 10, mode: ranker.mode });
      const matcher = rankerMatches(rows as any, true);
      const lenk = matcher(item, "lenient");
      const doc = matcher(item, "doc");
      const str = matcher(item, "strict");
      perQ.push({ id: item.id, lenient: lenk, doc, strict: str });
    }
    out.results[scope][ranker.name] = Object.fromEntries(MODES.map((m) => {
      const avg = (f: (p: any) => number) => Number((perQ.reduce((s, p) => s + f(p[m]), 0) / perQ.length).toFixed(4));
      return [m, { p5: avg((p) => Number(p.p5)), r5: avg((p) => Number(p.r5)), r10: avg((p) => Number(p.r10)), mrr: avg((p) => Number(p.mrr)), top1: avg((p) => Number(p.top1)) }];
    }));
  }
}
writeFileSync("data/eval/ablation_results.json", JSON.stringify(out, null, 2));
for (const scope of SCOPES) {
  for (const name of Object.keys(out.results[scope])) {
    const cell = out.results[scope][name];
    console.log(`${scope} ${name}`);
    for (const m of MODES) console.log(`  ${m}: P@5=${cell[m].p5} R@5=${cell[m].r5} R@10=${cell[m].r10} MRR=${cell[m].mrr} top1=${cell[m].top1}`);
  }
}
