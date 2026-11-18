import { seedCases } from "@/lib/seed";


export async function POST(req: Request) {
  let only: string[] | undefined;
  try {
    const body = await req.json();
    if (body && Array.isArray(body.only)) only = body.only.map(String);
  } catch {
    // No body: seed everything.
  }

  try {
    await seedCases(only);
    return Response.json({ ok: true, seeded: only ?? "all" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Seed failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
