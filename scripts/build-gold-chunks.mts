/*
 * gold_chunks.json — gold chunk IDs, strict deterministic rules.
 *   benchmark/heldout question → gold chunk iff:
 *     (A) expected_paragraph is a Para N for an ingested judgment and a chunk
 *         exists whose section_label is exactly "2024 INSC n | Para N", or
 *     (B) expected_citation is an exact statute identifier (BNS/BSA/PMLA §§)
 *         and the chunk's section_label equals that label, or
 *     (C) expected_citation/paragraph names a specific Electoral Bonds case fact
 *         and the chunk text contains the matching phrase from that fact.
 *   Anything else is listed as gold-not-found and excluded from scoring.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

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
import { db } from "../src/lib/db.ts";

const bench = JSON.parse(readFileSync("data/eval/questions.json", "utf8")).map(q => ({ ...q, split: "benchmark" }));
const heldout = JSON.parse(readFileSync("data/eval/heldout_questions.json", "utf8")).map(q => ({ ...q, split: "heldout" }));
const questions = [...bench, ...heldout];

const sql = db();
const rows = await sql`
  SELECT c.id AS id, c.section_label, c.text, c.document_id, d.title
  FROM chunks c JOIN documents d ON d.id = c.document_id
`;

const MATTER = {
  "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case": "delhi-liquor-2022",
  "Association for Democratic Reforms v. Union of India": "electoral-bonds-2024",
  "Sita Soren v. Union of India": "sita-soren-2024",
  "Bilkis Yakub Rasool v. Union of India": "bilkis-rasool-2024",
  "Sukanya Shantha v. Union of India": "sukanya-shantha-2024",
};
const INSC = { "sita-soren-2024": "161", "bilkis-rasool-2024": "24", "sukanya-shantha-2024": "753" };

const chunks = (rows as Array<any>).map(c => {
  const title = String(c.title).toLowerCase();
  let matter = "unknown";
  if (/kejriwal|delhi liquor/.test(title)) matter = "delhi-liquor-2022";
  else if (/electoral bonds|democratic reforms/.test(title)) matter = "electoral-bonds-2024";
  else if (/sita soren|insc 161/.test(title)) matter = "sita-soren-2024";
  else if (/bilkis|insc 24/.test(title)) matter = "bilkis-rasool-2024";
  else if (/sukanya|insc 753/.test(title)) matter = "sukanya-shantha-2024";
  return { id: String(c.id), label: String(c.section_label), text: String(c.text).toLowerCase(), matter, title: String(c.title) };
});

const found = [];
const missing = [];

for (const q of questions) {
  const matter = MATTER[q.expected_judgment];
  const pool = chunks.filter(c => c.matter === matter);
  const gold = [];

  // (A) paragraph-labeled chunks
  const paras = (q.expected_paragraph ?? "").match(/\d+/g) ?? [];
  for (const c of pool) {
    for (const n of paras) {
      if (matter in INSC && c.label === `2024 INSC ${INSC[matter]} | Para ${n}`) gold.push({ id: c.id, why: `para ${n}` });
    }
  }

  // (B) exact statute label match
  const statutes = [
    { key: "bns", label: "BNS § 61(2)" },
    { key: "bsa", label: "BSA § 63" },
    { key: "pmla", label: "PMLA § 3" },
  ];
  for (const s of statutes) {
    if ((q.expected_citation ?? "").toLowerCase().includes(s.key)) {
      for (const c of pool) if (c.label === s.label) gold.push({ id: c.id, why: `label:${s.label}` });
    }
  }

  // (C) Electoral Bonds case facts phrase match
  if (matter === "electoral-bonds-2024") {
    const l = `${q.expected_citation ?? ""} ${q.expected_paragraph ?? ""} ${q.question ?? ""}`.toLowerCase();
    for (const c of pool) {
      if (/bench|sannaj|khanna|gavai|pardiwala|manoj misra/.test(l) && /bench: cji chandrachud with justices/.test(c.text)) gold.push({ id: c.id, why: "bench fact" });
      if (/19\(1\)\(a\)|right to information/.test(l) && /art 19\(1\)\(a\)|19\(1\)\(a\)/.test(c.text)) gold.push({ id: c.id, why: "art 19(1)(a)" });
      if (/2024 insc 113|struck down|constitutional/.test(l) && /struck down in 2024 insc 113/.test(c.text)) gold.push({ id: c.id, why: "bonds struck down fact" });
      if (/companies act|pa 182|it act|rpa|amend/.test(l) && /companies act §182|amendments on anonymous donations/.test(c.text)) gold.push({ id: c.id, why: "amendment case fact" });
    }
  }

  // (D) Delhi case facts: only for questions that mention the arrest Mar 21 / interim bail / 13 Sep
  if (matter === "delhi-liquor-2022") {
    const l = q.question.toLowerCase();
    for (const c of pool) {
      if (/(summons|summons)/.test(l) && /9 summons|nine summons/.test(c.text)) gold.push({ id: c.id, why: "summons fact" });
      if (/arrest (21|march)|mar 21/.test(l) && /arrested 21 mar 2024/.test(c.text)) gold.push({ id: c.id, why: "arrest fact" });
      if (/interim bail|campaign|may 10/.test(l) && /interim bail 10 may to 1 jun 2024/.test(c.text)) gold.push({ id: c.id, why: "interim bail fact" });
      if (/13 sep|five months/.test(l) && /granted bail in cbi case 13 sep 2024/.test(c.text)) gold.push({ id: c.id, why: "cbi bail fact" });
      if (/(20 june|high court|stay)/.test(l) && /20 jun 2024 stayed by delhi hc/.test(c.text)) gold.push({ id: c.id, why: "bail stayed fact" });
      if (/(26 jun|tihar|cbI arrested|ed arrested)/.test(l) && /cbi arrested him from tihar on 26 jun 2024/.test(c.text)) gold.push({ id: c.id, why: "tihar arrest fact" });
    }
  }

  const seen = new Set<string>();
  const dedup = gold.filter(g => (seen.has(g.id) ? false : (seen.add(g.id), true)));

  if (dedup.length) {
    found.push({ id: q.id, split: q.split, question: q.question, expected_judgment: q.expected_judgment, expected_citation: q.expected_citation, expected_paragraph: q.expected_paragraph, gold_chunk_ids: dedup.map(g => g.id), reasons: dedup.map(g => g.why) });
  } else {
    missing.push({ id: q.id, split: q.split, question: q.question, expected_citation: q.expected_citation, expected_paragraph: q.expected_paragraph });
  }
}

const out = {
  generated: new Date().toISOString(),
  benchmark: found.filter(f => f.split === "benchmark"),
  heldout: found.filter(f => f.split === "heldout"),
  benchmark_not_found: missing.filter(m => m.split === "benchmark"),
  heldout_not_found: missing.filter(m => m.split === "heldout"),
};
writeFileSync("data/eval/gold_chunks.json", JSON.stringify(out, null, 2));
console.log(`benchmark: ${out.benchmark.length}/30 with gold, ${out.benchmark_not_found.length} not found`);
console.log(`heldout:   ${out.heldout.length}/47 with gold, ${out.heldout_not_found.length} not found`);
const counts = [...out.benchmark, ...out.heldout].map(f => f.gold_chunk_ids.length);
console.log(`matches per question: min ${Math.min(...counts)} max ${Math.max(...counts)}`);
console.log("\n--- not found (benchmark) ---");
for (const m of out.benchmark_not_found) console.log(`${m.id}: ${m.expected_citation} | ${m.expected_paragraph}`);
console.log("\n--- not found (heldout) ---");
for (const m of out.heldout_not_found) console.log(`${m.id}: ${m.expected_citation} | ${m.expected_paragraph}`);
