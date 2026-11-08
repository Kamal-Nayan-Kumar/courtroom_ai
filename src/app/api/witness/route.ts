import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { chat } from "@/lib/llm";

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
    "You are in a coaching session before cross-examination. Answer the advocate's question from the witness's point of view, truthfully to the case facts, in character. 2-4 sentences, natural hesitation allowed, one realistic detail, no invented statutes. If asked for a detail you cannot know, say you do not recall. Stay consistent with the persona.",
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
      temperature: 0.7,
      fast: true,
    });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Witness coaching failed" },
      { status: 502 },
    );
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
