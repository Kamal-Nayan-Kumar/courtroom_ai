import { auth } from "@/lib/auth/server";

export const maxDuration = 30;

type FirecrawlResult = {
  title?: string;
  url?: string;
  markdown?: string;
  description?: string;
};

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Search not configured" },
      { status: 502 }
    );
  }

  let query = "";
  try {
    const body = (await req.json()) as { query?: unknown };
    query = typeof body?.query === "string" ? body.query.trim() : "";
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!query) {
    return Response.json({ error: "query required" }, { status: 400 });
  }
  if (query.length > 500) {
    return Response.json({ error: "query too long" }, { status: 400 });
  }

  let providerRes: Response;
  try {
    providerRes = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, limit: 5 }),
    });
  } catch (err) {
    console.warn(
      `[search] provider request failed: ${err instanceof Error ? err.message : String(err)}`
    );
    return Response.json({ error: "Search provider error" }, { status: 502 });
  }
  if (!providerRes.ok) {
    return Response.json({ error: "Search provider error" }, { status: 502 });
  }

  const json = (await providerRes.json()) as { data?: FirecrawlResult[] };
  const results = (json.data ?? []).map((d) => ({
    title: d.title ?? "",
    url: d.url ?? "",
    snippet: ((d.markdown ?? d.description ?? "") as string)
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300),
  }));

  return Response.json(results);
}
