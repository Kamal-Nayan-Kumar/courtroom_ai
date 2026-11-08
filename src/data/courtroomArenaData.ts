import {
  AgentPersona,
  ChronologyFact,
  CoCounselHintItem,
  CourtroomExhibit,
  ObjectionGround,
  PinnedPrecedent,
  PinnedStatute,
  TranscriptItem,
  WitnessProfile,
} from "../types/courtroomArena";

export const INITIAL_TRANSCRIPT: TranscriptItem[] = [
  {
    id: "turn-1",
    speaker: "Prosecutor",
    speakerRole: "prosecutor",
    content:
      "My Lord, the prosecution now relies on Exhibit A, the CCTV footage extracted from the Colaba Junction DVR. We submit this footage through witness PW-1 Dr. Kulkarni, who personally analyzed the secondary hash extract under Section 63 BSA.",
    timestamp: "10:14:05",
    citation: "Reliance: BSA Sec 63(2) · Production of Electronic Record",
    kind: "standard",
  },
  {
    id: "turn-2",
    speaker: "Witness",
    speakerRole: "witness",
    content:
      "Yes, My Lord. I received the pen-drive containing the MP4 export from the investigating officer and performed a SHA-256 cryptographic checksum matching the optical hash.",
    timestamp: "10:14:21",
    citation: "Deposition Vol. II, Para 14 · Lab Inward Entry #108",
    kind: "witness",
  },
  {
    id: "turn-3",
    speaker: "Defense",
    speakerRole: "defense",
    content:
      "Dr. Kulkarni, look at Station Diary Entry #42 and IO Patil's seizure memo. The DVR was seized at 21:30 HRS, but your inward register logs receipt at 23:15 HRS. Where was this unsealed pen-drive during that unexplained 105-minute gap?",
    timestamp: "10:14:48",
    citation: "FIR Diary Entry #42 vs. Seizure Memo #89",
    kind: "standard",
  },
  {
    id: "turn-4",
    speaker: "Prosecutor",
    speakerRole: "prosecutor",
    content:
      "⚡ OBJECTION! My Lord, learned Defense Counsel is badgering the expert witness on clerical Panchnama entries already annexed and verified by the investigating agency.",
    timestamp: "10:15:02",
    citation: "Objection raised under Sec 151 BSA · Argumentative Badgering",
    kind: "objection",
  },
  {
    id: "turn-5",
    speaker: "Judge",
    speakerRole: "judge",
    content:
      "OBJECTION OVERRULED. The chain of digital custody under Section 63 BSA goes to the root of admissibility. Witness PW-1 is directed to answer the question.",
    timestamp: "10:15:14",
    citation: "Ruling: Admissibility Threshold · Arjun Panditrao Khotkar (2020)",
    kind: "ruling",
  },
  {
    id: "turn-6",
    speaker: "Witness",
    speakerRole: "witness",
    content:
      "My Lord, I... I only verified the hash value after the pen-drive reached the Kalina lab at 11:45 PM. The drive was transported in a standard police envelope without an independent electronic tamper-evident seal...",
    timestamp: "10:15:32",
    citation: "Deposition Concession · Vulnerability Triggered",
    kind: "witness",
  },
];

export const INITIAL_EXHIBITS: CourtroomExhibit[] = [
  {
    id: "ex-a",
    code: "Ex-A",
    label: "Exhibit A",
    name: "Hotel CCTV DVR & Hash Log (Colaba Junction)",
    type: "Digital Media / Video Extract",
    admissibility: "Contested",
    statuteWarning: "BSA Sec 63(4) Certificate Defect · 48h unsealed gap",
    timestamp: "21:30 HRS (Incident Date)",
    source: "Colaba Junction Surveillance Server 4",
    description:
      "High-definition video export showing alleged vehicle transit. Secondary media produced without accompanying magistrate-verified contemporaneous hash seal.",
  },
  {
    id: "ex-b",
    code: "Ex-B",
    label: "Exhibit B",
    name: "Cellular CDR & Tower Locational Matrix",
    type: "Telecom Data Log",
    admissibility: "Admitted",
    statuteWarning: "Section 63(4) Nodal Certificate Annexed",
    timestamp: "23:14 IST Handshake",
    source: "Bharti Airtel Telecom Nodal Division",
    description:
      "Call detail records and cellular tower triangulation matrix indicating mobile handset presence within 1.2km radius of incident zone.",
  },
  {
    id: "ex-c",
    code: "Ex-C",
    label: "Exhibit C",
    name: "Chemical Analysis & Post-Mortem Forensic Report",
    type: "Forensic Medico-Legal Document",
    admissibility: "Admitted",
    timestamp: "04:30 HRS (Post-Mortem)",
    source: "Dr. K. Saxena, Civil Hospital Mortuary",
    description:
      "Medico-legal autopsy recording time of death between 22:00 and 22:30 HRS. Toxicology findings negative for narcotic contamination.",
  },
  {
    id: "ex-d",
    code: "Ex-D",
    label: "Exhibit D",
    name: "Spot Panchnama & Seizure Memo #89",
    type: "Investigative Police Record",
    admissibility: "Contested",
    statuteWarning: "BNSS Sec 105 Audio-Video Non-Compliance",
    timestamp: "23:15 HRS",
    source: "IO Patil, Colaba Police Station",
    description:
      "Handwritten spot inspection memo containing unexplained 105-minute timestamp variance and missing panchas signatures on page 3.",
  },
];

export const CHRONOLOGY_FACTS: ChronologyFact[] = [
  {
    id: "fact-1",
    time: "21:30 HRS",
    title: "Alleged Arrival of Vehicle MH-01-EA-402",
    description: "FIR records accused vehicle approaching junction near Marine Drive.",
    discrepancy: "CCTV frame timestamp mismatch: Municipal streetlight circuit log confirms sector power was off until 21:45 HRS.",
    isDiscrepancy: true,
    sectionRef: "FIR Colaba #89/2026",
  },
  {
    id: "fact-2",
    time: "22:15 HRS",
    title: "First Emergency Call Logged at 112 Control Room",
    description: "Witness PW-2 called emergency services reporting disturbance.",
    isDiscrepancy: false,
    sectionRef: "Police Station Diary Entry #42",
  },
  {
    id: "fact-3",
    time: "23:15 HRS",
    title: "Seizure Memo Signed by IO Patil",
    description: "Police seized optical storage media and pen-drive from premises.",
    discrepancy: "105-minute gap between physical recovery (21:30 HRS) and formal seizure sealing (23:15 HRS). Chain of custody unaccounted.",
    isDiscrepancy: true,
    sectionRef: "BNSS Sec 173 Charge Sheet Page 14",
  },
  {
    id: "fact-4",
    time: "23:42 HRS",
    title: "Cellular Handshake on Marine Drive Sector 3",
    description: "Airtel tower log places accused handset in general precinct.",
    isDiscrepancy: false,
    sectionRef: "Exhibit B · CDR Annexure 2",
  },
  {
    id: "fact-5",
    time: "11:45 HRS (+1d)",
    title: "Unsealed Pen-Drive Inward at Kalina Forensic Lab",
    description: "PW-1 Dr. Kulkarni logs receipt of optical media for SHA-256 analysis.",
    discrepancy: "Arrived in paper packet without magistrate wax seal or contemporaneous cryptographic hash certificate.",
    isDiscrepancy: true,
    sectionRef: "Forensic Inward Register Entry #108",
  },
];

export const PINNED_STATUTES: PinnedStatute[] = [
  {
    code: "BSA",
    section: "Sec 63(4)",
    title: "Electronic Record Admissibility & Hash Certificate",
    summary:
      "Mandates a contemporaneous certificate signed by the person in lawful control of the device confirming source authenticity and integrity.",
    badgeColor: "bg-blue-50 text-blue-900 border-blue-200",
  },
  {
    code: "BNS",
    section: "Sec 103(1)",
    title: "Punishment for Murder (Legacy IPC 302)",
    summary:
      "Prosecution must prove intentional causation of death beyond reasonable doubt. Circumstantial links require complete unbroken chain.",
    badgeColor: "bg-rose-50 text-rose-900 border-rose-200",
  },
  {
    code: "BSA",
    section: "Sec 11",
    title: "Plea of Alibi (Legacy IEA 11)",
    summary:
      "Facts not otherwise relevant are relevant if they are inconsistent with any fact in issue or make the existence of any fact highly improbable.",
    badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
  },
  {
    code: "BNSS",
    section: "Sec 105",
    title: "Mandatory Videography during Search and Seizure",
    summary:
      "Mandates that the process of conducting search of a place or seizure of any property shall be recorded through audio-video electronic means.",
    badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
];

export const PINNED_PRECEDENTS: PinnedPrecedent[] = [
  {
    id: "prec-1",
    citation: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal (2020) 7 SCC 1",
    court: "Supreme Court of India (3-Judge Bench)",
    year: 2020,
    principle:
      "Certificate under Section 65B(4) (now BSA Sec 63(4)) is a condition precedent to the admissibility of electronic evidence in criminal trial.",
    application:
      "Direct authority to disqualify Exhibit A because the hash was computed post-seizure without the mandatory contemporaneous custodian certificate.",
  },
  {
    id: "prec-2",
    citation: "Sharad Birdhichand Sarda v. State of Maharashtra (1984) 4 SCC 116",
    court: "Supreme Court of India",
    year: 1984,
    principle:
      "The Panchsheel of circumstantial evidence: every link in the evidentiary chain must be firmly and unerringly established to exclude any hypothesis of innocence.",
    application:
      "Use to argue that the 105-minute gap in custody creates fatal reasonable doubt in a circumstantial prosecution.",
  },
];

export const WITNESS_ACTIVE_PROFILE: WitnessProfile = {
  name: "Dr. Rajesh Kulkarni",
  title: "PW-1 · Prosecution Forensic & Cyber Witness",
  designation: "Senior Cyber Forensic Examiner, State Forensic Science Lab, Kalina",
  oathStatus: "Under Oath (Cross-Examination in Progress)",
  composure: 74,
  composureLabel: "Pressured on Chain of Custody (Hash discrepancy)",
  keyVulnerability:
    "Admitted SHA-256 hash was generated 48 hours post-seizure in the lab vault without a contemporaneous hash sheet at the spot.",
  boundaryRules: [
    "Witness cannot speculate on police transit between junction and station.",
    "Witness must confirm whether physical optical port was sealed at seizure.",
    "Witness must concede if software hashing was done on cloned image or raw target.",
  ],
};

export const AGENT_PERSONAS: Record<string, AgentPersona> = {
  judge: {
    id: "judge",
    name: "Hon'ble Justice V. Gopalan",
    roleTitle: "Presiding Sessions Judge AI",
    court: "Courtroom No. 3 · Sessions Court, Greater Mumbai",
    temperament: "Strict Proceduralist & Statutory Stickler",
    liveThought:
      "Observing cross-examination · Evaluating BSA Sec 63 admissibility threshold · Monitoring chain of custody gaps",
    audioState: "listening",
    memoryTrace: [
      "Noted Prosecution's submission of Exhibit A under Sec 63(2).",
      "Heard Defense argument highlighting 105-minute Panchnama gap.",
      "Overruled Prosecutor's objection; ruled custody chain goes to root of admissibility.",
      "Awaiting witness explanation of missing tamper-evident seal.",
    ],
    legalFocus: "BSA Evidence Law, BNSS Procedures, Judicial Scrutiny",
    samplePhrase: "“Counsel, substantiate whether the hash seal was contemporaneous or an afterthought.”",
  },
  prosecutor: {
    id: "prosecutor",
    name: "Adv. M. Deshpande",
    roleTitle: "Public Prosecutor AI (State of Maharashtra)",
    court: "Directorate of Public Prosecutions",
    temperament: "Adversarial, High-Cadence & Quick to Object",
    liveThought:
      "Listening for leading questions and character attacks · Preparing to assert Section 117 statutory presumption",
    audioState: "listening",
    memoryTrace: [
      "Marked Exhibit A into evidence record.",
      "Objected to Defense questioning Panchnama timing as badgering (Overruled).",
      "Ready to object under BSA Sec 142 if Defense puts leading assertions without foundation.",
    ],
    legalFocus: "BNS Sec 103, Presumptions under BSA Sec 117, Witness Protection",
    samplePhrase: "“Objection, My Lord! The defense is cross-examining on administrative formalities already cured by lab inward.”",
  },
  witness: {
    id: "witness",
    name: "Dr. Rajesh Kulkarni (PW-1)",
    roleTitle: "Senior Cyber Forensic Examiner AI",
    court: "State Forensic Science Laboratory, Kalina",
    temperament: "Technical, Precise, Currently Rattled by Custody Gap",
    liveThought:
      "Anxious about admitting the pen-drive was stored in police cupboard without tamper-evident envelope before reaching lab.",
    audioState: "speaking",
    memoryTrace: [
      "Affirmed extracting SHA-256 hash in Kalina lab vault.",
      "Conceded drive arrived in standard brown envelope without magistrate seal.",
      "Composure dropped from 85% to 74% upon Panchnama timestamp challenge.",
    ],
    legalFocus: "Digital forensics, SHA-256 hash chains, Bit-stream cloning",
    samplePhrase: "“I... I verified the hash against the file header, but I cannot vouch for the physical storage prior to lab inward.”",
  },
  defense: {
    id: "defense",
    name: "Defense Counsel (You) & Adv. Saathi",
    roleTitle: "Lead Advocate & Co-Counsel AI Strategist",
    court: "Bar Council of Maharashtra & Goa",
    temperament: "Surgical, Evidentiary Focus, Strategic Impeachment",
    liveThought:
      "Preparing BSA Sec 63(4) fatal motion · Target: Exclude Exhibit A and break chain of circumstantial proof",
    audioState: "idle",
    memoryTrace: [
      "Pinned Arjun Panditrao Khotkar precedent.",
      "Cornered PW-1 on 105-minute gap.",
      "Received Co-Counsel whisper on missing contemporaneous hash sheet.",
    ],
    legalFocus: "BSA Sec 63(4), BNSS Sec 105, Cross-Examination & Impeachment",
    samplePhrase: "“PW-1 has conceded the absence of a contemporaneous seal. Exhibit A must be discarded.”",
  },
};

export const INITIAL_CO_COUNSEL_HINTS: CoCounselHintItem[] = [
  {
    id: "hint-1",
    badge: "Tactical Contradiction",
    title: "Vulnerability in PW-1 Hash Chain",
    whisper:
      "Counsel, PW-1 just admitted he received the DVR pen-drive from Constable Patil without a contemporaneous hash receipt. Press him under Section 63(4) BSA right now to render Exhibit A inadmissible.",
    suggestedAction:
      "Dr. Kulkarni, is it not true that without a contemporaneous spot hash receipt signed by the seizing officer under Section 63(4) BSA, you cannot eliminate the possibility of file tampering during the 105-minute transit?",
    statuteRef: "BSA Sec 63(4) r/w BNSS Sec 105",
    precedentRef: "Arjun Panditrao Khotkar (2020) 7 SCC 1",
  },
  {
    id: "hint-2",
    badge: "Alibi Defense Anchor",
    title: "Anchor Alibi under BSA Sec 11",
    whisper:
      "Exhibit B cellular sector handshake covers a wide 1.2km radius. Confront the witness with the accused's UPI digital transaction timestamped 23:52 HRS at Bandra to establish physical impossibility.",
    suggestedAction:
      "I put it to you that the cellular tower handshake is non-specific, whereas the verified UPI server log proves the accused was 14 kilometers away at 23:52 HRS.",
    statuteRef: "BSA Sec 11 (Plea of Alibi)",
  },
];

export const OBJECTION_GROUNDS: ObjectionGround[] = [
  {
    id: "obj-leading",
    label: "Leading Question on Direct",
    section: "Sec 146",
    act: "BSA",
    ruleExplanation:
      "A question suggesting the answer which the person putting it wishes or expects to receive cannot be asked in examination-in-chief without Court permission.",
    suggestedSpeech:
      "Objection, My Lord! Learned Prosecutor is leading their own witness under Section 146 BSA by supplying the factual answer directly in the question.",
  },
  {
    id: "obj-electronic",
    label: "Inadmissible Electronic Record",
    section: "Sec 63(4)",
    act: "BSA",
    ruleExplanation:
      "Secondary electronic records require strict contemporaneous certification from the person responsible for the management of the device.",
    suggestedSpeech:
      "Objection, My Lord! Exhibit A cannot be marked into evidence. No lawful Section 63(4) certificate has been produced by the device custodian.",
  },
  {
    id: "obj-hearsay",
    label: "Hearsay / Incompetent Witness",
    section: "Sec 60",
    act: "BSA",
    ruleExplanation:
      "Oral evidence must in all cases whatever be direct. Witness cannot testify to statements made out of court by third parties.",
    suggestedSpeech:
      "Objection, My Lord! The witness is testifying to what Constable Patil told him regarding the transit envelope. That is pure hearsay under Section 60 BSA.",
  },
  {
    id: "obj-badgering",
    label: "Badgering & Argumentative",
    section: "Sec 151",
    act: "BSA",
    ruleExplanation:
      "Questions intended to insult, annoy, or needlessly harass a witness are prohibited by the Presiding Judge.",
    suggestedSpeech:
      "Objection, My Lord! Opposing counsel is arguing legal conclusions rather than asking factual questions, violating Section 151 BSA.",
  },
  {
    id: "obj-relevance",
    label: "Irrelevant to Fact in Issue",
    section: "Sec 5",
    act: "BSA",
    ruleExplanation:
      "Evidence may be given only of facts in issue and of such other facts declared relevant under the Adhiniyam.",
    suggestedSpeech:
      "Objection, My Lord! The question regarding past administrative transfers of the witness has zero bearing on the facts in issue under Section 5 BSA.",
  },
];
