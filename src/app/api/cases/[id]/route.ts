import { db } from "@/lib/db";
import { resolveCaseId } from "@/lib/caseAliases";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = resolveCaseId(rawId);
  const sql = db();
  const [caseRow] = await sql`SELECT * FROM cases WHERE id = ${id} LIMIT 1`;
  if (!caseRow) return Response.json({ error: "Case not found" }, { status: 404 });
  const parties = await sql`SELECT * FROM case_parties WHERE case_id = ${id}`;
  const evidence = await sql`SELECT * FROM case_evidence WHERE case_id = ${id} ORDER BY exhibit_label ASC`;

  // `chunks` stays the case's own dossier — the prep and courtroom pages render
  // this list directly, so the linked judgment is surfaced as metadata instead
  // of appended here (a single judgment can run to thousands of paragraphs).
  const chunks = await sql`
    SELECT id, section_label, text, token_count FROM chunks
    WHERE case_id = ${id}
    ORDER BY created_at ASC LIMIT 200
  `;

  let linkedDocument = null;
  if (caseRow.source_document_id) {
    const [doc] = await sql`
      SELECT id, title, kind FROM documents WHERE id = ${caseRow.source_document_id} LIMIT 1
    `;
    if (doc) {
      const [count] = await sql`
        SELECT count(*)::int AS n FROM chunks WHERE document_id = ${doc.id}
      `;
      linkedDocument = { id: doc.id, title: doc.title, kind: doc.kind, chunkCount: Number(count.n) };
    }
  }

  return Response.json({ case: caseRow, parties, evidence, chunks, linkedDocument });
}
