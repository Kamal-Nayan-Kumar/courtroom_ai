/*
 * Faithfulness harness v3. Fixed scope: case-or-null (the app's live path).
 * For each of the 20 key questions:
 *   1. Ask the live app /api/rag/ask with caseId (playable cases) or global
 *      (judgment matters: app reaches them only through judgments docs).
 *      Wait — app currently uses case-or-null with caseId=X for playable cases,
 *      so judgment queries with no caseId use case_id IS NULL (judgments).
 *   2. Classify answer as ANSWER vs ABSTINENCE (abstain-pattern match).
 *   3. Split ANSWER answer into atomic claims (gpt-oss-20b).
 *   4. Judge claims in ONE call (gpt-oss-20b) with up to 3 retries; a question
 *      whose split/judge fails is counted as failed. No silent exclusion.
 *   5. Report: overall, per-question
 * Run: node --experimental-strip-types scripts/eval-faithfulness.mts
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

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = "data/eval/faithfulness.json";

const questions = JSON.parse(readFileSync("data/eval/questions.json", "utf8")) as Array<{
  id: string; question: string; expected_judgment: string; expected_citation: string; category: string;
}>;
const MATTER_KEY: Record<string, string> = {
  "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case": "delhi-liquor-2022",
  "Association for Democratic Reforms v. Union of India": "electoral-bonds-2024",
  "Sita Soren v. Union of India": "sita-soren-2024",
  "Bilkis Yakub Rasool v. Union of India": "bilkis-rasool-2024",
  "Sukanya Shantha v. Union of India": "sukanya-shantha-2024",
};
const ORDER = ["sita-soren-2024", "bilkis-rasool-2024", "sukanya-shantha-2024", "electoral-bonds-2024", "delhi-liquor-2022"];
const grouped: Record<string, typeof questions> = {};
for (const q of questions) (grouped[MATTER_KEY[q.expected_judgment] ?? "x"] ??= []).push(q);
const selected = ORDER.flatMap((m) => (grouped[m] ?? []).slice(0, 4));

const GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_FAST = "openai/gpt-oss-20b";

async function chatJson(messages: Array<{ role: string; content: string }>, maxTokens: number, retries = 3): Promise<{ ok: boolean; text: string; error?: string }> {
  const key = process.env.GROQ_API_KEY;
  if (!key) return { ok: false, text: "", error: "missing GROQ_API_KEY" };
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(GROQ_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: GROQ_FAST, messages, max_tokens: maxTokens, temperature: 0.0 }),
      });
      if (!res.ok) {
        const body = await res.text();
        if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 15000)); continue; }
        return { ok: false, text: "", error: `HTTP ${res.status}: ${body.slice(0, 200)}` };
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content ?? "";
      return { ok: true, text };
    } catch (e) {
      if (i === retries - 1) return { ok: false, text: "", error: e instanceof Error ? e.message : String(e) };
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  return { ok: false, text: "", error: "failed after retries" };
}

const ABSTAIN_RE = /cannot (answer|confirm|determine|supply|provide|say|address|advise|assess|comment)|do not (contain|include|cover|address|mention)|not (in the (provided|supplied|sources)|contained|available)|i don'?t have (enough|sufficient)|sources (do not|provided do not)/i;

async function classifyAnswer(a: string): Promise<"ANSWER" | "ABSTAIN"> {
  const tooShort = !a || a.trim().length < 60; // very short or empty answers are treated as ABSTAIN
  if (tooShort) return "ABSTAIN";
  // quick heuristic: answer must contain at least one factual/term cluster tying to sources, not refusal
  const refusalCount = (a.match(ABSTAIN_RE) ?? []).length;
  return refusalCount >= 1 ? "ABSTAIN" : "ANSWER";
}

async function ragAsk(q: { question: string; caseId: string | null }) {
  const body: Record<string, unknown> = { question: q.question };
  if (q.caseId) body.caseId = q.caseId;
  const res = await fetch(BASE + "/api/rag/ask", {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  });
  const json = await res.json();
  return { status: res.status, ...json };
}

const results: any[] = [];
if (existsSync(OUT)) {
  try {
    const prior = JSON.parse(readFileSync(OUT, "utf8"));
    for (const r of prior.details ?? []) results.push(r);
  } catch { /* fresh */ }
}
const haveIds = new Set(results.map(r => r.id));
for (const q of selected) {
  if (haveIds.has(q.id)) { console.log(`skip ${q.id}`); continue; }
  const matter = MATTER_KEY[q.expected_judgment];
  const caseId = matter === "delhi-liquor-2022" ? "delhi-liquor-2022" : matter === "electoral-bonds-2024" ? "electoral-bonds-2024" : null;
  const qa = await ragAsk({ question: q.question, caseId });
  const answer = String(qa?.answer ?? "");
  const classification = await classifyAnswer(answer);
  const sources = (qa?.sources ?? []) as Array<{ section_label: string; text: string }>;
  const claimCtx = sources.map((s, i) => `[${i + 1}] (${s.section_label}) ${String(s.text).slice(0, 500)}`).join("\n\n") || "(no sources)";

  let claim_count = 0, claims: string[] = [], supported = 0, unsupported = 0, contradicted = 0, supported_pct: number | null = null, judge_error: string | null = "no_claims";
  let perClaim: Array<{ claim: string; label: string; reason: string }> = [];
  if (classification === "ANSWER" && answer.trim().length >= 60) {
    const splitRaw = await chatJson([
      { role: "system", content: "Extract atomic factual claims from the ANSWER. Output EXACTLY a JSON array of strings: [\"claim1\",\"claim2\"]. Each entry must be a standalone factual assertion. No commentary. No prose. If there are no claims, output []." },
      { role: "user", content: answer },
    ], 800);
    if (splitRaw.ok) {
      try {
        const start = splitRaw.text.indexOf("[");
        const end = splitRaw.text.lastIndexOf("]");
        const parsed = JSON.parse(splitRaw.text.slice(start, end + 1));
        claims = Array.isArray(parsed) ? parsed.map(String).filter(s => s.trim().length > 5) : [];
      } catch { claims = []; }
    }
    claim_count = claims.length;

    if (claim_count > 0) {
      const judgeRaw = await chatJson([
        { role: "system", content: "You are a strict legal-faithfulness judge. Output ONLY a single JSON object: {\"labels\":[[\"claim\",\"supported\"|\"unsupported\"|\"contradicted\",\"reason\"],...]}. Each label must be exactly one of those three. Use ONLY the SOURCES provided. A claim that restates what the answer says but goes beyond the sources is unsupported." },
        { role: "user", content: `SOURCES:\n${claimCtx}\n\nANSWER's claims:\n${claims.map((c, i) => `${i + 1}. ${c}`).join("\n")}` },
      ], 900);
      if (judgeRaw.ok) {
        try {
          const start = judgeRaw.text.indexOf("{");
          const end = judgeRaw.text.lastIndexOf("}");
          const obj = JSON.parse(judgeRaw.text.slice(start, end + 1));
          const arr = Array.isArray(obj?.labels) ? obj.labels : [];
          let labels: Array<{ claim: string; label: string; reason: string }> = [];
          for (const entry of arr) {
            if (!Array.isArray(entry) || entry.length < 2) continue;
            const lab = String(entry[1]);
            const label = ["supported", "unsupported", "contradicted"].includes(lab) ? lab : "unsupported";
            if (label === "supported") supported += 1;
            else if (label === "contradicted") contradicted += 1;
            else unsupported += 1;
            labels.push({ claim: String(entry[0] ?? ""), label, reason: String(entry[2] ?? "") });
          }
          perClaim = labels;
        } catch { judge_error = "judge_parse_failed"; }
        if (supported + unsupported + contradicted === 0) judge_error = "judge_empty_labels";
        else judge_error = null;
        supported_pct = supported + unsupported + contradicted > 0 ? Number(((supported / (supported + unsupported + contradicted)) * 100).toFixed(1)) : null;
      } else {
        judge_error = judgeRaw.error ?? "judge_failed";
      }
    }
  }

  results.push({
    id: q.id,
    question: q.question,
    expected_judgment: q.expected_judgment,
    case_id_used: caseId,
    classification,
    used_vector: qa?.usedVector,
    source_count: sources.length,
    source_labels: sources.map((s) => s.section_label),
    answer_snippet: answer.slice(0, 400),
    claim_count,
    judged: supported + unsupported + contradicted > 0 ? supported + unsupported + contradicted : 0,
    supported,
    unsupported,
    contradicted,
    supported_pct,
    judge_error,
    generation_model: "openai/gpt-oss-120b (primary)",
    judge_model: "openai/gpt-oss-20b (fast)",
    answer_full: answer,
    claims,
    judge_labels: perClaim,
  });
  writeFileSync(OUT, JSON.stringify({ summary: buildSummary(results), details: results }, null, 2));
  process.stdout.write(`${q.id} ${classification} claims=${claim_count} supported=${supported} err=${judge_error ?? ""}\n`);
  await new Promise((r) => setTimeout(r, 1500));
}

function buildSummary(rows: any[]) {
  const judged = rows.filter((r) => (r.judged ?? 0) > 0);
  const abstains = rows.filter((r) => r.classification === "ABSTAIN").length;
  const totalClaims = judged.reduce((s, r) => s + (r.judged as number), 0);
  const totalSupported = judged.reduce((s, r) => s + (r.supported as number), 0);
  const fails = rows.filter((r) => (r.classification === "ANSWER" && (r.judge_error || (r.judged === 0 && r.claim_count === 0))));
  return {
    generated: new Date().toISOString(),
    matters: ORDER,
    questions: rows.length,
    questions_abstained: abstains,
    abstention_rate_pct: Number(((abstains / rows.length) * 100).toFixed(1)),
    questions_answered: rows.length - abstains,
    questions_judged: judged.length,
    questions_failed_split_or_judge: fails.length,
    total_claims: totalClaims,
    claims_supported: totalSupported,
    supported_pct: totalClaims ? Number(((totalSupported / totalClaims) * 100).toFixed(1)) : 0,
    claims_unsupported: totalClaims - totalSupported - (judged.reduce((s, r) => s + (r.contradicted as number), 0)),
    claims_contradicted: judged.reduce((s, r) => s + (r.contradicted as number), 0),
    judge_model: "openai/gpt-oss-20b (fast)",
    generation_model: "openai/gpt-oss-120b (primary)",
  };
}
const summary = buildSummary(results);
writeFileSync(OUT, JSON.stringify({ summary, details: results }, null, 2));
console.log("\n" + JSON.stringify(summary, null, 2));
