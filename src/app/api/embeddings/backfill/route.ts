import { db, type Row } from "@/lib/db";
import { auth } from "@/lib/auth/server";
import { embed, EMBED_DIM } from "@/lib/llm";

export const maxDuration = 300;

const BATCH = 50;

export async function POST(req: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  let body: { batchSize?: number; limit?: number } = {};
  try {
    body = (await req.json()) as { batchSize?: number; limit?: number };
  } catch {
    body = {};
  }
  const batchSize = Math.min(200, Math.max(1, Math.floor(body.batchSize ?? BATCH) || BATCH));
  const limit = body.limit != null ? Math.max(0, Math.floor(body.limit)) : null;

  const sql = db();
  let updated = 0;
  let skipped = 0;
  let processed = 0;

  for (;;) {
    const batch = (await sql`
      SELECT id, text FROM chunks
      WHERE embedding IS NULL
      ORDER BY created_at ASC
      LIMIT ${batchSize}
    `) as Row[];

    if (batch.length === 0) break;

    const ids = batch.map((r) => String(r.id));
    const texts = batch.map((r) => String(r.text ?? "").slice(0, 8000));

    let vectors: number[][];
    try {
      vectors = await embed(texts);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[embeddings/backfill] embed failed: ${msg}`);
      return Response.json(
        { error: `embedding failed: ${msg}`, updated, skipped },
        { status: 500 },
      );
    }

    if (vectors.length !== batch.length) {
      console.warn(
        `[embeddings/backfill] embedding count mismatch: got ${vectors.length}, expected ${batch.length}`,
      );
      return Response.json(
        { error: `embedding count mismatch: got ${vectors.length}, expected ${batch.length}`, updated, skipped },
        { status: 500 },
      );
    }

    for (let i = 0; i < batch.length; i++) {
      const id = ids[i];
      const vec = vectors[i];
      if (!vec || vec.length !== EMBED_DIM) {
        skipped++;
        console.warn(
          `[embeddings/backfill] skipping chunk ${id}: dimension mismatch (got ${vec?.length ?? 0}, expected ${EMBED_DIM})`,
        );
        continue;
      }
      const vecStr = `[${vec.join(",")}]`;
      await sql`
        UPDATE chunks SET embedding = ${vecStr}::vector WHERE id = ${id}
      `;
      updated++;
    }

    processed += batch.length;
    console.log(`[embeddings/backfill] batch done: processed=${processed} updated=${updated} skipped=${skipped}`);

    if (limit != null && processed >= limit) break;
  }

  const remaining = (await sql`
    SELECT COUNT(*)::int AS count FROM chunks WHERE embedding IS NULL
  `) as Row[];
  const remainingCount = Number(remaining[0]?.count ?? 0);

  return Response.json({ updated, skipped, remaining: remainingCount });
}
