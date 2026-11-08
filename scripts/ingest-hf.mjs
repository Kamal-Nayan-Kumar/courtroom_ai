#!/usr/bin/env node
// Ingest Hugging Face legal datasets into Neon (documents + chunks).
// No pdftotext, no paid services. Uses the public datasets-server rows API
// instead of a parquet reader, so no heavy native deps are needed.
// Usage: node scripts/ingest-hf.mjs [--limit 200] [--dataset id] [--offline] [--help]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const DEFAULT_DATASETS = ["KanoonGPT/indian-case-laws", "KanoonGPT/indian-legal-documents"];
const CHUNK_SIZE = 800;
const OVERLAP = 100;
const PAGE_SIZE = 100;

// Offline fixtures: built-in statute summaries + case facts for when HF is
// unreachable or no token is available. Inline here (not imported from TS).
// Each entry becomes one document and one-or-more chunks with NULL embeddings.
const OFFLINE_FIXTURES = [
  {
    title: "Bharatiya Nyaya Sanhita (BNS) - key sections (offline fixture)",
    section: "BNS § 103",
    kind: "statute",
    text: "BNS § 103 punishes murder: causing death by an act done with intention or knowledge that it is so likely to cause death, punishable with death or imprisonment for life and fine. Related sections cover culpable homicide not amounting to murder and abetment.",
  },
  {
    title: "Bharatiya Nyaya Sanhita (BNS) - conspiracy (offline fixture)",
    section: "BNS § 61(2)",
    kind: "statute",
    text: "BNS § 61(2) covers criminal conspiracy: an agreement to do an illegal act, or a legal act by illegal means, punishable with the same punishment as the target offence. The 2022 Delhi liquor policy case charges allege conspiracy under this section.",
  },
  {
    title: "Bharatiya Nagarik Suraksha Sanhita (BNSS) - FIR (offline fixture)",
    section: "BNSS § 173",
    kind: "statute",
    text: "BNSS § 173 governs information about a cognizable offence (FIR): the officer in charge must record it in writing, read it back to the informant, and give a free copy. This replaces CrPC § 154. Electronic and zero-FIR procedures are also provided for.",
  },
  {
    title: "Bharatiya Nagarik Suraksha Sanhita (BNSS) - arrest (offline fixture)",
    section: "BNSS § 35",
    kind: "statute",
    text: "BNSS § 35 sets the grounds and safeguards for arrest: no arrest without a warrant except as provided by law, memo of arrest, right to meet a nominated person, and right to legal aid. It replaces CrPC § 41.",
  },
  {
    title: "Bharatiya Sakshya Adhiniyam (BSA) - electronic records (offline fixture)",
    section: "BSA § 63",
    kind: "statute",
    text: "BSA § 63 governs admissibility of electronic records: secondary evidence of an electronic record requires a certificate identifying the record and device, successor to Section 65B of the Indian Evidence Act. Primary evidence of the device itself is separately admissible.",
  },
  {
    title: "Bharatiya Sakshya Adhiniyam (BSA) - facts in issue (offline fixture)",
    section: "BSA § 3",
    kind: "statute",
    text: "BSA § 3 defines facts in issue and relevant facts: facts on which the existence or non-existence of a right, liability, or disability depends, and facts connected with a transaction that are so related as to form part of the same transaction.",
  },
  {
    title: "Case fact: Delhi liquor policy case (offline fixture)",
    section: "Case fact",
    kind: "hf_seed",
    text: "State v. Arvind Kejriwal (2022 Delhi liquor policy case): the CBI/ED allege the 2021-22 Excise Policy routed kickbacks from licensees. Kejriwal was arrested on 21 Mar 2024 after nine ED summons, the first sitting chief minister arrested. Trial court granted bail on 20 Jun 2024, Delhi HC stayed it on 21 Jun 2024 before release, and the Supreme Court granted bail in the CBI case on 13 Sep 2024.",
  },
  {
    title: "Case fact: Electoral bonds case (offline fixture)",
    section: "Case fact",
    kind: "hf_seed",
    text: "Association for Democratic Reforms v. Union of India (2024 INSC 113): a five-judge Constitution Bench led by CJI Chandrachud struck down the Electoral Bonds Scheme of 2018 as unconstitutional, violating the voter's right to information under Article 19(1)(a). Amendments to Companies Act § 182, the Income Tax Act and the RPA on anonymous donations were also struck down.",
  },
  {
    title: "Case fact: Defamation case (offline fixture)",
    section: "Case fact",
    kind: "hf_seed",
    text: "Purnesh Modi v. Rahul Gandhi (2023): a Surat court convicted Rahul Gandhi for the 'Modi surname' remark at a rally, sentencing him to 2 years for defamation, and his Lok Sabha membership was terminated on disqualification. The Supreme Court stayed the conviction in August 2023.",
  },
];

function parseArgs(argv) {
  const args = { limit: 200, dataset: null, offline: false, help: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--offline") args.offline = true;
    else if (arg === "--limit") args.limit = Number(argv[i + 1]) || 200;
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice(8)) || 200;
    else if (arg === "--dataset") args.dataset = argv[i + 1] || null;
    else if (arg.startsWith("--dataset=")) args.dataset = arg.slice(10);
  }
  return args;
}

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

function headers() {
  const h = { Accept: "application/json" };
  if (process.env.HF_TOKEN) h.Authorization = `Bearer ${process.env.HF_TOKEN}`;
  return h;
}

async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, { headers: headers(), signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

// Same logic as src/lib/chunk.ts (script cannot import TS).
function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function chunkText(input) {
  const text = (input ?? "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  if (text.length <= CHUNK_SIZE) return [{ text, tokenCount: countWords(text) }];
  const words = text.split(" ");
  const chunks = [];
  let start = 0;
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
    if (slice.trim()) chunks.push({ text: slice, tokenCount: countWords(slice) });
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

function rowToDocument(row, datasetId, index) {
  const fields = row?.row ?? row ?? {};

  // Prefer known body-text fields (case-laws uses indexable_text, legal docs uses text).
  const textFields = [
    "indexable_text",
    "text",
    "content",
    "judgment",
    "body",
    "document",
    "full_text",
    "headnote_text",
  ];
  let bestText = "";
  for (const key of textFields) {
    const v = fields[key];
    if (typeof v === "string" && v.trim().length > bestText.length) bestText = v.trim();
  }
  if (!bestText) {
    // Fallback: longest plain string, skipping JSON blobs and urls.
    const values = Object.entries(fields);
    for (const [key, v] of values) {
      if (typeof v !== "string") continue;
      if (/_json$/i.test(key)) continue;
      const trimmed = v.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("{") || trimmed.startsWith("[")) continue;
      if (trimmed.startsWith("http")) continue;
      if (trimmed.length > bestText.length) bestText = trimmed;
    }
  }
  if (!bestText) return null;

  const titleCandidates = [
    "case_title",
    "document_title",
    "title",
    "name",
    "party_caption",
    "case_name",
    "caseName",
    "heading",
    "caption",
    "citation",
  ];
  let title = "";
  for (const key of titleCandidates) {
    const v = fields[key];
    if (typeof v === "string" && v.trim() && v.trim().length < 400) {
      title = v.trim();
      break;
    }
  }
  if (!title) title = `${datasetId.split("/").pop()}-${index + 1}`;
  return { title: title.slice(0, 300), text: bestText };
}

async function getFirstSplit(datasetId) {
  const encoded = encodeURIComponent(datasetId);
  const data = await fetchJson(`https://datasets-server.huggingface.co/splits?dataset=${encoded}`);
  const splits = data?.splits ?? [];
  if (!splits.length) return null;
  // Prefer a non-empty sounding split name, else first.
  const first = splits[0];
  return { config: first.config, split: first.split };
}

async function* fetchRows(datasetId, splitInfo, limit) {
  const encoded = encodeURIComponent(datasetId);
  let offset = 0;
  let fetched = 0;
  while (fetched < limit) {
    const length = Math.min(PAGE_SIZE, limit - fetched);
    const url =
      `https://datasets-server.huggingface.co/rows?dataset=${encoded}` +
      `&config=${encodeURIComponent(splitInfo.config)}&split=${encodeURIComponent(splitInfo.split)}` +
      `&offset=${offset}&length=${length}`;
    const data = await fetchJson(url);
    const rows = data?.rows ?? [];
    if (!rows.length) break;
    yield rows;
    fetched += rows.length;
    offset += rows.length;
  }
}

async function ingestFixtures(sql, limit) {
  console.log(`[fixtures] offline mode, limit ${limit}`);
  const picked = OFFLINE_FIXTURES.slice(0, limit);
  let docs = 0;
  let chunks = 0;
  for (const fx of picked) {
    const [inserted] = await sql`
      INSERT INTO documents (case_id, owner_id, kind, title, status)
      VALUES (${null}, ${null}, ${fx.kind}, ${fx.title}, 'indexed')
      RETURNING id
    `;
    const sliced = chunkText(fx.text);
    for (const c of sliced) {
      await sql`
        INSERT INTO chunks (document_id, case_id, section_label, text, token_count)
        VALUES (${inserted.id}, ${null}, ${fx.section}, ${c.text}, ${c.tokenCount})
      `;
      chunks += 1;
    }
    docs += 1;
  }
  return { docs, chunks };
}

async function ingestDataset(sql, datasetId, limit) {
  console.log(`[${datasetId}] looking up splits...`);
  let splitInfo = null;
  try {
    splitInfo = await getFirstSplit(datasetId);
  } catch (err) {
    console.warn(`[${datasetId}] splits lookup failed: ${err.message}`);
  }
  if (!splitInfo) {
    console.warn(
      `[${datasetId}] no datasets-server split (parquet fallback needs a parquet reader). Skipping.`
    );
    return { rows: 0, chunks: 0, docs: 0 };
  }
  console.log(`[${datasetId}] using ${splitInfo.config}/${splitInfo.split}, limit ${limit}`);

  let rows = 0;
  let chunks = 0;
  let docs = 0;
  for await (const page of fetchRows(datasetId, splitInfo, limit)) {
    for (const raw of page) {
      const doc = rowToDocument(raw, datasetId, rows);
      if (!doc) continue;
      const [inserted] = await sql`
        INSERT INTO documents (case_id, owner_id, kind, title, status)
        VALUES (${null}, ${null}, 'hf_seed', ${doc.title}, 'indexed')
        RETURNING id
      `;
      const sliced = chunkText(doc.text);
      for (let i = 0; i < sliced.length; i += 25) {
        const batch = sliced.slice(i, i + 25);
        await Promise.all(
          batch.map(
            (c) => sql`
              INSERT INTO chunks (document_id, case_id, section_label, text, token_count)
              VALUES (${inserted.id}, ${null}, ${""}, ${c.text}, ${c.tokenCount})
            `
          )
        );
      }
      docs += 1;
      chunks += sliced.length;
      rows += 1;
      if (rows % 25 === 0) console.log(`[${datasetId}] ${rows}/${limit} rows, ${chunks} chunks`);
    }
  }
  return { rows, chunks, docs };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("Usage: node scripts/ingest-hf.mjs [--limit 200] [--dataset id] [--offline]");
    console.log("  --limit   rows to take per dataset (default 200)");
    console.log("  --dataset ingest a single dataset id instead of both");
    console.log("  --offline write built-in statute/case-fact fixtures, no HF fetch");
    return;
  }
  if (!args.limit || args.limit < 1) args.limit = 200;
  if (args.limit > 2000) args.limit = 2000;

  const databaseUrl = loadDatabaseUrl();
  if (!databaseUrl) {
    console.error("DATABASE_URL not set (env or .env.local).");
    process.exit(1);
  }
  const sql = neon(databaseUrl);

  if (args.offline) {
    const result = await ingestFixtures(sql, args.limit);
    console.log(`Ingest complete (offline fixtures): ${result.docs} documents, ${result.chunks} chunks.`);
    return;
  }

  const datasets = args.dataset ? [args.dataset] : DEFAULT_DATASETS;

  let totalDocs = 0;
  let totalChunks = 0;
  for (const id of datasets) {
    const result = await ingestDataset(sql, id, args.limit);
    totalDocs += result.docs;
    totalChunks += result.chunks;
    console.log(`[${id}] done: ${result.docs} documents, ${result.chunks} chunks`);
  }
  console.log(`Ingest complete: ${totalDocs} documents, ${totalChunks} chunks.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
