import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { chunkText } from "@/lib/chunk";
// pdf-parse ships no types, the runtime shape is a single function.
// Import the lib entry directly to skip the package index.js debug harness
// (it tries to read a test pdf when module.parent is unset, which breaks Turbopack).
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse.js";

export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024;

function parseFn(): (buf: Buffer) => Promise<{ text: string }> {
  if (typeof pdf === "function") return pdf;
  const maybe = pdf as unknown as { default?: unknown };
  if (typeof maybe?.default === "function") return maybe.default as never;
  throw new Error("pdf-parse did not expose a function");
}

export async function GET(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const caseId = new URL(req.url).searchParams.get("caseId");
  if (!caseId) return Response.json({ error: "caseId query param required" }, { status: 400 });

  const sql = db();
  const rows = await sql`
    SELECT d.*,
      COALESCE(c.chunk_count, 0) AS chunk_count
    FROM documents d
    LEFT JOIN (
      SELECT document_id, COUNT(*)::int AS chunk_count
      FROM chunks GROUP BY document_id
    ) c ON c.document_id = d.id
    WHERE d.case_id = ${caseId}
    ORDER BY d.created_at DESC
    LIMIT 50
  `;
  return Response.json(rows);
}

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return Response.json({ error: "multipart form required" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return Response.json({ error: "file field required" }, { status: 400 });
  }

  const rawCaseId = form.get("caseId");
  const caseId = typeof rawCaseId === "string" && rawCaseId.trim() ? rawCaseId.trim() : null;

  const name = (file as File).name || "uploaded.pdf";
  const size = (file as File).size ?? 0;
  if (!/\.pdf$/i.test(name) && (file as File).type !== "application/pdf") {
    return Response.json({ error: "pdf file required" }, { status: 400 });
  }
  if (size > MAX_BYTES) {
    return Response.json({ error: "file too large (max 10MB)" }, { status: 413 });
  }

  const sql = db();
  if (caseId) {
    const found = await sql`SELECT id FROM cases WHERE id = ${caseId} LIMIT 1`;
    if (found.length === 0) {
      return Response.json({ error: "case not found" }, { status: 404 });
    }
  }

  const buffer = Buffer.from(await (file as File).arrayBuffer());
  let text = "";
  try {
    const parsed = await parseFn()(buffer);
    text = (parsed?.text ?? "").trim();
  } catch {
    return Response.json({ error: "could not parse pdf" }, { status: 422 });
  }
  if (!text) {
    return Response.json({ error: "no extractable text in pdf" }, { status: 422 });
  }

  const chunks = chunkText(text);
  const title = name.replace(/\.pdf$/i, "").slice(0, 200) || "uploaded";

  const [document] = await sql`
    INSERT INTO documents (case_id, owner_id, kind, title, status)
    VALUES (${caseId}, ${userId}, 'upload', ${title}, 'indexed')
    RETURNING *
  `;

  for (let i = 0; i < chunks.length; i += 25) {
    const batch = chunks.slice(i, i + 25);
    await Promise.all(
      batch.map(
        (chunk) => sql`
          INSERT INTO chunks (document_id, case_id, section_label, text, token_count)
          VALUES (${document.id}, ${caseId}, ${""}, ${chunk.text}, ${chunk.tokenCount})
        `
      )
    );
  }

  return Response.json({ document, chunkCount: chunks.length }, { status: 201 });
}
