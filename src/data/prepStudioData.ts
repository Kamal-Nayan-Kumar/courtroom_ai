import {
  CaseDossierDocument,
  PinnedTrialFact,
  RetrievedAuthority,
  TrialBriefState,
  WitnessProfile,
} from "../types/prepStudio";

export const CASE_DOSSIER_DOCUMENTS: CaseDossierDocument[] = [
  {
    id: "doc-fir",
    title: "FIR No. 89/2026 (PS Colaba)",
    documentType: "fir",
    badgeText: "Core Fact",
    badgeVariant: "default",
    filingDate: "14 Aug 2026, 04:15 IST",
    officerOrBench: "Sub-Inspector A. Patil · PS Colaba",
    summary:
      "First Information Report registered on statement of hotel night security guard alleging physical altercation and fatal collision near Marine Drive promenade.",
    paragraphs: [
      {
        id: "fir-p1",
        paraNumber: 1,
        text: "On the night of 13th/14th August 2026, at approximately 23:42 HRS, PCR van received emergency call reporting an unconscious male lying near Marine Drive Junction. Complainant Ramesh Pawar (Guard at Hotel Grand Bay) stated he witnessed a dark luxury vehicle departing at high speed.",
      },
      {
        id: "fir-p2",
        paraNumber: 2,
        text: "Offence formally registered under Section 103(1) of Bharatiya Nyaya Sanhita (BNS 2023) read with Section 61(2) (Criminal Conspiracy) against unidentified driver and vehicle registration MH-01-EA-4902.",
      },
      {
        id: "fir-p3",
        paraNumber: 3,
        text: "Investigating Officer arrived on spot at 00:15 HRS and directed immediate cordon of hotel entry gates. CCTV surveillance hard drive of entrance camera was requisitioned from hotel manager.",
        isContradiction: true,
        contradictionType: "timeline-gap",
        contradictionNote: "FIR records requisition at 00:15 HRS, but Hotel Manager deposition states IO arrived at 02:30 HRS.",
        statuteRef: "BNSS Sec 173(1)",
      },
      {
        id: "fir-p4",
        paraNumber: 4,
        text: "Seizure memo records the DVR drive was placed into police custody bag without contemporaneous digital videography due to low light battery failure on police mobile device.",
        isContradiction: true,
        contradictionType: "custody-defect",
        contradictionNote: "Fatal non-compliance with BNSS Sec 105 mandatory videography of search and seizure.",
        statuteRef: "BNSS Sec 105",
      },
    ],
  },
  {
    id: "doc-chargesheet",
    title: "Charge Sheet & Panchnama",
    documentType: "charge-sheet",
    badgeText: "BNSS Sec 193",
    badgeVariant: "secondary",
    filingDate: "28 Sep 2026",
    officerOrBench: "ACP Crime Branch, Mumbai",
    summary:
      "Final police investigation report under Section 193 BNSS consolidating spot recovery, witness statements, and forensic cross-links.",
    paragraphs: [
      {
        id: "cs-p1",
        paraNumber: 1,
        text: "Accused Arjun Sharma was apprehended at Bandra residence on 15th August 2026. Blood sample and vehicle tires seized under recovery Panchnama Vol. I.",
      },
      {
        id: "cs-p2",
        paraNumber: 2,
        text: "Prosecution relies on digital correlation between Colaba junction CCTV logs and accused cellular tower handshakes between 23:14 and 23:45 HRS.",
      },
      {
        id: "cs-p3",
        paraNumber: 3,
        text: "Paragraph 4 states CCTV was seized at 21:30 HRS on 14th August, whereas Panchnama records seizure at 23:15 HRS without a contemporaneous BSA Sec 63(4) hash certificate.",
        isContradiction: true,
        contradictionType: "hash-delay",
        contradictionNote: "105-minute gap between seizure and inward lab stamping. Hash generated 48 hours later.",
        statuteRef: "BSA Sec 63(4)",
      },
      {
        id: "cs-p4",
        paraNumber: 4,
        text: "Section 180 BNSS statement of hotel manager corroborates presence of accused vehicle near parking lane at 23:10 HRS.",
      },
    ],
  },
  {
    id: "doc-ex-a",
    title: "Exhibit A: Hotel Lobby CCTV Footage Log",
    documentType: "digital-evidence",
    badgeText: "⚠️ BSA Sec 63(4) Hash Mismatch",
    badgeVariant: "destructive",
    filingDate: "16 Aug 2026",
    officerOrBench: "State Cyber Lab · SHA-256 Vault",
    summary:
      "Hard drive containing 4 hours of entrance gate video stream. Contested on admissibility due to 48-hour hash delay and missing certificate schedule.",
    paragraphs: [
      {
        id: "exa-p1",
        paraNumber: 1,
        text: "Device Description: Seagate Barracuda 2TB Hard Disk Drive Serial #WCAZ482910. Extracted from Hikvision 16-Channel NVR at Hotel Grand Bay.",
      },
      {
        id: "exa-p2",
        paraNumber: 2,
        text: "Extraction Hash computed on 16th August at 14:20 HRS: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (SHA-256).",
      },
      {
        id: "exa-p3",
        paraNumber: 3,
        text: "Certificate under Section 63(4) BSA produced on 28th August signed by Systems Administrator who was not present at the time of extraction.",
        isContradiction: true,
        contradictionType: "hash-delay",
        contradictionNote: "Signatory lacks lawful control under Arjun Panditrao Khotkar (2020) 7 SCC 1 ratio.",
        statuteRef: "BSA Sec 63(4)",
      },
    ],
  },
  {
    id: "doc-ex-b",
    title: "Exhibit B: Forensic Ballistics & DNA Report",
    documentType: "forensic-report",
    badgeText: "Forensic Analysis",
    badgeVariant: "outline",
    filingDate: "20 Aug 2026",
    officerOrBench: "Dr. K. Saxena · Civil Forensic Dept",
    summary:
      "Biological swab and impact fracture evaluation from vehicle bumper. Shows inconclusive blood antigen grouping.",
    paragraphs: [
      {
        id: "exb-p1",
        paraNumber: 1,
        text: "Microscopic evaluation of vehicle bumper scrapings revealed paint transfers consistent with street light bollard.",
      },
      {
        id: "exb-p2",
        paraNumber: 2,
        text: "DNA extraction from bonnet residue yielded degraded profile below match threshold. No foreign biological material confirmed.",
        isContradiction: true,
        contradictionType: "alibi-match",
        contradictionNote: "Directly weakens prosecution narrative of high-speed pedestrian impact.",
        statuteRef: "BSA Sec 39",
      },
    ],
  },
  {
    id: "doc-sec180",
    title: "Section 180 BNSS Police Statements",
    documentType: "deposition",
    badgeText: "Witness Statements",
    badgeVariant: "secondary",
    filingDate: "17 Aug 2026",
    officerOrBench: "IO Inspector V. Deshmukh",
    summary:
      "Recorded statements of PW-1 Dr. Rajesh Kulkarni, PW-2 Inspector Deshmukh, and DW-1 Meera Nair under Section 180 BNSS (Successor to CrPC 161).",
    paragraphs: [
      {
        id: "s180-p1",
        paraNumber: 1,
        text: "PW-1 Dr. Rajesh Kulkarni: 'I received the sealed parcel on Monday morning. The paper seal was intact, but there was no signature of the Executive Magistrate on the inner anti-static pouch.'",
      },
      {
        id: "s180-p2",
        paraNumber: 2,
        text: "DW-1 Meera Nair (Cafe Manager): 'Arjun Sharma was seated in our outdoor patio from 22:45 to 23:55 HRS reviewing business contracts on his iPad. He paid via UPI at 23:52 HRS.'",
        isContradiction: true,
        contradictionType: "alibi-match",
        contradictionNote: "Validates Section 11 BSA Plea of Alibi; directly contradicts toll CCTV departure timestamp.",
        statuteRef: "BSA Sec 11",
      },
    ],
  },
];

export const INITIAL_PINNED_FACTS: PinnedTrialFact[] = [
  {
    id: "pin-1",
    sourceDocId: "doc-chargesheet",
    sourceDocTitle: "Charge Sheet & Panchnama",
    paraNumber: 3,
    text: "105-minute unexplained gap between DVR seizure (21:30 HRS) and Panchnama entry (23:15 HRS).",
    annotation: "Key contradiction to impeach PW-2 (IO) on spot procedure.",
    statuteTag: "BNSS Sec 105",
    pinnedAt: "Today, 10:20 IST",
  },
  {
    id: "pin-2",
    sourceDocId: "doc-ex-a",
    sourceDocTitle: "Exhibit A: Hotel Lobby CCTV Footage Log",
    paraNumber: 3,
    text: "Section 63(4) BSA Certificate was signed on 28th August by an administrator not present during extraction.",
    annotation: "Absolute ground for evidence exclusion under Arjun Panditrao precedent.",
    statuteTag: "BSA Sec 63(4)",
    pinnedAt: "Today, 10:25 IST",
  },
  {
    id: "pin-3",
    sourceDocId: "doc-sec180",
    sourceDocTitle: "Section 180 BNSS Police Statements",
    paraNumber: 2,
    text: "DW-1 verified accused paid digital UPI bill at Colaba Cafe at 23:52 HRS.",
    annotation: "Substantive alibi establishing physical impossibility of being at Marine Drive.",
    statuteTag: "BSA Sec 11",
    pinnedAt: "Today, 10:28 IST",
  },
];

export const RETRIEVED_AUTHORITIES: RetrievedAuthority[] = [
  {
    id: "auth-1",
    title: "Bharatiya Sakshya Adhiniyam (BSA), 2023 - Section 63(4)",
    citation: "BSA (Act No. 47 of 2023) § 63(4)",
    legacyCitation: "Formerly IEA 1872 § 65B(4)",
    sourceType: "statutory",
    matchScore: 99,
    latencyMs: 12,
    court: "Parliament of India (Statutory Provision)",
    benchOrYear: "Enacted 2023 · In Force 2024",
    statuteCode: "BSA",
    statuteSection: "Sec 63(4)",
    statutorySnippet:
      "In any proceedings where it is desired to give a statement in evidence by virtue of this section, a certificate doing any of the following things, that is to say: identifying the electronic record and describing the manner in which it was produced... signed by a person occupying a responsible official position in relation to the operation of the relevant device shall be evidence of any matter stated in the certificate.",
    applicationToCase:
      "Exhibit A (CCTV Hard Drive) was certified by an external admin 12 days post-seizure. Fails the requirement of personal knowledge and official device custody.",
    isSavedToBrief: true,
  },
  {
    id: "auth-2",
    title: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal & Ors.",
    citation: "(2020) 7 SCC 1",
    legacyCitation: "Reaffirming Anvar P.V. (2014) 10 SCC 473",
    sourceType: "landmark-sc",
    matchScore: 94,
    latencyMs: 38,
    court: "Supreme Court of India",
    benchOrYear: "3-Judge Bench · Coram: R.F. Nariman, S. Ravindra Bhat, V. Ramasubramanian, JJ.",
    statuteCode: "BSA / IEA",
    statuteSection: "Sec 63(4) / 65B",
    statutorySnippet:
      "The certificate required under Section 65B(4) (now BSA Sec 63(4)) is a mandatory condition precedent to the admissibility of evidence by way of electronic record. Non-production of contemporaneous certificate fatally infects secondary electronic evidence.",
    applicationToCase:
      "Direct precedent binding on the Sessions Court to rule Exhibit A inadmissible if defense raises timely objection before marking.",
    isSavedToBrief: true,
  },
  {
    id: "auth-3",
    title: "State of Maharashtra v. Aniket Deshmukh (Bombay HC Digital Panchnama Ruling)",
    citation: "2025 SCC OnLine Bom 1142",
    sourceType: "firecrawl-web",
    matchScore: 89,
    latencyMs: 140,
    court: "High Court of Judicature at Bombay",
    benchOrYear: "Division Bench · Criminal Appeal No. 418/2024",
    statuteCode: "BNSS / BSA",
    statuteSection: "BNSS 105 & BSA 63",
    statutorySnippet:
      "Where digital evidence is seized without contemporaneous electronic hash generation and without videography under Section 105 BNSS, the presumption of authenticity is negated. Delay of over 24 hours in computing SHA hash creates reasonable doubt.",
    applicationToCase:
      "Identical factual matrix: 48-hour delay in SHA-256 hash calculation at State Cyber Lab destroys evidentiary integrity.",
    isSavedToBrief: true,
    webSourceDomain: "livelaw.in & indiankanoon.org",
  },
];

export const INITIAL_TRIAL_BRIEF: TrialBriefState = {
  openingHooks: [
    {
      id: "hook-def-1",
      text: "“My Lord, this prosecution rests entirely on an unsealed hard drive whose hash was manufactured two days after seizure in clear breach of mandatory Section 63 BSA safeguards.”",
      role: "defense",
    },
    {
      id: "hook-def-2",
      text: "“The defense will demonstrate through DW-1 and digital transaction logs that the accused was enjoying coffee at Colaba Cafe at the exact minute the tragedy occurred.”",
      role: "defense",
    },
    {
      id: "hook-pros-1",
      text: "“My Lord, the electronic tower pings establish an unbroken chain of geographic presence that no delayed certificate can wipe away.”",
      role: "prosecution",
    },
  ],
  objectionTriggers: [
    {
      id: "obj-1",
      statute: "BSA Sec 63(4)",
      condition: "Trigger instant objection if Public Prosecutor attempts to mark Exhibit A without calling the certifying technician.",
    },
    {
      id: "obj-2",
      statute: "BNSS Sec 105",
      condition: "Move for adverse inference under Section 119 BSA regarding unrecorded search videography.",
    },
    {
      id: "obj-3",
      statute: "BSA Sec 142",
      condition: "Object to leading questions during prosecution examination-in-chief of PW-1 regarding hash integrity.",
    },
  ],
  savedPrecedents: RETRIEVED_AUTHORITIES,
  generatedTheory: {
    title: "Three-Pronged Defense Strategy: Chain-of-Custody Collapse & Alibi Corroboration",
    points: [
      "1. Threshold Admissibility Challenge: Move preliminary objection under Section 63(4) BSA citing Arjun Panditrao Khotkar (2020) 7 SCC 1 to exclude Exhibit A (Lobby CCTV) prior to marking.",
      "2. Impeach Police Panchnama: Exploit the 105-minute gap between seizure and inward log to establish evidence tampering and non-compliance with BNSS Sec 105 videography.",
      "3. Affirm Substantive Alibi: Examine DW-1 (Meera Nair) with authenticated UPI digital payment logs under Section 11 BSA, proving accused was seated 3.2 km away at 23:52 HRS.",
    ],
    generatedAt: "Generated via Groq Llama-3.3 70B RAG Synthesizer",
  },
};

export const WITNESS_PROFILES: Record<string, WitnessProfile> = {
  "pw-1": {
    id: "pw-1",
    code: "PW-1",
    name: "Dr. Rajesh Kulkarni",
    designation: "Senior Cyber Forensic Examiner, State Forensic Science Laboratory",
    roleType: "Prosecution / Hostile",
    riskLevel: "High",
    depositionConsistency: 82,
    composureLabel: "Calm / Defensive under hash timeline interrogation",
    composurePercent: 84,
    memoryScope: "Strictly scoped to Case ID #402 Forensic Evidence Bag #8",
    tasks: [
      {
        id: "task-pw1-1",
        text: "Emphasize the 105-minute gap between DVR seizure and hash generation.",
        completed: true,
      },
      {
        id: "task-pw1-2",
        text: "Refuse to speculate on events outside the Forensic Lab report (Exhibit B).",
        completed: true,
      },
      {
        id: "task-pw1-3",
        text: "If pressed on chain-of-custody, refer strictly to Panchnama Entry #4.",
        completed: true,
      },
      {
        id: "task-pw1-4",
        text: "Do not admit unsealed storage unless confronted with Malkhana register log.",
        completed: false,
      },
    ],
    responseStyle: "factual",
    predictedTraps: [
      {
        id: "trap-1",
        probability: 92,
        trapType: "Credibility Impeachment",
        opposingQuestion:
          "“Dr. Kulkarni, isn't it true you never physically inspected the hotel DVR server yourself, and relied entirely on an unverified pen-drive handed over by the Constable?”",
        vulnerability: "Violates BSA Sec 63(2) chain of custody and primary device integrity.",
        safePivotResponse:
          "“My examination was strictly confined to the forensic image received under seal in Memo #8. Transit custody is governed by the Investigating Officer's panchnama.”",
        isLocked: true,
      },
      {
        id: "trap-2",
        probability: 85,
        trapType: "Timeline Contradiction",
        opposingQuestion:
          "“Why does your lab inward register show 11:45 PM on 15th August when the Panchnama claims the drive arrived at 9:30 PM?”",
        vulnerability: "135-minute gap unaccounted for in malkhana transit.",
        safePivotResponse:
          "“The inward register logs the formal administrative receipt; physical transit and courier verification procedures precede register logging.”",
        isLocked: true,
      },
      {
        id: "trap-3",
        probability: 76,
        trapType: "Section 148 BSA Hostile Pressure",
        opposingQuestion:
          "“Answer yes or no: could an unsealed hard drive be manipulated during a 48-hour gap before SHA-256 hash computation?”",
        vulnerability: "Forces a damaging binary concession on hypothetical tampering.",
        safePivotResponse:
          "“As a forensic scientist, I do not answer hypothetical questions. I certify only that the hash generated on 16th August matches the image currently in the lab vault.”",
        isLocked: false,
      },
      {
        id: "trap-4",
        probability: 68,
        trapType: "Custody Chain Defect",
        opposingQuestion:
          "“Who held the secondary key to the evidence safe over the intervening weekend?”",
        vulnerability: "Absence of log book entry for laboratory vault access.",
        safePivotResponse:
          "“Vault protocols are governed by the Laboratory Superintendent per standard operating manual, not individual examiners.”",
        isLocked: false,
      },
    ],
    dryRunMessages: [
      {
        id: "m-1",
        sender: "counsel",
        speakerName: "Adv. Kamal Nayan (Counsel)",
        message:
          "Dr. Kulkarni, if the opposing prosecutor asks you why you waited 48 hours to generate the SHA-256 hash, how will you respond?",
        timestamp: "10:32 IST",
      },
      {
        id: "m-2",
        sender: "witness",
        speakerName: "Dr. Rajesh Kulkarni (PW-1 AI)",
        message:
          "“Counsel, I will state that the drive was received after hours on Friday. The forensic write-blocker imaging was scheduled for Monday morning per lab queue protocols, ensuring no data degradation occurred.”",
        timestamp: "10:32 IST",
        resilienceScore: 92,
        guardrailTriggered: "Guardrail #2 (Refuse speculation outside lab report)",
      },
    ],
  },
  "dw-1": {
    id: "dw-1",
    code: "DW-1",
    name: "Meera Nair",
    designation: "Manager, The Colaba Coffee House, Colaba Causeway",
    roleType: "Friendly Defense Witness",
    riskLevel: "Medium",
    depositionConsistency: 96,
    composureLabel: "Steady / Highly credible business professional",
    composurePercent: 91,
    memoryScope: "Strictly scoped to Cafe floor events and Point-of-Sale receipts between 22:00 and 00:30 HRS",
    tasks: [
      {
        id: "task-dw1-1",
        text: "Produce certified POS transaction register showing Arjun Sharma's payment at 23:52 HRS.",
        completed: true,
      },
      {
        id: "task-dw1-2",
        text: "Confirm accused was engaged in contract review on iPad and did not leave patio until midnight.",
        completed: true,
      },
      {
        id: "task-dw1-3",
        text: "Bring Section 63 BSA electronic certificate for the UPI merchant payment terminal.",
        completed: false,
      },
    ],
    responseStyle: "factual",
    predictedTraps: [
      {
        id: "trap-dw-1",
        probability: 88,
        trapType: "Credibility Impeachment",
        opposingQuestion:
          "“Ms. Nair, how many hundreds of patrons visited your cafe that night? Isn't it impossible to remember one specific customer weeks later?”",
        vulnerability: "Subjective memory frailty under hostile cross.",
        safePivotResponse:
          "“I remember Mr. Sharma specifically because he requested our Wi-Fi router password twice to download a large legal brief, and I personally validated his table bill.”",
        isLocked: true,
      },
      {
        id: "trap-dw-2",
        probability: 79,
        trapType: "Timeline Contradiction",
        opposingQuestion:
          "“Could someone else have paid with his phone while he slipped out for 30 minutes?”",
        vulnerability: "Alibi impersonation hypothesis.",
        safePivotResponse:
          "“No. He sat directly facing the checkout counter in the lighted patio area throughout that one-hour window.”",
        isLocked: true,
      },
    ],
    dryRunMessages: [
      {
        id: "m-dw-1",
        sender: "counsel",
        speakerName: "Adv. Kamal Nayan (Counsel)",
        message:
          "Meera, if the prosecutor suggests you are a personal friend of the accused fabricating an alibi, what will you tell the Bench?",
        timestamp: "10:35 IST",
      },
      {
        id: "m-dw-2",
        sender: "witness",
        speakerName: "Meera Nair (DW-1 AI)",
        message:
          "“My Lord, I had never met Mr. Sharma before that evening. My testimony is corroborated by automated merchant transaction records and CCTV timestamps that were verified by my bank.”",
        timestamp: "10:35 IST",
        resilienceScore: 96,
        guardrailTriggered: "Guardrail #1 (Anchor to merchant POS record)",
      },
    ],
  },
  "pw-2": {
    id: "pw-2",
    code: "PW-2",
    name: "Inspector Vikram Deshmukh",
    designation: "Investigating Officer, Colaba Police Station",
    roleType: "Police Investigating Officer",
    riskLevel: "High",
    depositionConsistency: 74,
    composureLabel: "Authoritative / Highly vulnerable on search videography non-compliance",
    composurePercent: 68,
    memoryScope: "Charge sheet #89/2026, spot panchnama, arrest memo, and station diary entries",
    tasks: [
      {
        id: "task-pw2-1",
        text: "Examine on failure to record digital videography of search under Section 105 BNSS.",
        completed: true,
      },
      {
        id: "task-pw2-2",
        text: "Cross on why the station diary entry for CDR requisition was delayed by 14 hours.",
        completed: true,
      },
      {
        id: "task-pw2-3",
        text: "Confront with independent panch witness concessions regarding unread panchnama signing.",
        completed: false,
      },
    ],
    responseStyle: "defensive",
    predictedTraps: [
      {
        id: "trap-pw2-1",
        probability: 95,
        trapType: "Custody Chain Defect",
        opposingQuestion:
          "“Inspector, did you comply with Section 105 BNSS mandatory digital videography when you seized the hard drive?”",
        vulnerability: "Complete statutory non-compliance.",
        safePivotResponse:
          "“Due to heavy rain and battery drainage on the departmental mobile device, videography could not be completed contemporaneously; physical panchnama was maintained.”",
        isLocked: true,
      },
    ],
    dryRunMessages: [
      {
        id: "m-pw2-1",
        sender: "counsel",
        speakerName: "Adv. Kamal Nayan (Counsel)",
        message:
          "Inspector Deshmukh, why was the hard disk stored in the police malkhana for 36 hours before being dispatched to the forensic lab?",
        timestamp: "10:38 IST",
      },
      {
        id: "m-pw2-2",
        sender: "witness",
        speakerName: "Inspector V. Deshmukh (PW-2 AI)",
        message:
          "“The seizure occurred late on a holiday eve. Transit to the State Cyber Lab requires official courier requisition and magistrate forwarding, which was processed on the next working morning.”",
        timestamp: "10:38 IST",
        resilienceScore: 78,
        guardrailTriggered: "Guardrail #3 (Bureaucratic procedural protocol justification)",
      },
    ],
  },
};
