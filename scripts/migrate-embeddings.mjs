#!/usr/bin/env node
/**
 * Database migration: Nomic 768-dim → Qwen3 4096-dim embeddings.
 *
 * Steps:
 * 1. Verify current state (should have 768-dim vectors)
 * 2. Update the documents kind constraint to allow 'judgment' and 'legal_ref'
 * 3. Drop old vector index
 * 4. Alter embedding column from vector(768) to vector(4096)
 * 5. Set all existing embeddings to NULL (old Nomic vectors are incompatible)
 * 6. Recreate vector index for 4096 dimensions
 * 7. Verify migration
 *
 * Preserves ALL existing data: documents, chunks, cases, sessions, scores, etc.
 * Only the embedding vectors are nullified (they'll be regenerated with Qwen3).
 *
 * Usage:
 *   node scripts/migrate-embeddings.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

function loadDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const here = path.dirname(fileURLToPath(import.meta.url));
  for (const file of [path.join(here, "..", ".env.local"), path.join(here, "..", ".env")]) {
    try {
      const body = fs.readFileSync(file, "utf8");
      for (const line of body.split("\n")) {
        const match = line.match(/^\s*DATABASE_URL\s*=\s*(.+)\s*$/);
        if (match) {
          const value = match[1].trim().replace(/^["']|["']$/g, "");
          if (value) return value;
        }
      }
    } catch {
      // file missing
    }
  }
  return null;
}

async function main() {
  const databaseUrl = loadDatabaseUrl();
  if (!databaseUrl) {
    console.error("DATABASE_URL not set.");
    process.exit(1);
  }

  // Verify we're on the active database (snowy-bread)
  if (!databaseUrl.includes("ep-red-hat-ao4wpm6r")) {
    console.warn("WARNING: This doesn't appear to be the snowy-bread-71537502 database.");
    console.warn("Connection:", databaseUrl.replace(/:[^:@]+@/, ":***@").slice(0, 80));
    // Continue anyway - the user may have a different endpoint name
  }

  const sql = neon(databaseUrl);
  const log = (msg) => console.log(`[migrate] ${msg}`);

  // Step 0: Pre-migration state
  log("=== Pre-migration state ===");
  const chunksBefore = await sql`SELECT COUNT(*)::int AS count FROM chunks`;
  const embsBefore = await sql`SELECT COUNT(*)::int AS count FROM chunks WHERE embedding IS NOT NULL`;
  const docsBefore = await sql`SELECT COUNT(*)::int AS count FROM documents`;
  const casesBefore = await sql`SELECT id, title FROM cases ORDER BY id`;
  const sessionsBefore = await sql`SELECT COUNT(*)::int AS count FROM sessions`;
  const scoresBefore = await sql`SELECT COUNT(*)::int AS count FROM scores`;

  log(`  Chunks: ${chunksBefore[0].count} (${embsBefore[0].count} with embeddings)`);
  log(`  Documents: ${docsBefore[0].count}`);
  log(`  Cases: ${casesBefore.map(c => c.id).join(", ")}`);
  log(`  Sessions: ${sessionsBefore[0].count}, Scores: ${scoresBefore[0].count}`);

  // Check current dimension
  const dimCheck = await sql`
    SELECT vector_dims(embedding) AS dim FROM chunks WHERE embedding IS NOT NULL LIMIT 1
  `;
  if (dimCheck.length > 0) {
    log(`  Current embedding dimension: ${dimCheck[0].dim}`);
  } else {
    log(`  No embeddings found (all NULL)`);
  }

  // Step 1: Update kind constraint to allow 'judgment' and 'legal_ref'
  log("\n=== Step 1: Update documents kind constraint ===");
  try {
    await sql`ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_kind_check`;
    await sql`ALTER TABLE documents ADD CONSTRAINT documents_kind_check CHECK (kind IN ('hf_seed','upload','fir','statute','judgment','legal_ref'))`;
    log("  Kind constraint updated to include 'judgment' and 'legal_ref'");
  } catch (err) {
    log(`  Kind constraint update: ${err.message} (may already be correct)`);
  }

  // Step 2: Drop old vector index
  log("\n=== Step 2: Drop old vector index ===");
  try {
    await sql`DROP INDEX IF EXISTS chunks_embedding_idx`;
    log("  Old index dropped");
  } catch (err) {
    log(`  Drop index: ${err.message}`);
  }

  // Step 3: Null all old embeddings (Nomic vectors are incompatible with Qwen3)
  log("\n=== Step 3: Clear old Nomic embeddings ===");
  const nulled = await sql`
    UPDATE chunks SET embedding = NULL WHERE embedding IS NOT NULL
    RETURNING id
  `;
  log(`  Cleared ${nulled.length} old Nomic embeddings`);

  // Step 4: Alter embedding column from vector(768) to vector(4096)
  log("\n=== Step 4: Alter column to vector(4096) ===");
  try {
    await sql`ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(4096)`;
    log("  Column altered to vector(4096)");
  } catch (err) {
    log(`  Column alter: ${err.message}`);
    // If it fails because it's already 4096, that's fine
    if (!err.message.includes("already")) {
      throw err;
    }
  }

  // Step 5: Recreate vector index for 4096 dimensions
  log("\n=== Step 5: Recreate vector index ===");
  try {
    // For 4096-dim with small dataset, use ivfflat with fewer lists
    // or HNSW for better recall. Using HNSW since dataset is small.
    await sql`CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops)`;
    log("  HNSW index created for vector(4096)");
  } catch (err) {
    log(`  Index creation: ${err.message}`);
    // Fallback to ivfflat
    try {
      await sql`CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10)`;
      log("  Fallback: IVFFlat index created");
    } catch (err2) {
      log(`  IVFFlat fallback also failed: ${err2.message}`);
    }
  }

  // Step 6: Verify migration
  log("\n=== Post-migration verification ===");
  const chunksAfter = await sql`SELECT COUNT(*)::int AS count FROM chunks`;
  const embsAfter = await sql`SELECT COUNT(*)::int AS count FROM chunks WHERE embedding IS NOT NULL`;
  const docsAfter = await sql`SELECT COUNT(*)::int AS count FROM documents`;
  const casesAfter = await sql`SELECT id, title FROM cases ORDER BY id`;
  const sessionsAfter = await sql`SELECT COUNT(*)::int AS count FROM sessions`;
  const scoresAfter = await sql`SELECT COUNT(*)::int AS count FROM scores`;

  log(`  Chunks: ${chunksAfter[0].count} (${embsAfter[0].count} with embeddings — should be 0 pre-backfill)`);
  log(`  Documents: ${docsAfter[0].count}`);
  log(`  Cases: ${casesAfter.map(c => c.id).join(", ")}`);
  log(`  Sessions: ${sessionsAfter[0].count}, Scores: ${scoresAfter[0].count}`);

  // Verify data integrity
  const integrityOk =
    chunksAfter[0].count === chunksBefore[0].count &&
    docsAfter[0].count === docsBefore[0].count &&
    casesAfter.length === casesBefore.length &&
    sessionsAfter[0].count === sessionsBefore[0].count &&
    scoresAfter[0].count === scoresBefore[0].count;

  if (integrityOk) {
    log("\n✅ Migration complete. All data preserved. Embeddings cleared for Qwen3 regeneration.");
  } else {
    log("\n⚠️ WARNING: Data counts changed during migration!");
    log(`  Chunks: ${chunksBefore[0].count} → ${chunksAfter[0].count}`);
    log(`  Documents: ${docsBefore[0].count} → ${docsAfter[0].count}`);
  }

  log("\nNext steps:");
  log("  1. Run scripts/ingest-judgments.mjs to add new judgment documents");
  log("  2. Run scripts/backfill-embeddings.mjs to generate Qwen3 embeddings for all chunks");
}

main().catch((err) => {
  console.error(`[migrate] FATAL:`, err);
  process.exit(1);
});
