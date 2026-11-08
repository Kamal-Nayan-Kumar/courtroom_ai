import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { runIntroGraph } from "@/lib/graph";

export const maxDuration = 60;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const sql = db();
  const [sess] = await sql`SELECT * FROM sessions WHERE id = ${id} LIMIT 1`;
  if (!sess || sess.user_id !== userId) return Response.json({ error: "Session not found" }, { status: 404 });
  if (sess.status === "ended") return Response.json({ error: "Session ended" }, { status: 409 });

  const result = await runIntroGraph({ sessionId: id });
  const turn = result.created[0] ?? null;
  return Response.json(
    {
      session: result.session,
      turn,
      turns: result.turns,
      added: result.created,
      reasoning: result.reasoning,
    },
    { status: 201 }
  );
}
