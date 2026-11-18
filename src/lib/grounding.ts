/*
 * Grounding check for generated courtroom/witness turns.
 *
 * The prompts instruct the model to stay inside the case record, but a prompt
 * is not a guarantee. This module extracts the concrete artifacts a generated
 * turn asserts (dates, section/article numbers, diary and page references,
 * counts) and checks each one against the text that was actually supplied to
 * the model. Anything that is asserted but not in the supplied text is a
 * violation.
 *
 * Used by /api/sessions/[id]/stream and /api/witness.
 */

export interface GroundingViolation {
  kind: "date" | "section" | "diary-page" | "count";
  text: string;
}

const DATE_PATTERNS: RegExp[] = [
  /\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/gi,
  /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g,
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
];

const SECTION_PATTERN = /\b(?:Section|Art(?:icle)?\.?|Sec\.?)\s*(\d+[A-Za-z]*(?:\(\d+\))?)/gi;

const DIARY_PAGE_PATTERN = /\b(?:diary|entry|register)\s*(?:entry|no\.?|number)?\s*[:.]?\s*([\d/.-]{4,})\b/gi;
const PAGE_PATTERN = /\b(?:p\.|page)\s*(\d+)\b/gi;

// Only a numeric quantity followed by the noun counts as a countable assertion.
const COUNT_PATTERN =
  /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d{1,3})\s+(summons?|notices?|convicts?|accused|officers?|witnesses|exhibits|chargesheets?)\b/gi;

const NUMBER_WORDS: Record<string, string> = {
  one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7",
  eight: "8", nine: "9", ten: "10", eleven: "11", twelve: "12",
};

const MONTHS: Array<[RegExp, string]> = [
  [/\bjan(?:uary)?\b/g, "january"], [/\bfeb(?:ruary)?\b/g, "february"],
  [/\bmar(?:ch)?\b/g, "march"], [/\bapr(?:il)?\b/g, "april"],
  [/\bmay\b/g, "may"], [/\bjun(?:e)?\b/g, "june"], [/\bjul(?:y)?\b/g, "july"],
  [/\baug(?:ust)?\b/g, "august"], [/\bsep(?:tember)?\b/g, "september"],
  [/\boct(?:ober)?\b/g, "october"], [/\bnov(?:ember)?\b/g, "november"],
  [/\bdec(?:ember)?\b/g, "december"],
];

function normalise(s: string): string {
  let out = s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[‐-―]/g, "-")
    .trim();
  for (const [re, full] of MONTHS) out = out.replace(re, full);
  return out;
}

/** Digits written as words ("nine summons") vs digits in the record. */
function countSupported(countText: string, record: string): boolean {
  const word = countText.toLowerCase();
  const digits = NUMBER_WORDS[word];
  const recordHasWord = new RegExp(`\\b${word}\\b`, "i").test(record);
  if (recordHasWord) return true;
  if (!digits) return false;
  const nouns = word.match(/([a-z]+)/g) ?? [];
  const noun = nouns[nouns.length - 1] ?? "";
  return new RegExp(`\\b${digits}\\s+${noun}`, "i").test(record);
}

/**
 * @param generated  text produced by the model
 * @param record     the case text that was supplied to the model (the only permitted source)
 */
export function findGroundingViolations(generated: string, record: string): GroundingViolation[] {
  const rec = normalise(record);
  const gen = generated ?? "";
  const out: GroundingViolation[] = [];
  const seen = new Set<string>();

  const push = (kind: GroundingViolation["kind"], text: string) => {
    const key = `${kind}:${text.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ kind, text });
  };

  for (const re of DATE_PATTERNS) {
    for (const m of gen.matchAll(re)) {
      const t = m[0];
      if (!rec.includes(normalise(t))) push("date", t);
    }
  }

  for (const m of gen.matchAll(SECTION_PATTERN)) {
    const num = m[1];
    if (!rec.includes(num.toLowerCase())) push("section", `Section ${num}`);
  }

  for (const m of gen.matchAll(DIARY_PAGE_PATTERN)) {
    const t = m[0];
    if (!rec.includes(normalise(m[1]))) push("diary-page", t.trim());
  }

  for (const m of gen.matchAll(PAGE_PATTERN)) {
    if (!rec.includes(m[1])) push("diary-page", `page ${m[1]}`);
  }

  for (const m of gen.matchAll(COUNT_PATTERN)) {
    const [full, word] = m;
    if (!countSupported(word, rec)) push("count", full.trim());
  }

  return out;
}

/** One-line description of violations, safe to show in a prompt. */
export function describeViolations(violations: GroundingViolation[]): string {
  if (!violations.length) return "";
  return violations.map((v) => `"${v.text}"`).join(", ");
}
