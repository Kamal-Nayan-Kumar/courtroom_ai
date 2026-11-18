/*
 * Qwen3-Embedding-8B via OpenRouter. Server-only.
 * Replaces the previous local Nomic/HuggingFace embedding pipeline entirely.
 *
 * All embeddings are generated through the OpenRouter API.
 * No local CPU embedding generation. No local model downloads.
 */

const OPENROUTER_EMBED_URL = "https://openrouter.ai/api/v1/embeddings";
const EMBED_MODEL = "qwen/qwen3-embedding-8b";

/** Qwen3-Embedding-8B produces 4096-dimensional vectors. */
export const EMBED_DIM = 4096;

/** Maximum texts per batch request. */
const MAX_BATCH = 20;

/** Maximum retry attempts for transient failures. */
const MAX_RETRIES = 3;

/** Base delay in ms for exponential backoff. */
const RETRY_BASE_MS = 1000;

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error(
      "OPENROUTER_API_KEY not set. Required for Qwen3 embeddings via OpenRouter.",
    );
  }
  return key;
}

async function callEmbedApi(
  texts: string[],
  apiKey: string,
): Promise<number[][]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(OPENROUTER_EMBED_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: EMBED_MODEL,
          input: texts,
          encoding_format: "float",
        }),
      });

      // Rate limit handling: wait and retry
      if (res.status === 429) {
        const retryAfter = res.headers.get("retry-after");
        const waitMs = retryAfter
          ? Number(retryAfter) * 1000
          : RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(
          `[embed] rate limited (429), retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      // Server errors: retry with backoff
      if (res.status >= 500) {
        const waitMs = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(
          `[embed] server error ${res.status}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})`,
        );
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(
          `Qwen3 embedding failed ${res.status}: ${body.slice(0, 300)}`,
        );
      }

      const json = (await res.json()) as {
        data?: Array<{ embedding?: number[]; index?: number }>;
        model?: string;
      };

      if (!json.data || !Array.isArray(json.data)) {
        throw new Error("Qwen3 embedding: unexpected response shape (no data array)");
      }

      // Sort by index to ensure correct ordering
      const sorted = [...json.data].sort(
        (a, b) => (a.index ?? 0) - (b.index ?? 0),
      );

      const vectors: number[][] = [];
      for (let i = 0; i < sorted.length; i++) {
        const vec = sorted[i].embedding;
        if (!vec || !Array.isArray(vec)) {
          throw new Error(
            `Qwen3 embedding: missing embedding at index ${i}`,
          );
        }
        if (vec.length !== EMBED_DIM) {
          throw new Error(
            `Qwen3 embedding: dimension mismatch at index ${i}: got ${vec.length}, expected ${EMBED_DIM}`,
          );
        }
        vectors.push(vec);
      }

      if (vectors.length !== texts.length) {
        throw new Error(
          `Qwen3 embedding: count mismatch: got ${vectors.length}, expected ${texts.length}`,
        );
      }

      return vectors;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES - 1) {
        const waitMs = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(
          `[embed] attempt ${attempt + 1} failed: ${lastError.message}, retrying in ${waitMs}ms`,
        );
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }

  throw lastError ?? new Error("Qwen3 embedding failed after retries");
}

/**
 * Generate embeddings for an array of texts using Qwen3-Embedding-8B
 * via OpenRouter. Returns one 4096-dimensional vector per input text.
 *
 * Handles batching, retries, rate limits, and dimension validation.
 * Never falls back to a local model or a different embedding model.
 */
export async function embed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const apiKey = getApiKey();
  const allVectors: number[][] = [];

  // Process in batches of MAX_BATCH
  for (let i = 0; i < texts.length; i += MAX_BATCH) {
    const batch = texts.slice(i, i + MAX_BATCH).map(
      // Trim to reasonable length for embedding
      (t) => (t ?? "").slice(0, 8000),
    );
    const vectors = await callEmbedApi(batch, apiKey);
    allVectors.push(...vectors);
  }

  return allVectors;
}
