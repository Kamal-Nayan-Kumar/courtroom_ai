import { db } from "@/lib/db";


export async function GET() {
  const sql = db();
  const rows = await sql`SELECT * FROM cases ORDER BY seeded DESC, created_at ASC`;
  return Response.json(rows);
}
