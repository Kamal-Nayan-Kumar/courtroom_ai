/**
 * Canonical case ids are the ones stored in the `cases` table. The practice
 * library and older links use friendly aliases (pub-1, 402, 184). Resolve them
 * in one place so the mapping cannot drift between the UI and the API routes.
 *
 * The fictional benchmark cards have no case of their own, so each points at
 * the real case whose subject matter is closest.
 */
const ALIASES: Record<string, string> = {
  "402": "case-402",
  "184": "electoral-bonds-2024",
  "case-184": "electoral-bonds-2024",
  // Midnight highway hit-and-run — vehicular death, CCTV/electronic evidence.
  "pub-1": "case-402",
  // Deepfake / voice-clone fraud — IT Act and digital evidence.
  "pub-2": "shreya-singhal-2015",
  // Constitutional bail & pre-trial incarceration — undertrial rights.
  "pub-3": "hussainara-1979",
  // Arjun Sharma — this card *is* the Marine Drive collision case.
  "pub-4": "case-402",
  // Environmental public trust moot — Article 21 constitutional advocacy.
  "pub-5": "puttaswamy-2017",
  // Disproportionate assets / corruption — PC Act and money trail.
  "pub-6": "delhi-liquor-2022",
};

export function resolveCaseId(id: string): string {
  return ALIASES[id] ?? id;
}
