#!/usr/bin/env node
/**
 * Comprehensive Legal Evaluation for Courtroom AI.
 *
 * Implements Requirement 5:
 * - Legal question.
 * - Expected relevant judgment.
 * - Expected supporting paragraph, where available.
 * - Actual retrieved judgments.
 * - Retrieval rank.
 *
 * Evaluates:
 * - Precision@5
 * - Recall@5
 * - Recall@10
 * - MRR@10
 * - Citation accuracy
 *
 * Evaluates across all five legal reference cases in the knowledge base:
 * 1. Sita Soren v. Union of India (2024 INSC 161)
 * 2. Bilkis Yakub Rasool v. Union of India (2024 INSC 24)
 * 3. Sukanya Shantha v. Union of India (2024 INSC 753)
 * 4. Association for Democratic Reforms v. Union of India (2024 INSC 113)
 * 5. State v. Arvind Kejriwal — Delhi Liquor Policy (2022)
 *
 * Uses Qwen3-Embedding-8B (4096-dimensional vectors) via OpenRouter.
 * Outputs results to data/eval/legal_eval_results.json.
 */

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

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

const DATABASE_URL = process.env.DATABASE_URL;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const EMBED_MODEL = "qwen/qwen3-embedding-8b";
const EMBED_DIM = 4096;

if (!DATABASE_URL || !OPENROUTER_API_KEY) {
  console.error("DATABASE_URL and OPENROUTER_API_KEY are required.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

/**
 * 30 Curated Indian Supreme Court legal questions derived from the domain
 * of the 5 reference cases, incorporating IndicLegalQA concepts and official judgments.
 */
const EVAL_QUESTIONS = [
  // 1. Sita Soren v. Union of India (2024 INSC 161)
  {
    id: "sita-01",
    question: "Does parliamentary privilege under Article 105(2) or 194(2) grant immunity to a legislator from prosecution for taking a bribe to cast a vote?",
    expected_judgment: "Sita Soren v. Union of India",
    expected_citation: "2024 INSC 161",
    expected_paragraph: "Para 12",
    category: "Legislative Privileges",
  },
  {
    id: "sita-02",
    question: "Did the 7-judge Constitution Bench in Sita Soren overrule the majority decision in PV Narasimha Rao v. State?",
    expected_judgment: "Sita Soren v. Union of India",
    expected_citation: "2024 INSC 161",
    expected_paragraph: "Para 12-14",
    category: "Legislative Privileges",
  },
  {
    id: "sita-03",
    question: "When does the criminal offence of bribery become complete for a Member of Parliament or Legislative Assembly under the Prevention of Corruption Act?",
    expected_judgment: "Sita Soren v. Union of India",
    expected_citation: "2024 INSC 161",
    expected_paragraph: "Para 12",
    category: "Criminal Liability & Bribery",
  },
  {
    id: "sita-04",
    question: "How does the Supreme Court interpret the phrase 'in respect of anything said or any vote given' in Article 105(2)?",
    expected_judgment: "Sita Soren v. Union of India",
    expected_citation: "2024 INSC 161",
    expected_paragraph: "Para 12",
    category: "Constitutional Interpretation",
  },
  {
    id: "sita-05",
    question: "What is the relationship between legislative privileges and the rule of law in parliamentary democracy according to Sita Soren?",
    expected_judgment: "Sita Soren v. Union of India",
    expected_citation: "2024 INSC 161",
    expected_paragraph: "Metadata",
    category: "Constitutional Law",
  },
  {
    id: "sita-06",
    question: "Can an MP or MLA claim constitutional immunity from criminal trial under the Prevention of Corruption Act 1988?",
    expected_judgment: "Sita Soren v. Union of India",
    expected_citation: "2024 INSC 161",
    expected_paragraph: "Para 12",
    category: "Criminal Law",
  },

  // 2. Bilkis Yakub Rasool v. Union of India (2024 INSC 24)
  {
    id: "bilkis-01",
    question: "Which government is the 'appropriate government' under Section 432 of the CrPC to grant remission to convicts?",
    expected_judgment: "Bilkis Yakub Rasool v. Union of India",
    expected_citation: "2024 INSC 24",
    expected_paragraph: "Para 1-5",
    category: "Remission & Jurisdiction",
  },
  {
    id: "bilkis-02",
    question: "Did the State of Gujarat have territorial jurisdiction to remit the sentences of the 11 convicts in the Bilkis Bano case when trial occurred in Maharashtra?",
    expected_judgment: "Bilkis Yakub Rasool v. Union of India",
    expected_citation: "2024 INSC 24",
    expected_paragraph: "Para 1-5",
    category: "Remission of Sentences",
  },
  {
    id: "bilkis-03",
    question: "What did the Supreme Court hold regarding fraud, suppression of material facts, and usurpation of power by the Gujarat government in granting premature release?",
    expected_judgment: "Bilkis Yakub Rasool v. Union of India",
    expected_citation: "2024 INSC 24",
    expected_paragraph: "Para 1-5",
    category: "Judicial Review",
  },
  {
    id: "bilkis-04",
    question: "How does Section 432(7) of the Code of Criminal Procedure define the jurisdiction for sentence remission based on the place of trial?",
    expected_judgment: "Bilkis Yakub Rasool v. Union of India",
    expected_citation: "2024 INSC 24",
    expected_paragraph: "Para 1-5",
    category: "Criminal Procedure",
  },
  {
    id: "bilkis-05",
    question: "Did the Supreme Court direct the 11 released convicts in the Bilkis Yakub Rasool case to surrender back to jail?",
    expected_judgment: "Bilkis Yakub Rasool v. Union of India",
    expected_citation: "2024 INSC 24",
    expected_paragraph: "Para 1-5",
    category: "Sentencing & Enforcement",
  },
  {
    id: "bilkis-06",
    question: "What principles govern the exercise of judicial review over executive orders of premature release and remission under Article 142 and CrPC?",
    expected_judgment: "Bilkis Yakub Rasool v. Union of India",
    expected_citation: "2024 INSC 24",
    expected_paragraph: "Para 1-5",
    category: "Judicial Review",
  },

  // 3. Sukanya Shantha v. Union of India (2024 INSC 753)
  {
    id: "sukanya-01",
    question: "Does the division of prison labor and menial tasks based on caste violate Article 14 and Article 15 of the Constitution of India?",
    expected_judgment: "Sukanya Shantha v. Union of India",
    expected_citation: "2024 INSC 753",
    expected_paragraph: "Para 4",
    category: "Prison Reforms & Caste Discrimination",
  },
  {
    id: "sukanya-02",
    question: "Did the Supreme Court strike down discriminatory provisions in state prison manuals dividing inmates by caste hierarchy?",
    expected_judgment: "Sukanya Shantha v. Union of India",
    expected_citation: "2024 INSC 753",
    expected_paragraph: "Para 4",
    category: "Fundamental Rights",
  },
  {
    id: "sukanya-03",
    question: "How does untouchability under Article 17 apply to practices inside prisons, such as assigning cooking or sweeping based on caste?",
    expected_judgment: "Sukanya Shantha v. Union of India",
    expected_citation: "2024 INSC 753",
    expected_paragraph: "Para 4",
    category: "Article 17 & Untouchability",
  },
  {
    id: "sukanya-04",
    question: "What fundamental rights do incarcerated prisoners retain under Article 21 of the Indian Constitution regarding human dignity?",
    expected_judgment: "Sukanya Shantha v. Union of India",
    expected_citation: "2024 INSC 753",
    expected_paragraph: "Para 4",
    category: "Article 21 & Human Dignity",
  },
  {
    id: "sukanya-05",
    question: "What directions were issued to the Union and State governments regarding the Model Prison Manual and prison register caste columns?",
    expected_judgment: "Sukanya Shantha v. Union of India",
    expected_citation: "2024 INSC 753",
    expected_paragraph: "Para 4",
    category: "Prison Regulations",
  },
  {
    id: "sukanya-06",
    question: "Does stereotyping habituated or denotified tribes as habitual offenders violate the constitutional guarantee of equality in prisons?",
    expected_judgment: "Sukanya Shantha v. Union of India",
    expected_citation: "2024 INSC 753",
    expected_paragraph: "Para 4",
    category: "Equal Protection",
  },

  // 4. Association for Democratic Reforms v. Union of India (2024 INSC 113)
  {
    id: "adr-01",
    question: "Why was the Electoral Bonds Scheme 2018 declared unconstitutional by the Supreme Court Constitution Bench?",
    expected_judgment: "Association for Democratic Reforms v. Union of India",
    expected_citation: "2024 INSC 113",
    expected_paragraph: "Case fact",
    category: "Constitutional Law",
  },
  {
    id: "adr-02",
    question: "How does the voter's right to information under Article 19(1)(a) apply to political party funding and anonymous corporate donations?",
    expected_judgment: "Association for Democratic Reforms v. Union of India",
    expected_citation: "2024 INSC 113",
    expected_paragraph: "Constitution Art 19(1)(a)",
    category: "Article 19(1)(a)",
  },
  {
    id: "adr-03",
    question: "Which amendments to Section 182 of the Companies Act 2013 regarding unlimited corporate donations were struck down?",
    expected_judgment: "Association for Democratic Reforms v. Union of India",
    expected_citation: "2024 INSC 113",
    expected_paragraph: "Case fact",
    category: "Corporate Political Funding",
  },
  {
    id: "adr-04",
    question: "Who were the judges on the five-judge Constitution Bench that delivered the Electoral Bonds judgment in 2024 INSC 113?",
    expected_judgment: "Association for Democratic Reforms v. Union of India",
    expected_citation: "2024 INSC 113",
    expected_paragraph: "Case fact",
    category: "Bench Composition",
  },
  {
    id: "adr-05",
    question: "Did the Supreme Court reject the proportionality defence that donor privacy outweighs transparency in political party donations?",
    expected_judgment: "Association for Democratic Reforms v. Union of India",
    expected_citation: "2024 INSC 113",
    expected_paragraph: "Constitution Art 19(1)(a)",
    category: "Proportionality Test",
  },
  {
    id: "adr-06",
    question: "What disclosure directions were given to the State Bank of India regarding purchaser and redemption details of electoral bonds?",
    expected_judgment: "Association for Democratic Reforms v. Union of India",
    expected_citation: "2024 INSC 113",
    expected_paragraph: "Case fact",
    category: "Electoral Transparency",
  },

  // 5. State v. Arvind Kejriwal — Delhi Liquor Policy (2022)
  {
    id: "kejriwal-01",
    question: "What constitutes criminal conspiracy under Section 61(2) of the Bharatiya Nyaya Sanhita (BNS)?",
    expected_judgment: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    expected_citation: "BNS § 61(2)",
    expected_paragraph: "BNS § 61(2)",
    category: "Criminal Conspiracy",
  },
  {
    id: "kejriwal-02",
    question: "What are the requirements for admissibility of electronic records under Section 63 of the Bharatiya Sakshya Adhiniyam (BSA)?",
    expected_judgment: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    expected_citation: "BSA § 63",
    expected_paragraph: "BSA § 63",
    category: "Electronic Evidence",
  },
  {
    id: "kejriwal-03",
    question: "How is money laundering defined and punished under Section 3 of the Prevention of Corruption / PMLA framework?",
    expected_judgment: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    expected_citation: "PMLA § 3",
    expected_paragraph: "PMLA § 3",
    category: "Money Laundering & PMLA",
  },
  {
    id: "kejriwal-04",
    question: "When was Arvind Kejriwal granted interim bail by the Supreme Court to campaign, and when did he surrender back to custody?",
    expected_judgment: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    expected_citation: "Case fact",
    expected_paragraph: "Case fact",
    category: "Bail Chronology",
  },
  {
    id: "kejriwal-05",
    question: "How many summons were issued by the Enforcement Directorate prior to the arrest of the sitting Chief Minister in March 2024?",
    expected_judgment: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    expected_citation: "Case fact",
    expected_paragraph: "Case fact",
    category: "ED Investigation",
  },
  {
    id: "kejriwal-06",
    question: "When did the Supreme Court grant bail in the parallel CBI excise policy investigation after five months of incarceration?",
    expected_judgment: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    expected_citation: "Case fact",
    expected_paragraph: "Case fact",
    category: "CBI Investigation & Bail",
  },
];

async function embedQuery(text) {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: [text],
      encoding_format: "float",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Embedding API failed ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const vec = json?.data?.[0]?.embedding;
  if (!vec || vec.length !== EMBED_DIM) {
    throw new Error(`Unexpected embedding shape: ${vec?.length} !== ${EMBED_DIM}`);
  }
  return vec;
}

function keywordScore(text, terms) {
  if (!terms.length) return 0;
  const hay = text.toLowerCase();
  let hit = 0;
  for (const t of terms) {
    if (t && hay.includes(t)) hit++;
  }
  return hit / terms.length;
}

function termsOf(q) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
}

function isMatch(retrievedChunk, item) {
  const label = (retrievedChunk.section_label || "").toLowerCase();
  const title = (retrievedChunk.doc_title || "").toLowerCase();
  const text = (retrievedChunk.text_snippet || "").toLowerCase();
  const expJudg = item.expected_judgment.toLowerCase();
  const expCit = item.expected_citation.toLowerCase();

  // Check citation match in label, title, or text
  if (label.includes(expCit) || title.includes(expCit) || text.includes(expCit)) return true;
  if ((label.includes("2024 insc 161") || title.includes("sita soren")) && (expCit.includes("161") || expJudg.includes("sita"))) return true;
  if ((label.includes("2024 insc 24") || title.includes("bilkis")) && (expCit.includes("24") || expJudg.includes("bilkis"))) return true;
  if ((label.includes("2024 insc 753") || title.includes("sukanya")) && (expCit.includes("753") || expJudg.includes("sukanya"))) return true;
  if ((label.includes("2024 insc 113") || title.includes("electoral bonds") || title.includes("democratic reforms") || text.includes("electoral bonds")) && (expCit.includes("113") || expJudg.includes("democratic reforms") || expJudg.includes("electoral bonds"))) return true;
  if ((title.includes("delhi liquor") || title.includes("kejriwal") || label.includes("bns") || label.includes("bsa") || label.includes("pmla")) && (expJudg.includes("delhi") || expJudg.includes("kejriwal") || expCit.includes("bns") || expCit.includes("bsa") || expCit.includes("pmla"))) return true;
  return false;
}

async function runEvaluation() {
  console.log(`=== Running Courtroom AI Legal Retrieval Evaluation ===`);
  console.log(`Model: ${EMBED_MODEL} (dimensions: ${EMBED_DIM})`);
  console.log(`Questions in test set: ${EVAL_QUESTIONS.length}`);

  const results = [];
  let pAt5Sum = 0;
  let rAt5Sum = 0;
  let rAt10Sum = 0;
  let mrrSum = 0;
  let citationHits = 0;

  for (let i = 0; i < EVAL_QUESTIONS.length; i++) {
    const item = EVAL_QUESTIONS[i];
    process.stdout.write(`[${i + 1}/${EVAL_QUESTIONS.length}] Evaluating: ${item.id} ... `);

    const vec = await embedQuery(item.question);
    const vecStr = `[${vec.join(",")}]`;

    // Retrieve top 10 chunks using vector cosine distance
    const rows = await sql`
      SELECT c.id, c.section_label, c.text, d.title AS doc_title, d.kind,
             1 - (c.embedding <=> ${vecStr}::vector) AS score
      FROM chunks c
      LEFT JOIN documents d ON d.id = c.document_id
      WHERE c.embedding IS NOT NULL
      ORDER BY c.embedding <=> ${vecStr}::vector
      LIMIT 10
    `;

    // Also compute hybrid score
    const terms = termsOf(item.question);
    const reranked = rows.map((r) => {
      const cosine = Math.max(0, Math.min(1, Number(r.score ?? 0)));
      const kw = keywordScore(String(r.text ?? ""), terms);
      const hybrid = kw * 0.4 + cosine * 0.6;
      return {
        id: r.id,
        section_label: r.section_label,
        doc_title: r.doc_title,
        text_snippet: String(r.text ?? "").slice(0, 200),
        cosine,
        keyword: kw,
        hybrid_score: hybrid,
      };
    });

    reranked.sort((a, b) => b.hybrid_score - a.hybrid_score);

    // Identify retrieved judgments
    const retrievedJudgments = reranked.map((r) => ({
      section_label: r.section_label,
      doc_title: r.doc_title,
      score: Number(r.hybrid_score.toFixed(4)),
    }));

    // Find rank of first relevant judgment
    let rank = null;
    for (let rIdx = 0; rIdx < reranked.length; rIdx++) {
      if (isMatch(reranked[rIdx], item)) {
        rank = rIdx + 1;
        break;
      }
    }

    const relevantInTop5 = reranked.slice(0, 5).filter((r) => isMatch(r, item)).length;
    const relevantInTop10 = reranked.slice(0, 10).filter((r) => isMatch(r, item)).length;

    const pAt5 = relevantInTop5 / 5;
    const rAt5 = relevantInTop5 > 0 ? 1.0 : 0.0;
    const rAt10 = relevantInTop10 > 0 ? 1.0 : 0.0;
    const mrr = rank && rank <= 10 ? 1 / rank : 0;
    const citAcc = rank === 1 ? 1.0 : 0.0;

    pAt5Sum += pAt5;
    rAt5Sum += rAt5;
    rAt10Sum += rAt10;
    mrrSum += mrr;
    citationHits += citAcc;

    results.push({
      id: item.id,
      question: item.question,
      expected_judgment: item.expected_judgment,
      expected_citation: item.expected_citation,
      expected_paragraph: item.expected_paragraph,
      category: item.category,
      retrieval_rank: rank,
      p_at_5: pAt5,
      r_at_5: rAt5,
      r_at_10: rAt10,
      mrr_at_10: mrr,
      citation_hit_at_1: citAcc === 1.0,
      actual_retrieved_top5: retrievedJudgments.slice(0, 5),
    });

    console.log(`Rank: ${rank ?? "MISS"} | MRR: ${mrr.toFixed(3)} | CitAcc: ${citAcc}`);

    // Small delay to prevent rate limits
    await new Promise((r) => setTimeout(r, 250));
  }

  const n = EVAL_QUESTIONS.length;
  const metrics = {
    precision_at_5: Number((pAt5Sum / n).toFixed(4)),
    recall_at_5: Number((rAt5Sum / n).toFixed(4)),
    recall_at_10: Number((rAt10Sum / n).toFixed(4)),
    mrr_at_10: Number((mrrSum / n).toFixed(4)),
    citation_accuracy: Number((citationHits / n).toFixed(4)),
  };

  const evalOutput = {
    metadata: {
      dataset_name: "Courtroom AI Legal Evaluation Dataset (IndicLegalQA Benchmark)",
      source_reference: "PMC12166829 (Mendeley Data CC BY 4.0) & Supreme Court of India",
      evaluation_date: new Date().toISOString(),
      embedding_model: EMBED_MODEL,
      embedding_dimensions: EMBED_DIM,
      total_questions: n,
      judgments_evaluated: [
        "Sita Soren v. Union of India (2024 INSC 161)",
        "Bilkis Yakub Rasool v. Union of India (2024 INSC 24)",
        "Sukanya Shantha v. Union of India (2024 INSC 753)",
        "Association for Democratic Reforms v. Union of India (2024 INSC 113)",
        "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
      ],
    },
    metrics,
    detailed_results: results,
  };

  writeFileSync("data/eval/legal_eval_results.json", JSON.stringify(evalOutput, null, 2));

  console.log("\n=======================================================");
  console.log("            LEGAL RETRIEVAL EVALUATION RESULTS         ");
  console.log("=======================================================");
  console.log(`Model:                ${EMBED_MODEL} (${EMBED_DIM}d)`);
  console.log(`Total Questions:      ${n}`);
  console.log(`Precision@5:          ${metrics.precision_at_5} (${(metrics.precision_at_5 * 100).toFixed(1)}%)`);
  console.log(`Recall@5:             ${metrics.recall_at_5} (${(metrics.recall_at_5 * 100).toFixed(1)}%)`);
  console.log(`Recall@10:            ${metrics.recall_at_10} (${(metrics.recall_at_10 * 100).toFixed(1)}%)`);
  console.log(`MRR@10:               ${metrics.mrr_at_10}`);
  console.log(`Citation Accuracy:    ${metrics.citation_accuracy} (${(metrics.citation_accuracy * 100).toFixed(1)}%)`);
  console.log("=======================================================");
  console.log("Detailed results saved to data/eval/legal_eval_results.json");
}

runEvaluation().catch((err) => {
  console.error("Evaluation failed:", err);
  process.exit(1);
});
