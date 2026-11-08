import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { chat } from "@/lib/llm";

export const maxDuration = 60;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const sql = db();
  const [sess] = await sql`SELECT * FROM sessions WHERE id = ${id} LIMIT 1`;
  if (!sess || sess.user_id !== userId) return Response.json({ error: "Session not found" }, { status: 404 });

  const [caseRow] = await sql`SELECT * FROM cases WHERE id = ${sess.case_id} LIMIT 1`;
  const turns = await sql`SELECT * FROM session_turns WHERE session_id = ${id} ORDER BY seq ASC`;

  const transcript = turns
    .map((t: any) => `[${t.speaker_name} · ${t.kind}] ${t.text}`)
    .join("\n\n")
    .slice(0, 12000);

  const raw = await chat({
    messages: [
      {
        role: "system",
        content: `You are an Indian trial judge writing a verdict report for a moot court student who played ${sess.student_role}. Score 0-10 on four rubrics: argument, objection handling, composure, legal accuracy. Be strict but fair. Output ONLY JSON:
{"argument":n,"objection":n,"composure":n,"legal":n,"overall":n,"summary":"3 sentences","strengths":["...","..."],"weaknesses":["...","..."]}
No prose outside the JSON.`,
      },
      { role: "user", content: `Case: ${caseRow.title}\nCharges: ${caseRow.charges}\n\nTranscript:\n${transcript || "(no turns recorded)"}` },
    ],
    maxTokens: 900,
    temperature: 0.3,
  });
  const v = safeJson(raw);

  const clamp = (n: unknown) => {
    const x = Number(n);
    return Number.isFinite(x) ? Math.max(0, Math.min(10, Math.round(x))) : null;
  };

  const [score] = await sql`
    INSERT INTO scores (session_id, argument_score, objection_score, composure_score, legal_accuracy_score, overall, judge_summary, strengths, weaknesses)
    VALUES (${id}, ${clamp(v.argument)}, ${clamp(v.objection)}, ${clamp(v.composure)}, ${clamp(v.legal)}, ${clamp(v.overall)}, ${String(v.summary ?? "Report generated.")}, ${arr(v.strengths)}, ${arr(v.weaknesses)})
    ON CONFLICT (session_id) DO UPDATE SET
      argument_score = EXCLUDED.argument_score,
      objection_score = EXCLUDED.objection_score,
      composure_score = EXCLUDED.composure_score,
      legal_accuracy_score = EXCLUDED.legal_accuracy_score,
      overall = EXCLUDED.overall,
      judge_summary = EXCLUDED.judge_summary,
      strengths = EXCLUDED.strengths,
      weaknesses = EXCLUDED.weaknesses
    RETURNING *
  `;
  await sql`
    UPDATE sessions SET status = 'ended', ended_at = now(), outcome = ${String(v.summary ?? "")} WHERE id = ${id}
  `;
  return Response.json(score);
}

function safeJson(raw: string): Record<string, unknown> {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(raw.slice(start, end + 1));
  } catch {
    // ignore
  }
  return {};
}

function arr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).slice(0, 4);
  return [];
}
