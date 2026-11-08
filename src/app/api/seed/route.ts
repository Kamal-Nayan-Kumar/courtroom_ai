import { seedCases } from "@/lib/seed";


export async function POST() {
  await seedCases();
  return Response.json({ ok: true });
}
