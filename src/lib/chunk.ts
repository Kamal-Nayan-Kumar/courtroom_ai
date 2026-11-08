// Shared chunking: word-safe, ~800 chars with 100-char overlap.
// Used by scripts/ingest-hf.mjs (inline copy of this logic) and POST /api/documents.

export const CHUNK_SIZE = 800;
export const OVERLAP = 100;

export interface TextChunk {
  text: string;
  tokenCount: number;
  index: number;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function chunkText(
  input: string,
  options?: { chunkSize?: number; overlap?: number }
): TextChunk[] {
  const chunkSize = options?.chunkSize ?? CHUNK_SIZE;
  const overlap = options?.overlap ?? OVERLAP;
  const text = (input ?? "").replace(/\s+/g, " ").trim();
  if (!text) return [];
  if (text.length <= chunkSize) {
    return [{ text, tokenCount: countWords(text), index: 0 }];
  }

  const words = text.split(" ");
  const chunks: TextChunk[] = [];
  let start = 0;
  let index = 0;

  while (start < words.length) {
    let end = start;
    let length = 0;
    while (end < words.length) {
      const wordLen = words[end].length + (end > start ? 1 : 0);
      if (length + wordLen > chunkSize && end > start) break;
      length += wordLen;
      end += 1;
    }
    const slice = words.slice(start, end).join(" ");
    if (slice.trim()) {
      chunks.push({ text: slice, tokenCount: countWords(slice), index });
      index += 1;
    }
    if (end >= words.length) break;

    // Carry back ~overlap chars of words into the next chunk.
    let carryLength = 0;
    let carryStart = end;
    while (carryStart > start) {
      const wordLen = words[carryStart - 1].length + (carryStart < end ? 1 : 0);
      if (carryLength + wordLen > overlap) break;
      carryLength += wordLen;
      carryStart -= 1;
    }
    start = carryStart > start ? carryStart : end;
  }

  return chunks;
}
