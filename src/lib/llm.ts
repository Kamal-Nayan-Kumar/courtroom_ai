/*
 * Free-tier LLM layer. Groq primary (gpt-oss-120b / gpt-oss-20b), OpenRouter free fallback.
 * Server-only. Never called from the browser directly.
 */
const GROQ_BASE = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";

export const GROQ_PRIMARY = "openai/gpt-oss-120b";
export const GROQ_FAST = "openai/gpt-oss-20b";
export const OPENROUTER_FALLBACK = "meta-llama/llama-3.3-70b-instruct:free";
export const EMBED_DIM = 768;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function call(base: string, key: string, model: string, messages: ChatMessage[], maxTokens: number, temperature: number): Promise<string> {
  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${model} failed ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error(`${model} returned empty`);
  return text;
}

export async function chat(options: {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  fast?: boolean;
}): Promise<string> {
  const { messages, maxTokens = 1200, temperature = 0.6, fast = false } = options;
  const groqKey = process.env.GROQ_API_KEY;
  const primary = fast ? GROQ_FAST : GROQ_PRIMARY;

  if (groqKey) {
    try {
      return await call(GROQ_BASE, groqKey, primary, messages, maxTokens, temperature);
    } catch {
      // fall through to OpenRouter
    }
  }
  const orKey = process.env.OPENROUTER_API_KEY;
  if (orKey) {
    return await call(OPENROUTER_BASE, orKey, OPENROUTER_FALLBACK, messages, maxTokens, temperature);
  }
  throw new Error("No LLM key configured. Set GROQ_API_KEY or OPENROUTER_API_KEY.");
}

let embedPipe: any = null;

async function getEmbedPipe() {
  if (!embedPipe) {
    // Loaded via Function so Turbopack skips resolving the native ONNX package.
    const load = Function("return import('@huggingface/transformers')") as () => Promise<any>;
    const { pipeline } = await load();
    embedPipe = await pipeline("feature-extraction", "Xenova/nomic-embed-text-v1");
  }
  return embedPipe;
}

export async function embed(texts: string[]): Promise<number[][]> {
  const pipe = await getEmbedPipe();
  const out: number[][] = [];
  for (const t of texts) {
    const res = await pipe(t, { pooling: "mean", normalize: true });
    const vec = Array.from(res.data as Float32Array);
    if (vec.length !== EMBED_DIM) {
      console.warn(`[embed] dimension mismatch: got ${vec.length}, expected ${EMBED_DIM}`);
    }
    out.push(vec);
  }
  return out;
}
