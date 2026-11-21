#!/usr/bin/env node
/**
 * Extract judgment text from Indian Kanoon HTML pages (the verbatim official
 * Supreme Court of India judgment text).
 * Preserves paragraph numbering, extracts metadata.
 * Outputs JSON files suitable for ingestion.
 *
 * Usage:
 *   node scripts/extract-judgments.mjs                  # all judgments
 *   node scripts/extract-judgments.mjs --only vishaka-1997
 *   node scripts/extract-judgments.mjs --only id-a,id-b
 *
 * HTML is read from data/html/<id>.html, downloaded from `sourceUrl` when
 * missing, or taken from the legacy /tmp copies of the first three runs.
 */
import fs from "node:fs";
import path from "node:path";

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const LEGACY_HTML = {
  "sita-soren-2024": "/tmp/ik-sita-soren.html",
  "bilkis-yakub-rasool-2024": "/tmp/ik-bilkis.html",
  "sukanya-shantha-2024": "/tmp/ik-sukanya.html",
};

const JUDGMENTS = [
  {
    id: "sita-soren-2024",
    docId: "193599726",
    title: "Sita Soren v. Union of India",
    citation: "2024 INSC 161",
    court: "Supreme Court of India (7-Judge Constitution Bench)",
    date: "2024-03-04",
    judges: "CJI D.Y. Chandrachud, Justices A.S. Bopanna, M.M. Sundresh, P.S. Narasimha, J.B. Pardiwala, Sanjay Kumar, Manoj Misra",
    topics: ["Legislative privileges", "Bribery", "Criminal liability", "Constitutional interpretation", "Article 105(2)", "Prevention of Corruption Act"],
    sourceUrl: "https://indiankanoon.org/doc/193599726/",
    referencedActs: [
      "Constitution of India, Article 105(2)",
      "Constitution of India, Article 194(2)",
      "Prevention of Corruption Act, 1988",
      "Indian Penal Code, Section 171E",
      "Indian Penal Code, Section 171B",
    ],
  },
  {
    id: "bilkis-yakub-rasool-2024",
    docId: "47574125",
    title: "Bilkis Yakub Rasool v. Union of India",
    citation: "2024 INSC 24",
    court: "Supreme Court of India (2-Judge Bench)",
    date: "2024-01-08",
    judges: "Justices B.V. Nagarathna, Ujjal Bhuyan",
    topics: ["Remission of sentences", "State jurisdiction", "Judicial review", "Gujarat riots 2002", "CrPC Section 432"],
    sourceUrl: "https://indiankanoon.org/doc/47574125/",
    referencedActs: [
      "Code of Criminal Procedure, 1973, Section 432",
      "Code of Criminal Procedure, 1973, Section 433",
      "Code of Criminal Procedure, 1973, Section 435",
      "Constitution of India, Article 72",
      "Constitution of India, Article 161",
      "Constitution of India, Article 142",
    ],
  },
  {
    id: "sukanya-shantha-2024",
    docId: "137753759",
    title: "Sukanya Shantha v. Union of India",
    citation: "2024 INSC 753",
    court: "Supreme Court of India (2-Judge Bench)",
    date: "2024-10-03",
    judges: "Chief Justice of India D.Y. Chandrachud, Justice J.B. Pardiwala",
    topics: ["Caste discrimination in prisons", "Fundamental rights", "Article 14", "Article 15", "Article 17", "Article 21", "Prison reforms"],
    sourceUrl: "https://indiankanoon.org/doc/137753759/",
    referencedActs: [
      "Constitution of India, Article 14",
      "Constitution of India, Article 15",
      "Constitution of India, Article 17",
      "Constitution of India, Article 21",
      "Protection of Civil Rights Act, 1955",
      "Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989",
      "Prisons Act, 1894",
    ],
  },
  {
    id: "kesavananda-bharati-1973",
    docId: "257876",
    title: "Kesavananda Bharati Sripadagalvaru v. State of Kerala",
    citation: "AIR 1973 SC 1461",
    court: "Supreme Court of India (13-Judge Constitution Bench)",
    date: "1973-04-24",
    judges: "CJI S.M. Sikri, Justices A.N. Grover, A.N. Ray, D.G. Palekar, H.R. Khanna, J.M. Shelat, K.K. Mathew, K.S. Hegde, M.H. Beg, P. Jaganmohan Reddy, S.N. Dwivedi, Y.V. Chandrachud",
    topics: ["Basic structure doctrine", "Article 368", "Constitutional amendment", "Fundamental rights", "Parliamentary sovereignty"],
    sourceUrl: "https://indiankanoon.org/doc/257876/",
    referencedActs: [
      "Constitution of India, Article 13",
      "Constitution of India, Article 25",
      "Constitution of India, Article 32",
      "Constitution of India, Article 368",
    ],
  },
  {
    id: "maneka-gandhi-1978",
    docId: "1766147",
    title: "Maneka Gandhi v. Union of India",
    citation: "1978 AIR 597",
    court: "Supreme Court of India (7-Judge Bench)",
    date: "1978-01-25",
    judges: "CJI M. Hameedullah Beg, Justices Y.V. Chandrachud, P.N. Bhagwati, V.R. Krishna Iyer, N.L. Untwalia, Syed Murtaza Fazalali, P.S. Kailasam",
    topics: ["Right to life and personal liberty", "Article 21", "Passport impoundment", "Natural justice", "Procedure established by law"],
    sourceUrl: "https://indiankanoon.org/doc/1766147/",
    referencedActs: [
      "Constitution of India, Article 14",
      "Constitution of India, Article 19(1)(g)",
      "Constitution of India, Article 21",
      "Passport (Entry into India) Act, 1920",
      "Passports Act, 1967",
    ],
  },
  {
    id: "adm-jabalpur-1976",
    docId: "165099707",
    title: "Additional District Magistrate, Jabalpur v. Shivakant Shukla",
    citation: "AIR 1976 SC 1207",
    court: "Supreme Court of India (5-Judge Bench)",
    date: "1976-04-28",
    judges: "CJI A.N. Ray, Justices H.R. Khanna, M.H. Beg, P.N. Bhagwati, Y.V. Chandrachud",
    topics: ["Habeas corpus", "Emergency detention", "Article 21", "Executive detention", "Overruled precedent"],
    sourceUrl: "https://indiankanoon.org/doc/165099707/",
    referencedActs: [
      "Constitution of India, Article 19",
      "Constitution of India, Article 21",
      "Constitution of India, Article 226",
      "Maintenance of Internal Security Act, 1971",
    ],
  },
  {
    id: "puttaswamy-2017",
    docId: "91938676",
    title: "K.S. Puttaswamy (Retd.) v. Union of India",
    citation: "2017 INSC 801",
    court: "Supreme Court of India (9-Judge Constitution Bench)",
    date: "2017-08-24",
    judges: "CJI Jagdish Singh Khehar, Justices J. Chelameswar, S.A. Bobde, R.K. Agrawal, Rohinton Fali Nariman, Abhay Manohar Sapre, D.Y. Chandrachud, Sanjay Kishan Kaul, S. Abdul Nazeer",
    topics: ["Right to privacy", "Article 21", "Fundamental rights", "Aadhaar", "Overruling M.P. Sharma and Kharak Singh"],
    sourceUrl: "https://indiankanoon.org/doc/91938676/",
    referencedActs: [
      "Constitution of India, Article 14",
      "Constitution of India, Article 19",
      "Constitution of India, Article 21",
      "Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016",
    ],
  },
  {
    id: "vishaka-1997",
    docId: "1031794",
    title: "Vishaka v. State of Rajasthan",
    citation: "AIR 1997 SC 3011",
    court: "Supreme Court of India (3-Judge Bench)",
    date: "1997-08-13",
    judges: "CJI J.S. Verma, Justices Sujata V. Manohar, B.N. Kirpal",
    topics: ["Sexual harassment at workplace", "Guidelines", "Article 14", "Article 15", "Public interest litigation"],
    sourceUrl: "https://indiankanoon.org/doc/1031794/",
    referencedActs: [
      "Constitution of India, Article 14",
      "Constitution of India, Article 15",
      "Constitution of India, Article 19",
      "Constitution of India, Article 21",
      "Constitution of India, Article 32",
    ],
  },
  {
    id: "navtej-johar-2018",
    docId: "168671544",
    title: "Navtej Singh Johar v. Union of India",
    citation: "2018 INSC 790",
    court: "Supreme Court of India (5-Judge Constitution Bench)",
    date: "2018-09-06",
    judges: "CJI Dipak Misra, Justices Rohinton Fali Nariman, A.M. Khanwilkar, D.Y. Chandrachud, Indu Malhotra",
    topics: ["Section 377", "Consensual homosexuality", "Article 14", "Article 15", "Article 21", "Sexual orientation"],
    sourceUrl: "https://indiankanoon.org/doc/168671544/",
    referencedActs: [
      "Indian Penal Code, Section 377",
      "Constitution of India, Article 14",
      "Constitution of India, Article 15",
      "Constitution of India, Article 19",
      "Constitution of India, Article 21",
    ],
  },
  {
    id: "shreya-singhal-2015",
    docId: "110813550",
    title: "Shreya Singhal v. Union of India",
    citation: "2015 INSC 257",
    court: "Supreme Court of India (2-Judge Bench)",
    date: "2015-03-24",
    judges: "Justices Rohinton Fali Nariman, J. Chelameswar",
    topics: ["Freedom of speech and expression", "Section 66A", "Intermediary liability", "Reasonable restrictions", "Online speech"],
    sourceUrl: "https://indiankanoon.org/doc/110813550/",
    referencedActs: [
      "Information Technology Act, 2000, Section 66A",
      "Information Technology Act, 2000, Section 69A",
      "Information Technology Act, 2000, Section 79",
      "Constitution of India, Article 19(1)(a)",
      "Constitution of India, Article 19(2)",
    ],
  },
  {
    id: "hussainara-1979",
    docId: "1007347",
    title: "Hussainara Khatoon v. Home Secretary, State of Bihar",
    citation: "1979 AIR 1360",
    court: "Supreme Court of India (3-Judge Bench)",
    date: "1979-02-12",
    judges: "Justices P.N. Bhagwati, R.S. Pathak, A.D. Koshal",
    topics: ["Undertrial prisoners", "Speedy trial", "Article 21", "Bail", "Access to justice"],
    sourceUrl: "https://indiankanoon.org/doc/1007347/",
    referencedActs: [
      "Constitution of India, Article 14",
      "Constitution of India, Article 21",
      "Code of Criminal Procedure, 1973, Section 437",
      "Code of Criminal Procedure, 1973, Section 497",
      "Code of Criminal Procedure, 1973, Section 498",
    ],
  },
  {
    id: "dk-basu-1996",
    docId: "501198",
    title: "D.K. Basu v. State of West Bengal",
    citation: "AIR 1997 SC 610",
    court: "Supreme Court of India (2-Judge Bench)",
    date: "1996-12-18",
    judges: "Justice Kuldip Singh",
    topics: ["Arrest safeguards", "Custodial death", "Guidelines", "Article 21", "Article 22"],
    sourceUrl: "https://indiankanoon.org/doc/501198/",
    referencedActs: [
      "Constitution of India, Article 21",
      "Constitution of India, Article 22",
      "Code of Criminal Procedure, 1973, Section 54",
      "Code of Criminal Procedure, 1973, Section 55",
      "Code of Criminal Procedure, 1973, Section 57",
      "Code of Criminal Procedure, 1973, Section 167",
    ],
  },
  {
    id: "mukesh-nirbhaya-2017",
    docId: "68696327",
    title: "Mukesh v. State (NCT of Delhi)",
    citation: "2017 INSC 448",
    court: "Supreme Court of India (3-Judge Bench)",
    date: "2017-05-05",
    judges: "Justice Dipak Misra, Justices R. Banumathi, Ashok Bhushan",
    topics: ["Gang rape", "Death penalty", "Criminal conspiracy", "Murder", "Appellate review"],
    sourceUrl: "https://indiankanoon.org/doc/68696327/",
    referencedActs: [
      "Indian Penal Code, Section 302",
      "Indian Penal Code, Section 307",
      "Indian Penal Code, Section 376A",
      "Indian Penal Code, Section 376D",
      "Indian Penal Code, Section 376E",
      "Code of Criminal Procedure, 1973, Section 366",
      "Indian Evidence Act, 1872, Section 34",
    ],
  },
];

/**
 * Indian Kanoon renders the judgment inside <div class="judgments"> and ends
 * the document at </main>. Text lives in three interchangeable containers:
 * <p id="p_N">, <blockquote> and <pre> — reading only one of them silently drops
 * whole sections (Vishaka lost 65% of its text that way).
 */
function extractText(html) {
  const start = html.search(/<div[^>]*(?:id|class)="judgments?"[^>]*>/i);
  let region = start >= 0 ? html.slice(start) : html;
  const end = region.search(/<\/main>|<footer|homepage-footer-links/i);
  if (end > 0) region = region.slice(0, end);

  region = region
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ");

  let text = region
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|blockquote|pre|div|h[1-6]|li|tr|td|figcaption)>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ");

  // Decode HTML entities (including hex numeric forms).
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x[0-9a-f]+;/gi, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/gi, " ");

  // Drop Indian Kanoon's trailing tag cloud ("Related AI tags, ...").
  const junk = text.search(/Related AI tags|Related tags, queries/i);
  if (junk > 0) text = text.slice(0, junk);

  // Clean up whitespace but preserve paragraph structure.
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/ *\n */g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n");

  // Fall back to the legacy paragraph scan if the container was not found.
  if (text.replace(/\s+/g, " ").trim().length < 500) {
    const paragraphs = [];
    const paraRegex = /<p[^>]*(?:id="p_\d+"|data-structure)[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = paraRegex.exec(html)) !== null) paragraphs.push(match[1]);
    if (paragraphs.length > 5) text = paragraphs.join("\n\n");
  }

  return text.trim();
}

function extractJudges(html) {
  // Try to extract bench composition from the HTML
  const benchMatch = html.match(/(?:BENCH|Bench|CORAM|Coram)[:\s]*([^<\n]+)/i);
  return benchMatch ? benchMatch[1].trim() : null;
}

async function main() {
  const args = process.argv.slice(2);
  const outDir = path.join(process.cwd(), "data", "judgments");
  fs.mkdirSync(outDir, { recursive: true });
  const htmlDir = path.join(process.cwd(), "data", "html");
  fs.mkdirSync(htmlDir, { recursive: true });

  // --only <id>[,<id>] restricts the run to specific judgments (repeatable).
  const only = new Set();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--only" && args[i + 1]) {
      args[++i].split(",").forEach((id) => only.add(id.trim()));
    }
  }

  for (const judgment of JUDGMENTS) {
    if (only.size && !only.has(judgment.id)) continue;

    const htmlPath = await resolveHtmlPath(judgment, htmlDir);
    if (!htmlPath) {
      console.error(`HTML not available for ${judgment.id} (sourceUrl: ${judgment.sourceUrl})`);
      process.exitCode = 1;
      continue;
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    const text = extractText(html);
    if (text.split(/\s+/).filter(Boolean).length < 500) {
      console.error(`${judgment.id}: extracted only ${text.length} chars from ${htmlPath} — refusing to write`);
      process.exitCode = 1;
      continue;
    }

    const output = {
      ...judgment,
      // Curated bench detail wins: Indian Kanoon's <h3 class="doc_bench"> often
      // renders the CJI as a bare "Chief Justice".
      judges: judgment.judges || extractJudges(html),
      fullText: text,
      charCount: text.length,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      extractedAt: new Date().toISOString(),
    };

    const outFile = path.join(outDir, `${judgment.id}.json`);
    fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
    console.log(`${judgment.id}: ${output.wordCount} words, ${output.charCount} chars -> ${outFile}`);
  }
}

/**
 * Prefer the committed copy in data/html/, then download from Indian Kanoon,
 * then fall back to the temp files used by the original three extractions.
 */
async function resolveHtmlPath(judgment, htmlDir) {
  const local = path.join(htmlDir, `${judgment.id}.html`);
  if (fs.existsSync(local)) return local;

  if (judgment.sourceUrl) {
    try {
      const res = await fetch(judgment.sourceUrl, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(60000),
      });
      if (res.ok) {
        const body = await res.text();
        if (body.length > 5000) {
          fs.writeFileSync(local, body);
          console.log(`  fetched ${judgment.sourceUrl} -> ${local} (${body.length} bytes)`);
          return local;
        }
      }
      console.warn(`  fetch failed ${res.status} for ${judgment.sourceUrl}`);
    } catch (err) {
      console.warn(`  fetch error for ${judgment.sourceUrl}: ${err.message}`);
    }
  }

  const legacy = LEGACY_HTML[judgment.id];
  if (legacy && fs.existsSync(legacy)) return legacy;
  return null;
}

main().catch(console.error);
