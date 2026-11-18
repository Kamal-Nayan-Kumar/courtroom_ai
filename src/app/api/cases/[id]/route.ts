import { db } from "@/lib/db";


export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  let { id } = await params;
  if (id === "402") id = "case-402";
  if (id === "184" || id === "case-184") id = "electoral-bonds-2024";
  if (id === "pub-1") id = "delhi-liquor-2022";
  if (id === "pub-2") id = "case-402";
  if (id === "pub-3" || id === "pub-4") id = "electoral-bonds-2024";
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
