import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";


export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = (await req.json()) as { caseId?: string; studentRole?: string; durationSec?: number };
  let caseId = body.caseId;
  if (caseId === "402") caseId = "case-402";
  if (caseId === "184" || caseId === "case-184") caseId = "electoral-bonds-2024";
  if (caseId === "pub-1") caseId = "delhi-liquor-2022";
  if (caseId === "pub-2") caseId = "case-402";
  if (caseId === "pub-3" || caseId === "pub-4") caseId = "electoral-bonds-2024";
  const studentRole = body.studentRole === "prosecution" ? "prosecution" : "defense";
  const duration = [120, 180, 300, 600].includes(body.durationSec ?? 180) ? (body.durationSec ?? 180) : 180;
  if (!caseId) return Response.json({ error: "caseId required" }, { status: 400 });

  const sql = db();
  const [created] = await sql`
    INSERT INTO sessions (user_id, case_id, student_role, duration_limit_sec, status)
    VALUES (${userId}, ${caseId}, ${studentRole}, ${duration}, 'live')
    RETURNING *
  `;
  return Response.json(created, { status: 201 });
}

export async function GET() {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });
  const sql = db();
  const rows = await sql`
    SELECT * FROM sessions WHERE user_id = ${userId} ORDER BY started_at DESC LIMIT 20
  `;
  return Response.json(rows);
}
