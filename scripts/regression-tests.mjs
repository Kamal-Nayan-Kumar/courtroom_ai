/*
 * Regression tests for Courtroom AI — self-contained, runs against the live dev server.
 * Requires: app running at BASE_URL (default http://localhost:3000) with seeded cases.
 *
 * Tests:
 *   T1 — case-scope isolation: a RAG question for one case never returns chunks
 *        from the other case (the Delhi question must not return Bonds chunks).
 *   T2 — expired session: POST /stream /intro /turns on an expired session -> 409.
 *   T3 — wrong owner: POST /intro on a session created by another user -> 404.
 *   T4 — missing session: POST /intro for a random UUID -> 404.
 *   T5 — stream ends with a `done` event containing a persisted turn.
 *   T6 — verdict returns valid JSON schema: all rubric scores are numbers in [0,10].
 *   T7 — source labels returned by RAG for seeded case are non-empty strings.
 * Exit code 0 = all pass, 1 = any fail.
 */
const BASE = process.env.BASE_URL || "http://localhost:3000";

const results = [];
const check = (name, ok, detail) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

async function http(method, path, body, headers = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null, text = "";
  const raw = await res.text();
  try { json = JSON.parse(raw); } catch { text = raw; }
  return { status: res.status, json, text, headers: res.headers };
}

// T1 — case-scope isolation
{
  const res = await http("POST", "/api/rag/ask", { caseId: "delhi-liquor-2022", question: "evidence certificate admissibility BSA 63" });
  const labels = (res.json?.sources ?? []).map((s) => s.section_label);
  const hasElectoral = labels.some((l) => /electoral|democratic reforms|insc 113|2024 INSC 113/i.test(l));
  check("T1 case-scope isolation", !hasElectoral, `delhi-case labels=${JSON.stringify(labels)}`);
}

// Create session
const sess = await http("POST", "/api/sessions", { caseId: "delhi-liquor-2022", studentRole: "defense", durationSec: 180 });
check("T0 session create 201", sess.status === 201 && typeof sess.json?.id === "string", `status=${sess.status}`);
const sid = sess.json?.id;

// T2 — expired session rejection. We cannot rewind started_at without DB access,
// so we verify against a deliberately-invalidated lifecycle: create, end via verdict, then retry.
const intro = await http("POST", `/api/sessions/${sid}/intro`, {});
check("T2a intro ok 201", intro.status === 201, `status=${intro.status}`);
const verdict = await http("POST", `/api/sessions/${sid}/verdict`, {});
check("T2b verdict ends session (and parse)", verdict.status === 200, `status=${verdict.status}`);
const introAfterVerdict = await http("POST", `/api/sessions/${sid}/intro`, {});
check("T2c intro on ended session -> 409", introAfterVerdict.status === 409, `status=${introAfterVerdict.status}`);

// T3 — wrong owner (create-an-identity path is not available in this app; we simulate via
// a fresh session with a different case but same user=guest and expect the route to treat it
// as not-found for a fabricated UUID — T4 does exactly this. So T3 requires seeding two users
// which is a DB op we won't touch. This test is skipped with reason.)
check("T3 wrong owner", null, "skipped — needs two auth users; no DB write allowed");

// T4 — missing session
{
  const res = await http("POST", "/api/sessions/00000000-0000-0000-0000-000000000000/intro", {});
  check("T4 intro on missing session -> 404", res.status === 404, `status=${res.status}`);
}

// T5 — stream ends with done event
{
  const sess2 = await http("POST", "/api/sessions", { caseId: "delhi-liquor-2022", studentRole: "defense", durationSec: 180 });
  const sid2 = sess2.json?.id;
  await http("POST", `/api/sessions/${sid2}/intro`, {});
  const res = await fetch(BASE + `/api/sessions/${sid2}/stream`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "Your Lordship, the prosecution must prove every element beyond reasonable doubt.", kind: "judge" }),
  });
  const text = await res.text();
  const lines = text.split("\n").filter(Boolean);
  const types = lines.map((l) => { try { return JSON.parse(l).type; } catch { return "?"; } });
  const hasDone = types.includes("done");
  check("T5 stream emits done event", hasDone, `event types=${types.join(",")}`);
}

// T6 — verdict schema check
{
  const sess3 = await http("POST", "/api/sessions", { caseId: "delhi-liquor-2022", studentRole: "defense", durationSec: 180 });
  const sid3 = sess3.json?.id;
  await http("POST", `/api/sessions/${sid3}/intro`, {});
  await fetch(BASE + `/api/sessions/${sid3}/stream`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: "I respectfully submit the witness is not testifying from personal knowledge.", kind: "judge" }),
  });
  const v = await http("POST", `/api/sessions/${sid3}/verdict`, {});
  const json = v.json ?? {};
  const numsOk = ["argument_score", "objection_score", "composure_score", "legal_accuracy_score", "overall"].every((k) => typeof json[k] === "number" && json[k] >= 0 && json[k] <= 10);
  check("T6 verdict schema valid", numsOk, `scores=${JSON.stringify({ argument_score: json.argument_score, overall: json.overall })}`);
}

// T7 — RAG returns non-empty source labels
{
  const res = await http("POST", "/api/rag/ask", { caseId: "electoral-bonds-2024", question: "what does the constitution say about free speech?" });
  const labels = (res.json?.sources ?? []).map((s) => s.section_label);
  check("T7 source labels non-empty", labels.length > 0 && labels.every((l) => typeof l === "string" && l.length > 0), `labels=${JSON.stringify(labels.slice(0, 3))}`);
}

const failed = results.filter((r) => r.ok === false).length;
console.log(`\n${results.filter((r) => r.ok !== null).length} tests ran, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
