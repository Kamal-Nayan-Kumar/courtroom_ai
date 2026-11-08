#!/usr/bin/env node
/*
 * Batch-embeddings backfill. Fills chunks.embedding where it IS NULL.
 * Uses a local model (Xenova/nomic-embed-text-v1, 768 dims). No API key needed.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/backfill-embeddings.mjs
 * Env:
 *   DATABASE_URL        Neon connection string (required)
 *   BATCH_SIZE          rows per batch (default 50)
 *   LIMIT               total rows to process, omit for all
 */
import { neon } from "@neondatabase/serverless";

const EMBED_DIM = 768;
const BATCH_SIZE = Number(process.env.BATCH_SIZE || 50);
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : null;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
let pipeFn = null;

async function getPipe() {
  if (!pipeFn) {
    const { pipeline } = await import("@huggingface/transformers");
    pipeFn = await pipeline("feature-extraction", "Xenova/nomic-embed-text-v1");
  }
  return pipeFn;
}

async function embedBatch(texts) {
  const pipe = await getPipe();
  const out = [];
  for (const t of texts) {
    const res = await pipe(t, { pooling: "mean", normalize: true });
    out.push(Array.from(res.data));
  }
  return out;
}

async function main() {
  let updated = 0;
  let skipped = 0;
  let processed = 0;

  console.log(`[backfill] starting batchSize=${BATCH_SIZE} limit=${LIMIT ?? "all"}`);

  for (;;) {
    const batch = await sql`
      SELECT id, text FROM chunks
      WHERE embedding IS NULL
      ORDER BY created_at ASC
      LIMIT ${BATCH_SIZE}
    `;
    if (batch.length === 0) break;

    const ids = batch.map((r) => String(r.id));
    const texts = batch.map((r) => String(r.text ?? "").slice(0, 8000));

    const vectors = await embedBatch(texts);
    if (vectors.length !== batch.length) {
      throw new Error(`embedding count mismatch: got ${vectors.length}, expected ${batch.length}`);
    }

    for (let i = 0; i < batch.length; i++) {
      const id = ids[i];
      const vec = vectors[i];
      if (!vec || vec.length !== EMBED_DIM) {
        skipped++;
        console.warn(`[backfill] skipping chunk ${id}: dimension mismatch (got ${vec?.length ?? 0}, expected ${EMBED_DIM})`);
        continue;
      }
      const vecStr = `[${vec.join(",")}]`;
      await sql`
        UPDATE chunks SET embedding = ${vecStr}::vector WHERE id = ${id}
      `;
      updated++;
    }

    processed += batch.length;
    console.log(`[backfill] batch done: processed=${processed} updated=${updated} skipped=${skipped}`);

    if (LIMIT != null && processed >= LIMIT) break;
  }

  const remaining = await sql`
    SELECT COUNT(*)::int AS count FROM chunks WHERE embedding IS NULL
  `;
  console.log(`[backfill] done. updated=${updated} skipped=${skipped} remaining=${Number(remaining[0]?.count ?? 0)}`);
}

main().catch((err) => {
  console.error(`[backfill] failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
