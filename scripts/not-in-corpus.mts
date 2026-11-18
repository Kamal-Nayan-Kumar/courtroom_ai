/*
 * REDO not-in-corpus test — 8 questions: 3 original unanswerable +
 * 5 topically close to the corpus but not answered by it.
 * Prints question, retrieval result (usedVector), answer, abstention flag.
 */
const BASE = process.env.BASE_URL || "http://localhost:3000";

const QUESTIONS = [
  // original 3 unanswerable
  { id: "no-01", question: "What is the date of birth of the lead petitioner in Sita Soren v. Union of India?", caseId: null },
  { id: "no-02", question: "Which law firm argued on behalf of the State of Gujarat in the Bilkis Bano remission matter before the Supreme Court?", caseId: null },
  { id: "no-03", question: "What was the final retail price of the 5029.01 crore scandal cases in the Delhi excise policy case?", caseId: "delhi-liquor-2022" },
  // 5 more, close to corpus but not answerable from it
  { id: "near-01", question: "What was the vote margin in the 2024 Lok Sabha election when V.V. Giri was elected President?", caseId: null },
  { id: "near-02", question: "How much did the convicted Nirav Modi defraud Punjab National Bank of in the 2018 border-hopping wire fraud?", caseId: null },
  { id: "near-03", question: "Which Supreme Court bench decided Navtej Singh Johar v. Union of India and in what year?", caseId: null },
  { id: "near-04", question: "What was the original circumnavigation cost funded by the Electoral Bonds government in 2024?", caseId: null },
  { id: "near-05", question: "How many police officers were charged in the 2002 Bilkis Bano riots and what were their individual sentences?", caseId: null },
];

(async () => {
  for (const q of QUESTIONS) {
    const body = { question: q.question };
    if (q.caseId) body.caseId = q.caseId;
    const res = await fetch(BASE + "/api/rag/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    const sources = (json.sources || []).map((s: any) => s.section_label);
    const answer = String(json.answer || "");
    const abstains = /cannot|unavailable|not (in the|provided|covered)|insufficient|no (information|excerpt)|source/i.test(answer);
    console.log(`\n=== ${q.id} usedVector=${json.usedVector} sources=[${sources.join(" | ")}]`);
    console.log(`question: ${q.question}`);
    console.log(`answer[:600]: ${answer.slice(0, 600)}`);
    console.log(`hedged/abstains: ${abstains}`);
  }
})();
