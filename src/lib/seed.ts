import { db } from "./db";

export interface SeedCase {
  id: string;
  title: string;
  category: string;
  court: string;
  charges: string;
  summary: string;
  parties: Array<{ side: string; name: string; role: string; persona: string; isWitness?: boolean; personality?: string }>;
  evidence: Array<{ label: string; title: string; description: string; content: string }>;
  chunks: Array<{ label: string; text: string }>;
}

export const SEED_CASES: SeedCase[] = [
  {
    id: "delhi-liquor-2022",
    title: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    category: "Criminal · Corruption",
    court: "Trial Court, Delhi, with CBI/ED parallel proceedings",
    charges: "Prevention of Corruption Act; PMLA (ED); conspiracy in the 2021-22 Excise Policy",
    summary:
      "The CBI/ED allege the 2021-22 Delhi Excise Policy routed kickbacks from liquor licensees to AAP. ED issued nine summons; Kejriwal was arrested on 21 Mar 2024, the first sitting CM arrested. SC gave interim bail 10 May to 1 Jun 2024 to campaign, he surrendered on 2 Jun 2024. Trial court granted bail on 20 Jun 2024, Delhi HC stayed it on 21 Jun before release. CBI arrested him from Tihar on 26 Jun 2024. SC granted interim bail in the ED money-laundering case on 12 Jul 2024 but he stayed in jail on the CBI case. SC granted bail in the CBI case on 13 Sep 2024 after 5+ months.",
    parties: [
      { side: "judge", name: "Hon'ble Justice V. Gopalan", role: "Presiding Judge", persona: "Measured, procedural, strict on relevance." },
      { side: "prosecution", name: "Public Prosecutor (ED)", role: "Prosecution counsel", persona: "Presses the kickback trail and money-laundering angle." },
      { side: "defense", name: "Defense Counsel", role: "Defense counsel", persona: "Argues vendetta, agency misuse, and weak evidence." },
      { side: "witness", name: "PW-1 · ED Investigating Officer", role: "Prosecution witness", persona: "Officer defending the summons record.", isWitness: true, personality: "Formal, defensive about summons procedure, cites case diary references." },
      { side: "witness", name: "DW-1 · Excise Department Official", role: "Defense witness", persona: "Policy drafting official.", isWitness: true, personality: "Calm, technical about the 2021-22 policy clauses, concedes nothing on kickbacks." },
    ],
    evidence: [
      { label: "Exhibit A", title: "ED summons record (9 summons)", description: "Chronology of ED summons and non-appearance", content: "Nine summons issued before the 21 Mar 2024 arrest; arrest followed reported non-appearance." },
      { label: "Exhibit B", title: "2021-22 Excise Policy text", description: "The policy clauses at the heart of the case", content: "Policy introduced private liquor retail; prosecution alleges favored licensees and waived fees." },
      { label: "Exhibit C", title: "Bail orders trail", description: "SC interim bail, trial court bail, HC stay", content: "10 May-1 Jun 2024 SC interim bail; 20 Jun 2024 trial court bail; 21 Jun 2024 Delhi HC stay; 12 Jul 2024 SC interim bail in ED case; 13 Sep 2024 SC bail in CBI case." },
    ],
    chunks: [
      { label: "BNS § 61(2)", text: "Criminal conspiracy: agreement to do an illegal act, punishable with the same punishment as the target offence." },
      { label: "BSA § 63", text: "Admissibility of electronic records; secondary evidence requires a certificate identifying the record and device, successor to Section 65B of the Evidence Act." },
      { label: "PMLA § 3", text: "Money laundering: directly or indirectly deals in proceeds of crime, punishable with rigorous imprisonment up to 7 years and fine." },
      { label: "Case fact", text: "Arvind Kejriwal arrested 21 Mar 2024 after nine ED summons; first sitting chief minister arrested in Indian history." },
      { label: "Case fact", text: "SC interim bail 10 May to 1 Jun 2024 for campaigning; surrendered 2 Jun 2024." },
      { label: "Case fact", text: "Trial court bail 20 Jun 2024 stayed by Delhi HC 21 Jun 2024 before release." },
      { label: "Case fact", text: "CBI arrested him from Tihar on 26 Jun 2024; SC granted interim bail in ED case 12 Jul 2024 but CBI case kept him in jail." },
      { label: "Case fact", text: "SC granted bail in CBI case 13 Sep 2024 after more than five months." },
    ],
  },
  {
    id: "electoral-bonds-2024",
    title: "Association for Democratic Reforms v. Union of India — Electoral Bonds Case",
    category: "Constitutional",
    court: "Supreme Court of India, five-judge Constitution Bench (CJI Chandrachud)",
    charges: "Electoral Bonds Scheme 2018; Finance Act amendments; Companies Act §182 and RPA changes",
    summary:
      "A five-judge bench led by CJI D.Y. Chandrachud struck down the Electoral Bonds Scheme of 2018 as unconstitutional, violating voters' right to information under Article 19(1)(a). The Court also struck down amendments to Companies Act §182, the Income Tax Act, and the Representation of the People Act that made donations anonymous. Judgment in 2024 INSC 113.",
    parties: [
      { side: "judge", name: "Hon'ble CJI Bench", role: "Constitution Bench", persona: "Focuses on Article 19(1)(a) proportionality, sealed cover and anonymous money." },
      { side: "prosecution", name: "Petitioner Counsel (ADR)", role: "Petitioner counsel", persona: "Argues voter information rights and unaccountable political funding." },
      { side: "defense", name: "Union of India Counsel", role: "Respondent counsel", persona: "Defends the scheme on donor privacy and curbing black money." },
      { side: "witness", name: "PW-1 · ECI Records Officer", role: "Neutral records witness", persona: "Produces bond and donation records.", isWitness: true, personality: "Precise about data dates, refuses to speculate on intent." },
    ],
    evidence: [
      { label: "Exhibit A", title: "Electoral Bonds Scheme 2018", description: "Anonymous donation instruments", content: "Scheme allowed anonymous donations to political parties through bearer bonds." },
      { label: "Exhibit B", title: "Statutory amendments", description: "Companies Act, IT Act, RPA changes", content: "Amendments removed donor disclosure and unlimited corporate donation caps." },
      { label: "Exhibit C", title: "2024 INSC 113", description: "Constitution Bench judgment", content: "Scheme struck down as unconstitutional; right to information under Article 19(1)(a) violated." },
    ],
    chunks: [
      { label: "Constitution Art 19(1)(a)", text: "Freedom of speech and expression includes the voter's right to information about political funding and the source of donations." },
      { label: "Case fact", text: "Electoral Bonds Scheme of 2018 struck down in 2024 INSC 113 as unconstitutional." },
      { label: "Case fact", text: "Bench: CJI Chandrachud with Justices Sanjiv Khanna, B.R. Gavai, J.B. Pardiwala, Manoj Misra." },
      { label: "Case fact", text: "Companies Act §182, Income Tax Act and RPA amendments on anonymous donations also struck down." },
    ],
  },
  {
    id: "rahul-defamation-2023",
    title: "Purnesh Modi v. Rahul Gandhi — 2023 Defamation and Disqualification",
    category: "Defamation · Election Law",
    court: "Surat trial court; Supreme Court stay",
    charges: "Defamation under IPC §§499-500 (now BNS equivalent) for 'Modi surname' remark; sentence of 2 years; Lok Sabha disqualification",
    summary:
      "A Surat court convicted Rahul Gandhi in 2023 for remarks about the 'Modi surname', sentencing him to 2 years. His membership of the Lok Sabha was terminated on disqualification. The Supreme Court stayed the conviction in August 2023, and he returned to Parliament and contested the Wayanad by-election.",
    parties: [
      { side: "judge", name: "Hon'ble Surat Trial Judge", role: "Presiding Judge", persona: "Focused on the exact words and the identification of the class." },
      { side: "prosecution", name: "Complainant Counsel (Purnesh Modi)", role: "Complainant counsel", persona: "Argues the remark defamed an identifiable class." },
      { side: "defense", name: "Defense Counsel", role: "Defense counsel", persona: "Argues political speech, no individual identification, no malice." },
      { side: "witness", name: "PW-1 · Complainant", role: "Complainant witness", persona: "Explains the hurt and the class identification.", isWitness: true, personality: "Emotional but precise about the occasion and audience." },
    ],
    evidence: [
      { label: "Exhibit A", title: "Rally speech recording", description: "The impugned remark at a rally", content: "'How come all thieves have Modi surname?' said at a public rally, alleged to target an identifiable class." },
      { label: "Exhibit B", title: "Disqualification notice", description: "Lok Sabha membership termination", content: "Membership terminated after the 2-year conviction triggered disqualification." },
      { label: "Exhibit C", title: "SC stay order, Aug 2023", description: "Supreme Court stayed conviction", content: "Supreme Court stayed the conviction; membership restored." },
    ],
    chunks: [
      { label: "IPC § 499", text: "Defamation: imputation made with intent to harm reputation, or knowledge/reason to believe it will harm reputation." },
      { label: "IPC § 500", text: "Punishment for defamation: simple imprisonment up to 2 years, or fine, or both." },
      { label: "Case fact", text: "Surat court convicted in 2023; sentence of 2 years; Lok Sabha membership terminated on disqualification." },
      { label: "Case fact", text: "Supreme Court stayed the conviction in August 2023; Gandhi returned to Parliament." },
      { label: "Case fact", text: "He later contested and won the Wayanad Lok Sabha by-election." },
    ],
  },
];

export async function seedCases() {
  const sql = db();
  for (const c of SEED_CASES) {
    await sql`
      INSERT INTO cases (id, title, category, court, charges, summary, seeded)
      VALUES (${c.id}, ${c.title}, ${c.category}, ${c.court}, ${c.charges}, ${c.summary}, true)
      ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary
    `;
    await sql`DELETE FROM case_parties WHERE case_id = ${c.id}`;
    await sql`DELETE FROM case_evidence WHERE case_id = ${c.id}`;
    await sql`DELETE FROM chunks WHERE case_id = ${c.id}`;
    for (const p of c.parties) {
      await sql`
        INSERT INTO case_parties (case_id, side, name, role, persona_prompt, is_witness, personality)
        VALUES (${c.id}, ${p.side}, ${p.name}, ${p.role}, ${p.persona}, ${Boolean(p.isWitness)}, ${p.personality ?? ""})
      `;
    }
    for (const e of c.evidence) {
      await sql`
        INSERT INTO case_evidence (case_id, exhibit_label, title, description, content)
        VALUES (${c.id}, ${e.label}, ${e.title}, ${e.description}, ${e.content})
      `;
    }
    const [doc] = await sql`
      INSERT INTO documents (case_id, kind, title, status)
      VALUES (${c.id}, 'hf_seed', ${c.title + " fact sheet"}, 'indexed')
      RETURNING id
    `;
    for (const ch of c.chunks) {
      await sql`
        INSERT INTO chunks (document_id, case_id, section_label, text, token_count)
        VALUES (${doc.id}, ${c.id}, ${ch.label}, ${ch.text}, ${ch.text.split(/\s+/).length})
      `;
    }
  }
}
