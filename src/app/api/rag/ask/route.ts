import { db } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { chat } from "@/lib/llm";
import { retrieve } from "@/lib/retrieval";

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
  const caseId = body.caseId ?? null;
  if (!question) return Response.json({ error: "question required" }, { status: 400 });

  // Retrieval is centralized in src/lib/retrieval.ts. The app uses case-or-null
  // so playable cases can ground themselves in the judgment corpus (judgment
  // chunks carry case_id IS NULL).
  const { results, usedVector } = await retrieve({
    question,
    caseId,
    scope: "case-or-null",
    kwWeight: 0.4,
    cosineWeight: 0.6,
    limit: 6,
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
