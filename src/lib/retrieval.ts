/*
 * Shared retrieval pipeline for case-scoped RAG.
 * Extracted from src/app/api/rag/ask/route.ts so the app and the evaluation
 * harness measure exactly the same code.
 *
 * Scope modes:
 *   case                — case_id = X only (current production behavior)
 *   case-or-null        — case_id = X OR case_id IS NULL (adds judgments)
 *   case-or-doc         — case_id = X OR the case's linked judgment document
 *   global              — all chunks with embeddings (current eval behavior)
 */
import { db, type Row } from "./db.ts";
import { embed, EMBED_DIM } from "./embed.ts";

// Module-scope memo for query embeddings. Questions repeat across ablation
// cells; caching avoids 8x redundant OpenRouter calls. Cache is per-process.
const queryVectorCache = new Map<string, number[] | null>();
// qwen3-embedding models are instruction-aware: queries should be prefixed with
// an instruction describing the task; documents stay unprefixed.
// instructionPrefix is opt-in — the app controls whether to send it.
const QUERY_INSTRUCTION = "Instruct: Given a question about Indian law, retrieve passages containing the answer.";
async function embedCached(q: string, instructionPrefix?: string): Promise<number[] | null> {
  const prefix = instructionPrefix === undefined ? "" : QUERY_INSTRUCTION;
  const key = `${prefix}::${q}`;
  if (queryVectorCache.has(key)) return queryVectorCache.get(key)!;
  const [vec] = await embed([prefix ? `${prefix}\nQuery: ${q}` : q]);
  const v = vec && vec.length === EMBED_DIM ? vec : null;
  queryVectorCache.set(key, v);
  return v;
}

export type ScopeMode = "case" | "case-or-null" | "case-or-doc" | "global";

export interface RetrieveOptions {
  question: string;
  caseId?: string | null;
  scope?: ScopeMode;
  /** Document linked to the case (cases.source_document_id) for case-or-doc. */
  documentId?: string | null;
  kwWeight?: number;
  cosineWeight?: number;
  limit?: number;
  includeScores?: boolean;
  minCandidates?: number;
  mode?: "hybrid" | "keyword-only";
  instructionPrefix?: string; // prepend to query text before embedding, e.g. qwen3 query template
}

const STOPWORDS = new Set([
  "the", "and", "for", "are", "was", "with", "that", "this", "from", "have", "has",
  "not", "but", "you", "all", "can", "his", "her", "its", "their", "would", "there",
  "been", "were", "will", "shall", "they", "them", "then", "than", "legal", "court",
  "case", "matter", "section", "what", "which", "who", "when", "where", "why", "how",
  "did", "does", "vs", "v", "india", "state",
]);

function termsOf(question: string): string[] {
  return question
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function keywordScorePublic(text: string, terms: string[]): number {
  if (!terms.length) return 0;
  const hay = text.toLowerCase();
  let hit = 0;
  for (const t of terms) if (t && hay.includes(t)) hit += 1;
  return hit / terms.length;
}

async function vectorCandidates(
  sql: ReturnType<typeof db>,
  vecStr: string,
  scope: ScopeMode,
  caseId: string | null | undefined,
  limit: number,
  documentId?: string | null,
) {
  if (scope === "global") {
    return sql`
      SELECT id, section_label, text, document_id,
             1 - (embedding <=> ${vecStr}::vector) AS score
      FROM chunks
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${vecStr}::vector
      LIMIT ${limit}
    `;
  }
  if (caseId == null) {
    // No case filter: judgments only (NULL case_id).
    return sql`
      SELECT id, section_label, text, document_id,
             1 - (embedding <=> ${vecStr}::vector) AS score
      FROM chunks
      WHERE embedding IS NOT NULL AND case_id IS NULL
      ORDER BY embedding <=> ${vecStr}::vector
      LIMIT ${limit}
    `;
  }
  if (scope === "case-or-null") {
    // case_id = X OR case_id IS NULL — judgments reachable from case pages.
    return sql`
      SELECT id, section_label, text, document_id,
             1 - (embedding <=> ${vecStr}::vector) AS score
      FROM chunks
      WHERE embedding IS NOT NULL AND (case_id = ${caseId} OR case_id IS NULL)
      ORDER BY embedding <=> ${vecStr}::vector
      LIMIT ${limit}
    `;
  }
  if (scope === "case-or-doc") {
    // The case's own chunks plus the specific judgment it is built on. A case
    // without a linked document falls back to the whole judgment pool.
    if (documentId) {
      return sql`
        SELECT id, section_label, text, document_id,
               1 - (embedding <=> ${vecStr}::vector) AS score
        FROM chunks
        WHERE embedding IS NOT NULL AND (case_id = ${caseId} OR document_id = ${documentId})
        ORDER BY embedding <=> ${vecStr}::vector
        LIMIT ${limit}
      `;
    }
    return sql`
      SELECT id, section_label, text, document_id,
             1 - (embedding <=> ${vecStr}::vector) AS score
      FROM chunks
      WHERE embedding IS NOT NULL AND (case_id = ${caseId} OR case_id IS NULL)
      ORDER BY embedding <=> ${vecStr}::vector
      LIMIT ${limit}
    `;
  }
  // scope === "case"
  return sql`
    SELECT id, section_label, text, document_id,
           1 - (embedding <=> ${vecStr}::vector) AS score
    FROM chunks
    WHERE embedding IS NOT NULL AND case_id = ${caseId}
    ORDER BY embedding <=> ${vecStr}::vector
    LIMIT ${limit}
  `;
}

async function keywordCandidates(
  sql: ReturnType<typeof db>,
  scope: ScopeMode,
  caseId: string | null | undefined,
  minCandidates: number,
  documentId?: string | null,
) {
  if (scope === "global") {
    return sql`
      SELECT id, section_label, text, document_id FROM chunks
      ORDER BY created_at ASC LIMIT ${minCandidates}
    `;
  }
  if (caseId == null) {
    return sql`
      SELECT id, section_label, text, document_id FROM chunks
      WHERE case_id IS NULL
      ORDER BY created_at ASC LIMIT ${minCandidates}
    `;
  }
  if (scope === "case-or-null") {
    return sql`
      SELECT id, section_label, text, document_id FROM chunks
      WHERE case_id = ${caseId} OR case_id IS NULL
      ORDER BY created_at ASC LIMIT ${minCandidates}
    `;
  }
  if (scope === "case-or-doc") {
    // No LIMIT here: the pool is one case plus one judgment, and truncating it
    // by created_at would drop exactly the chunks a keyword fallback needs.
    if (documentId) {
      return sql`
        SELECT id, section_label, text, document_id FROM chunks
        WHERE case_id = ${caseId} OR document_id = ${documentId}
      `;
    }
    return sql`
      SELECT id, section_label, text, document_id FROM chunks
      WHERE case_id = ${caseId} OR case_id IS NULL
    `;
  }
  return sql`
    SELECT id, section_label, text, document_id FROM chunks
    WHERE case_id = ${caseId}
    ORDER BY created_at ASC LIMIT ${minCandidates}
  `;
}

async function rankKeywordRows(
  rows: Array<Record<string, unknown>>,
  terms: string[],
): Promise<Array<Record<string, unknown>>> {
  return rows.map((r) => {
    const id = String(r.id ?? "");
    const section_label = String(r.section_label ?? "");
    const text = String(r.text ?? "");
    const document_id = r.document_id == null ? null : String(r.document_id);
    const keyword = keywordScorePublic(text, terms);
    return { id, section_label, text, document_id, cosine: 0, keyword, blended: keyword };
  }).sort((a, b) => (b.blended as number) - (a.blended as number));
}

export async function retrieve(opts: RetrieveOptions) {
  const {
    question,
    caseId = null,
    scope = "case",
    kwWeight = 0.4,
    cosineWeight = 0.6,
    limit = 6,
    minCandidates = 100,
    mode = "hybrid",
    instructionPrefix,
    documentId = null,
  } = opts;

  const sql = db();
  const terms = termsOf(question);

  let rows: Array<Record<string, unknown>> = [];
  let usedVector = false;

  if (mode === "keyword-only") {
    const keywordRows = await keywordCandidates(sql, scope, caseId, minCandidates, documentId);
    rows = await rankKeywordRows(keywordRows as unknown as Record<string, unknown>[], terms);
    return { usedVector: false, terms, results: rows.slice(0, limit), allCandidates: rows.length };
  }

  try {
    const vec = await embedCached(question, instructionPrefix);
    if (vec) {
      const vecStr = `[${vec.join(",")}]`;
      const candidates = await vectorCandidates(sql, vecStr, scope, caseId, 10, documentId);
      if (candidates.length) {
        rows = (candidates as Row[]).map((r) => {
          const id = String(r.id ?? "");
          const section_label = String(r.section_label ?? "");
          const text = String(r.text ?? "");
          const document_id = r.document_id == null ? null : String(r.document_id);
          const cosine = Math.max(0, Math.min(1, Number(r.score ?? 0)));
          const kw = keywordScorePublic(text, terms);
          return { id, section_label, text, document_id, cosine, keyword: kw, blended: kw * kwWeight + cosine * cosineWeight };
        });
        rows.sort((a, b) => (b.blended as number) - (a.blended as number));
        usedVector = true;
      }
    }
  } catch (err) {
    console.warn(`[retrieve] embedding failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!usedVector) {
    const keywordRows = await keywordCandidates(sql, scope, caseId, minCandidates, documentId);
    rows = await rankKeywordRows(keywordRows as unknown as Record<string, unknown>[], terms);
  }

  const top = rows.slice(0, limit);
  return { usedVector, terms, results: top, allCandidates: rows.length };
}
