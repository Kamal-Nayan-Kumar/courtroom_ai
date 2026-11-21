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
  /** Vector candidates to score before blending. Default 50 (was hardcoded 10). */
  vectorCandidateLimit?: number;
  mode?: "hybrid" | "keyword-only" | "vector-only";
  /** Disable label-based reranking for pure keyword/vector ablations. */
  rerank?: boolean;
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

/**
 * A case-insensitive regex matching any query term. `termsOf` only emits
 * [a-z0-9] tokens, so this is safe to use as a SQL parameter (never as raw SQL).
 * Pushing the term filter into SQL avoids the old "oldest 100 chunks" fallback,
 * which silently excluded every judgment ingested later.
 */
function termPattern(terms: string[]): string | null {
  const cleaned = terms
    .map((t) => t.toLowerCase())
    .filter((t) => /^[a-z0-9]+$/.test(t) && t.length > 2)
    .slice(0, 16);
  return cleaned.length ? cleaned.join("|") : null;
}

/**
 * Curated dossier briefs have clean section labels; raw judgment chunks are
 * labelled "<citation> | <first ~70 chars>". Prefer the curated holding brief
 * when scores are close, and push metadata/fragment-only labels down.
 */
const CURATED_BOOST = 0.06;

function rerankScore(row: { blended: number; section_label: string }): number {
  const label = row.section_label.trim();
  if (label.length > 3 && !label.includes(" | ")) return row.blended + CURATED_BOOST;
  const fragment = label.includes(" | ") ? label.slice(label.indexOf(" | ") + 3).trim() : label;
  if (
    /^(metadata|chunk\s*\d+)$/i.test(fragment) ||
    /^[\d\s.,()\-/A-Z]+$/.test(fragment) ||
    fragment.length < 8
  ) {
    return row.blended - CURATED_BOOST;
  }
  return row.blended;
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

/**
 * Curated dossier briefs (clean section labels, no "<citation> | ..." prefix)
 * inside the same scope. These are the holding summaries written for practice;
 * retrieving them separately stops raw judgment fragments from crowding them
 * out of a short answer list.
 */
async function curatedCandidates(
  sql: ReturnType<typeof db>,
  vecStr: string,
  scope: ScopeMode,
  caseId: string | null | undefined,
  documentId: string | null | undefined,
  limit: number,
) {
  const params: unknown[] = [vecStr];
  const clauses: string[] = ["section_label NOT LIKE '% | %' AND embedding IS NOT NULL"];

  if (scope === "global") {
    // no extra scope clause
  } else if (caseId == null) {
    clauses.push("case_id IS NULL");
  } else if (scope === "case-or-doc" && documentId) {
    params.push(caseId, documentId);
    clauses.push("(case_id = $2 OR document_id = $3)");
  } else if (scope === "case-or-null") {
    params.push(caseId);
    clauses.push("(case_id = $2 OR case_id IS NULL)");
  } else {
    params.push(caseId);
    clauses.push("case_id = $2");
  }
  params.push(limit);

  const text = `SELECT id, section_label, text, document_id, 1 - (embedding <=> $1::vector) AS score FROM chunks WHERE ${clauses.join(" AND ")} ORDER BY embedding <=> $1::vector LIMIT $${params.length}`;
  const query = sql as unknown as {
    query: (text: string, params: unknown[]) => Promise<Row[]>;
  };
  return query.query(text, params);
}

async function keywordCandidates(
  sql: ReturnType<typeof db>,
  scope: ScopeMode,
  caseId: string | null | undefined,
  minCandidates: number,
  documentId: string | null | undefined,
  terms: string[],
) {
  const pattern = termPattern(terms);
  // No searchable terms means no keyword signal; an unfiltered scan would only
  // add noise (and used to mask the whole judgment corpus).
  if (!pattern) return [];

  const params: unknown[] = [pattern];
  const clauses: string[] = ["c.text ~* $1"];
  if (scope === "global") {
    // no extra scope clause
  } else if (caseId == null) {
    clauses.push("c.case_id IS NULL");
  } else if (scope === "case-or-doc" && documentId) {
    params.push(caseId, documentId);
    clauses.push(`(c.case_id = $${params.length - 1} OR c.document_id = $${params.length})`);
  } else if (scope === "case-or-null") {
    params.push(caseId);
    clauses.push(`(c.case_id = $${params.length} OR c.case_id IS NULL)`);
  } else {
    params.push(caseId);
    clauses.push(`c.case_id = $${params.length}`);
  }
  params.push(minCandidates);

  // Rank by the number of distinct query terms matched before applying the
  // cap. Ordering by created_at (the old behaviour) selected an arbitrary
  // oldest prefix and silently ignored relevant chunks in long judgments.
  const text = `
    SELECT c.id, c.section_label, c.text, c.document_id,
           (SELECT count(*) FROM unnest(string_to_array($1, '|')) AS t(term)
            WHERE c.text ~* t.term) AS hits
    FROM chunks c
    WHERE ${clauses.join(" AND ")}
    ORDER BY hits DESC, length(c.text) DESC
    LIMIT $${params.length}
  `;
  const query = sql as unknown as {
    query: (text: string, params: unknown[]) => Promise<Row[]>;
  };
  return query.query(text, params);
}

export async function retrieve(opts: RetrieveOptions) {
  const {
    question,
    caseId = null,
    scope = "case",
    kwWeight = 0.4,
    cosineWeight = 0.6,
    limit = 6,
    minCandidates = 300,
    vectorCandidateLimit = 50,
    mode = "hybrid",
    rerank = true,
    instructionPrefix,
    documentId = null,
  } = opts;

  const sql = db();
  const terms = termsOf(question);

  const makeRow = (r: Row, cosine: number) => {
    const id = String(r.id ?? "");
    const section_label = String(r.section_label ?? "");
    const text = String(r.text ?? "");
    const document_id = r.document_id == null ? null : String(r.document_id);
    const kw = keywordScorePublic(text, terms);
    const baseScore = kw * kwWeight + cosine * cosineWeight;
    const blended = rerank ? rerankScore({ blended: baseScore, section_label }) : baseScore;
    return { id, section_label, text, document_id, cosine, keyword: kw, baseScore, blended };
  };

  const finalize = (
    rows: Array<Record<string, unknown>>,
    curatedRows: Array<Record<string, unknown>> = [],
  ) => {
    const seen = new Set<string>();
    const ordered: Array<Record<string, unknown>> = [];
    const sortedRest = [...rows].sort((a, b) => (b.blended as number) - (a.blended as number));
    // Case-scoped answers lead with a curated holding brief only when it is a
    // credible match for the question (>= 60% of the best raw score). Irrelevant
    // briefs therefore cannot occupy the answer context.
    if (caseId && scope !== "global" && sortedRest.length) {
      const bar = (sortedRest[0].blended as number) * 0.6;
      for (const r of curatedRows) {
        if (ordered.length >= Math.min(3, limit)) break;
        if ((r.blended as number) < bar) continue;
        ordered.push(r);
        seen.add(String(r.id));
      }
    }
    const rest = sortedRest.filter((r) => !seen.has(String(r.id)));
    ordered.push(...rest);
    const unique = new Set([...rows, ...curatedRows].map((r) => String(r.id)));
    return { results: ordered.slice(0, limit), allCandidates: unique.size };
  };

  if (mode === "keyword-only") {
    const keywordRows = await keywordCandidates(sql, scope, caseId, minCandidates, documentId, terms);
    const rows = (keywordRows as Row[]).map((r) => makeRow(r, 0));
    const { results, allCandidates } = finalize(rows);
    return { usedVector: false, terms, results, allCandidates };
  }

  let rows: Array<Record<string, unknown>> = [];
  let curatedRows: Array<Record<string, unknown>> = [];
  let usedVector = false;

  try {
    const vec = await embedCached(question, instructionPrefix);
    if (vec) {
      const vecStr = `[${vec.join(",")}]`;
      const candidates = await vectorCandidates(sql, vecStr, scope, caseId, vectorCandidateLimit, documentId);
      if (candidates.length) {
        const byId = new Map<string, Record<string, unknown>>();
        for (const r of (candidates as Row[]).map((c) => makeRow(c, Math.max(0, Math.min(1, Number(c.score ?? 0)))))) {
          byId.set(String(r.id), r);
        }

        // Hybrid is a union: a term that is rare in embedding space can still
        // surface through the SQL keyword prefilter, and vice versa.
        if (mode === "hybrid") {
          const keywordRows = await keywordCandidates(sql, scope, caseId, minCandidates, documentId, terms);
          for (const kr of keywordRows as Row[]) {
            const row = makeRow(kr, 0);
            if (!byId.has(String(row.id))) byId.set(String(row.id), row);
          }
        }

        rows = [...byId.values()];
        if (mode === "hybrid" && caseId && scope !== "global") {
          const curated = await curatedCandidates(sql, vecStr, scope, caseId, documentId, 20);
          curatedRows = (curated as Row[])
            .map((c) => makeRow(c, Math.max(0, Math.min(1, Number(c.score ?? 0)))))
            .sort((a, b) => (b.blended as number) - (a.blended as number));
        }
        usedVector = true;
      }
    }
  } catch (err) {
    console.warn(`[retrieve] embedding failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!usedVector) {
    const keywordRows = await keywordCandidates(sql, scope, caseId, minCandidates, documentId, terms);
    rows = (keywordRows as Row[]).map((r) => makeRow(r, 0));
  }

  const { results, allCandidates } = finalize(rows, curatedRows);
  return { usedVector, terms, results, allCandidates };
}
