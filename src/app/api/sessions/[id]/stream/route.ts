import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { GROQ_PRIMARY, OPENROUTER_FALLBACK } from "@/lib/llm";

export const maxDuration = 60;

const GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";

type Responder = "judge" | "witness";

function clip(s: string, n = 1400) {
  return s.length > n ? s.slice(0, n) : s;
}

function transcriptBlock(turns: Array<{ speaker_name: string; kind: string; text: string }>) {
  return (
    turns.map((t) => `[${t.speaker_name} · ${t.kind}] ${clip(String(t.text ?? ""), 600)}`).join("\n\n") ||
    "(no turns yet)"
  );
}

function extractDelta(line: string): string {
  const trimmed = line.trim();
  if (!trimmed) return "";
  if (!trimmed.startsWith("data:")) return "";
  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") return "";
  try {
    const json = JSON.parse(payload) as {
      choices?: Array<{ delta?: { content?: string }; message?: { content?: string } }>;
    };
    const choice = json.choices?.[0];
    return choice?.delta?.content ?? choice?.message?.content ?? "";
  } catch {
    return "";
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  let body: { text?: string; kind?: string };
  try {
    body = (await req.json()) as { text?: string; kind?: string };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = (body.text ?? "").trim().slice(0, 4000);
  const rawKind = String(body.kind ?? "standard").toLowerCase().trim();
  const kind: "objection" | "judge" | "witness" | "standard" =
    rawKind === "objection" || rawKind === "judge" || rawKind === "witness" || rawKind === "standard"
      ? (rawKind as "objection" | "judge" | "witness" | "standard")
      : "standard";
  if (!text) return Response.json({ error: "text required" }, { status: 400 });

  const groqKey = process.env.GROQ_API_KEY;
  const orKey = process.env.OPENROUTER_API_KEY;
  if (!groqKey && !orKey) {
    return Response.json(
      { error: "No LLM key configured. Set GROQ_API_KEY or OPENROUTER_API_KEY." },
      { status: 500 }
    );
  }

  const sql = db();
  const [sess] = await sql`SELECT * FROM sessions WHERE id = ${id} LIMIT 1`;
  if (!sess || sess.user_id !== userId) return Response.json({ error: "Session not found" }, { status: 404 });
  if (sess.status === "ended") return Response.json({ error: "Session ended" }, { status: 409 });

  const responder: Responder = kind === "judge" || kind === "objection" ? "judge" : "witness";
  const studentKind = kind === "objection" ? "objection" : "standard";
  const aiKind = responder === "judge" ? "ruling" : "response";

  const [caseRow] = await sql`SELECT * FROM cases WHERE id = ${sess.case_id} LIMIT 1`;
  const parties = await sql`SELECT * FROM case_parties WHERE case_id = ${sess.case_id}`;
  const turns = await sql`SELECT * FROM session_turns WHERE session_id = ${id} ORDER BY seq ASC`;
  const evidence = await sql`SELECT * FROM case_evidence WHERE case_id = ${sess.case_id} LIMIT 6`;

  const judge = parties.find((p: any) => p.side === "judge");
  const witnesses = parties.filter((p: any) => p.side === "witness");
  const witness = witnesses[0];
  const judgeName = judge?.name ?? "Hon'ble Justice";

  const caseBrief = `Case: ${caseRow?.title ?? ""}
Court: ${caseRow?.court ?? ""}
Charges: ${caseRow?.charges ?? ""}
Summary: ${caseRow?.summary ?? ""}

Exhibits on record:
${(evidence as Array<{ exhibit_label: string; title: string }>).map((e) => `- ${e.exhibit_label} ${e.title}`).join("\n") || "- none yet"}

Transcript so far:
${transcriptBlock(turns as Array<{ speaker_name: string; kind: string; text: string }>)}

Student turn (${kind}):
${text}`;

  const system =
    responder === "judge"
      ? `You are ${judgeName}. Respond to the student's last submission in an Indian courtroom. 2-4 sentences in plain courtroom tone. ${kind === "objection" ? "Rule on the objection. Start with OBJECTION SUSTAINED or OBJECTION OVERRULED and give a one-sentence reason." : "Give a short bench response / direction."} Cite one real statute or precedent briefly by number. No fake statutes.`
      : `You are ${witness?.name ?? "PW-1"}, ${witness?.role ?? "witness"}. Personality: ${witness?.personality ?? ""}. Answer the counsel's last question truthfully to the case facts, in character as a witness under oath in an Indian court. 3-5 sentences, natural hesitation allowed, one realistic detail. No fake statutes.`;

  const messages = [
    { role: "system", content: system },
    { role: "user", content: caseBrief },
  ];

  const providers: Array<{ base: string; key: string; model: string }> = [];
  if (groqKey) providers.push({ base: GROQ_BASE, key: groqKey, model: GROQ_PRIMARY });
  if (orKey) providers.push({ base: OPENROUTER_BASE, key: orKey, model: OPENROUTER_FALLBACK });

  // Open the upstream stream now so a 500 JSON is possible before we return.
  let upstreamBody: ReadableStream<Uint8Array> | null = null;
  let lastError = "";
  for (const provider of providers) {
    try {
      const res = await fetch(provider.base, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${provider.key}` },
        body: JSON.stringify({
          model: provider.model,
          messages,
          stream: true,
          max_tokens: 700,
          temperature: responder === "judge" ? 0.5 : 0.7,
        }),
      });
      if (res.ok && res.body) {
        upstreamBody = res.body;
        break;
      }
      const errBody = await res.text().catch(() => "");
      lastError = `${provider.model} failed ${res.status}: ${errBody.slice(0, 300)}`;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "LLM request failed";
    }
  }

  if (!upstreamBody) {
    return Response.json({ error: `LLM streaming failed: ${lastError || "provider error"}` }, { status: 500 });
  }

  // Save the student turn before streaming the response.
  const [maxSeq] = await sql`
    SELECT COALESCE(MAX(seq), 0)::int AS max_seq FROM session_turns WHERE session_id = ${id}
  `;
  const studentSeq = (maxSeq?.max_seq ?? 0) + 1;
  const speakerName = sess.student_role === "defense" ? "Defense Counsel" : "Public Prosecutor";
  const studentCitation =
    studentKind === "objection" ? "Student objection" : "Student submission";
  await sql`
    INSERT INTO session_turns (session_id, seq, actor, speaker_name, kind, text, citation)
    VALUES (${id}, ${studentSeq}, 'student', ${speakerName}, ${studentKind}, ${text}, ${studentCitation})
    RETURNING *
  `;

  const evidenceLabels = (evidence as Array<{ exhibit_label: string }>).map((e) => e.exhibit_label).filter(Boolean);
  const reasoningSteps: string[] = [
    kind === "objection" ? "Reading objection against case facts" : "Reading last submission against case facts",
    evidenceLabels.length
      ? `Checking exhibits: ${evidenceLabels.join(", ").slice(0, 120)}`
      : "Checking exhibits on record",
    responder === "judge"
      ? `Drafting bench response as ${judgeName}`
      : `Drafting ${witness?.name ?? "witness"} response in character`,
  ];

  const aiSpeakerName =
    responder === "judge" ? judgeName : witness?.name ?? "PW-1";
  const aiCitation =
    responder === "judge"
      ? kind === "objection" ? "Bench ruling on objection" : "Bench response"
      : witness?.role ?? "Witness deposition";

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enqueue = (obj: unknown) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      };
      for (const step of reasoningSteps) {
        enqueue({ type: "reasoning", step });
      }
      let fullText = "";
      try {
        const reader = upstreamBody!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const delta = extractDelta(line);
            if (delta) {
              fullText += delta;
              enqueue({ type: "delta", text: delta });
            }
          }
        }
        const tail = extractDelta(buffer);
        if (tail) {
          fullText += tail;
          enqueue({ type: "delta", text: tail });
        }
      } catch {
        // Mid-stream upstream failure: persist whatever arrived.
      }

      const cleanText = fullText.trim() || "(no response generated)";
      let turn: unknown;
      try {
        const [maxSeq2] = await sql`
          SELECT COALESCE(MAX(seq), 0)::int AS max_seq FROM session_turns WHERE session_id = ${id}
        `;
        const seq = (maxSeq2?.max_seq ?? studentSeq) + 1;
        const [row] = await sql`
          INSERT INTO session_turns (session_id, seq, actor, speaker_name, kind, text, citation)
          VALUES (${id}, ${seq}, ${responder}, ${aiSpeakerName}, ${aiKind}, ${cleanText}, ${aiCitation})
          RETURNING *
        `;
        turn = row;
      } catch {
        turn = {
          id: `transient-${Date.now()}`,
          session_id: id,
          seq: studentSeq + 1,
          actor: responder,
          speaker_name: aiSpeakerName,
          kind: aiKind,
          text: cleanText,
          citation: aiCitation,
          created_at: new Date().toISOString(),
        };
      }
      enqueue({ type: "done", turn });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
