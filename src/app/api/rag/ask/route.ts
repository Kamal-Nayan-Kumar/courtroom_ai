import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { chat } from "@/lib/llm";
import { retrieve } from "@/lib/retrieval";
import { resolveCaseId } from "@/lib/caseAliases";

export const maxDuration = 60;

type AskedChunk = {
  id?: string;
  section_label: string;
  text: string;
  score?: number | null;
};

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = (await req.json()) as { question?: string; caseId?: string; web?: boolean };
  const question = (body.question ?? "").trim().slice(0, 1500);
  const caseId = body.caseId ? resolveCaseId(body.caseId) : null;
  if (!question) return Response.json({ error: "question required" }, { status: 400 });

  // A case built on a landmark judgment is scoped to that judgment, so its
  // research is grounded in the case's own law rather than the whole corpus.
  const sql = db();
  let documentId: string | null = null;
  if (caseId) {
    const [row] = await sql`
      SELECT source_document_id FROM cases WHERE id = ${caseId} LIMIT 1
    `;
    documentId = row?.source_document_id ?? null;
  }

  // Retrieval is centralized in src/lib/retrieval.ts. The app uses case-or-doc
  // so playable cases ground themselves in their linked judgment (or, for
  // cases without one, in the wider judgment corpus).
  const { results, usedVector } = await retrieve({
    question,
    caseId,
    scope: documentId ? "case-or-doc" : "case-or-null",
    documentId,
    kwWeight: 0.4,
    cosineWeight: 0.6,
    limit: 6,
    // Score a wider vector shortlist before blending; the old hardcoded 10
    // caused relevant holdings to be cut before keyword scoring ran.
    vectorCandidateLimit: 50,
  });
  const rows: AskedChunk[] = results.map((r) => ({
    id: String(r.id),
    section_label: String(r.section_label),
    text: String(r.text),
    score: Number(r.blended),
  }));

  const context = rows.map((r) => `[${r.section_label}] ${r.text.slice(0, 900)}`).join("\n\n") || "(no indexed sources yet)";

  let webBlock = "";
  if (body.web && process.env.FIRECRAWL_API_KEY) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}` },
        body: JSON.stringify({ query: `India ${question}`, limit: 3 }),
      });
      if (res.ok) {
        const json = (await res.json()) as { data?: Array<{ title?: string; markdown?: string }> };
        webBlock = (json.data ?? [])
          .map((d) => `${d.title ?? ""}: ${(d.markdown ?? "").slice(0, 700)}`)
          .join("\n\n");
      }
    } catch {
      webBlock = "";
    }
  }

  const answer = await chat({
    messages: [
      {
        role: "system",
        content: `You are a legal research assistant for Indian advocates. Answer only from the provided sources. Cite section numbers and source labels. If the sources do not cover it, say so plainly.`,
      },
      { role: "user", content: `Question: ${question}\n\nIndexed sources:\n${context}${webBlock ? `\n\nWeb results:\n${webBlock}` : ""}` },
    ],
    maxTokens: 1200,
    temperature: 0.3,
  });

  return Response.json({ answer, sources: rows, usedWeb: Boolean(webBlock), usedVector });
}
