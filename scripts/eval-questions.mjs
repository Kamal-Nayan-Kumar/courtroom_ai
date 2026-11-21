/**
 * Shared labelled question set and metric helpers for retrieval evaluation.
 * Extracted from the legacy eval-rag.mjs so the unified harness and any
 * wrappers measure the same gold labels and metric semantics.
 */

/** Labelled question set. expected = section labels or partial matches of the correct chunk(s). */
export const LABELLED_SET = {
  "delhi-liquor-2022": [
    { q: "What is criminal conspiracy under BNS section 61(2)?", expected: ["BNS § 61(2)"] },
    { q: "How many ED summons were issued before the arrest?", expected: ["Case fact"] },
    { q: "What does section 63 of the Bharatiya Sakshya Adhiniyam say about electronic records?", expected: ["BSA § 63"] },
    { q: "What is money laundering under PMLA section 3?", expected: ["PMLA § 3"] },
    { q: "When was the Supreme Court interim bail granted?", expected: ["Case fact"] },
    { q: "What did the trial court bail order say and when was it stayed?", expected: ["Case fact"] },
    { q: "When was the CBI arrest from Tihar jail?", expected: ["Case fact"] },
    { q: "What were the bail order dates and the CBI arrest date?", expected: ["Case fact"] },
    { q: "Define criminal conspiracy and the punishment for it.", expected: ["BNS § 61(2)"] },
    { q: "What certificate is needed for secondary electronic evidence?", expected: ["BSA § 63"] },
    { q: "Explain the definition of money laundering and its punishment.", expected: ["PMLA § 3"] },
    { q: "Summarise the chronology of interim bail and surrender.", expected: ["Case fact"] },
  ],
  "electoral-bonds-2024": [
    { q: "What does Article 19(1)(a) guarantee regarding political funding?", expected: ["Constitution Art 19(1)(a)"] },
    { q: "Which judgment struck down the Electoral Bonds Scheme?", expected: ["Case fact"] },
    { q: "Who presided over the Constitution Bench that decided the case?", expected: ["Case fact"] },
    { q: "Which statutes were amended regarding anonymous donations?", expected: ["Case fact"] },
    { q: "What is the voter's right to information about donations?", expected: ["Constitution Art 19(1)(a)"] },
    { q: "Name the case citation 2024 INSC 113 and its outcome.", expected: ["Case fact"] },
    { q: "List the judges on the bench.", expected: ["Case fact"] },
    { q: "Which company law and election law amendments were struck down?", expected: ["Case fact"] },
  ],
  // Cross-case queries against judgment documents (no case_id filter)
  "__cross_case__": [
    { q: "Can a legislator be prosecuted for bribery related to voting?", expected: ["2024 INSC 161"], caseId: null },
    { q: "Does Article 105(2) grant immunity from criminal prosecution for bribery?", expected: ["2024 INSC 161"], caseId: null },
    { q: "What did the Supreme Court hold about remission of convicts in the Bilkis Bano case?", expected: ["2024 INSC 24"], caseId: null },
    { q: "Which state has jurisdiction to grant remission under Section 432 CrPC?", expected: ["2024 INSC 24"], caseId: null },
    { q: "What did the Supreme Court say about caste discrimination in prisons?", expected: ["2024 INSC 753"], caseId: null },
    { q: "Does the assignment of prison labour based on caste violate fundamental rights?", expected: ["2024 INSC 753"], caseId: null },
    { q: "What is the constitutional position on untouchability in Indian prisons?", expected: ["2024 INSC 753"], caseId: null },
    { q: "Can the Electoral Bonds Scheme be challenged under Article 19(1)(a)?", expected: ["2024 INSC 113", "Constitution Art 19(1)(a)"], caseId: null },
    { q: "What are the legislative privileges regarding parliamentary speech?", expected: ["2024 INSC 161"], caseId: null },
    { q: "What are the rights of prisoners under Articles 14 and 21?", expected: ["2024 INSC 753"], caseId: null },
  ],
  // Queries whose gold document is one of the ten landmark judgments added later.
  // Kept in a separate bucket so __cross_case__ stays comparable with the
  // baseline recorded in data/eval-results.json.
  "__new_judgments__": [
    { q: "Can Parliament alter the basic structure of the Constitution under Article 368?", expected: ["AIR 1973 SC 1461"] },
    { q: "What is the basic structure doctrine of the Constitution?", expected: ["AIR 1973 SC 1461"] },
    { q: "Could a citizen challenge his detention during the Emergency by filing habeas corpus?", expected: ["AIR 1976 SC 1207"] },
    { q: "What did the Supreme Court hold about Article 21 during the Emergency?", expected: ["AIR 1976 SC 1207"] },
    { q: "Does Article 21 require the procedure established by law to be fair, just and reasonable?", expected: ["1978 AIR 597"] },
    { q: "On what grounds can the government impound a passport under natural justice?", expected: ["1978 AIR 597"] },
    { q: "Are undertrial prisoners entitled to a speedy trial?", expected: ["1979 AIR 1360"] },
    { q: "Can an accused be released on a personal bond without sureties?", expected: ["1979 AIR 1360"] },
    { q: "What guidelines did the Supreme Court frame to prevent sexual harassment at the workplace?", expected: ["AIR 1997 SC 3011"] },
    { q: "Who must constitute the internal complaint committee against workplace harassment?", expected: ["AIR 1997 SC 3011"] },
    { q: "What safeguards must the police follow when arresting a person?", expected: ["AIR 1997 SC 610"] },
    { q: "Must a friend or relative of an arrested person be informed about the arrest?", expected: ["AIR 1997 SC 610"] },
    { q: "Is Section 66A of the Information Technology Act unconstitutional?", expected: ["2015 INSC 257"] },
    { q: "Can the government block internet content without a reasoned order under Section 69A?", expected: ["2015 INSC 257"] },
    { q: "Is the right to privacy a fundamental right protected by Article 21?", expected: ["2017 INSC 801"] },
    { q: "Which earlier judgments did the nine-judge bench overrule on the question of privacy?", expected: ["2017 INSC 801"] },
    { q: "What sentence did the Supreme Court confirm in the Nirbhaya gang rape appeal?", expected: ["2017 INSC 448"] },
    { q: "Which sections of the Indian Penal Code were applied in the Nirbhaya case?", expected: ["2017 INSC 448"] },
    { q: "Did the Supreme Court strike down Section 377 of the Indian Penal Code?", expected: ["2018 INSC 790"] },
    { q: "Is consensual sex between adults protected under Articles 14, 15 and 21?", expected: ["2018 INSC 790"] },
  ],
};

export function evaluate(rankings, items, k) {
  let precisionSum = 0;
  let recallSum = 0;
  let mrrSum = 0;
  let citationHits = 0;
  for (const item of items) {
    const ranked = rankings.get(item.q) ?? [];
    const topK = ranked.slice(0, k);
    // Partial match: if expected contains a substring of the label, count it
    const relTopK = new Set(topK.filter((label) =>
      item.expected.some((e) => label.includes(e) || e.includes(label))
    )).size;
    precisionSum += relTopK / k;
    recallSum += Math.min(1, relTopK / item.expected.length);
    let firstRelevant = 0;
    for (let i = 0; i < ranked.length; i += 1) {
      if (item.expected.some((e) => ranked[i].includes(e) || e.includes(ranked[i]))) {
        firstRelevant = 1 / (i + 1);
        break;
      }
    }
    mrrSum += firstRelevant;
    // Citation accuracy: does the top-1 result contain the expected citation?
    if (topK.length > 0 && item.expected.some((e) => topK[0].includes(e) || e.includes(topK[0]))) {
      citationHits += 1;
    }
  }
  const n = items.length || 1;
  return {
    precision_at_k: precisionSum / n,
    recall_at_k: recallSum / n,
    mrr: mrrSum / n,
    citation_accuracy: citationHits / n,
  };
}

export function fmt(x) {
  return Number(x).toFixed(3);
}

/**
 * Holdings-level gold: for each case, the curated dossier brief that actually
 * answers the question. Unlike LABELLED_SET (which uses citation labels), this
 * set rewards substantive holdings over citation-header fragments. It is
 * evaluated with a top-3 hit rate in eval-retrieval.mts.
 */
export const HOLDINGS_SET = [
  {
    caseId: "kesavananda-1973",
    q: "Can Parliament alter the basic structure of the Constitution under Article 368?",
    expectedLabel: "Majority holding: the basic structure limitation",
  },
  {
    caseId: "adm-jabalpur-1976",
    q: "Could a citizen challenge his detention during the Emergency by filing habeas corpus?",
    expectedLabel: "Majority reasoning: locus standi and sole repository",
  },
  {
    caseId: "maneka-gandhi-1978",
    q: "Does Article 21 require the procedure established by law to be fair, just and reasonable?",
    expectedLabel: "Expanded Article 21: right, just and fair",
  },
  {
    caseId: "hussainara-1979",
    q: "Are undertrial prisoners entitled to a speedy trial?",
    expectedLabel: "Holding - speedy trial",
  },
  {
    caseId: "vishaka-1997",
    q: "What guidelines did the Supreme Court frame to prevent sexual harassment at the workplace?",
    expectedLabel: "Guidelines: definition, duties, prevention",
  },
  {
    caseId: "dk-basu-1996",
    q: "What safeguards must the police follow when arresting a person?",
    expectedLabel: "Eleven safeguards (substance)",
  },
  {
    caseId: "shreya-singhal-2015",
    q: "Is Section 66A of the Information Technology Act unconstitutional?",
    expectedLabel: "Holding: Section 66A Struck Down",
  },
  {
    caseId: "puttaswamy-2017",
    q: "Is the right to privacy a fundamental right protected by Article 21?",
    expectedLabel: "Unanimous holding and opinions",
  },
  {
    caseId: "mukesh-nirbhaya-2017",
    q: "What sentence did the Supreme Court confirm in the Nirbhaya gang rape appeal?",
    expectedLabel: "rarest of rare",
  },
  {
    caseId: "navtej-johar-2018",
    q: "Did the Supreme Court strike down Section 377 of the Indian Penal Code?",
    expectedLabel: "The operative holding and its limits",
  },
];
