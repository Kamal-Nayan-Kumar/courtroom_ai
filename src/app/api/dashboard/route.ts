import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";


export async function GET() {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;

  const sql = db();
  const [kpi] = await sql`
    SELECT
      COUNT(*)::int AS sessions_played,
      COALESCE(AVG(overall), 0)::float AS avg_overall
    FROM scores s
    JOIN sessions se ON se.id = s.session_id
    WHERE ${userId ?? ""} <> '' AND se.user_id = ${userId ?? ""}
  `;
  const recentCases = await sql`SELECT * FROM cases ORDER BY seeded DESC, created_at DESC LIMIT 8`;
  const recentSessions = userId
    ? await sql`
        SELECT se.id, se.case_id, se.student_role, se.started_at, se.status, s.overall, s.judge_summary
        FROM sessions se LEFT JOIN scores s ON s.session_id = se.id
        WHERE se.user_id = ${userId}
        ORDER BY se.started_at DESC LIMIT 8
      `
    : [];
  const prepOpen = userId
    ? await sql`SELECT COUNT(*)::int AS open_tasks FROM prep_tasks WHERE user_id = ${userId} AND done = false`
    : [{ open_tasks: 0 }];

  return Response.json({
    kpi: kpi ?? { sessions_played: 0, avg_overall: 0 },
    recentCases,
    recentSessions,
    prepOpen: prepOpen[0] ?? { open_tasks: 0 },
  });
}
