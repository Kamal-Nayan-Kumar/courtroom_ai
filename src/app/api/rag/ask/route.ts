import { db, type Row } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { chat, embed, EMBED_DIM } from "@/lib/llm";

export const maxDuration = 60;

type AskedChunk = {
  id?: string;
  section_label: string;
  text: string;
  score?: number | null;
};

// Keyword relevance: fraction of question terms (lowercased, word-bounded)
// that appear in the chunk text. Range 0..1.
function keywordScore(text: string, terms: string[]): number {
  if (!terms.length) return 0;
  const hay = text.toLowerCase();
  let hit = 0;
  for (const term of terms) {
    if (term && hay.includes(term)) hit += 1;
  }
  return hit / terms.length;
}

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id ?? "guest";
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = (await req.json()) as { question?: string; caseId?: string; web?: boolean };
  const question = (body.question ?? "").trim().slice(0, 1500);
  const caseId = body.caseId ?? null;
  if (!question) return Response.json({ error: "question required" }, { status: 400 });

  const sql = db();

  // 1. Vector retrieval: embed the question, search with pgvector cosine.
  // Falls through to keyword retrieval when embeddings are missing or the
  // request fails (no key, wrong dimension, empty result set).
  let rows: AskedChunk[] = [];
  let usedVector = false;

  try {
    const [vec] = await embed([question]);
    if (vec && vec.length === EMBED_DIM) {
      const vecStr = `[${vec.join(",")}]`;
      const vecRows = caseId
        ? await sql`
            SELECT id, section_label, text,
                   1 - (embedding <=> ${vecStr}::vector) AS score
            FROM chunks
            WHERE case_id = ${caseId} AND embedding IS NOT NULL
            ORDER BY embedding <=> ${vecStr}::vector
            LIMIT 6
          `
        : await sql`
            SELECT id, section_label, text,
                   1 - (embedding <=> ${vecStr}::vector) AS score
            FROM chunks
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> ${vecStr}::vector
            LIMIT 6
          `;
      if (vecRows.length > 0) {
        // Rerank: score = keyword*0.4 + cosine*0.6 when both present.
        const terms = question
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((t) => t.length > 2);
        const mapped = (vecRows as Row[]).map((r) => {
          const text = String(r.text ?? "");
          const cosine = r.score == null ? null : Number(r.score);
          // Cosine (1 - distance) is in [-1, 1] for pgvector; clamp to [0,1]
          // so the blend stays interpretable. Keyword is always computable.
          const cosClamped = cosine == null ? 0 : Math.max(0, Math.min(1, cosine));
          const kw = keywordScore(text, terms);
          const score = kw * 0.4 + cosClamped * 0.6;
          return { id: String(r.id ?? ""), section_label: String(r.section_label ?? ""), text, score };
        });
        mapped.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
        rows = mapped.slice(0, 6);
        usedVector = true;
      }
    } else if (vec) {
      console.warn(`[rag/ask] embedding dimension mismatch: got ${vec.length}, expected ${EMBED_DIM}`);
    }
  } catch (err) {
    console.warn(`[rag/ask] embedding failed, using keyword fallback: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 2. Keyword fallback when no vector results (or embedding was NULL/empty).
  if (!usedVector) {
    const keywordRows = caseId
      ? await sql`
          SELECT section_label, text FROM chunks
          WHERE case_id = ${caseId} AND text ILIKE ${"%" + question.split(/\s+/)[0] + "%"}
          ORDER BY created_at DESC LIMIT 6
        `
      : await sql`
          SELECT section_label, text FROM chunks
          WHERE text ILIKE ${"%" + question.split(/\s+/)[0] + "%"}
          ORDER BY created_at DESC LIMIT 6
        `;
    rows = (keywordRows as Row[]).map((r) => ({
      section_label: String(r.section_label ?? ""),
      text: String(r.text ?? ""),
      score: null,
    }));
  }

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
