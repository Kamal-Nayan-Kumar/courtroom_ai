import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";


export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const sql = db();
  const [sess] = await sql`SELECT * FROM sessions WHERE id = ${id} LIMIT 1`;
  if (!sess || sess.user_id !== userId) return Response.json({ error: "Session not found" }, { status: 404 });
  if (sess.status === "ended") return Response.json({ error: "Session ended" }, { status: 409 });

  const turns = await sql`
    SELECT * FROM session_turns WHERE session_id = ${id} ORDER BY seq ASC
  `;
  return Response.json({ session: sess, turns });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = (await req.json()) as { text?: string; kind?: string };
  const text = (body.text ?? "").trim().slice(0, 4000);
  const kind = body.kind === "objection" ? "objection" : "standard";
  if (!text) return Response.json({ error: "text required" }, { status: 400 });

  const sql = db();
  const [sess] = await sql`SELECT * FROM sessions WHERE id = ${id} LIMIT 1`;
  if (!sess || sess.user_id !== userId) return Response.json({ error: "Session not found" }, { status: 404 });
  if (sess.status === "ended") return Response.json({ error: "Session ended" }, { status: 409 });

  const [maxSeq] = await sql`
    SELECT COALESCE(MAX(seq), 0)::int AS max_seq FROM session_turns WHERE session_id = ${id}
  `;
  const seq = (maxSeq?.max_seq ?? 0) + 1;
  const speakerName = sess.student_role === "defense" ? "Defense Counsel" : "Public Prosecutor";

  const [turn] = await sql`
    INSERT INTO session_turns (session_id, seq, actor, speaker_name, kind, text, citation)
    VALUES (${id}, ${seq}, 'student', ${speakerName}, ${kind}, ${text}, ${"Student submission"})
    RETURNING *
  `;
  return Response.json(turn, { status: 201 });
}
