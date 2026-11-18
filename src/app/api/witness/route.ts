import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { chat } from "@/lib/llm";
import { findGroundingViolations, describeViolations } from "@/lib/grounding";

export const maxDuration = 60;

interface HistoryMsg {
  role?: string;
  text?: string;
  content?: string;
}

const TRAP_PATTERNS: Array<{
  test: RegExp;
  label: string;
  hint: string;
}> = [
  {
    test: /isn'?t it true|would you agree|don'?t you agree|admit (it|that)/i,
    label: "Leading question",
    hint: "Leading form pushes the witness to agree. Rephrase as a neutral open question and let the witness answer in their own words.",
  },
  {
    test: /previously you (said|stated|told)|you (earlier|before) said|contradict/i,
    label: "Prior-statement trap",
    hint: "Witness is being confronted with a prior statement. Coach them to confirm only what they personally remember and refer to the record for exact wording.",
  },
  {
    test: /what happened (and|&)/i,
    label: "Compound question",
    hint: "Compound question bundles multiple facts. Coach the witness to answer one part at a time and ask for the next part to be repeated.",
  },
  {
    test: /did you (ever|also) (meet|discuss|talk|see)/i,
    label: "Ambiguous timeline",
    hint: "Broad timeline probes invite speculation. Coach the witness to anchor to dates or exhibits they know, and say 'I do not recall' rather than guess.",
  },
];

function detectTrap(message: string): { detected: boolean; label?: string; hint?: string } {
  for (const p of TRAP_PATTERNS) {
    if (p.test.test(message)) {
      return { detected: true, label: p.label, hint: p.hint };
    }
  }
  return { detected: false };
}

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = (await req.json()) as {
    caseId?: string;
    witnessName?: string;
    message?: string;
    history?: HistoryMsg[];
  };

  const caseId = (body.caseId ?? "").trim();
  const witnessName = (body.witnessName ?? "").trim();
  const message = (body.message ?? "").trim().slice(0, 2000);

  if (!caseId) return Response.json({ error: "caseId required" }, { status: 400 });
  if (!witnessName) return Response.json({ error: "witnessName required" }, { status: 400 });
  if (!message) return Response.json({ error: "message required" }, { status: 400 });

  const sql = db();
  const [caseRow] = await sql`SELECT * FROM cases WHERE id = ${caseId} LIMIT 1`;
  if (!caseRow) return Response.json({ error: "Case not found" }, { status: 404 });

  const parties = await sql`SELECT * FROM case_parties WHERE case_id = ${caseId}`;
  const witness =
    parties.find((p: any) => p.name === witnessName) ??
    parties.find((p: any) => (p.name ?? "").toLowerCase() === witnessName.toLowerCase()) ??
    parties.find((p: any) => p.is_witness && (p.name ?? "").toLowerCase() === witnessName.toLowerCase());

  if (!witness) return Response.json({ error: "Witness not found for this case" }, { status: 404 });

  // The case record is the only permitted source of facts. Without it the
  // persona has no ground truth and invents dates, diary entries and sections.
  const exhibits = await sql`
    SELECT exhibit_label, title, description, content FROM case_evidence
    WHERE case_id = ${caseId} ORDER BY exhibit_label
  `;
  const facts = await sql`
    SELECT section_label, text FROM chunks
    WHERE case_id = ${caseId} ORDER BY created_at ASC
  `;

  const recordBlock = [
    (exhibits as Array<Record<string, string>>).length
      ? "Exhibits on record:\n" +
        (exhibits as Array<Record<string, string>>)
          .map((e) => `- ${e.exhibit_label} ${e.title}: ${e.description} ${e.content}`)
          .join("\n")
      : "",
    (facts as Array<Record<string, string>>).length
      ? "Case facts on record:\n" +
        (facts as Array<Record<string, string>>).map((f) => `- [${f.section_label}] ${f.text}`).join("\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n\n") || "(no exhibits or facts are on record for this case)";

  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const historyMsgs = history
    .map((m) => {
      const text = (m.text ?? m.content ?? "").trim();
      if (!text) return null;
      const role = m.role === "assistant" || m.role === "witness" ? "assistant" : "user";
      return { role: role as "user" | "assistant", content: text.slice(0, 1200) };
    })
    .filter(Boolean) as Array<{ role: "user" | "assistant"; content: string }>;

  const system = [
    `You are ${witness.name}, ${witness.role ?? "witness"} in case ${caseRow.title} (${caseRow.court}).`,
    witness.persona_prompt ? `Persona: ${witness.persona_prompt}` : "",
    witness.personality ? `Personality: ${witness.personality}` : "",
    "You are in a coaching session before cross-examination. Answer the advocate's question from the witness's point of view, truthfully to the case facts, in character. 2-4 sentences.",
    "STRICT GROUNDING RULE: you may state ONLY what is written in the CASE RECORD below, and you should quote the record's own words for dates, counts and section numbers. Never invent or alter a date, a count, a period, a diary entry, a page number, a section number or a proper name. If the record does not contain the specific asked for, reply 'The record does not state that' (or 'I do not recall') and give only what the record does contain. Do not speculate. Do not cite any statute or section that is not quoted in the record.",
    "Stay consistent with the persona.",
    "",
    "CASE RECORD:",
    recordBlock,
  ]
    .filter(Boolean)
    .join("\n");

  let reply: string;
  try {
    reply = await chat({
      messages: [
        { role: "system", content: system },
        ...historyMsgs,
        { role: "user", content: message },
      ],
      maxTokens: 700,
      temperature: 0.3,
      fast: true,
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Witness coaching failed" },
      { status: 502 },
    );
  }

  // Verify the answer against the record. If it asserts specifics that are not
  // in the record, regenerate once with the violation named, then fall back to a
  // record-only answer.
  const recordText = recordBlock;
  let violations = findGroundingViolations(reply, recordText);
  if (violations.length) {
    try {
      const repaired = await chat({
        messages: [
          {
            role: "system",
            content:
              system +
              "\n\nYour previous answer asserted material that is NOT in the CASE RECORD: " +
              describeViolations(violations) +
              ". Rewrite the answer using ONLY what the CASE RECORD states. If the record does not contain the specific, say 'The record does not state that'.",
          },
          ...historyMsgs,
          { role: "user", content: message },
        ],
        maxTokens: 700,
        temperature: 0,
        fast: true,
      });
      const repairedViolations = findGroundingViolations(repaired, recordText);
      if (repairedViolations.length < violations.length) {
        reply = repaired;
        violations = repairedViolations;
      }
    } catch {
      /* keep the original reply */
    }
  }
  if (violations.length) {
    reply =
      "I cannot speak to that: the record before me does not contain those particulars. " +
      "Ask me about what the case record actually states.";
  }

  const trap = detectTrap(message);
  const trapNote = trap.detected
    ? `Potential trap (${trap.label}): ${trap.hint}`
    : null;

  return Response.json({
    witnessName: witness.name,
    reply,
    trap,
    trapNote,
  });
}
