#!/usr/bin/env node
/**
 * Extract judgment text from Indian Kanoon HTML pages.
 * Preserves paragraph numbering, extracts metadata.
 * Outputs JSON files suitable for ingestion.
 */
import fs from "node:fs";
import path from "node:path";

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
];

function extractText(html) {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  
  // Find the judgment body - Indian Kanoon uses div with class "judgments" or id "judgments"
  let judgmentMatch = text.match(/<div[^>]*(?:id|class)="judgments?"[^>]*>([\s\S]*?)<\/div>\s*(?:<div|<\/body)/i);
  if (!judgmentMatch) {
    // Try broader extraction - look for the pre tag with judgment text
    judgmentMatch = text.match(/<pre[^>]*id="pre_\d+"[^>]*>([\s\S]*?)(?:<\/pre>)/i);
  }
  
  let body = judgmentMatch ? judgmentMatch[1] : text;
  
  // Also extract from paragraph tags with data-structure
  const paragraphs = [];
  const paraRegex = /<p[^>]*(?:id="p_\d+"|data-structure)[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = paraRegex.exec(text)) !== null) {
    paragraphs.push(match[1]);
  }
  
  // Extract from pre tags too
  const preRegex = /<pre[^>]*>([\s\S]*?)<\/pre>/gi;
  while ((match = preRegex.exec(text)) !== null) {
    paragraphs.push(match[1]);
  }
  
  // Combine: use paragraphs if substantial, otherwise fall back to body
  let fullText;
  if (paragraphs.length > 5) {
    fullText = paragraphs.join("\n\n");
  } else {
    fullText = body;
  }
  
  // Clean HTML tags but preserve newlines
  fullText = fullText.replace(/<br\s*\/?>/gi, "\n");
  fullText = fullText.replace(/<\/p>/gi, "\n\n");
  fullText = fullText.replace(/<[^>]+>/g, " ");
  
  // Decode HTML entities
  fullText = fullText.replace(/&amp;/g, "&");
  fullText = fullText.replace(/&lt;/g, "<");
  fullText = fullText.replace(/&gt;/g, ">");
  fullText = fullText.replace(/&quot;/g, '"');
  fullText = fullText.replace(/&#39;/g, "'");
  fullText = fullText.replace(/&nbsp;/g, " ");
  fullText = fullText.replace(/&#\d+;/g, " ");
  
  // Clean up whitespace but preserve paragraph structure
  fullText = fullText.replace(/[ \t]+/g, " ");
  fullText = fullText.replace(/\n\s*\n\s*\n/g, "\n\n");
  fullText = fullText.trim();
  
  return fullText;
}

function extractJudges(html) {
  // Try to extract bench composition from the HTML
  const benchMatch = html.match(/(?:BENCH|Bench|CORAM|Coram)[:\s]*([^<\n]+)/i);
  return benchMatch ? benchMatch[1].trim() : null;
}

async function main() {
  const outDir = path.join(process.cwd(), "data", "judgments");
  fs.mkdirSync(outDir, { recursive: true });
  
  for (const judgment of JUDGMENTS) {
    const htmlFile = `/tmp/ik-${judgment.id.split("-")[0]}${judgment.id.includes("bilkis") ? "" : judgment.id.includes("sukanya") ? "" : ""}.html`;
    
    // Map to actual temp files
    let htmlPath;
    if (judgment.id === "sita-soren-2024") htmlPath = "/tmp/ik-sita-soren.html";
    else if (judgment.id === "bilkis-yakub-rasool-2024") htmlPath = "/tmp/ik-bilkis.html";
    else if (judgment.id === "sukanya-shantha-2024") htmlPath = "/tmp/ik-sukanya.html";
    
    if (!fs.existsSync(htmlPath)) {
      console.error(`HTML file not found: ${htmlPath}`);
      continue;
    }
    
    const html = fs.readFileSync(htmlPath, "utf8");
    const text = extractText(html);
    const extractedJudges = extractJudges(html);
    
    const output = {
      ...judgment,
      judges: extractedJudges || judgment.judges,
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

main().catch(console.error);
