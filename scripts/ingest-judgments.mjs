#!/usr/bin/env node
/**
 * Ingest extracted Supreme Court judgments into the database as legal reference
 * documents (kind='judgment'). These are NOT courtroom simulation cases — they
 * are real judgments stored for RAG retrieval.
 *
 * Usage:
 *   node scripts/ingest-judgments.mjs
 *   node scripts/ingest-judgments.mjs --judgment sita-soren-2024
 *
 * Reads JSON files from data/judgments/ created by extract-judgments.mjs.
 * Each judgment becomes one `documents` row (kind='judgment') and many `chunks` rows.
 * Duplicate documents (same title) are skipped.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const CHUNK_SIZE = 800;
const OVERLAP = 100;

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
      // file missing, try next
    }
  }
  return null;
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function chunkText(input) {
  const text = (input ?? "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  if (text.length <= CHUNK_SIZE) return [{ text, tokenCount: countWords(text), index: 0 }];
  const words = text.split(" ");
  const chunks = [];
  let start = 0;
  let index = 0;
  while (start < words.length) {
    let end = start;
    let length = 0;
    while (end < words.length) {
      const wordLen = words[end].length + (end > start ? 1 : 0);
      if (length + wordLen > CHUNK_SIZE && end > start) break;
      length += wordLen;
      end += 1;
    }
    const slice = words.slice(start, end).join(" ");
    if (slice.trim()) {
      chunks.push({ text: slice, tokenCount: countWords(slice), index });
      index += 1;
    }
    if (end >= words.length) break;
    let carryLength = 0;
    let carryStart = end;
    while (carryStart > start) {
      const wordLen = words[carryStart - 1].length + (carryStart < end ? 1 : 0);
      if (carryLength + wordLen > OVERLAP) break;
      carryLength += wordLen;
      carryStart -= 1;
    }
    start = carryStart > start ? carryStart : end;
  }
  return chunks;
}

/** Extract paragraph-level section labels from judgment text. */
function extractParagraphLabel(text, chunkIndex) {
  // Try to find paragraph numbers like "12.", "Para 5:", etc.
  const paraMatch = text.match(/^(\d+)\.\s/);
  if (paraMatch) return `Para ${paraMatch[1]}`;
  
  // Try to find section headers
  const sectionMatch = text.match(/^(?:PART|Section|Chapter|CHAPTER|I{1,3}V?|V?I{0,3})\b[^.]{0,60}/i);
  if (sectionMatch) return sectionMatch[0].trim().slice(0, 80);
  
  return `Chunk ${chunkIndex + 1}`;
}

async function main() {
  const args = process.argv.slice(2);
  let judgmentFilter = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--judgment" && args[i + 1]) judgmentFilter = args[i + 1];
  }

  const databaseUrl = loadDatabaseUrl();
  if (!databaseUrl) {
    console.error("DATABASE_URL not set.");
    process.exit(1);
  }
  const sql = neon(databaseUrl);

  const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "judgments");
  if (!fs.existsSync(dataDir)) {
    console.error(`Judgments directory not found: ${dataDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.error("No judgment JSON files found. Run extract-judgments.mjs first.");
    process.exit(1);
  }

  let totalDocs = 0;
  let totalChunks = 0;

  for (const file of files) {
    const judgment = JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf8"));
    if (judgmentFilter && judgment.id !== judgmentFilter) continue;

    console.log(`\nIngesting: ${judgment.title} (${judgment.citation})`);
    console.log(`  Words: ${judgment.wordCount}, Chars: ${judgment.charCount}`);

    // Check for duplicate documents
    const existing = await sql`
      SELECT id FROM documents WHERE title = ${judgment.title + " — " + judgment.citation} LIMIT 1
    `;
    if (existing.length > 0) {
      console.log(`  SKIP: already ingested (document ${existing[0].id})`);
      continue;
    }

    // Insert document (kind='judgment', not linked to any simulation case)
    const docTitle = `${judgment.title} — ${judgment.citation}`;
    const [doc] = await sql`
      INSERT INTO documents (case_id, owner_id, kind, title, status)
      VALUES (${null}, ${null}, 'judgment', ${docTitle}, 'indexed')
      RETURNING id
    `;

    // Chunk the full text
    const chunks = chunkText(judgment.fullText);
    console.log(`  Chunks: ${chunks.length}`);

    // Insert chunks in batches of 25
    for (let i = 0; i < chunks.length; i += 25) {
      const batch = chunks.slice(i, i + 25);
      await Promise.all(
        batch.map((chunk) => {
          const label = extractParagraphLabel(chunk.text, chunk.index);
          const sectionLabel = `${judgment.citation} | ${label}`;
          return sql`
            INSERT INTO chunks (document_id, case_id, section_label, text, token_count)
            VALUES (${doc.id}, ${null}, ${sectionLabel}, ${chunk.text}, ${chunk.tokenCount})
          `;
        }),
      );
    }

    // Store metadata as a separate small chunk for search
    const metaText = `${judgment.title} (${judgment.citation}). Court: ${judgment.court}. Date: ${judgment.date}. Judges: ${judgment.judges}. Topics: ${judgment.topics.join(", ")}. Referenced Acts: ${judgment.referencedActs.join("; ")}.`;
    await sql`
      INSERT INTO chunks (document_id, case_id, section_label, text, token_count)
      VALUES (${doc.id}, ${null}, ${judgment.citation + " | Metadata"}, ${metaText}, ${countWords(metaText)})
    `;

    totalDocs += 1;
    totalChunks += chunks.length + 1; // +1 for metadata chunk
    console.log(`  Done: document ${doc.id}, ${chunks.length + 1} chunks total`);
  }

  console.log(`\nIngestion complete: ${totalDocs} documents, ${totalChunks} chunks.`);

  // Print summary
  const allDocs = await sql`SELECT COUNT(*)::int AS count FROM documents`;
  const allChunks = await sql`SELECT COUNT(*)::int AS count FROM chunks`;
  const nullEmbed = await sql`SELECT COUNT(*)::int AS count FROM chunks WHERE embedding IS NULL`;
  console.log(`Database: ${allDocs[0].count} documents, ${allChunks[0].count} chunks total, ${nullEmbed[0].count} without embeddings`);
}

main().catch((err) => {
  console.error(`[ingest-judgments] failed:`, err);
  process.exit(1);
});
