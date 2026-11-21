/**
 * Unified retrieval evaluation harness.
 *
 * Measures the exact same retrieval code the app uses (src/lib/retrieval.ts).
 * Outputs JSON to stdout, writes data/eval-results.json, and prints a summary
 * to stderr.
 *
 * Usage:
 *   node scripts/eval-retrieval.mts
 *   node scripts/eval-retrieval.mts --check
 *   node scripts/eval-retrieval.mts --check --baseline data/eval/baseline-pre-unify.json
 *   node scripts/eval-retrieval.mts --check --from data/eval-results.json
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { db } from "../src/lib/db.ts";
import { retrieve, type RetrieveOptions } from "../src/lib/retrieval.ts";
import { LABELLED_SET, HOLDINGS_SET, evaluate, fmt } from "./eval-questions.mjs";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  }
}

loadEnv();

const EMBED_DIM = 4096;
const EMBED_MODEL = "qwen/qwen3-embedding-8b";

type Setting = {
  name: string;
  opts: Partial<RetrieveOptions>;
};

const SETTINGS: Setting[] = [
  { name: "keyword-only", opts: { mode: "keyword-only", rerank: false } },
  { name: "vector-only", opts: { mode: "vector-only", kwWeight: 0, cosineWeight: 1, rerank: false } },
  { name: "hybrid (0.4/0.6)", opts: { kwWeight: 0.4, cosineWeight: 0.6 } },
  { name: "hybrid (0.2/0.8)", opts: { kwWeight: 0.2, cosineWeight: 0.8 } },
  { name: "hybrid (0.6/0.4)", opts: { kwWeight: 0.6, cosineWeight: 0.4 } },
];

const SUMMARY_KEYS = ["precision@5", "mrr@10", "citation_accuracy"] as const;

function parseArgs(argv: string[]) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const baselineIdx = args.indexOf("--baseline");
  const baselinePath =
    baselineIdx >= 0 ? args[baselineIdx + 1] : "data/eval/baseline-after-quality.json";
  const fromIdx = args.indexOf("--from");
  const from = fromIdx >= 0 ? args[fromIdx + 1] : null;
  return { check, baselinePath, from };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function lookupSourceDocumentId(caseId: string): Promise<string | null> {
  const sql = db();
  const rows = await sql`
    SELECT source_document_id FROM cases WHERE id = ${caseId} LIMIT 1
  `;
  const row = rows[0] as { source_document_id?: string | null } | undefined;
  const id = row?.source_document_id;
  return id == null ? null : String(id);
}

async function chunkStats(caseId: string | null) {
  const sql = db();
  const rows = caseId
    ? await sql`
        SELECT section_label, text, embedding IS NOT NULL AS has_embedding
        FROM chunks WHERE case_id = ${caseId}
      `
    : await sql`
        SELECT section_label, text, embedding IS NOT NULL AS has_embedding
        FROM chunks
      `;
  const embeddedCount = rows.filter((r: any) => r.has_embedding).length;
  return { chunkCount: rows.length, chunksWithEmbedding: embeddedCount };
}

function labelsFromResults(results: Array<Record<string, unknown>>): string[] {
  return results.map((r) => String(r.section_label ?? ""));
}

function buildSummary(perCase: Record<string, any>) {
  const summary: Record<string, Record<string, number>> = {};
  for (const setting of SETTINGS) {
    const acc5 = Object.values(perCase).flatMap((c: any) =>
      c.results_at_5[setting.name] ? [c.results_at_5[setting.name]] : [],
    );
    const acc10 = Object.values(perCase).flatMap((c: any) =>
      c.results_at_10[setting.name] ? [c.results_at_10[setting.name]] : [],
    );
    if (!acc5.length) continue;
    summary[setting.name] = {
      "precision@5": acc5.reduce((s: number, r: any) => s + r.precision_at_k, 0) / acc5.length,
      "recall@5": acc5.reduce((s: number, r: any) => s + r.recall_at_k, 0) / acc5.length,
      "recall@10": acc10.reduce((s: number, r: any) => s + r.recall_at_k, 0) / acc10.length,
      "mrr@10": acc10.reduce((s: number, r: any) => s + r.mrr, 0) / acc10.length,
      citation_accuracy:
        acc5.reduce((s: number, r: any) => s + r.citation_accuracy, 0) / acc5.length,
    };
  }
  return summary;
}

function printSummary(summary: Record<string, Record<string, number>>, questionCount: number) {
  process.stderr.write(`\n=== Retrieval Evaluation (Qwen3-Embedding-8B, ${EMBED_DIM}d) ===\n`);
  process.stderr.write(`Model: ${EMBED_MODEL}\n`);
  process.stderr.write(`Questions: ${questionCount}\n\n`);
  for (const [name, m] of Object.entries(summary)) {
    process.stderr.write(
      `${name.padEnd(20)} P@5=${fmt(m["precision@5"])}  R@5=${fmt(m["recall@5"])}  R@10=${fmt(m["recall@10"])}  MRR@10=${fmt(m["mrr@10"])}  CitAcc=${fmt(m["citation_accuracy"])}\n`,
    );
  }
}

function runCheck(
  currentSummary: Record<string, Record<string, number>>,
  baselinePath: string,
  holdingsTop3: number,
) {
  if (!existsSync(baselinePath)) {
    process.stderr.write(`ERROR: baseline not found: ${baselinePath}\n`);
    process.exit(1);
  }
  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  const baseSummary = (baseline.summary ?? {}) as Record<string, Record<string, number>>;

  const rows: Array<{
    setting: string;
    metric: string;
    baseline: number;
    current: number;
    delta: number;
    ok: boolean;
  }> = [];

  for (const [setting, baseMetrics] of Object.entries(baseSummary)) {
    const curMetrics = currentSummary[setting];
    for (const metric of SUMMARY_KEYS) {
      const b = Number((baseMetrics as any)[metric]);
      const c = Number(curMetrics?.[metric]);
      if (!Number.isFinite(b)) continue;
      const hasCurrent = Number.isFinite(c);
      const delta = hasCurrent ? c - b : Number.NaN;
      const ok = hasCurrent && delta >= -0.02;
      rows.push({ setting, metric, baseline: b, current: c, delta, ok });
    }
  }

  process.stderr.write(`\n=== Eval Regression Check ===\n`);
  process.stderr.write(`Baseline: ${baselinePath}\n`);
  process.stderr.write(
    `${"setting".padEnd(20)} ${"metric".padEnd(18)} ${"baseline".padStart(8)} ${"current".padStart(8)} ${"delta".padStart(8)}  status\n`,
  );
  for (const r of rows) {
    const deltaStr = Number.isFinite(r.delta) ? (r.delta >= 0 ? "+" : "") + r.delta.toFixed(3) : "NA";
    const curStr = Number.isFinite(r.current) ? r.current.toFixed(3) : "NA";
    process.stderr.write(
      `${r.setting.padEnd(20)} ${r.metric.padEnd(18)} ${r.baseline.toFixed(3).padStart(8)} ${curStr.padStart(8)} ${deltaStr.padStart(8)}  ${r.ok ? "OK" : "FAIL"}\n`,
    );
  }

  const failed = rows.filter((r) => !r.ok);
  if (failed.length) {
    process.stderr.write(`\nFAILED: ${failed.length} metric(s) regressed by more than 0.02.\n`);
    process.exit(1);
  }
  process.stderr.write(`\nHOLDINGS gate: holdings_top3=${holdingsTop3.toFixed(3)} (required >= 0.800)\n`);
  if (!Number.isFinite(holdingsTop3) || holdingsTop3 < 0.8) {
    process.stderr.write(`FAILED: substantive holding brief not in top-3 for enough cases.\n`);
    process.exit(1);
  }
  process.stderr.write(`\nPASS: no regression > 0.02 on precision@5, mrr@10, citation_accuracy; holdings gate met.\n`);
}

async function main() {
  const { check, baselinePath, from } = parseArgs(process.argv);

  // Re-check an existing result artifact without paying for another live eval.
  if (from) {
    const data = JSON.parse(readFileSync(from, "utf8"));
    const summary = data.summary as Record<string, Record<string, number>>;
    const holdingsTop3 = Number(data.holdings?.holdings_top3 ?? 0);
    printSummary(summary, Number(data.question_count ?? 50));
    process.stderr.write(`\nHoldings top-3 hit rate: ${fmt(holdingsTop3)}\n`);
    if (check) runCheck(summary, baselinePath, holdingsTop3);
    return;
  }

  const perCase: Record<string, any> = {};

  for (const [caseId, items] of Object.entries(LABELLED_SET as Record<string, any[]>)) {
    const isCrossCase = caseId.startsWith("__");
    const effectiveCaseId = isCrossCase ? null : caseId;
    const label =
      caseId === "__cross_case__"
        ? "cross-case (all judgments)"
        : isCrossCase
          ? "cross-case (new landmark judgments)"
          : caseId;

    let documentId: string | null = null;
    if (!isCrossCase) {
      documentId = await lookupSourceDocumentId(caseId);
    }

    const statsCaseId = effectiveCaseId;
    const { chunkCount, chunksWithEmbedding } = await chunkStats(statsCaseId);

    const rankings: Record<string, Map<string, string[]>> = {};
    for (const setting of SETTINGS) rankings[setting.name] = new Map();

    process.stderr.write(
      `\nEvaluating: ${label} (${items.length} questions, ${chunkCount} chunks, ${chunksWithEmbedding} embedded)\n`,
    );

    for (let qi = 0; qi < items.length; qi += 1) {
      const item = items[qi];
      for (const setting of SETTINGS) {
        const opts: RetrieveOptions = {
          question: item.q,
          limit: 20,
          ...setting.opts,
        };

        if (isCrossCase) {
          opts.caseId = null;
          opts.scope = "global";
        } else {
          opts.caseId = caseId;
          opts.documentId = documentId;
          opts.scope = documentId ? "case-or-doc" : "case-or-null";
        }

        const res = await retrieve(opts);
        const labels = labelsFromResults(res.results as Array<Record<string, unknown>>);
        rankings[setting.name].set(item.q, labels);
      }
      await sleep(150);
      if ((qi + 1) % 5 === 0 || qi === items.length - 1) {
        process.stderr.write(`  ${label}: ${qi + 1}/${items.length} questions evaluated\n`);
      }
    }

    perCase[caseId] = {
      label,
      questionCount: items.length,
      chunkCount,
      chunksWithEmbedding,
      results_at_5: Object.fromEntries(
        SETTINGS.map((s) => [s.name, evaluate(rankings[s.name], items, 5)]),
      ),
      results_at_10: Object.fromEntries(
        SETTINGS.map((s) => [s.name, evaluate(rankings[s.name], items, 10)]),
      ),
    };
  }

  // Holdings-level check: does the production hybrid setting put the curated
  // holding brief in the top 3 rather than a citation-header fragment?
  const holdingsPerCase: Record<string, any> = {};
  for (const item of HOLDINGS_SET) {
    const documentId = await lookupSourceDocumentId(item.caseId);
    const res = await retrieve({
      question: item.q,
      caseId: item.caseId,
      documentId,
      scope: documentId ? "case-or-doc" : "case-or-null",
      kwWeight: 0.4,
      cosineWeight: 0.6,
      vectorCandidateLimit: 50,
      limit: 3,
    });
    const top3 = labelsFromResults(res.results as Array<Record<string, unknown>>);
    const hit = top3.some((label) => label.includes(item.expectedLabel));
    holdingsPerCase[item.caseId] = {
      question: item.q,
      expectedLabel: item.expectedLabel,
      hit,
      top3,
    };
    process.stderr.write(`  holdings ${hit ? "HIT " : "MISS"} ${item.caseId}: ${top3.slice(0, 3).join(" | ")}\n`);
    await sleep(150);
  }
  const holdingsTop3 =
    Object.values(holdingsPerCase).filter((h: any) => h.hit).length / (HOLDINGS_SET.length || 1);

  const summary = buildSummary(perCase);
  const questionCount = Object.values(perCase).reduce((s: number, c: any) => s + c.questionCount, 0);

  const output = {
    embedding_model: EMBED_MODEL,
    embedding_dim: EMBED_DIM,
    k: 5,
    question_count: questionCount,
    timestamp: new Date().toISOString(),
    perCase,
    summary,
    holdings: { holdings_top3: holdingsTop3, perCase: holdingsPerCase },
  };

  mkdirSync(dirname(resolve("data/eval-results.json")), { recursive: true });
  writeFileSync("data/eval-results.json", JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
  printSummary(summary, questionCount);
  process.stderr.write(`\nHoldings top-3 hit rate: ${fmt(holdingsTop3)}\n`);

  if (check) {
    runCheck(summary, baselinePath, holdingsTop3);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
