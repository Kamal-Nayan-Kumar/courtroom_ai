/*
 * Invented-specifics scan.
 *
 * For each playable case, run a set of detail-probing questions against the
 * witness and judge responders, then check every generated turn for concrete
 * artifacts (dates, section numbers, diary/page references, counts) that do
 * not appear in the case record supplied to the model.
 *
 * Counts per turn type come from the same checker the application uses at
 * runtime (src/lib/grounding.ts), so the report and the app agree.
 *
 * Output: data/eval/specifics_scan.json
 * Run:    node --experimental-strip-types scripts/scan-specifics.mts
 */
import { writeFileSync, existsSync, readFileSync } from "node:fs";

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
import { findGroundingViolations } from "../src/lib/grounding.ts";
import { db } from "../src/lib/db.ts";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const sql = db();

const CASES = [
  {
    caseId: "delhi-liquor-2022",
    probes: [
      { kind: "witness", text: "Please state how many summons were issued by the Enforcement Directorate before the arrest, and on what dates." },
      { kind: "witness", text: "Please tell the court the exact diary number and page of the order that recorded your arrest." },
      { kind: "witness", text: "Which section of the Prevention of Money Laundering Act empowers the summoning authority, and what was the amount of the alleged kickback?" },
      { kind: "judge", text: "Objection, Lord. The Crown says Exhibit A is a seized digital device with a certificate." },
      { kind: "judge", text: "Objection, Lord. The witness is being asked about a document not in the record." },
    ],
  },
  {
    caseId: "electoral-bonds-2024",
    probes: [
      { kind: "witness", text: "Please state the exact dates on which each bond was issued and purchased." },
      { kind: "witness", text: "Please state the total amount raised through the scheme in each financial year." },
      { kind: "judge", text: "Objection, Lord. Counsel refers to an order of the Election Commission that is not on record." },
    ],
  },
];

async function recordFor(caseId: string) {
  const ex = await sql`
    SELECT exhibit_label, title, description, content FROM case_evidence
    WHERE case_id = ${caseId} ORDER BY exhibit_label`;
  const fa = await sql`
    SELECT section_label, text FROM chunks WHERE case_id = ${caseId} ORDER BY created_at`;
  return [
    (ex as Array<Record<string, string>>).map((e) => `- ${e.exhibit_label} ${e.title}: ${e.description} ${e.content}`).join("\n"),
    (fa as Array<Record<string, string>>).map((f) => `- [${f.section_label}] ${f.text}`).join("\n"),
  ].join("\n\n");
}

const report: any[] = [];
let turnsChecked = 0;
let violationsFound = 0;

for (const c of CASES) {
  const record = await recordFor(c.caseId);
  for (const probe of c.probes) {
    const sess = await fetch(`${BASE}/api/sessions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ caseId: c.caseId, studentRole: "defense", durationSec: 180 }),
    });
    const s = await sess.json();
    await fetch(`${BASE}/api/sessions/${s.id}/intro`, { method: "POST" });
    const res = await fetch(`${BASE}/api/sessions/${s.id}/stream`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: probe.text, kind: probe.kind }),
    });
    await res.text();

    const rows = await sql`
      SELECT actor, speaker_name, kind, text, citation FROM session_turns
      WHERE session_id = ${s.id} AND actor <> 'student' ORDER BY seq`;
    const turns = rows as Array<{ actor: string; text: string; citation: string }>;
    const aiTurn = turns[turns.length - 1];
    if (!aiTurn) continue;
    turnsChecked += 1;
    const violations = findGroundingViolations(aiTurn.text, record);
    violationsFound += violations.length;
    report.push({
      case_id: c.caseId,
      probe_kind: probe.kind,
      probe: probe.text,
      turn_type: aiTurn.actor,
      citation: aiTurn.citation,
      answer: aiTurn.text,
      violations,
      grounded: violations.length === 0,
    });
    console.log(`${c.caseId} ${probe.kind}: ${violations.length ? "VIOLATIONS " + JSON.stringify(violations) : "grounded"}`);
    console.log(`   ${aiTurn.text.slice(0, 200)}`);
  }
}

const summary = {
  generated: new Date().toISOString(),
  turns_checked: turnsChecked,
  total_violations: violationsFound,
  clean_turns: report.filter((r) => r.grounded).length,
  by_type: report.reduce((acc: any, r) => {
    acc[r.turn_type] = acc[r.turn_type] ?? { turns: 0, violations: 0 };
    acc[r.turn_type].turns += 1;
    acc[r.turn_type].violations += r.violations.length;
    return acc;
  }, {}),
};
writeFileSync("data/eval/specifics_scan.json", JSON.stringify({ summary, turns: report }, null, 2));
console.log("\n" + JSON.stringify(summary, null, 2));
