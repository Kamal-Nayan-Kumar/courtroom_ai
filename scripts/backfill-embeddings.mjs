#!/usr/bin/env node
/*
 * Batch-embeddings backfill using Qwen3-Embedding-8B via OpenRouter.
 * Fills chunks.embedding where it IS NULL.
 *
 * All embeddings are generated through the OpenRouter API.
 * No local CPU embedding generation. No local model downloads.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/backfill-embeddings.mjs
 * Env:
 *   DATABASE_URL          Neon connection string (required)
 *   OPENROUTER_API_KEY    OpenRouter API key (required)
 *   BATCH_SIZE            rows per batch (default 10, max 20 for API limits)
 *   LIMIT                 total rows to process, omit for all
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const EMBED_DIM = 4096;
const EMBED_MODEL = "qwen/qwen3-embedding-8b";
const OPENROUTER_EMBED_URL = "https://openrouter.ai/api/v1/embeddings";
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1500;

const BATCH_SIZE = Math.min(20, Number(process.env.BATCH_SIZE || 10));
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : null;

function loadEnv() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  for (const file of [path.join(here, "..", ".env.local"), path.join(here, "..", ".env")]) {
    try {
      const body = fs.readFileSync(file, "utf8");
      for (const line of body.split("\n")) {
        const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
      }
    } catch {
      // file missing
    }
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}
if (!OPENROUTER_API_KEY) {
  console.error("OPENROUTER_API_KEY is required for Qwen3 embeddings");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function embedBatch(texts) {
  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(OPENROUTER_EMBED_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: EMBED_MODEL,
          input: texts,
          encoding_format: "float",
        }),
      });

      if (res.status === 429) {
        const retryAfter = res.headers.get("retry-after");
        const waitMs = retryAfter ? Number(retryAfter) * 1000 : RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(`[backfill] rate limited (429), waiting ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (res.status >= 500) {
        const waitMs = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(`[backfill] server error ${res.status}, retrying in ${waitMs}ms`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Qwen3 embedding failed ${res.status}: ${body.slice(0, 300)}`);
      }

      const json = await res.json();
      const sorted = [...(json.data || [])].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
      return sorted.map((d) => d.embedding);
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES - 1) {
        const waitMs = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(`[backfill] attempt ${attempt + 1} failed: ${err.message}, retrying in ${waitMs}ms`);
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }

  throw lastError;
}

async function main() {
  let updated = 0;
  let skipped = 0;
  let processed = 0;

  console.log(`[backfill] Qwen3-Embedding-8B via OpenRouter`);
  console.log(`[backfill] batchSize=${BATCH_SIZE} limit=${LIMIT ?? "all"} expectedDim=${EMBED_DIM}`);

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

    let vectors;
    try {
      vectors = await embedBatch(texts);
    } catch (err) {
      console.error(`[backfill] embed failed: ${err.message}`);
      console.log(`[backfill] partial result: updated=${updated} skipped=${skipped}`);
      process.exit(1);
    }

    if (!vectors || vectors.length !== batch.length) {
      console.error(`[backfill] count mismatch: got ${vectors?.length ?? 0}, expected ${batch.length}`);
      process.exit(1);
    }

    for (let i = 0; i < batch.length; i++) {
      const id = ids[i];
      const vec = vectors[i];
      if (!vec || vec.length !== EMBED_DIM) {
        skipped++;
        console.warn(`[backfill] skipping chunk ${id}: dimension ${vec?.length ?? 0} ≠ ${EMBED_DIM}`);
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

    // Brief pause between batches to avoid rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  const remaining = await sql`
    SELECT COUNT(*)::int AS count FROM chunks WHERE embedding IS NULL
  `;
  const total = await sql`
    SELECT COUNT(*)::int AS count FROM chunks
  `;
  const withEmb = await sql`
    SELECT COUNT(*)::int AS count FROM chunks WHERE embedding IS NOT NULL
  `;

  console.log(`\n[backfill] ✅ Complete.`);
  console.log(`[backfill]   updated=${updated} skipped=${skipped} remaining=${Number(remaining[0]?.count ?? 0)}`);
  console.log(`[backfill]   total chunks=${total[0].count} with embeddings=${withEmb[0].count}`);

  // Verify dimensions
  const dimCheck = await sql`
    SELECT vector_dims(embedding) AS dim FROM chunks WHERE embedding IS NOT NULL LIMIT 1
  `;
  if (dimCheck.length > 0) {
    console.log(`[backfill]   verified dimension: ${dimCheck[0].dim}`);
  }
}

main().catch((err) => {
  console.error(`[backfill] failed: ${err.message || err}`);
  process.exit(1);
});
