import {
  CaseFileState,
  TranscriptMessage,
  CoCounselHint,
  CourtroomAgentInfo,
  MetricCardData,
  DashboardCaseRow,
} from "../types/courtroom";

export const DEFAULT_CASE_FILE: CaseFileState = {
  caseNumber: "CRL.A. 402/2026",
  title: "STATE OF MAHARASHTRA vs. ARJUN SHARMA",
  bench: "Courtroom No. 3 · Hon'ble Sessions Court, Mumbai",
  firSnippet:
    "FIR No. 89/2025 PS Colaba: Alleged offence under BNS Sec 103(1) (Murder) read with Sec 61(2) (Criminal Conspiracy). Prosecution alleges accused was tracked via automated toll camera logs and cellular tower handshakes near Marine Drive at 23:42 hrs.",
  sections: [
    {
      code: "BNS",
      section: "Sec 103(1)",
      description: "Punishment for Murder (Replaced IPC 302)",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
    },
    {
      code: "BSA",
      section: "Sec 63",
      description: "Admissibility of Electronic Records / 65B successor certificate",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      code: "BNSS",
      section: "Sec 173",
      description: "Report of Police Officer on Completion of Investigation",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
  ],
  exhibits: [
    {
      id: "Ex-A",
      name: "CCTV DVR Hard Drive (Colaba Junction)",
      type: "Digital Media",
      admissibility: "Contested",
      bnaCitation: "BSA Sec 63(4) Certificate Defect",
    },
    {
      id: "Ex-B",
      name: "Cellular CDR & Tower Locational Matrix",
      type: "Telecom Log",
      admissibility: "Admitted",
      bnaCitation: "Tower Handshake at 23:14 IST",
    },
    {
      id: "Ex-C",
      name: "Chemical Analysis & Post-Mortem Report",
      type: "Forensic Report",
      admissibility: "Admitted",
      bnaCitation: "Dr. K. Saxena, Civil Hospital",
    },
  ],
  witnessBrief: {
    witnessName: "Dr. N. Kulkarni (PW-1)",
    designation: "Senior Cyber Forensic Examiner, State Forensic Lab",
    keyTestimony:
      "Affirmed hash value match for the extracted footage, but conceded in pre-deposition that the hash was generated 48 hours after seizure without magistrate seal.",
    prepRiskScore: "High Vulnerability (Hash timeline discrepancy)",
  },
  prepChecklist: [
    { id: "c1", label: "Inspect Form 63 BSA electronic device certificate chain", done: true },
    { id: "c2", label: "Prepare impeachment question on hash generation delay", done: true },
    { id: "c3", label: "Flag non-compliance with BNSS Sec 105 videography rule", done: false },
    { id: "c4", label: "Cite Arjun Panditrao Khotkar (2020) 7 SCC 1 precedent", done: false },
  ],
};

export const INITIAL_TRANSCRIPTS: Record<"defense" | "prosecution", TranscriptMessage[]> = {
  defense: [
    {
      id: "t1",
      speaker: "Judge AI",
      speakerRole: "judge",
      content:
        "Counsel, the bench has reviewed Exhibit A. You may proceed with the cross-examination of PW-1 on the digital evidence chain.",
      timestamp: "10:14:02",
      citation: "Coram: Hon'ble Justice S. K. Deshmukh",
    },
    {
      id: "t2",
      speaker: "Prosecutor AI",
      speakerRole: "prosecutor",
      content:
        "My Lord, the prosecution relies on the secondary forensic hash copy. The witness has verified the source integrity under Section 63 BSA.",
      timestamp: "10:14:18",
      citation: "Reliance: BSA Sec 63(2)",
      isObjectionable: true,
    },
    {
      id: "t3",
      speaker: "Witness AI (PW-1)",
      speakerRole: "witness",
      content:
        "I examined the DVR drive on 14th August. The hash was computed using SHA-256 after the hard disk was received in the lab vault.",
      timestamp: "10:14:35",
      citation: "Deposition Vol. II, Para 14",
    },
  ],
  prosecution: [
    {
      id: "t1-p",
      speaker: "Judge AI",
      speakerRole: "judge",
      content:
        "Public Prosecutor, state your nexus between the CDR tower records and the accused's vehicle departure.",
      timestamp: "10:14:05",
      citation: "Coram: Hon'ble Justice S. K. Deshmukh",
    },
    {
      id: "t2-p",
      speaker: "Witness AI (PW-1)",
      speakerRole: "witness",
      content:
        "The IMEI number 35912400 logged 14 consecutive handshakes between 23:10 and 23:45 at the Colaba tower sector 3.",
      timestamp: "10:14:24",
      citation: "Telecom Annexure D-1",
    },
    {
      id: "t3-p",
      speaker: "Prosecutor AI",
      speakerRole: "prosecutor",
      content:
        "Defense counsel has provided no alibi under Section 11 BSA to counteract the geographic triangulation.",
      timestamp: "10:14:41",
      citation: "Reliance: BSA Sec 11 (Plea of Alibi)",
      isObjectionable: false,
    },
  ],
};

export const SAMPLE_HINTS: Record<"defense" | "prosecution", CoCounselHint> = {
  defense: {
    id: "hint-def-1",
    badge: "Tactical Contradiction",
    title: "Vulnerability in PW-1 Hash Chain",
    hint: "PW-1 just admitted the SHA-256 hash was calculated 48 hours post-seizure in the vault. The seizing officer did not seal the optical port at the police station.",
    suggestedArgument:
      "My Lord, I put to PW-1 that in absence of contemporaneous sealing at the spot under Sec 105 BNSS, the hash integrity is fatally compromised per Arjun Panditrao (2020) 7 SCC 1.",
    statuteCitation: "BSA Sec 63(4) r/w BNSS Sec 105",
  },
  prosecution: {
    id: "hint-pros-1",
    badge: "Evidentiary Lock-in",
    title: "Presumption under Sec 117 BSA",
    hint: "Defense has not cross-examined the telecom nodal officer. The CDR certificate is certified under Sec 63(4) by the telecom designated officer.",
    suggestedArgument:
      "My Lord, the defense failed to challenge the Nodal Officer's stamp. By operation of law, Section 63 sub-clause (4) certificate carries a statutory presumption of authenticity.",
    statuteCitation: "BSA Sec 63(4) & Sec 117",
  },
};

export const COURTROOM_AGENTS: CourtroomAgentInfo[] = [
  {
    id: "judge",
    role: "The Presiding Judge AI",
    name: "Justice Vikramaditya (Bench Engine)",
    tagline: "Unforgiving legal mind simulating High Court & Sessions trial judges",
    specialization: "Admissibility rulings, bench interruptions, procedural decorum scoring",
    listeningTrigger:
      "Constantly monitors both counsels' speech for procedural defaults, weak citations, and rambling arguments.",
    reasoningSnippet:
      "IF counsel_argument lacks Section 63 BSA certificate -> INTERRUPT with question: 'Where is the designated officer's affidavit under 63(4)?'",
    sampleDialogue:
      "“Counsel, you are reciting facts when you should be arguing the threshold of admissibility. Address my question on the seizure memo or resume your seat.”",
    statuteFocus: "BNSS CrPC Procedures & Judicial Prerogatives",
  },
  {
    id: "opposing",
    role: "The Opposing Counsel AI",
    name: "Adv. Mihir Salve (Adversarial Engine)",
    tagline: "Dynamic prosecutor or defense opponent that exploits your blind spots",
    specialization: "Instant objections, leading question counters, adversarial traps",
    listeningTrigger:
      "Monitors your syntax for compound questions, argumentative examination, and hearsay declarations in real-time.",
    reasoningSnippet:
      "DETECT: Leading question in direct examination -> TRIGGER: Instant 'Objection, My Lord!' under BSA Sec 142.",
    sampleDialogue:
      "“Objection, My Lord! My learned friend is putting words into PW-1's mouth during examination-in-chief. This directly violates Section 142 of the Bharatiya Sakshya Adhiniyam.”",
    statuteFocus: "BSA Evidence Act & Trial Cross-Exam Rules",
  },
  {
    id: "witness",
    role: "The Dynamic Witness AI",
    name: "PW / DW Personas (Stateful Persona Engine)",
    tagline: "Simulates forensic doctors, police IOs, eye-witnesses, and hostile turncoats",
    specialization: "Stateful memory, stress simulation under cross, hostility transitions",
    listeningTrigger:
      "Evaluates questioning pressure; if caught in a proven contradiction, composure drops and answers become evasive.",
    reasoningSnippet:
      "STATE: Hostile Witness -> IF confronted with signed Sec 180 BNSS statement -> RETURN hesitant reply: 'I was made to sign under duress at the police station.'",
    sampleDialogue:
      "“I... I might have signed that sheet in haste, but I am certain the vehicle was silver, not dark blue as recorded in the memo.”",
    statuteFocus: "BNSS Sec 180 / BSA Sec 145 Statements",
  },
  {
    id: "co-counsel",
    role: "Your Co-Counsel AI",
    name: "Adv. Saathi (Real-Time Strategist)",
    tagline: "Whispers winning counters, spots witness contradictions, and fetches BNS sections live",
    specialization: "Subtle live prompt cards, statute lookup, objection recommendations",
    listeningTrigger:
      "Listens to opponent submissions and witness depositions, cross-referencing FIR exhibits in milliseconds.",
    reasoningSnippet:
      "MATCH: Witness testimony timestamp != Exhibit B tower ping -> GENERATE prompt card with precise impeachment citation.",
    sampleDialogue:
      "“💡 Note: The witness stated he reached the spot at 11:15 PM, but Exhibit D shows the first call to 112 was logged at 11:42 PM. Ask him to explain the 27-minute gap.”",
    statuteFocus: "BNS, BNSS, BSA Cross-Correlation & Case Law",
  },
  {
    id: "clerk",
    role: "The Research & Clerk AI",
    name: "Munshi AI (Pre-Trial Investigator)",
    tagline: "Crawls Supreme Court & High Court precedents and structures trial bundles",
    specialization: "Chronology building, FIR clause extraction, automated moot memorials",
    listeningTrigger:
      "Analyzes uploaded case briefs / charge sheets to extract timeline, gaps, and contradictory police statements.",
    reasoningSnippet:
      "INGEST: Charge sheet PDF -> BUILD chronological event graph -> FLAG: 3 unexplained evidentiary gaps in Section 173 BNSS report.",
    sampleDialogue:
      "“Bundle generated: 4 Supreme Court citations on digital evidence admissibility indexed. Prepared 8 cross-examination anchors for the ballistic expert.”",
    statuteFocus: "Supreme Court Precedents & Charge Sheet Analysis",
  },
];

export const DASHBOARD_METRICS: MetricCardData[] = [
  {
    label: "Trial Verdict Rate",
    value: "78.4%",
    subtext: "Across 24 mock trials & bail hearings",
    trend: "up",
    trendValue: "+6.2% vs last month",
  },
  {
    label: "Argument Persuasion Score",
    value: "8.9 / 10",
    subtext: "Bench conviction metric",
    trend: "up",
    trendValue: "Top 4% of mooters",
  },
  {
    label: "Objection Accuracy",
    value: "92.1%",
    subtext: "Sustained by Judge AI under BSA",
    trend: "up",
    trendValue: "34/37 sustained",
  },
  {
    label: "Cases Practiced",
    value: "24 Cases",
    subtext: "14 Criminal · 10 Constitutional",
    trend: "neutral",
    trendValue: "42.5 hrs on record",
  },
];

export const RECENT_CASES: DashboardCaseRow[] = [
  {
    id: "c-101",
    title: "State of Maharashtra v. Arjun Sharma",
    court: "Sessions Court, Greater Mumbai",
    role: "Defense Counsel",
    stage: "Cross-Examination",
    judgeScore: 8.8,
    lastActive: "Today, 10:14 AM",
    statutes: ["BNS Sec 103", "BSA Sec 63"],
  },
  {
    id: "c-102",
    title: "Union of India v. Global Tech Ltd (PMLA)",
    court: "Special PMLA Court, New Delhi",
    role: "Public Prosecutor",
    stage: "Final Arguments",
    judgeScore: 9.2,
    lastActive: "Yesterday",
    statutes: ["PMLA Sec 45", "BNSS Sec 479"],
  },
  {
    id: "c-103",
    title: "NLU National Moot: Environmental Public Trust",
    court: "Supreme Court of India (Moot Bench)",
    role: "Defense Counsel",
    stage: "Pre-Trial Briefing",
    judgeScore: 8.4,
    lastActive: "3 days ago",
    statutes: ["Art 21 Const.", "Art 32"],
  },
  {
    id: "c-104",
    title: "K. R. Rao v. Central Bureau of Investigation",
    court: "Special CBI Court, Bengaluru",
    role: "Defense Counsel",
    stage: "Reserved Verdict",
    judgeScore: 9.0,
    lastActive: "Nov 02, 2026",
    statutes: ["PC Act Sec 13", "BSA Sec 65"],
  },
];

export const FAQ_ITEMS = [
  {
    question: "Does Courtroom AI support the new Indian criminal laws (BNS, BNSS, BSA) as well as IPC/CrPC?",
    answer:
      "Yes, completely. Courtroom AI features native bilingual transition support. Every case scenario has auto-mapped parallel references: you can argue using Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), and Bharatiya Sakshya Adhiniyam (BSA 2023), while also viewing their legacy Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), and Indian Evidence Act counterparts for older pending appeals.",
  },
  {
    question: "How do the multiple AI agents know when to speak or interrupt?",
    answer:
      "Our courtroom architecture runs on a stateful multi-agent orchestration graph (built on LangGraph principles). Agents listen concurrently to the streaming transcript. The Judge AI evaluates procedural admissibility thresholds; if you ask a leading question on direct examination, the Opposing Counsel agent triggers an immediate interruption ('Objection, My Lord!'), and the Judge pauses the trial floor to rule whether to sustain or overrule.",
  },
  {
    question: "Can I upload my own private case files or moot court problem PDFs?",
    answer:
      "Yes. You can drag and drop your Moot Memorial problem, FIR copy, charge sheet, or case brief (PDF/DOCX). Munshi AI extracts the statement of facts, timeline discrepancies, witness list, and evidence exhibits within 30 seconds, automatically populating the 3-pane courtroom simulator for instant trial practice.",
  },
  {
    question: "How does Witness AI preparation work when we don't know what the opposing lawyer will ask?",
    answer:
      "In the Pre-Trial Witness Prep Lab, you subject your Witness AI to an adversarial stress-test. The engine plays the role of an aggressive opposing counsel trying to extract contradictions, test alibis, or break emotional composure. You can coach the witness on boundary lines (e.g., 'Do not speculate on call records you have not seen') and test if they hold under pressure.",
  },
  {
    question: "What is the Co-Counsel AI and can I turn it off for exam/moot practice?",
    answer:
      "Adv. Saathi (Co-Counsel AI) is your real-time strategic aide. It sits in your trial corner, silently auditing witness statements against exhibits and popping up high-impact counters and case law citations. For strict moot court simulations or university exams, you can toggle 'Exam Mode / Strict Moot', which silences Co-Counsel whispers so you rely entirely on your own preparation.",
  },
  {
    question: "Is it free to start for law students and moot court teams?",
    answer:
      "Yes. Students from NLUs, central and state law faculties, and collegiate moot court societies can practice standard landmark criminal and constitutional cases completely free. We offer student verification for unlimited trial runs, custom moot problem uploads, and detailed judge scoring analytics.",
  },
];
