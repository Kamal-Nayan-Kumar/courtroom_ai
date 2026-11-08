import { db } from "@/lib/db";


export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sql = db();
  const [caseRow] = await sql`SELECT * FROM cases WHERE id = ${id} LIMIT 1`;
  if (!caseRow) return Response.json({ error: "Case not found" }, { status: 404 });
  const parties = await sql`SELECT * FROM case_parties WHERE case_id = ${id}`;
  const evidence = await sql`SELECT * FROM case_evidence WHERE case_id = ${id} ORDER BY exhibit_label ASC`;
  const chunks = await sql`
    SELECT id, section_label, text, token_count FROM chunks WHERE case_id = ${id} ORDER BY created_at ASC LIMIT 200
  `;
  return Response.json({ case: caseRow, parties, evidence, chunks });
}
