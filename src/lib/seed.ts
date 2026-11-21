import { db } from "./db";
import { embed, EMBED_DIM } from "./embed";

export interface SeedCase {
  id: string;
  title: string;
  category: string;
  court: string;
  charges: string;
  summary: string;
  /** Title prefix of the landmark judgment document this case is built on. */
  sourceDocTitle?: string;
  parties: Array<{
    side: string;
    name: string;
    role: string;
    persona: string;
    isWitness?: boolean;
    personality?: string;
  }>;
  evidence: Array<{
    label: string;
    title: string;
    description: string;
    content: string;
  }>;
  chunks: Array<{
    label: string;
    text: string;
  }>;
}

export const SEED_CASES: SeedCase[] = [
  // 1. Delhi Liquor Policy (2022) — Enriched Simulation Dossier
  {
    id: "delhi-liquor-2022",
    title: "State v. Arvind Kejriwal — 2022 Delhi Liquor Policy Case",
    category: "Criminal · Corruption",
    court: "Special Court (PMLA), Rouse Avenue Court, New Delhi / Supreme Court of India",
    charges: "Prevention of Corruption Act 1988 § 7, § 13(1)(d); PMLA 2002 § 3, § 4; Bharatiya Nyaya Sanhita § 61(2) Criminal Conspiracy",
    summary:
      "The Central Bureau of Investigation (CBI) and Directorate of Enforcement (ED) allege that the 2021-22 Delhi Excise Policy was formulated with deliberate loopholes to route a Rs. 100 Crore kickback from the 'South Group' liquor syndicate to political campaign funds. The policy replaced government vends with private retail, increased wholesale profit margins from 5% to 12%, and allegedly waived Rs. 144.36 Crores in licence fees under the pretext of COVID-19 relief. Arvind Kejriwal was arrested on 21 Mar 2024 following nine unheeded ED summons, marking the first arrest of a sitting Chief Minister. The Supreme Court granted historic interim bail for general election campaigning in May 2024, followed by regular bail in the ED and CBI proceedings in July and September 2024 on the grounds of pre-trial detention violating personal liberty under Article 21.",
    parties: [
      {
        side: "judge",
        name: "Hon'ble Justice V. Gopalan",
        role: "Special Judge (PMLA / CBI)",
        persona: "Measured, procedural, demands strict adherence to the Bharatiya Sakshya Adhiniyam and PMLA twin-condition jurisprudence. Rejects speculative political arguments.",
      },
      {
        side: "prosecution",
        name: "Special Public Prosecutor (ED & CBI)",
        role: "Senior Prosecution Counsel",
        persona: "Aggressive and forensic. Focuses on the money trail, Section 50 PMLA statements of approvers, kickback routing to Goa election campaigns, and the presumption under Section 24 PMLA.",
      },
      {
        side: "defense",
        name: "Senior Defense Counsel",
        role: "Lead Counsel for Accused",
        persona: "Tenacious and constitutionally anchored. Attacks the absence of actual cash recovery, challenges the credibility of coerced approver statements under Section 164 CrPC/BNSS, and highlights Section 63 BSA secondary electronic evidence defects.",
      },
      {
        side: "witness",
        name: "PW-1 · ED Investigating Officer",
        role: "Assistant Director & Lead IO (ED)",
        persona: "Investigating Officer defending the summons record, search panchnamas, and money flow chart.",
        isWitness: true,
        personality: "Formal, defensive about summons procedure and digital seizure memos. Cites case diary entries by date, but hesitates when pressed on the exact physical recovery of the alleged Rs. 100 Crore kickback.",
      },
      {
        side: "witness",
        name: "PW-2 · Nodal Telecom & Cyber Forensics Officer",
        role: "Nodal Officer & Electronic Evidence Custodian",
        persona: "Technical officer deposing on Call Detail Records (CDR), cell tower triangulation, and encrypted messaging data.",
        isWitness: true,
        personality: "Pedantic, technical about hash algorithms (SHA-256). Highly vulnerable when questioned on the contemporaneous Section 63(4) BSA certificate and chain of custody during hardware seizure.",
      },
      {
        side: "witness",
        name: "PW-3 · Dinesh Arora (Approver / Businessman)",
        role: "Co-Accused Turned State Approver",
        persona: "Restaurateur and key intermediary between political figures and liquor licensees who received judicial pardon in exchange for testimony.",
        isWitness: true,
        personality: "Nervous and defensive. Tends to stick strictly to his Section 50 PMLA confession. Concedes nothing voluntarily, but gets agitated when defense points out multiple contradictory earlier statements before he was granted pardon.",
      },
      {
        side: "witness",
        name: "DW-1 · Excise Department Official",
        role: "Deputy Commissioner (Excise)",
        persona: "Senior civil servant who participated in drafting the 2021-22 Excise Policy cabinet notes.",
        isWitness: true,
        personality: "Calm, bureaucratically precise about official file notations, Cabinet meetings, and LG approvals. Concedes that the 12% wholesale margin was finalized following group of ministers (GoM) recommendations, but denies any illicit kickback motive.",
      },
    ],
    evidence: [
      {
        label: "Exhibit A",
        title: "ED Summons & Non-Appearance Chronology Record",
        description: "Official record of nine consecutive summons issued under Section 50 PMLA between Oct 2023 and Mar 2024.",
        content: "Chronology of nine Section 50 PMLA summons issued to Arvind Kejriwal. Non-appearance justified in defense replies alleging political vendetta and vague inquiry scope. Arrest executed on 21 Mar 2024 at official residence following dismissal of interim protection by Delhi High Court.",
      },
      {
        label: "Exhibit B",
        title: "2021-22 Delhi Excise Policy Text & Cabinet Notes",
        description: "Official policy clauses governing retail zonal allocation, 12% wholesale profit margins, and fee waivers.",
        content: "Clauses 3.2 and 4.1 introduced 100% private retail distribution across 32 zones. Wholesaler profit margin increased from 5% to 12%, with prosecution alleging an unrecorded 6% kickback clause. Airport zone licence fee waiver of Rs. 144.36 Crores granted citing pandemic lockdowns.",
      },
      {
        label: "Exhibit C",
        title: "Judicial Bail Orders Trail (Trial Court to Supreme Court)",
        description: "Orders detailing interim campaign bail, High Court stay on release, and final regular bail orders.",
        content: "10 May 2024: Supreme Court grants unprecedented interim bail till 1 Jun 2024 for Lok Sabha campaigning. 20 Jun 2024: Trial Court (Special Judge Niyay Bind) grants regular bail citing lack of direct evidence. 21 Jun 2024: Delhi HC stays release without written order. 12 Jul 2024: SC grants interim bail in ED case, refers PMLA arrest power to larger bench. 13 Sep 2024: SC grants regular bail in CBI case after 176 days of custody.",
      },
      {
        label: "Exhibit D",
        title: "South Group Hawala Cash Ledger & Angadia Memos",
        description: "Seized handwritten ledger sheets and WhatsApp chats alleging transfer of Rs. 45 Crores to Goa election campaign.",
        content: "Recovery of informal angadia transaction slips from Mumbai and Chennai. Entries correspond to token currency note serial numbers allegedly used to disperse cash to survey vendors and volunteer organizers in Goa during the 2022 assembly elections.",
      },
      {
        label: "Exhibit E",
        title: "Digital Device Seizure Memo & Section 63 BSA Certificate",
        description: "Seizure record of 14 mobile handsets and optical clone forensic image reports.",
        content: "Seizure of mobile devices conducted on 21 Mar 2024. Prosecution alleges systematic device replacement and data wiping. Defense challenges the Section 63 BSA certificate for lack of cryptographically timestamped optical hashes generated contemporaneously at seizure.",
      },
      {
        label: "Exhibit F",
        title: "Section 50 PMLA Statement of Approver Dinesh Arora",
        description: "Confessional deposition recorded before Assistant Director (ED) under pardon.",
        content: "Statement details meetings between representatives of the 'South Group' liquor manufacturers and senior political intermediaries at a hotel in New Delhi. Describes transfer of advance kickback packets to ensure favorable wholesale license terms.",
      },
      {
        label: "Exhibit G",
        title: "CBI FIR No. RC0032022A0053 (Predicate Offence Record)",
        description: "Initial crime registration under Section 120B IPC and Section 7 of the Prevention of Corruption Act 1988.",
        content: "FIR registered by CBI on 17 Aug 2022 pursuant to inquiry referred by the Lieutenant Governor of Delhi. Alleges public servants entered into criminal conspiracy with private licensees to cause wrongful revenue loss to the exchequer.",
      },
    ],
    chunks: [
      {
        label: "BNS § 61(2)",
        text: "Criminal conspiracy: When two or more persons agree to do, or cause to be done an illegal act, or an act which is not illegal by illegal means, such an agreement is designated a criminal conspiracy. Punishable with the same punishment as if the offender had abetted such offence.",
      },
      {
        label: "BSA § 63",
        text: "Admissibility of electronic records: Any information contained in an electronic record which is printed on paper, stored, recorded or copied in optical or magnetic media shall be deemed to be also a document. Requires a certificate identifying the electronic record, describing the device, and certified by a person occupying an official responsible position in relation to the device.",
      },
      {
        label: "PMLA § 3",
        text: "Offence of money-laundering: Whosoever directly or indirectly attempts to indulge or knowingly assists or knowingly is a party or is actually involved in any process or activity connected with the proceeds of crime including its concealment, possession, acquisition or use and projecting or claiming it as untainted property shall be guilty of offence of money-laundering.",
      },
      {
        label: "PMLA § 45",
        text: "Twin conditions for bail: No person accused of an offence under PMLA shall be released on bail unless the Public Prosecutor has been given an opportunity to oppose, and where the Public Prosecutor opposes the application, the court is satisfied that there are reasonable grounds for believing that he is not guilty of such offence and that he is not likely to commit any offence while on bail.",
      },
      {
        label: "PMLA § 50",
        text: "Powers of authorities regarding summons, production of documents and giving evidence: All persons summoned are bound to attend and state the truth upon any subject respecting which they are examined. Statements made under Section 50 are judicial proceedings within the meaning of Sections 193 and 228 of the Indian Penal Code.",
      },
      {
        label: "BNSS § 35",
        text: "When police may arrest without warrant: Any police officer may arrest any person who commits a cognizable offence in their presence, or against whom credible information has been received of an offence punishable with imprisonment for a term which may be less than seven years, subject to recording reasons in writing regarding the necessity of arrest.",
      },
      {
        label: "BNSS § 187",
        text: "Procedure when investigation cannot be completed in twenty-four hours: Remand powers authorizing detention of accused in custody for a term not exceeding fifteen days on the whole, and beyond that in judicial custody up to sixty or ninety days depending on the gravity of the offence.",
      },
      {
        label: "Precedent: Sisodia v. ED (2024)",
        text: "Supreme Court held that statutory restrictions on bail under Section 45 of PMLA cannot eclipse or take precedence over the fundamental right to personal liberty and speedy trial guaranteed under Article 21 of the Constitution. Prolonged pre-trial detention without commencement of trial constitutes a ground for bail.",
      },
      {
        label: "Precedent: Vijay Madanlal (2022)",
        text: "Supreme Court three-judge bench upheld the constitutional validity of Section 45 PMLA twin conditions and Section 50 statements, but ruled that the existence of proceeds of crime generated from a scheduled predicate offence is an indispensable prerequisite for invoking PMLA prosecution.",
      },
      {
        label: "Case fact: Arrest & Summons",
        text: "Arvind Kejriwal was arrested on 21 March 2024 at his New Delhi residence by the Enforcement Directorate after nine summons issued between October 2023 and March 2024 were unheeded. He was the first sitting Chief Minister to be arrested in Indian history.",
      },
      {
        label: "Case fact: Supreme Court Campaign Bail",
        text: "On 10 May 2024, the Supreme Court granted interim bail to Arvind Kejriwal till 1 June 2024 specifically to participate in the general election campaign, directing him to surrender on 2 June 2024, which he complied with.",
      },
      {
        label: "Case fact: Trial Court Bail & HC Stay",
        text: "On 20 June 2024, Special Judge Niyay Bind of Rouse Avenue Court granted regular bail, observing that the ED failed to produce direct evidence of the Rs. 100 Crore kickback. The Delhi High Court stayed the release the next morning on 21 June 2024 before the certified bail order was uploaded.",
      },
      {
        label: "Case fact: CBI Arrest from Tihar",
        text: "On 26 June 2024, while still in judicial custody, the CBI formally arrested Kejriwal directly from Tihar Jail under the Prevention of Corruption Act, preventing his release despite subsequent Supreme Court interim relief in the ED proceedings on 12 July 2024.",
      },
      {
        label: "Case fact: Supreme Court Final Bail",
        text: "On 13 September 2024, the Supreme Court granted regular bail in the CBI case after more than five months of incarceration, holding that prolonged incarceration without trial cannot become punishment and that personal liberty under Article 21 remains sacrosanct.",
      },
      {
        label: "Case fact: Wholesale Margin Dispute",
        text: "The core controversy centres on the revision of the wholesale profit margin from 5% to 12% in the 2021-22 policy. The prosecution alleges that 6% of this 12% was earmarked as illicit kickback, whereas the defense contends it was benchmarked against retail operating overheads.",
      },
      {
        label: "Case fact: Goa Election Fund Trail",
        text: "The ED alleged that Rs. 45 Crores of the kickback was routed to Goa through informal hawala networks for election surveys, hoardings, and candidate expenditures. The defense countered that not a single rupee was directly recovered from Kejriwal or his family.",
      },
    ],
  },

  // 2. Electoral Bonds Case (2024) — Enriched Simulation Dossier
  {
    id: "electoral-bonds-2024",
    title: "Association for Democratic Reforms v. Union of India — Electoral Bonds Case",
    category: "Constitutional · Election Law",
    court: "Supreme Court of India, Five-Judge Constitution Bench (2024 INSC 113)",
    charges: "Constitution of India Art. 19(1)(a) Violation; Challenge to Electoral Bond Scheme 2018; Finance Act 2016 & 2017 amendments to Companies Act § 182, RPA § 29C, Income Tax Act § 13A",
    summary:
      "A unanimous five-judge Constitution Bench headed by Chief Justice of India D.Y. Chandrachud declared the Electoral Bond Scheme 2018 unconstitutional on the grounds that anonymous corporate and individual donations violate the citizen's fundamental right to information regarding political party funding under Article 19(1)(a). The Court invalidated consequential amendments made through the Finance Acts of 2016 and 2017 to the Representation of the People Act 1951, the Companies Act 2013 (which previously capped corporate political contributions at 7.5% of net profit), and the Income Tax Act 1961. The State Bank of India was directed to immediately halt bond issuance and disclose comprehensive buyer, donor, denomination, and recipient data including unique alpha-numeric serial numbers to the Election Commission of India for public publication.",
    parties: [
      {
        side: "judge",
        name: "Hon'ble Constitution Bench (CJI D.Y. Chandrachud)",
        role: "Chief Justice of India & Presiding Judge",
        persona: "Deeply constitutional, analytically rigorous. Applies the four-prong proportionality standard (legitimate goal, rational connection, necessity, and balancing). Probes donor anonymity vs transparency.",
      },
      {
        side: "prosecution",
        name: "Lead Counsel for Petitioners (ADR & CPI(M))",
        role: "Senior Advocate for Petitioners",
        persona: "Forcefully argues democratic transparency, voter rights under Article 19(1)(a), the risk of corporate state capture, and quid-pro-quo contracts disguised as anonymous campaign contributions.",
      },
      {
        side: "defense",
        name: "Attorney General / Solicitor General of India",
        role: "Lead Counsel for Union of India",
        persona: "Defends the scheme as a legitimate public policy measure to incentivize white banking transactions, eradicate illicit black money in elections, and safeguard donor privacy against political retribution.",
      },
      {
        side: "witness",
        name: "PW-1 · Election Commission Records Officer",
        role: "Principal Secretary (Political Party Expenditure)",
        persona: "Neutral constitutional officer producing statutory disclosure filings, audit reports, and past commission submissions.",
        isWitness: true,
        personality: "Strictly factual and formal. Relies on the 2019 ECI counter-affidavit that warned anonymous bonds would allow shell companies to pump unchecked money into elections.",
      },
      {
        side: "witness",
        name: "PW-2 · State Bank of India IT & Bond Custodian",
        role: "Chief General Manager (Digital Operations, SBI)",
        persona: "Technical banking officer deposing on internal bond serial numbers, KYC verification logs, and matching algorithms.",
        isWitness: true,
        personality: "Cautious and compliance-driven. Stresses that SBI maintained internal KYC compliance for all purchasers, but concedes that unique alpha-numeric serial numbers visible only under ultraviolet light tied purchasers to redemptions.",
      },
    ],
    evidence: [
      {
        label: "Exhibit A",
        title: "Electoral Bond Scheme 2018 Gazette Notification",
        description: "Ministry of Finance notification S.O. 85(E) dated 2 January 2018 introducing bearer promissory notes.",
        content: "Scheme allowed Indian citizens and incorporated entities to purchase bearer bonds in multiples of Rs. 1,000, Rs. 10,000, Rs. 1 Lakh, Rs. 10 Lakhs, and Rs. 1 Crore from designated SBI branches without disclosing beneficiary details. Bonds had a 15-day validity window.",
      },
      {
        label: "Exhibit B",
        title: "Statutory Amendments Trail (Finance Acts 2016 & 2017)",
        description: "Omnibus amendments passed as Money Bills amending Companies Act § 182, RPA § 29C, and IT Act § 13A.",
        content: "Removed the 7.5% net profit ceiling on corporate donations under Section 182 Companies Act, enabling loss-making and shell companies to donate unlimited funds. Amended Section 29C of Representation of the People Act 1951 to exempt political parties from reporting contributions made via electoral bonds.",
      },
      {
        label: "Exhibit C",
        title: "Constitution Bench Judgment (2024 INSC 113)",
        description: "Full text of the unanimous judgment authored by CJI Chandrachud and Justice Sanjiv Khanna.",
        content: "Declared the Electoral Bond Scheme unconstitutional. Held that political party contributions are directly relevant to democratic choice, and anonymity impairs the voter's right to evaluate candidate autonomy under Article 19(1)(a). Ordered SBI to furnish all bond transaction records.",
      },
      {
        label: "Exhibit D",
        title: "SBI Redemption Alpha-Numeric Matching Table",
        description: "Official transaction dataset submitted to Supreme Court matching bond buyers with recipient political parties.",
        content: "Tabulation revealing that over Rs. 16,518 Crores worth of bonds were purchased between 2018 and 2024. Cross-referencing alpha-numeric codes showed corporate entities purchased massive tranches coinciding with government procurement tenders, CBI/ED raids, and policy approvals.",
      },
      {
        label: "Exhibit E",
        title: "Reserve Bank of India (RBI) Dissent Memo (2017)",
        description: "Official internal communication from RBI Governor warning against bearer bonds.",
        content: "RBI expressed strong reservations stating that bearer bonds issued by commercial banks would erode the central bank's currency monopoly, encourage money laundering, and fail to curb black money if ownership could be transferred without audit trail.",
      },
      {
        label: "Exhibit F",
        title: "Election Commission of India Counter-Affidavit (2019)",
        description: "Sworn affidavit of ECI before the Supreme Court opposing bond anonymity.",
        content: "ECI warned the Court that the amendment to Section 182 of the Companies Act allowing unlimited donations by companies, including those newly incorporated or loss-making, would lead to the proliferation of shell companies set up solely for routing political money.",
      },
    ],
    chunks: [
      {
        label: "Constitution Art 19(1)(a)",
        text: "Freedom of speech and expression includes the voter's right to information about political funding and the sources of contributions to political parties. Anonymity in political funding directly obstructs the democratic process.",
      },
      {
        label: "Companies Act § 182",
        text: "Section 182 of the Companies Act 2013 originally prohibited companies from contributing more than 7.5% of their average net profits over the three preceding financial years. The 2017 Finance Act deleted this ceiling and removed the obligation to disclose specific party names in company accounts.",
      },
      {
        label: "RPA 1951 § 29C",
        text: "Section 29C of the Representation of the People Act 1951 requires the treasurer of every political party to prepare a report each year detailing contributions received in excess of twenty thousand rupees. The 2017 amendment created an express exception for contributions made through electoral bonds.",
      },
      {
        label: "Income Tax Act § 13A",
        text: "Section 13A of the Income Tax Act 1961 exempts voluntary contributions received by political parties from income tax, provided records are maintained of contributions exceeding twenty thousand rupees. Electoral bonds were exempted from record-keeping requirements.",
      },
      {
        label: "Proportionality Standard",
        text: "Under the four-prong proportionality test (Puttaswamy), a state measure restricting a fundamental right must: (1) serve a legitimate state goal; (2) be a suitable means with rational connection; (3) be the least restrictive alternative; and (4) balance the societal benefit against the degree of fundamental right infringement.",
      },
      {
        label: "Case fact: Bench Composition",
        text: "The five-judge Constitution Bench in 2024 INSC 113 comprised Chief Justice D.Y. Chandrachud, Justice Sanjiv Khanna, Justice B.R. Gavai, Justice J.B. Pardiwala, and Justice Manoj Misra.",
      },
      {
        label: "Case fact: Total Bond Volume",
        text: "Between the introduction of the scheme in 2018 and the judgment in February 2024, electoral bonds worth over Rs. 16,518 Crores were sold across 30 tranches, with the ruling national party receiving the majority share of total corporate donations.",
      },
      {
        label: "Case fact: SBI Disclosure Compliance",
        text: "The Supreme Court dismissed SBI's plea for extension of time until June 2024, directing disclosure of all unique alpha-numeric serial numbers by 12 March 2024 to enable the public to match donors with beneficiary political parties.",
      },
      {
        label: "Case fact: Shell Companies Risk",
        text: "The Supreme Court specifically observed that deleting the profit ceiling under Companies Act § 182 permitted loss-making and newly formed entities to donate hundreds of crores, converting corporate political contributions into conduits for round-tripping and illicit quid-pro-quo transactions.",
      },
      {
        label: "Case fact: Right to Privacy Rejection",
        text: "The Court rejected the Union's submission that donor privacy under Article 21 outweighed transparency, holding that donor privacy cannot protect corporate influence over public policy, though small individual donations might have privacy considerations.",
      },
    ],
  },

  // 3. Case 402: State of Maharashtra v. Arjun Sharma (Homicide & Electronic Evidence Trial)
  {
    id: "case-402",
    title: "State of Maharashtra vs. Arjun Sharma — Marine Drive Collision Trial",
    category: "Criminal · Forensic Evidence",
    court: "Courtroom No. 3 · Sessions Court, Greater Mumbai (SC Case No. 402/2026)",
    charges: "Bharatiya Nyaya Sanhita 2023 § 103(1) Murder, § 106 Causing Death by Negligence, § 61(2) Criminal Conspiracy; Bharatiya Sakshya Adhiniyam 2023 § 63",
    summary:
      "Arjun Sharma, a 28-year-old corporate executive, stands trial for an alleged fatal vehicular collision and altercation occurring at Marine Drive Junction, Mumbai at 23:42 HRS on 13 August 2026. The prosecution alleges that following a personal dispute at a nearby five-star hotel, the accused intentionally struck the victim with a luxury SUV (MH-01-EA-4902) and fled the scene. The prosecution case hinges heavily on secondary CCTV DVR footage seized from the hotel entrance and analyzed by forensic expert PW-1 Dr. Kulkarni. The defense contends complete factual misidentification, alleging the vehicle was stolen two hours prior to the incident, and mounts a rigorous challenge against the admissibility of the CCTV footage due to an unexplained 105-minute station diary custody gap and failure to produce a contemporaneous Section 63(4) BSA electronic certificate.",
    parties: [
      {
        side: "judge",
        name: "Hon'ble Sessions Judge S.R. Deshmukh",
        role: "Presiding Sessions Judge",
        persona: "Strict proceduralist with deep expertise in forensic evidence. Demands rigorous proof of digital chain of custody under Bharatiya Sakshya Adhiniyam Section 63 and search videography under BNSS Section 105.",
      },
      {
        side: "prosecution",
        name: "Special Public Prosecutor Adv. Ujjwal Salve",
        role: "Public Prosecutor",
        persona: "Tenacious and forensic. Relies on the eyewitness testimony of hotel security guard and CCTV hash matches, aggressively countering defense claims of device tampering.",
      },
      {
        side: "defense",
        name: "Defense Counsel Adv. Kamal Nayan",
        role: "Defense Advocate",
        persona: "Methodical and sharp on procedural defects. Focuses on the 105-minute station diary gap, missing Section 63(4) BSA certificate, and police failure to video-record the search under BNSS Section 105.",
      },
      {
        side: "witness",
        name: "PW-1 · Dr. Anil Kulkarni",
        role: "Forensic Digital Evidence Analyst",
        persona: "Forensic laboratory specialist who examined the CCTV pen-drive extract and generated the SHA-256 optical hash report.",
        isWitness: true,
        personality: "Formal, confident on laboratory testing, but becomes defensive when confronted with the station diary inward register discrepancy between the 21:30 seizure and 23:15 lab inward time.",
      },
      {
        side: "witness",
        name: "PW-2 · Sub-Inspector A. Patil",
        role: "Investigating Officer (PS Colaba)",
        persona: "Police officer who executed the spot panchnama and seized the hotel DVR.",
        isWitness: true,
        personality: "Defensive about police paperwork shortcuts. Admits that low mobile battery prevented video recording of the seizure memo.",
      },
    ],
    evidence: [
      {
        label: "Exhibit A",
        title: "Colaba Junction CCTV DVR & Pen-Drive Export",
        description: "MP4 video export of CCTV footage showing vehicle movements between 23:30 and 23:55 HRS on 13 Aug 2026.",
        content: "Secondary extract of surveillance video footage submitted in a sealed tamper-evident police pouch. Video depicts a dark SUV matching the general silhouette of the accused's vehicle departing the junction at high speed.",
      },
      {
        label: "Exhibit B",
        title: "Forensic Optical Hash Analysis Report (Lab Ref #108)",
        description: "State Forensic Science Laboratory cryptographic checksum certificate.",
        content: "SHA-256 hash report generated by PW-1 Dr. Kulkarni confirming that the digital video stream on the pen-drive matches the optical image captured at the hotel server. Certificate signed under Section 63 BSA.",
      },
      {
        label: "Exhibit C",
        title: "Police Station Diary Entry #42 (PS Colaba)",
        description: "Official station diary register documenting police movements on the night of the incident.",
        content: "Logs entry of IO Patil departing for the scene at 00:15 HRS, recording seizure of DVR at 21:30 HRS (a retrospective entry), creating an unexplained 105-minute custody gap before lab receipt at 23:15 HRS.",
      },
      {
        label: "Exhibit D",
        title: "Spot Panchnama & Search Memo #89",
        description: "Record of seizure of vehicle MH-01-EA-4902 abandoned 4 km away in Worli.",
        content: "Vehicle seized with front bumper damage. Panchnama notes failure to record search via mobile videography due to battery failure, directly challenging compliance with Section 105 BNSS.",
      },
      {
        label: "Exhibit E",
        title: "Medical Post-Mortem Report (JJ Hospital)",
        description: "Forensic autopsy report establishing cause of death of the victim.",
        content: "Autopsy establishes blunt force trauma and crush injuries consistent with high-velocity vehicular impact. Estimated time of death between 23:30 and 00:00 HRS on 13 August 2026.",
      },
    ],
    chunks: [
      {
        label: "BNS § 103(1)",
        text: "Punishment for murder: Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. Replaces Section 302 of the Indian Penal Code.",
      },
      {
        label: "BNS § 106",
        text: "Causing death by negligence: Whoever causes the death of any person by doing any rash or negligent act not amounting to culpable homicide shall be punished with imprisonment for a term which may extend to five years, and shall also be liable to fine.",
      },
      {
        label: "BSA § 63(4)",
        text: "Certificate condition for electronic evidence: Secondary evidence of electronic records is inadmissible unless accompanied by an official certificate signed by a person occupying a responsible official position in relation to the operation of the relevant device, identifying the record and describing the device.",
      },
      {
        label: "BNSS § 105",
        text: "Recording of search and seizure through audio-video electronic means: Search and seizure conducted by police shall be recorded through audio-video electronic means, preferably mobile phone, and the police officer shall prepare a list of all things seized and forward the recording to the Magistrate without delay.",
      },
      {
        label: "Precedent: Arjun Panditrao (2020)",
        text: "Supreme Court three-judge bench held that production of a certificate under Section 65B(4) Evidence Act (now Section 63(4) BSA) is a mandatory condition precedent for the admissibility of secondary electronic records. Failure to produce certificate renders electronic evidence inadmissible.",
      },
      {
        label: "Case fact: Custody Gap",
        text: "The Station Diary Entry #42 and Forensic Lab Inward Register reveal an unexplained 105-minute gap between the seizure of the unsealed DVR pen-drive and its formal deposit in the laboratory, raising reasonable doubt regarding evidence tampering.",
      },
      {
        label: "Case fact: Vehicle Theft Alibi",
        text: "The accused filed an online vehicle theft complaint at 21:45 HRS on the national police citizen portal, approximately two hours prior to the fatal collision, supporting the defense theory of vehicular theft.",
      },
    ],
  },
  // Landmark Supreme Court judgments — each links to its judgment document
  // in the RAG corpus so research retrieval can scope to that one judgment.
  {
    id: "kesavananda-1973",
    title: "Kesavananda Bharati Sripadagalvaru v. State of Kerala, AIR 1973 SC 1461: Article 368 and the Basic Structure Doctrine",
    category: "Constitutional Law - Fundamental Rights, Constitutional Amendment and Judicial Review",
    court: "Supreme Court of India, 13-Judge Constitution Bench; Writ Petition (Civil) No. 135 of 1970, decided 24 April 1973",
    charges: "No criminal charge: this is a petition under Article 32 of the Constitution of India (a constitutional writ jurisdiction, not a prosecution under the IPC/CrPC - no BNS/BNSS cross-reference is engaged). Kesavananda sought enforcement of fundamental rights under Articles 25, 26, 14, 19(1)(f) and 31 (the property provisions, Article 19(1)(f) and Article 31, were later omitted by the 44th Amendment, 1978) and a declaration that the Kerala Land Reforms Act, 1963 (Act 1 of 1964), as amended by Kerala Acts 35 of 1969 and 25 of 1971, was unconstitutional. The petition was amended to challenge the Constitution (Twenty-fourth, Twenty-fifth and Twenty-ninth Amendment) Acts, 1971-1972.",
    summary: "By a 7:6 majority in a 13-Judge Constitution Bench, the Supreme Court held that Parliament's constituent power under Article 368 is wide but cannot damage or destroy the basic structure or essential features of the Constitution, overruling I.C. Golak Nath v. State of Punjab. The Court upheld the Twenty-fourth and Twenty-ninth Amendments and much of the Twenty-fifth, while keeping Article 31C subject to judicial review of the required nexus with Articles 39(b) and (c). Separate opinions were delivered across the Bench, spanning Sikri C.J.'s structural limitation to Ray J.'s concluding argument that the amending power is wide and unfettered and the Preamble itself within reach; the cases were remitted to a Constitution Bench with the Twenty-sixth Amendment left for separate determination.",
    sourceDocTitle: "Kesavananda Bharati Sripadagalvaru v. State of Kerala",
    parties: [
      { side: "judge", name: "Chief Justice S.M. Sikri", role: "Presiding Judge and author of the leading opinion", persona: "Chairs the 13-Judge Bench and structures the reference around the true scope of Article 368 apart from Article 13(2). Expects counsel to argue from the text, structure and history of the Constitution rather than slogans; presses the State on its claim that democracy itself could be replaced, and the petitioner to identify a judicially manageable limit. Calm, orderly, impatient with repetition." },
      { side: "judge", name: "Justice H.R. Khanna", role: "Concurring Judge whose vote supplied the basic-structure majority", persona: "Careful, synthesis-driven judge who accepts that the Twenty-fourth, Twenty-fifth and Twenty-ninth Amendments can largely stand while insisting that the amending power has an implied limit. Asks both sides how a court would identify an essential feature without substituting judicial policy for parliamentary policy, and encourages counsel to reconcile Sankari Prasad with Golak Nath." },
      { side: "judge", name: "Justice A.N. Ray", role: "Dissenting Judge and author of the concluding opinion reproduced in the digest", persona: "Textualist; treats the amending power under Article 368 as wide and unfettered, reaching every provision including the Preamble, and denies inherent limitations. Challenges the petitioner to point to the words that restrict amendment, and probes whether basic structure is an external test. Cool, logical, short pointed questions." },
      { side: "judge", name: "Justice J.M. Shelat", role: "Concurring Judge on the Bench", persona: "Shares the Chief Justice's concern that fundamental rights were not meant to be playthings of a special majority. Focuses on the effect of Article 31C on judicial review and on whether the Ninth Schedule can immunise a law that damages core freedoms; asks counsel for concrete examples drawn from the Kerala Acts." },
      { side: "prosecution", name: "His Holiness Kesavananda Bharati Sripadagalvaru", role: "Petitioner (challenging party) in Writ Petition No. 135 of 1970", persona: "The religious head who filed the Article 32 petition; speaks respectfully but firmly about the mutt's freedoms of religion and property under Articles 25, 26, 14, 19(1)(f) and 31. In the simulation he opens for the challenging side and instructs counsel on what the land reform legislation meant for his institution." },
      { side: "prosecution", name: "Senior Counsel for the Petitioner", role: "Lead advocate for Kesavananda (role-based; counsel not named in the digest)", persona: "Argumentative and rapid; builds a reductio from the respondent's own claim that Parliament could abolish elections, urging that amend in Article 368 means improvement within the original instrument, not destruction. Relies on Mudholkar J.'s questions in Sajjan Singh, the Preamble's sovereign democratic republic, and the need to keep Article 31C subject to courts. Concedes the Twenty-fourth Amendment's validity but confines its effect." },
      { side: "defense", name: "State of Kerala (Respondent No. 1)", role: "Respondent defending the Kerala land reform legislation", persona: "Defends the Kerala Land Reforms Acts of 1963, 1969 and 1971 as agrarian reform, relying on Ninth Schedule entries 65 and 66 inserted by the Twenty-ninth Amendment and on Article 31B. Points to Kunjukutty Sahib and the Kerala High Court decision in V.N. Narayanan Nair as proof the legislation survived scrutiny; presses the practical consequences of invalidating reforms." },
      { side: "defense", name: "Union of India (Respondent No. 2)", role: "Respondent defending the constitutional amendments", persona: "Appears through the Attorney General (role-based; not named in the digest). Argues that the Twenty-fourth Amendment merely declared the true legal position and that the Twenty-fifth and Twenty-ninth Amendments implement Articles 39(b) and (c) and protect Ninth Schedule laws. Stresses parliamentary sovereignty and asks the Bench to leave the Twenty-sixth Amendment to a Constitution Bench." },
      { side: "defense", name: "H.M. Seervai", role: "Senior counsel for the respondent side (named in the judgment)", persona: "Technical and contrarian; presses the point recorded in the judgment that the body amending the Constitution under Article 368 is not Parliament, so Article 13(2) law reasoning is misplaced. Uses Sankari Prasad's ordinary-law/constituent-law distinction and warns against converting agrarian policy into a fundamental-rights question." },
      { side: "witness", name: "V.N. Narayanan Nair", role: "Affiant tied to the Kerala High Court litigation over the same Act", persona: "Record-focused affiant on the Kerala High Court decision that struck down sections of the Act.", isWitness: true, personality: "Low-key, record-focused. Examined on the Kerala High Court decision reported as V.N. Narayanan Nair v. State of Kerala, A.I.R. 1971 Kerala 98, in which sections of the Act were struck down, and on what changed once the Twenty-ninth Amendment placed the 1969 and 1971 Acts in the Ninth Schedule. Answers dates and sections, not constitutional theory." },
      { side: "witness", name: "Kunjukutty Sahib", role: "Affiant tied to the connected Supreme Court appeal", persona: "Affiant on the connected Supreme Court appeal and the sequence of litigation.", isWitness: true, personality: "Practical and slightly combative about delays. Examined on the Supreme Court judgment dated 26 April 1971 in Kunjukutty Sahib v. State of Kerala, [1972] S.C.C. 364, which upheld the Kerala High Court's majority; useful for the sequence of litigation and for testing whether the Ninth Schedule entry changed the subject matter of the challenge." },
      { side: "witness", name: "Land Records Officer, Kerala Land Reforms (role-based)", role: "Records witness for the statutory chronology", persona: "Bureaucratic records witness for the statutory chronology of the Kerala land reform Acts.", isWitness: true, personality: "Bureaucratic, precise about documents. Expected to testify, as a contention to be tested, to the identity of Act 1 of 1964, Act 35 of 1969 and Act 25 of 1971, the 7 August 1971 assent, and the two Ninth Schedule entries; counsel should use him for foundation only, not legal conclusions." }
    ],
    evidence: [
      { label: "P-1", title: "Original Article 32 petition in W.P. No. 135 of 1970", description: "Petition as filed and later amended, with the rule nisi and leave to urge additional grounds.", content: "Writ Petition No. 135 of 1970 was filed on 21 March 1970 under Article 32 of the Constitution by His Holiness Kesavananda Bharati Sripadagalvaru and others. He sought enforcement of fundamental rights under Articles 25, 26, 14, 19(1)(f) and 31 and prayed that the Kerala Land Reforms Act, 1963 (Act 1 of 1964), as amended by the Kerala Land Reforms (Amendment) Act, 1969 (Act 35 of 1969), be declared unconstitutional, ultra vires and void, together with an interim order. The Court issued rule nisi on 25 March 1970. During pendency the Kerala Land Reforms (Amendment) Act, 1971 (Act 25 of 1971) received the President's assent on 7 August 1971, and the petitioner sought leave to urge additional grounds. Leave was granted on 10 August 1972, notices went to the Advocates-General, and the matter eventually reached a larger Bench because the validity of the Twenty-fourth, Twenty-fifth and Twenty-ninth Amendments had to be decided." },
      { label: "P-2", title: "Kerala land reform statutes and the connected litigation", description: "The three statutes and the High Court and Supreme Court decisions that preceded the reference.", content: "The challenge was aimed at the Kerala Land Reforms Act, 1963 (Act 1 of 1964) as amended by Act 35 of 1969; a further amending Act, 25 of 1971, was assented to on 7 August 1971 while the writ was pending. The judgment records that on 26 April 1971 the Supreme Court in Kunjukutty Sahib v. State of Kerala, [1972] S.C.C. 364, upheld the majority judgment of the Kerala High Court in V.N. Narayanan Nair v. State of Kerala, A.I.R. 1971 Kerala 98, whereby certain sections of the Act had been struck down. Counsel can use this chain to show that the State was legislating against a background of successful challenges, and the petitioner can argue that the later constitutional amendments were a response to those adverse decisions. The State will contend the amendments merely confirmed protection already available." },
      { label: "P-3", title: "Article 31C inserted by the Twenty-fifth Amendment", description: "The immunity for laws implementing Articles 39(b) and (c), and the judicial-review counter-argument.", content: "Section 3 of the Constitution (Twenty-fifth Amendment) Act inserted Article 31C, giving laws made to give effect to the State's policy towards the principles specified in Article 39(b) or (c) immunity from challenge under Articles 14, 19 and 31, and purporting to make a legislative declaration conclusive. Section 2 substituted the word amount for compensation in Article 31(2) and inserted Articles 31(2A) and 31(2B). The Chief Justice records the petitioners' contention that if Article 31C is valid, Parliament and the State Legislatures, not the Constitution, will determine how much freedom is good for citizens. The concluding opinion in the digest holds Section 3 valid but insists that courts may test whether there is a direct and reasonable nexus between the law and Article 39(b) or (c); absent such nexus the immunity does not attach." },
      { label: "R-1", title: "Twenty-fourth Amendment: Article 368(1) and Article 13(4)", description: "The express conferral of constituent power and the petitioners' recorded concession.", content: "The Constitution (Twenty-fourth Amendment) Act, 1971 expressly placed the power to amend in Article 368 and added Article 13(4), providing that nothing in Article 13 shall apply to any amendment made under Article 368. Sikri C.J. records that the petitioners concede the Amendment is valid insofar as it transfers the amending power from the residuary entry (Entry 97, List I) read with Article 248 to Article 368; he therefore does not decide the first conclusion in Golak Nath. The State relies on the Amendment to say Article 13(2) no longer restricts constituent power. The surviving question, as the Chief Justice frames it, is the extent of the power conferred by Article 368 apart from Article 13(2): whether amendment permits destruction of the Constitution's essential features." },
      { label: "R-2", title: "Twenty-ninth Amendment: Ninth Schedule entries 65 and 66", description: "The two Kerala Acts placed in the Ninth Schedule and the Article 31B argument.", content: "The Constitution (Twenty-ninth Amendment) Act inserted two Kerala statutes into the Ninth Schedule: entry 65, the Kerala Land Reforms (Amendment) Act, 1969 (Kerala Act 35 of 1969), and entry 66, the Kerala Land Reforms (Amendment) Act, 1971 (Kerala Act 25 of 1971). The State relies on Article 31B, which gives Acts in the Ninth Schedule immunity even where Article 31A does not apply. The concluding opinion in the digest rejects the argument that every Ninth Schedule entry must satisfy Article 31A, observing that such a reading would make Article 31B redundant, and upholds the Twenty-ninth Amendment. The petitioner's answer should be that schedule immunity cannot cure an amendment that damages basic features, and that Article 31B must be read with the limits on the amending power." },
      { label: "J-1", title: "The Chief Justice's framing of the reference and the six petitions", description: "Sikri C.J.'s account of what the larger Bench was really asked to decide.", content: "Sikri C.J. begins by noting that all six writ petitions raise common questions about the validity of the Twenty-fourth, Twenty-fifth and Twenty-ninth Amendments. After the Constitutional Bench referred the matter, a larger Bench was constituted and it was felt necessary to decide whether I.C. Golak Nath v. State of Punjab, [1967] 2 S.C.R. 762, was rightly decided; the Chief Justice says the deeper issue is the extent of Parliament's power under Article 368 apart from Article 13(2). He records the respondents' extreme claim that Parliament could abrogate speech, association and religion and even replace democracy with one-party rule, and the petitioners' answer that the Constitution conferred freedoms to subsist for ever. He insists the answer must come from interpreting the words of Article 368 as part of a Constitution given by the people to themselves, in the light of the Preamble's vision, fundamental rights and directive principles." },
      { label: "J-2", title: "Disposition, remittal and the range of separate opinions", description: "The conclusions recorded at the close of the judgment and the order that followed.", content: "The concluding opinion reproduced in the digest states conclusions supporting the Twenty-fourth Amendment as a declaration of the true legal position, upholding Section 2(a) and 2(b) of the Twenty-fifth Amendment while preserving judicial scrutiny where compensation is illusory, the stated principles are irrelevant, power is used for a collateral purpose, another constitutional principle (such as Article 19(1)(f), expressly excepted by Article 31(2B)) is offended, or the law is a fraud on the Constitution. It upholds Article 31C subject to a direct and reasonable nexus test under Article 39(b) or (c), and upholds the Twenty-ninth Amendment under Article 31B. The order directs that each party bear its own costs, that a Constitution Bench determine the validity of the Twenty-sixth Amendment, and that the cases be remitted to the Constitution Bench with no order as to costs up to that stage. Treat these conclusions as the dissenting thread on inherent limitations; the 7:6 majority holds the opposite." }
    ],
    chunks: [
      { label: "Factual background and procedural path", text: "The lead petition, W.P.(C) 135 of 1970, was filed on 21 March 1970 under Article 32 by Kesavananda Bharati, styled His Holiness in the judgment, against the State of Kerala. He asked the Court to declare the Kerala Land Reforms Act, 1963, as amended in 1969, void because it infringed Articles 25, 26, 14, 19(1)(f) and 31. Rule nisi issued on 25 March 1970. The Kerala Land Reforms (Amendment) Act, 1971 received assent on 7 August 1971 and the petition was amended accordingly. A connected Supreme Court decision, Kunjukutty Sahib v. State of Kerala (26 April 1971), had already upheld the Kerala High Court's decision in V.N. Narayanan Nair, where some sections were struck down. The Court allowed further grounds on 10 August 1972, notices issued to Advocates-General, and a Constitutional Bench reference produced the 13-Judge Bench that heard six petitions together. The amendments were inserted into the Ninth Schedule while the challenge was pending." },
      { label: "Constitutional provisions in issue", text: "The provisions in play are Article 32 (the writ jurisdiction invoked), Articles 25 and 26 (religion and religious institutions), Articles 14 and 19(1)(f) (equality and the then property right) and Article 31 (compulsory acquisition and compensation as it then stood). Articles 19(1)(f) and 31 were removed by the 44th Amendment, 1978, but were live provisions in 1970-73. Article 13(2) forbade the State from making laws abridging fundamental rights; the Twenty-fourth Amendment added Article 13(4) to exempt amendments under Article 368. Article 368, originally procedural, was amended to confer express constituent power. The Twenty-fifth Amendment substituted amount for compensation in Article 31(2), added Articles 31(2A) and 31(2B), and inserted Article 31C protecting laws implementing Article 39(b) or (c) from Articles 14, 19 and 31. The Twenty-ninth Amendment added Ninth Schedule entries 65 and 66 for the two Kerala Acts, engaging Article 31B." },
      { label: "Sankari Prasad and Sajjan Singh", text: "In Sri Sankari Prasad Singh Deo v. Union of India, [1952] S.C.R. 89, the Court upheld the First Amendment, which introduced Articles 31A and 31B. Patanjali Sastri J. held that the provisional Parliament could amend under Article 379; that Article 368 was a complete code as to procedure; and that law in Article 13 meant ordinary law made in exercise of legislative power, not constitutional amendment made in exercise of constituent power, so Article 13(2) did not affect amendments. Hidayatullah J. and Mudholkar J. doubted that reasoning while agreeing the petition failed. Mudholkar J. asked whether changing a basic feature would be amendment or rewriting, and whether, while the Preamble says sovereign democratic republic, democracy or republic could be abolished. In Sajjan Singh v. State of Rajasthan, [1965] 1 S.C.R. 933, Gajendragadkar C.J. upheld the Seventeenth Amendment, saying Article 368 allowed amendment of Part III without the proviso and that fundamental rights were not eternal and inviolate; Hidayatullah J. warned that Part III was not a plaything of a special majority." },
      { label: "Golak Nath and prospective overruling", text: "I.C. Golak Nath v. State of Punjab, [1967] 2 S.C.R. 762, struck a different note. Subba Rao C.J., for himself and four judges, held that the amending power came from Articles 245, 246 and 248 with Entry 97 of List I, not Article 368 (which only supplied procedure); that an amendment was law under Article 13 and void if it abridged Part III; that the First, Fourth and Seventeenth Amendments had abridged rights but were valid on earlier authority; that prospective overruling preserved them; that thereafter Parliament could not amend Part III to take away fundamental rights; and that the Punjab and Mysore land laws were valid. Hidayatullah J. would have required a Constituent body for abridgement; Wanchoo J. thought Sankari Prasad correctly decided. Sikri C.J. in Kesavananda notes that the first conclusion did not survive because the Twenty-fourth Amendment's validity was conceded, and says he need not decide the second because the same result follows even assuming amendments are not law." },
      { label: "Issues framed before the larger Bench", text: "The larger Bench had to decide the validity of the Twenty-fourth, Twenty-fifth and Twenty-ninth Amendments and whether Golak Nath was rightly decided, but Sikri C.J. reframed the central question as the extent of the amending power conferred by Article 368 apart from Article 13(2). Sub-issues include the ordinary-law/constituent-law distinction; whether amend permits abrogation; the status of the Preamble; whether the Ninth Schedule and Article 31B validate the Kerala Acts; the scope of Article 31C's immunity and of judicial review of a declaration under it; and what test, if any, identifies a protected essential feature. Arguments over Constituent Assembly debates were pressed; Sikri C.J. cites A.K. Gopalan and State of Travancore, Cochin for the caution that individual speeches are not admissible to construe provisions, save limited use for latent ambiguity. Counsel should treat the debates as a restricted tool, not the main text." },
      { label: "Majority holding: the basic structure limitation", text: "By 7:6 the Bench held that Parliament's power under Article 368 is wide and may reach Part III, but cannot damage or destroy the basic structure or essential features of the Constitution; Golak Nath was overruled. The Twenty-fourth Amendment was upheld, and so was the Twenty-ninth, including the two Kerala Ninth Schedule entries. The Twenty-fifth Amendment was largely sustained: Article 31C's protection for laws giving effect to Article 39(b) and (c) survived, while the majority severed the device purporting to make the legislature's declaration conclusive and to oust court review; the concluding opinion in the digest likewise insists on a court's power to test nexus. The Court directed that the validity of the Twenty-sixth Amendment be determined by a Constitution Bench and remitted the cases, with no order as to costs. Separate opinions were delivered across the Bench: Sikri C.J. wrote the leading opinion, Khanna J. a pivotal concurrence, and Ray J. the opinion whose conclusions are reproduced here." },
      { label: "Dissenting opinion: Ray J.'s conclusions", text: "Ray J.'s concluding opinion, reproduced in the digest, is the clearest statement of the dissenting position. Its numbered conclusions say the leading majority in Golak Nath was wrong that Article 368 was merely procedural; wrong that there is no distinction between ordinary law and amendment; wrong that Article 13(2) reached amendments; and wrong that Parliament lacked power to abrogate fundamental rights. The amending power was wide and unfettered and reached every part of the Constitution; the Preamble is part of the Constitution and within its reach; and there are no inherent limitations preventing damage to essential features. The Twenty-fourth Amendment was valid as a declaration of the existing legal position; Section 2(a) and 2(b) of the Twenty-fifth were valid with narrow judicial checks; Article 31C was valid subject to a direct and reasonable nexus with Article 39(b) or (c); and the Twenty-ninth Amendment and Article 31B protection stood. Costs were left to each party." },
      { label: "Petitioner's advocacy angles", text: "For the petitioner, the strongest line is textual and structural: Article 368 speaks of amendment, which implies alteration within the existing instrument, not its destruction; a power to abolish elections or freedom of religion would be a power to rewrite, not amend. Use Mudholkar J.'s questions in Sajjan Singh about the Preamble's sovereign democratic republic. Emphasise that Article 31C makes Legislatures, not the Constitution, the judge of how much freedom citizens enjoy, and that a conclusive declaration ousts the Article 32 jurisdiction the petitioner invoked. Concede the Twenty-fourth Amendment's validity to keep credibility, but argue it cannot enlarge amend into destroy. Distinguish Sankari Prasad and Sajjan Singh as cases about whether rights were touched, not about whether core features could be annihilated. Treat Constituent Assembly debates with the caution Sikri C.J. recommends, and press for a manageable, judicially enforceable test rather than a purely political one." },
      { label: "Respondent's advocacy angles", text: "For the respondents, begin with text and history: Sankari Prasad and Sajjan Singh repeatedly held that Article 13(2) does not touch constituent power and that Article 368 permits amendment of Part III; the Twenty-fourth Amendment only made explicit what was always true, which Sikri C.J. records even the petitioners conceded in part. The Twenty-fifth Amendment implements the directive principles in Article 39(b) and (c), and the concluding opinion accepts that laws with a direct and reasonable nexus get immunity while courts retain limited scrutiny for illusory compensation, irrelevant principles, collateral purpose and fraud. The Twenty-ninth Amendment's Ninth Schedule entries are supported by Article 31B, which the closing opinion reads as independent of Article 31A since otherwise it would be redundant. Stress the agrarian-reform context and the chain of Kerala litigation; warn that an unwritten basic structure test would let judges override elected legislatures, and note that the Twenty-sixth Amendment was left to a separate Constitution Bench." }
    ]
  },
  {
    id: "adm-jabalpur-1976",
    title: "Additional District Magistrate, Jabalpur v. Shivakant Shukla, AIR 1976 SC 1207 — Habeas Corpus and Preventive Detention During the Emergency",
    category: "Constitutional · Habeas Corpus & Preventive Detention (Emergency)",
    court: "Supreme Court of India, Five-Judge Constitution Bench (AIR 1976 SC 1207; 1976 INSC 129); appeals from the High Courts of Allahabad, Bombay (Nagpur Bench), Delhi, Karnataka, Madhya Pradesh, Punjab and Rajasthan",
    charges: "Constitution of India Arts. 14, 19, 21, 22, 32, 226, 352, 358, 359(1) and 359(1A); Presidential Orders of 27 Jun 1975 and 8 Jan 1976; Maintenance of Internal Security Act 1971 §§ 3, 8-12, 16A(9), 18 (COFEPOSA 1974 in connected later litigation); 38th and 39th Constitution Amendment Acts; compared with CrPC §§ 41, 151 / BNSS §§ 35, 170 (ordinary arrest only)",
    summary: "During the Emergency proclaimed under Article 352 on 25 June 1975, with the 3 December 1971 proclamation still in force, the President suspended enforcement of Articles 14, 21 and 22 by order dated 27 June 1975; detenus held under MISA section 3 nevertheless obtained habeas corpus from seven High Courts, and the State appealed. By a 4:1 majority (Ray C.J., Beg, Bhagwati and Y.V. Chandrachud JJ.), the Supreme Court held that no person had locus standi under Article 226 to challenge a detention order as illegal, mala fide or outside the Act, and upheld section 16A(9) as a genuine rule of evidence. H.R. Khanna J. dissented, insisting that Article 21 is not the sole repository of the right against deprivation of life or liberty without authority of law and that the High Courts' habeas jurisdiction survived; the majority was later overruled by the 44th Amendment, 1978 and expressly in K.S. Puttaswamy (2017).",
    sourceDocTitle: "Additional District Magistrate, Jabalpur v. Shivakant Shukla",
    parties: [
      {
        side: "judge",
        name: "Hon'ble CJI A.N. Ray",
        role: "Chief Justice of India; presiding judge and author of the leading majority opinion",
        persona: "Commands the hearing and insists on the textual distinction between Articles 358 and 359. Asks counsel whether any right to liberty exists outside Article 21 and expects argument on locus standi before merits. Treats the Presidential Order as the centre of the case and a duly authenticated detention order as a peremptory answer."
      },
      {
        side: "judge",
        name: "Hon'ble Justice H.R. Khanna",
        role: "Dissenting Judge",
        persona: "Separates the suspended fundamental right from the pre-existing common law and statutory rule against detention without authority of law. Presses counsel on the consequences of the State's logic for a head constable's arbitrary arrest and on the survival of statutory duties under Article 372. Quiet, exacting, and unwilling to accept an illusion of the rule of law."
      },
      {
        side: "judge",
        name: "Hon'ble Justice M.H. Beg",
        role: "Majority Judge (concurring)",
        persona: "Inclined toward deference in matters of state security. Asks whether a prima facie valid, duly authenticated order made by an authorised officer is a complete answer in habeas and whether malice in fact belongs in a suit for damages rather than a writ petition. Receptive to the notional surrender theory of individual rights."
      },
      {
        side: "judge",
        name: "Hon'ble Justice P.N. Bhagwati",
        role: "Majority Judge (concurring)",
        persona: "Tests whether any free-standing statutory right to personal liberty exists apart from Article 21, then scrutinises section 16A(9)(a) by asking whether the deemed confidential material would in the generality of cases be privileged. Concedes that the iron curtain argument caused him anxiety but applies the condition precedent of a valid section 16A(2) or (3) declaration."
      },
      {
        side: "judge",
        name: "Hon'ble Justice Y.V. Chandrachud",
        role: "Majority Judge (concurring)",
        persona: "Frames the appeal as one of legal capacity to sue rather than the source of the right. Invites counsel to identify any defect appearing on the very face of the order — want of authority, wrong identity, or a purpose outside the statute — and holds that further inquiry is barred. Firmly distinguishes the conditional orders of 1962 and 1974."
      },
      {
        side: "prosecution",
        name: "Attorney General of India",
        role: "Lead Counsel for the Union of India and the States",
        persona: "Opens with the preliminary objection that the 27 June 1975 order bars every Article 226 habeas petition at the threshold. Relies on Liversidge v. Anderson, Greene, Makhan Singh and the finality of emergency satisfaction; argues that the suspension of enforcement removes the detenu's locus standi without abolishing any court's jurisdiction."
      },
      {
        side: "prosecution",
        name: "Special Counsel for the State of Madhya Pradesh and the Additional District Magistrate, Jabalpur",
        role: "Counsel for the Detaining Authority",
        persona: "Defends the section 3 detention order and the section 16A declaration as duly authenticated and within the officer's authority. Argues subjective satisfaction, the conclusiveness of section 16A(9)(a), and the breadth of the words 'or purported to be made' in section 18. Presses for a peremptory answer short of disclosure."
      },
      {
        side: "defense",
        name: "Senior Counsel for the Detenu-Petitioners",
        role: "Lead Counsel challenging the detention orders",
        persona: "Argues in the alternative: Article 359(1) suspends only the enforcement of named fundamental rights; statutory rights and obligations under MISA remain enforceable; the High Court may test conditions precedent, nexus, staleness and mala fides; and Article 226's habeas power cannot be suspended by a Presidential Order. Uses A.K. Gopalan and Eshugbayi Eleko."
      },
      {
        side: "defense",
        name: "Counsel for Connected Detenus",
        role: "Supporting Counsel in the batch of High Court appeals",
        persona: "Brings the connected cases before the bench and stresses that some detenus were never supplied grounds and never saw an Advisory Board. Invokes Mahajan J.'s 'iron curtain' warning from A.K. Gopalan and argues that a construction leaving no judicial scrutiny whatever must be rejected where two constructions are possible."
      },
      {
        side: "witness",
        name: "Shivakant Shukla",
        role: "Detenu and lead respondent (petitioner in the High Court)",
        persona: "The person whose custody the writ is meant to test; deposes to the fact of arrest and continuing detention under the MISA order.",
        isWitness: true,
        personality: "Measured but insistent that no criminal charge was framed and that he cannot answer unseen grounds. Concedes that an order exists but denies that any prejudicial activity was explained to him; becomes firm when asked whether he received grounds or was produced before an Advisory Board."
      },
      {
        side: "witness",
        name: "Smt. Shukla (Spouse of the Detenu)",
        role: "Family affiant for the petitioner",
        persona: "Affiant describing the arrest, the absence of communicated reasons, and the practical impossibility of preparing a habeas petition without access to the grounds.",
        isWitness: true,
        personality: "Anxious and plain-spoken; sticks to dates and what was said at the jail gate. Reliable on chronology, not on legal conclusions. Wavers when the State's counsel suggests she knows the alleged grounds, but recovers when asked simply what was actually told to the family."
      },
      {
        side: "witness",
        name: "Additional District Magistrate, Jabalpur",
        role: "Detaining Authority and appellant official",
        persona: "The officer whose section 3 order is under challenge; produces the authenticated order and the official file and defends the statutory satisfaction.",
        isWitness: true,
        personality: "Bureaucratically exact about signatures, dates and file notations. Evasive when pressed on what material was actually placed before him, whether the section 16A(2) or (3) declaration preceded the order, and whether the grounds have any connection to matters of State."
      },
      {
        side: "witness",
        name: "Under Secretary, Ministry of Home Affairs (MISA Return Affiant)",
        role: "Affiant filing the State's return in the High Court",
        persona: "Files the return asserting confidentiality under section 16A(9)(a) and the validity of the emergency declaration under section 16A(2) or (3).",
        isWitness: true,
        personality: "Formal and careful to repeat the statutory formula verbatim. Avoids answering whether the grounds relate to matters of State at all, and resists questions about a privilege claim under section 123 of the Indian Evidence Act."
      }
    ],
    evidence: [
      {
        label: "R-1",
        title: "Emergency Proclamations under Article 352 (3 Dec 1971 and 25 Jun 1975)",
        description: "The two Presidential proclamations recited by the Court as operative when the habeas petitions were heard.",
        content: "On 3 December 1971 the President proclaimed a grave emergency under Article 352(1) because the security of India was threatened by external aggression. That proclamation remained in force. On 25 June 1975 a second proclamation was issued under the same provision on the ground of internal disturbance. The detenus' petitions challenged the Proclamation in some cases, but the High Courts declined to examine whether the Emergency was justified or continued in bad faith, and the Supreme Court recorded that no arguments were advanced on the validity of the 38th and 39th Constitution Amendment Acts. For the simulation, the State may argue that the existence of the proclamations is committed to the President, while the defense may argue that an emergency cannot enlarge executive power beyond the authority actually conferred by statute. The 1971 proclamation was expressly kept alive alongside the 1975 one by the later Presidential Order."
      },
      {
        label: "R-2",
        title: "Presidential Order of 27 June 1975 under Article 359(1)",
        description: "The order suspending enforcement of Articles 14, 21 and 22, with the supplementary order of 8 January 1976.",
        content: "The order declared that the right of any person, including a foreigner, to move any court for enforcement of Articles 14, 21 and 22, and all pending proceedings for those rights, would remain suspended while both Emergency proclamations were in force; it was additional to, and not in derogation of, earlier orders. A further order of 8 January 1976 suspended enforcement of Article 19 rights on the same footing. The State's preliminary objection was that these orders barred at the threshold every Article 226 habeas petition challenging MISA detention, even for non-compliance with the Act. The detenus answered that Article 359(1) suspends only the enforcement of named fundamental rights and cannot nullify statutory obligations or the limits on executive power. Article 359(1A), inserted by the 38th Amendment, was not argued, though the Court noticed its wider reach."
      },
      {
        label: "R-3",
        title: "MISA Section 3 Detention Order and Section 16A Declaration",
        description: "The statutory basis of the custody and the emergency declaration that disapplied ordinary safeguards.",
        content: "Under section 3 of the Maintenance of Internal Security Act, 1971 an authorised officer could order preventive detention on the statutory satisfaction that the case was one in which detention was warranted; the validity of that satisfaction and of the officer's authority were central to the petitions. The respondents were detained under section 3, and the State produced orders said to be duly authenticated by the Additional District Magistrate, Jabalpur, and other authorised officers. Section 16A, inserted in 1975, disapplied sections 8 to 12 where the Government declared detention necessary for dealing effectively with the Emergency, and section 16A(9)(a) deemed the grounds and materials to be matters of State against the public interest. The defense should test whether the conditions precedent, including any declaration under section 16A(2) or (3), were actually made and whether the grounds have a rational nexus to the Act's objects."
      },
      {
        label: "P-1",
        title: "Habeas Corpus Petitions in the High Courts",
        description: "The petitions that produced the judgments under appeal, and the grounds on which relief was sought.",
        content: "The respondents, detenus under MISA, filed separate applications in the High Courts of Allahabad, Bombay (Nagpur Bench), Delhi, Karnataka, Madhya Pradesh, Punjab and Rajasthan seeking writs of habeas corpus. In some cases they challenged the 38th and 39th Constitution Amendment Acts and the 25 June 1975 Proclamation; in all cases they challenged the legality and validity of their detention orders. Common grounds were that the order was not under or not in compliance with MISA, that the statutory satisfaction rested on irrelevant or stale material, that grounds were vague, and that the detention was mala fide. The High Courts held that, notwithstanding the Emergency and the Presidential Order, they could examine compliance with the conditions precedent in the Act, as distinct from merely procedural provisions, and could examine mala fides. They refused to examine the justification for the Proclamation."
      },
      {
        label: "P-2",
        title: "Affidavit of the Detenu and Family Member (Grounds, Delay and Nexus)",
        description: "Affidavit material offered to show the practical position of a detenu during the Emergency.",
        content: "Affidavit material placed by the detenu and a close family member supplies the human record of the detention: the date of arrest, the absence of a communicated ground where section 16A was invoked, the absence of an Advisory Board reference, and the difficulty of preparing a petition while the grounds are deemed confidential. Shivakant Shukla, the named respondent in the lead appeal, is the detenu whose custody the writ seeks to test. The family affiant can speak to the contention that no criminal charge was framed, that the detenu was produced only under the detention order, and that representations received no reasoned reply. The State responds that section 16A(9)(a) conclusively deems the material confidential and that a detenu has no locus standi to question it. Candidates should use this exhibit to test whether a paper order can be shown to be ex facie defective without disclosure of grounds."
      },
      {
        label: "J-1",
        title: "Bench Sheet: Constitutional and Statutory Provisions in Issue",
        description: "A working comparison of the Emergency provisions, the writ provisions and the detention statute.",
        content: "Working sheet of the provisions argued. Article 21: no deprivation of life or personal liberty except according to procedure established by law. Article 22: preventive detention safeguards, including communication of grounds and Advisory Board review. Article 32: original jurisdiction to enforce fundamental rights; Article 226: High Courts' writ jurisdiction. Article 352(1): proclamation of Emergency on a grave threat to security; Article 358: suspension of Article 19 rights during Emergency; Article 359(1): Presidential order suspending the right to move courts for enforcement of named fundamental rights, with Article 359(1A) inserted by the 38th Amendment. MISA sections 3, 8 to 12, 16A(1), (2), (3) and (9)(a), and 18 are set out for comparison. The modern cross-reference is not to MISA, which was repealed, but to special detention statutes such as the NSA 1980 and COFEPOSA 1974, read with ordinary arrest powers under CrPC section 41 or BNSS section 35."
      },
      {
        label: "J-2",
        title: "Precedent and Later-Treatment Memo",
        description: "A bench research note on the authorities cited and the subsequent fate of the majority holding.",
        content: "Research note for the bench, not a verdict extract. Authorities relied on both sides include A.K. Gopalan, M.M. Damnoo, Ram Manohar Lohia, Makhan Singh, Sree Mohan Chowdhury, Eshugbayi Eleko, Bidi Supply, Basheshar Nath, Dhirubha Devisingh Gohil, Anandan Nambiar, Thakur Bharat Singh and Jaichand Lall Sethia. The State relied on Liversidge v. Anderson, Greene, Rex v. Halliday and The King v. Holiday ex parte Zadiq for deference to executive satisfaction in matters of state security. Later treatment: I.R. Coelho (2007) said the restrictive reading of life and liberty stood impliedly overruled; K.S. Puttaswamy (2017) expressly overruled the majority and approved Khanna J.; the 44th Amendment, 1978 removed Articles 20 and 21 from the reach of Article 359(1). Union of India v. Bhanudas Krishna Gawde, a COFEPOSA case that followed the majority, was itself overruled."
      }
    ],
    chunks: [
      {
        label: "Factual background and the appeals",
        text: "These appeals were brought by the State, some by certificate and others by leave, against judgments of the High Courts of Allahabad, Bombay (Nagpur Bench), Delhi, Karnataka, Madhya Pradesh, Punjab and Rajasthan; Khanna J. counted nine High Courts, adding Madras and Andhra Pradesh. The respondents were the detenus who had moved those courts for habeas corpus under Article 226. They were held under orders of detention made under section 3 of the Maintenance of Internal Security Act, 1971. The Supreme Court was not trying any underlying offence: preventive detention is not a criminal trial. Its task was to decide whether the High Courts could examine the legality of continued detention at all, given the Emergency orders. Counsel for the detenus argued that an order made outside section 3, or made mala fide or on irrelevant material, is void and that habeas corpus lies to test that voidness. The State's answer was that the Presidential Order removed the detenu's standing to make that argument in any court. The record consists of the detention order, the return and the statutory file, not a charge-sheet or a trial."
      },
      {
        label: "Emergency proclamations and Presidential Orders",
        text: "The President proclaimed Emergency on 3 December 1971 under Article 352(1) owing to external aggression; that proclamation was still in force when, on 25 June 1975, a second proclamation was issued on the ground of internal disturbance. On 27 June 1975 the President ordered, under Article 359(1), that the right of any person, including a foreigner, to move any court for enforcement of Articles 14, 21 and 22, and all pending proceedings for those rights, remain suspended while both proclamations were in force; the order was additional to earlier orders. On 8 January 1976 a further order suspended enforcement of Article 19 rights. The 38th Amendment amended Articles 123, 213, 239(b), 352, 356, 359 and 360, making presidential satisfaction final and inserting Article 359(1A); the 39th Amendment dealt with Articles 71 and 329 and Ninth Schedule entries. The Court recorded that no arguments were advanced on the validity of those two amendment Acts, so nothing on them fell for decision."
      },
      {
        label: "Questions before the Court",
        text: "Ray C.J. framed two questions: first, whether, in view of the Presidential Orders, a petition under Article 226 for habeas corpus to enforce personal liberty of a person detained under the Act is maintainable when the detention is said not to be under or in compliance with the Act; second, if maintainable, what is the scope of judicial scrutiny, especially given the mention of Article 22 in the 27 June order and section 16A(9) of MISA. He then identified four pre-eminent questions: whether the Presidential Order is a threshold bar; whether Article 21 is the sole repository of the right to life and personal liberty; whether the order is subject to the rule of law; and whether section 16A(9) is a rule of evidence. The Attorney General's case was that the emergency provisions are constitutional imperatives, that a challenge to executive non-compliance is in substance enforcement of a suspended right, and that Liversidge v. Anderson and Greene supported curial deference. Detenus' counsel insisted that Article 359(1) bars only the remedy for named fundamental rights, not common law or statutory rights."
      },
      {
        label: "Majority reasoning: locus standi and sole repository",
        text: "Ray C.J. held that Article 21 is the sole repository of the right to life and personal liberty against the State, so any claim to habeas corpus is enforcement of Article 21 and barred by the Presidential Order. He distinguished Article 358, which suspends Article 19 rights and gives indemnity, from Article 359(1), which suspends enforcement of named fundamental rights and pending proceedings; a Presidential Order removes the detenu's locus standi but leaves the courts' jurisdiction untouched. Where liberty existed before the Constitution with the same content, its source was Part III. He held the emergency provisions themselves to be the rule of law in emergency, and that a duly authenticated order constituted a peremptory answer. Bhagwati J. similarly treated the rule-of-law principle as enacted in Article 21 with no independent existence, and found no Indian statute conferring a free-standing statutory right to personal liberty. The majority thus accepted the State's preliminary objection and set aside the High Court judgments."
      },
      {
        label: "Concurring routes within the majority",
        text: "Beg J. reasoned from a notional surrender of individual rights to a legally supreme Constitution; fundamental rights excluded parallel natural law or common law rights, so a prima facie valid detention order, duly authenticated and made by an authorised officer, was a complete answer in habeas corpus. He added that suspension does not legalise illegality, but thought the legal consequences were recoverable, if at all, in a suit for damages rather than in habeas. Y.V. Chandrachud J. left the sole-repository question open and rested on locus standi: the source of the right was immaterial because the Presidential Order spoke of rights conferred by Part III. He allowed a narrow exception where vitiation appears on the face of the order — want of authority, wrong identity or a purpose outside the statute — but held that an unconditional Presidential Order otherwise obliterates the detention jurisprudence of nexus, staleness and mala fides. His hope that such misdeeds would never tarnish Free India became the most criticised passage."
      },
      {
        label: "Khanna J.'s dissent",
        text: "Khanna J. held that Article 21 is not the sole repository. The principle that no one may be deprived of life or liberty without authority of law predated the Constitution, survived under Article 372, and was grounded not merely in natural law but in the penal law, the law of tort and the old Criminal Procedure Code section 491 habeas remedy. A suspension under Article 359(1) removes reliance on Article 21 but cannot nullify statutory obligations or enlarge executive power; the President cannot suspend enforcement of rights that are not fundamental rights. Section 18 of MISA, denying natural or common law liberty, did not enlarge section 3 and would be vulnerable to excessive delegation if read that way. He warned that the State's logic would let a head constable detain a person indefinitely with no judicial relief, leaving courts as helpless spectators. He would have left the High Courts' view undisturbed, and declined to decide section 16A(9) in appeals from preliminary objections. What is at stake, he wrote, is the rule of law."
      },
      {
        label: "Section 16A(9), section 18 and the iron curtain",
        text: "Section 16A(9)(a) of MISA deems the grounds, information and materials on which a detention order is made to relate to matters of State whose disclosure would injure the public interest. The detenus said this placed an iron curtain around the material, citing A.K. Gopalan, and forced courts to presume confidentiality regardless of the actual character of the material. Bhagwati J. said the contention caused him anxiety but sustained the provision: it applies only where there is a valid declaration under section 16A(2) or (3), and in such cases the material would generally be privileged under section 123 of the Indian Evidence Act. He cautioned that if the material had no relation to matters of State, deeming it confidential would be a colourable legislative device. Section 18 was inserted to deny any right to personal liberty under natural law or common law. The majority read the words 'or purported to be made' broadly; Khanna J. read section 18 as leaving section 3's conditions intact."
      },
      {
        label: "Key precedents and their use",
        text: "The State invoked Liversidge v. Anderson [1942] A.C. 206, Greene v. Secretary of State for Home Affairs and Rex v. Halliday / The King v. Holiday ex parte Zadiq [1917] A.C. 260 for the proposition that courts lack the material to second-guess executive satisfaction in matters of state security, and cited Sree Mohan Chowdhury and Makhan Singh. The detenus relied on Makhan Singh v. State of Punjab and Ram Manohar Lohia, but Ray C.J. distinguished them because the 1962 and 1974 Presidential Orders were conditional, tied to specified detention laws, whereas the 1975 order was unconditional. Eshugbayi Eleko and the Indian decisions following it supported the proposition that executive action needs authority of law. A.K. Gopalan and M.M. Damnoo supported scrutiny of disclosure bars. Kesavananda Bharati was read both ways on natural rights, and Indira Nehru Gandhi v. Raj Narain was invoked for the rule of law. Anandan Nambiar required strict construction of Article 359 orders."
      },
      {
        label: "Why the majority is indefensible today: advocacy angles",
        text: "Three developments dismantle the majority's foundation. First, the Constitution (44th Amendment) Act, 1978 amended Article 359 so that the President cannot suspend the right to move courts for enforcement of Articles 20 and 21; MISA was repealed. Second, I.R. Coelho (2007) recorded that the restrictive reading in ADM Jabalpur stood impliedly overruled. Third, K.S. Puttaswamy (2017) expressly overruled the majority, called its four judgments seriously flawed, and accepted Khanna J.'s view that recognition of a right in the Constitution does not extinguish its pre-existing existence; Bhanudas Krishna Gawde, which had followed the majority in a COFEPOSA case, was also overruled. In argument today, contrast the Emergency with the current framework: preventive detention under the NSA 1980 or COFEPOSA 1974 remains subject to Article 22 and judicial review, while CrPC section 41 / BNSS section 35 and CrPC section 151 / BNSS section 170 govern only ordinary arrest, never detention without trial. The old CrPC section 491 habeas route Khanna J. invoked is now anchored in Articles 32 and 226."
      }
    ]
  },
  {
    id: "maneka-gandhi-1978",
    title: "Maneka Gandhi v. Union of India — 1978 AIR 597 (Passport Impounding and Personal Liberty)",
    category: "Constitutional · Fundamental Rights · Passport Law",
    court: "Supreme Court of India, Seven-Judge Constitution Bench (1978 AIR 597; decided 25 January 1978)",
    charges: "Writ petition under Constitution of India Art. 32 challenging impounding of passport under Passports Act 1967 s.10(3)(c) without notice or hearing and refusal of reasons under s.10(5); alleged violations of Arts. 14, 19(1)(a), 19(1)(g) and 21",
    summary: "A seven-judge Bench of the Supreme Court held that the right to travel abroad is part of 'personal liberty' under Article 21 and that the 'procedure established by law' permitting its deprivation must be right, just and fair, not arbitrary, fanciful or oppressive. Rejecting the watertight-compartments theory of A.K. Gopalan, the Court treated Articles 14, 19 and 21 as an inter-connected golden triangle: a law valid under Article 21 must still meet the tests of Articles 19 and 14, and reasonableness under Article 14 permeates the procedure prescribed by Article 21. Reading natural justice into the Passports Act 1967, the Bench held that a passport ordinarily cannot be impounded under section 10(3)(c) without prior notice and a reasonable opportunity to show cause, although urgent cases permit a hearing after the event. The petition was disposed of without a formal order after the Attorney General undertook to consider the petitioner's representation, with the passport left in the Registrar's custody.",
    sourceDocTitle: "Maneka Gandhi v. Union of India",
    parties: [
      {
        side: "judge",
        name: "CJI M. Hameedullah Beg",
        role: "Chief Justice of India and Presiding Judge",
        persona: "Preside over the seven-judge bench. Treat Article 21 as both the shield and the interest protected beneath it, and insist that Part III is an integrated scheme. Press counsel on whether the impounding order was made quasi-judicially and whether the only stated ground, possible evidence before a Commission of Inquiry, justified either immediate seizure or refusal of reasons. Steer the hearing toward disposal on the Attorney General's undertaking."
      },
      {
        side: "judge",
        name: "Justice P.N. Bhagwati",
        role: "Justice delivering the plurality opinion",
        persona: "Apply the plurality reasoning. Probe the petitioner on why section 10(3)(c) is said to be arbitrary, and the Union on why 'the interests of the general public' is not vague. Use the direct-and-inevitable-effect test, read Article 14 reasonableness into Article 21, and ask whether audi alteram partem can be implied where the statute is silent."
      },
      {
        side: "judge",
        name: "Justice Y.V. Chandrachud",
        role: "Justice (concurring with Bhagwati, J.)",
        persona: "Concur with Bhagwati, J. Emphasise that the mere prescription of some procedure does not satisfy Article 21: it must be fair, just and reasonable, not fanciful, oppressive or arbitrary. Question the Union on why the exceptional power to withhold reasons under section 10(5) was exercised so casually and why disclosure could not have been made when first demanded."
      },
      {
        side: "judge",
        name: "Justice V.R. Krishna Iyer",
        role: "Justice (concurring)",
        persona: "Press the human consequence of impounding a journalist's passport and the requirement that justice must manifestly appear to be done. Test whether administrative action affecting fundamental rights can survive without even the appearance of fairness, and ask how the emergency exception can be kept within narrow bounds."
      },
      {
        side: "judge",
        name: "Justice N.L. Untwalia",
        role: "Justice (joined the plurality)",
        persona: "Join the plurality's constitutional reasoning. Focus on the text of sections 10(3) and 10(5) and ask whether the Act, read with natural justice, supplies a valid 'procedure established by law'. Require both sides to reconcile the emergency exception with the ordinary rule of prior hearing."
      },
      {
        side: "judge",
        name: "Justice S. Murtaza Fazal Ali",
        role: "Justice (joined the plurality)",
        persona: "Join the plurality. Scrutinise the material said to justify impounding and ask whether reasonable suspicion from credible sources can support action. Press the Union to identify a present public interest rather than a merely future contingency, and to explain the absence of any summons from the Commission of Inquiry."
      },
      {
        side: "judge",
        name: "Justice P.S. Kailasam",
        role: "Justice",
        persona: "Examine whether section 10(5) is within legislative competence and whether the refusal to furnish reasons was justified on the facts. Distinguish the validity of the provision from the lapse in its application, and weigh whether limited judicial scrutiny plus the Attorney General's statement makes formal interference unnecessary."
      },
      {
        side: "defense",
        name: "Senior Counsel for the Petitioner",
        role: "Lead Counsel for Maneka Gandhi (Art. 32 writ petitioner)",
        persona: "Argue that the right to go abroad is personal liberty under Article 21, that sections 10(3)(c) and 10(5) supply no fair procedure and no prior hearing, and that the order also abridges Article 19(1)(a) speech and Article 19(1)(g) profession. Attack the 'general public' ground as vague, the alleged Commission of Inquiry need as unsubstantiated, and the refusal of reasons as a cavalier denial of natural justice."
      },
      {
        side: "prosecution",
        name: "Attorney General of India",
        role: "Lead Counsel for the Union of India",
        persona: "Defend the Passports Act as Parliament's answer to Satwant Singh: sections 3, 5, 6, 10 and 10(5) together supply a procedure established by law, with an appeal where the Passport Authority acts and judicial review of Central Government orders. Submit that 'in the interests of the general public' is not vague, that urgency permits impounding before hearing, and offer the statement that a representation will be heard within two weeks and any impounding capped at six months."
      },
      {
        side: "witness",
        name: "Maneka Gandhi",
        role: "Petitioner and journalist (affiant)",
        persona: "Depose to the passport issued on 1 June 1976, receipt of the 2 July 1977 letter on 4 July 1977 requiring surrender in seven days, her immediate demand for reasons under section 10(5), and the refusal of 6 July 1977.",
        isWitness: true,
        personality: "Composed and precise about dates. Concedes that the Union later offered a hearing, but insists she was never given a chance to show that the stated ground had no bearing on public interest."
      },
      {
        side: "witness",
        name: "Regional Passport Officer, Delhi",
        role: "Official who issued the 2 July 1977 impounding intimation",
        persona: "Produce the intimation and surrender direction, and explain the administrative chain by which the Central Government's decision under section 10(3)(c) was communicated to the holder.",
        isWitness: true,
        personality: "Formal and file-bound. Hesitates when asked whether any show-cause notice, reasons record, or material beyond a possible Commission of Inquiry requirement preceded the order."
      },
      {
        side: "witness",
        name: "Shri Ghosh, Ministry of External Affairs",
        role: "Affiant who filed the Union's reply affidavit dated 18 August 1977",
        persona: "Depose to the grounds for impounding stated in the Union's affidavit: that the petitioner's presence was likely to be required before a Commission of Inquiry and that a report suggested she might leave India.",
        isWitness: true,
        personality: "Guarded and deferential to Government. Concedes there was no summons or requisition from the Commission and that the only reason offered for withholding reasons was the possibility of giving evidence, which was not a ground reasonably requiring concealment."
      }
    ],
    evidence: [
      {
        label: "P-1",
        title: "Passport Issuance and Impounding Intimation (1 June 1976 - 4 July 1977)",
        description: "Petitioner's passport record and the Regional Passport Officer's letter dated 2 July 1977, received on 4 July 1977.",
        content: "Maneka Gandhi was issued a passport on 1 June 1976 under the Passports Act 1967. On 4 July 1977 she received a letter dated 2 July 1977 from the Regional Passport Officer, Delhi, intimating that the Government of India had decided to impound the passport under Section 10(3)(c) \"in public interest\". The letter required surrender of the passport within seven days of receipt. No show-cause notice preceded the intimation and no reasons accompanied it. The petitioner's case is that impounding was communicated as a fait accompli; the Union's case is that the statutory power under clause (c) was invoked because her presence was likely to be required before a Commission of Inquiry. Use this exhibit to fix the chronology and to test whether any prior opportunity to be heard was afforded."
      },
      {
        label: "P-2",
        title: "Petitioner's Demand for Reasons under Section 10(5) (4 July 1977)",
        description: "The petitioner's prompt written request for a copy of the statement of reasons recorded under section 10(5).",
        content: "Immediately on receiving the impounding intimation, the petitioner addressed a letter to the Regional Passport Officer requesting a copy of the statement of reasons recorded under Section 10(5) of the Passports Act 1967. That sub-section requires the authority to record in writing a brief statement of reasons and to furnish a copy on demand, unless it forms the opinion that disclosure would prejudice sovereignty and integrity, security, friendly relations with a foreign country, or the general public. The letter is relied on to show that she invoked the only statutory channel for information and was met with refusal. Press the witness on whether the request was considered on its merits or whether a blanket public-interest objection was applied without examining the actual ground."
      },
      {
        label: "R-1",
        title: "MEA Refusal of 6 July 1977 and Ghosh Affidavit of 18 August 1977",
        description: "The Union's written refusal to disclose reasons and the later affidavit setting out the grounds for impounding.",
        content: "By reply dated 6 July 1977 the Government of India, Ministry of External Affairs, informed the petitioner that it had decided \"in the interest of the general public\" not to furnish a copy of the statement of reasons. In its reply affidavit dated 18 August 1977, Shri Ghosh stated the grounds for impounding: that the petitioner's presence was likely to be required in connection with proceedings before a Commission of Inquiry and that, according to a report received, she was likely to leave India. The petitioner contended that no summons or requisition from the Commission existed and that a mere likelihood of future public interest cannot satisfy clause (c). This exhibit is the Union's stated material; test its specificity and its timing against the refusal to disclose."
      },
      {
        label: "R-2",
        title: "Statement of the Attorney General Filed in Court",
        description: "The undertaking recorded during hearing: representation, two-week opportunity, six-month cap and Court custody.",
        content: "The Attorney General filed a statement during the hearing: the Government was agreeable to considering any representation by the petitioner and would give her an opportunity within two weeks of receipt; the grounds for impounding were those in Shri Ghosh's affidavit of 18 August 1977 except paragraph 2(xi); the representation would be dealt with expeditiously; if impounding were confirmed it would not exceed six months from the decision on the representation; pending decision the passport would remain in the custody of the Court; and the statement was without prejudice to future statutory action. The Court ultimately disposed of the writ petition without a formal order, with the passport in the custody of the Registrar. Argue whether this undertaking cures the earlier defect or merely acknowledges it."
      },
      {
        label: "J-1",
        title: "Passports Act 1967: Sections 3, 5, 6, 10(3)(c), 10(5) and 22(a)",
        description: "The statutory scheme relied on by both sides, including the impounding and reasons provisions.",
        content: "Section 3 bars departure without a valid passport. Sections 5 and 6 govern grant and refusal and require brief written reasons on refusal, with the Central Government's opinion that issue is not in the public interest as one of the grounds. Section 10(1) and (2) deal with endorsements and conditions; Section 10(3) authorises impounding or revocation on grounds (a) to (h). The order here was made by the Central Government under clause (c), which speaks of sovereignty and integrity, security, friendly relations, and the general public. Section 10(5) requires a brief written statement of reasons and a copy on demand, subject to a narrow exception the Court said should be rare. A notification of 14 April 1976 under Section 22(a) addressed persons facing criminal proceedings. Note that the Act was enacted on 24 April 1967 after Satwant Singh."
      },
      {
        label: "J-2",
        title: "Constitution of India: Articles 14, 19, 21, 22 and 32",
        description: "The fundamental-rights provisions invoked in the writ petition and in the Court's reasoning.",
        content: "Article 21 provides that no person shall be deprived of life or personal liberty except according to procedure established by law. Article 14 guarantees equality before law and equal protection, with reasonableness striking at arbitrariness. Article 19(1)(a) protects speech and expression and Article 19(1)(g) the right to practise a profession; reasonable restrictions are saved by Articles 19(2) and 19(6). Article 22 deals with preventive detention and was central to the older Gopalan approach. Article 32 supplies the writ jurisdiction invoked here. The Court read these as an integrated scheme: a law that satisfies Article 21 may still be challenged under Articles 19 and 14, and the procedure prescribed by Article 21 must answer the test of reasonableness under Article 14."
      },
      {
        label: "J-3",
        title: "Precedent Bundle: Gopalan, Bank Nationalisation and Counsel's Comparators",
        description: "Authorities on compartmentalisation, integrated fundamental rights, natural justice and judicial control of discretion.",
        content: "A.K. Gopalan v. State of Madras (1950) treated Articles 19 and 21 as separate compartments; its ratio on Article 22 preventive detention was preserved, but its separability observations were treated as obiter and later displaced. R.C. Cooper v. Union of India, the Bank Nationalisation case (1970), discarded the premise that fundamental-rights articles are mutually exclusive and is the pivot for the golden-triangle reasoning. Satwant Singh Sawhney (1967) held that travel abroad is personal liberty under Article 21; Kharak Singh (1964) and ADM Jabalpur (1976) were relied on for the breadth of that liberty. State of Orissa v. Binapani Dei (1967) and Cooper v. Wandsworth Board of Works (1863) support implied natural justice. Counsel also pressed PCB v. SC of India as a comparator on judicial control of statutory discretion; treat that citation as an advocate's submission rather than a holding stated in the digested judgment."
      }
    ],
    chunks: [
      {
        label: "Factual background: the 1977 impounding",
        text: "The petitioner obtained a passport on 1 June 1976 under the Passports Act 1967. On 2 July 1977 the Regional Passport Officer, Delhi, wrote that the Government of India had decided to impound it under Section 10(3)(c) \"in public interest\", and the letter reached her on 4 July 1977 with a direction to surrender within seven days. She at once asked for the statement of reasons under Section 10(5). On 6 July 1977 the Ministry of External Affairs replied that the Government had decided \"in the interest of the general public\" not to furnish it. Her Article 32 petition followed. The Union's eventual explanation, in Shri Ghosh's affidavit of 18 August 1977, was that her presence was likely to be needed before a Commission of Inquiry and that a report suggested she might leave India. No summons or requisition from the Commission was produced, and the Court noted there was no reason for declining disclosure on the facts."
      },
      {
        label: "Statutory scheme: Passports Act 1967",
        text: "Parliament enacted the Act on 24 April 1967 to cure the defect identified in Satwant Singh: before then, passport issue was unguided executive discretion. Section 3 forbids departure without a valid passport; Sections 5 and 6 govern grant and refusal and require brief written reasons on refusal, with the Central Government's 'public interest' opinion as one of the grounds. Section 10(1) and (2) deal with endorsements and conditions; Section 10(3) authorises impounding or revocation on eight enumerated grounds. The order here was made by the Central Government under clause (c), which speaks of sovereignty and integrity, security, friendly relations and the general public. Section 10(5) requires reasons in writing and a copy on demand, subject to an exception the Court said should be rare. A Section 22(a) notification of 14 April 1976 allowed limited passports to persons facing criminal proceedings on court orders."
      },
      {
        label: "Issues before the seven-judge bench",
        text: "Four questions structured the hearing. First, does the right to go abroad fall within 'personal liberty' in Article 21, and can it be curtailed only by law prescribing a valid procedure? Second, is the procedure prescribed by the Passports Act 'right, just and fair', or is it arbitrary because it permits impounding without a prior hearing? Third, are Articles 14, 19 and 21 mutually exclusive, or must a law that passes Article 21 also survive Articles 19(1)(a), 19(1)(g) and 14? Fourth, does natural justice apply to an administrative order with civil consequences even where the statute is silent, and can urgency justify a hearing after the decision? Ancillary disputes concerned the vagueness of 'general public interest', the difference between a present and a future public interest under clause (c), and whether the refusal of reasons under Section 10(5) was ultra vires."
      },
      {
        label: "Expanded Article 21: right, just and fair",
        text: "The bench rejected the proposition that Article 21 is satisfied by any enacted procedure. Chandrachud, J., stated the test: the procedure established by law has to be fair, just and reasonable, not fanciful, oppressive or arbitrary; reasonableness cannot be judged in the abstract or by demanding a full-dressed courtroom hearing, but in the context of the Act's purpose and the urgent situations administrators may face. Bhagwati, J., read Article 14's reasonableness into Article 21, so that arbitrariness in the procedure defeats the guarantee. Beg, C.J., described Article 21 as both the shield and the interest protected beneath it, and held that Part III provisions are parts of one integrated scheme whose waters must mix. The principle against fanciful, arbitrary and oppressive proceedings, traceable to Gopalan itself, became the operative standard."
      },
      {
        label: "Natural justice and the hearing requirement",
        text: "The Court held that an order impounding a passport must ordinarily be made quasi-judicially and after a reasonable opportunity to show cause. That duty is implied even where the statute is silent, because the function is damaging and affects fundamental rights; Beg, C.J., relied on State of Orissa v. Binapani Dei and Cooper v. Wandsworth Board of Works. Reasons ordinarily cannot be withheld if a reasonable opportunity is to be meaningful. The power under Section 10(5) to refuse a copy of reasons is exceptional, to be exercised fairly, sparingly and only in an uncommon situation, and is itself open to judicial scrutiny. A narrow emergency exception was recognised: where there is a real apprehension that the holder will leave, impounding may precede the hearing. On the facts, the only stated ground, possible evidence before a Commission of Inquiry, did not justify either immediate action or concealment."
      },
      {
        label: "Golden triangle: Articles 14, 19 and 21",
        text: "The judgment displaced the view that Articles 19 and 21 occupy watertight compartments. Gopalan's ratio was confined to Article 22 preventive detention; its observations on separability were obiter. Following R.C. Cooper, the Court treated fundamental rights as overlapping: a law that deprives personal liberty under a fair procedure may still be struck down under Article 19 if its direct and inevitable effect abridges speech or profession, and it must satisfy Article 14's reasonableness. An international singer or dancer denied a passport could plead both Articles 21 and 19(1)(g). Beg, C.J., warned that isolation of human freedoms would defeat their protection, and Bhagwati, J., held that Article 21 does not exclude Articles 14 and 19 even where there is no infringement of Article 21 itself. The combination is the 'golden triangle' invoked at the Bar."
      },
      {
        label: "Precedents relied on and distinguished",
        text: "Satwant Singh Sawhney (1967) is the starting point: travel abroad is personal liberty and Article 21 permits deprivation only by law. Kharak Singh (1964) and the Court's own ADM Jabalpur opinion were used to show the width of personal liberty. A.K. Gopalan (1950) was not wholly overruled: its Article 22 core stood, while its direct-effect and separability reasoning was abandoned. R.C. Cooper, the Bank Nationalisation case (1970), supplied the integrated reading of fundamental rights. Chinta Lingam v. Government of India (1971) was cited for upholding Section 10(5) despite the absence of an appeal from Central Government orders, because judicial review remains. State of Orissa v. Binapani Dei and Cooper v. Wandsworth Board of Works anchor implied natural justice. The PCB v. SC of India reference should be advanced only as counsel's comparator on judicial control of discretion."
      },
      {
        label: "Petitioner's advocacy angles",
        text: "Lead with the chronology: a passport issued in 1976, a seven-day surrender demand in July 1977, no notice, no hearing, no reasons. Characterise Section 10(3)(c) as conferring unguided discretion because 'general public interest' is undefined and because the alleged interest was only a future possibility. Argue that Article 21's procedure cannot be arbitrary; that the total effect of impounding is to abridge journalism under Article 19(1)(a) and profession under Article 19(1)(g); and that Article 14 is offended by the cavalier refusal of reasons. Press that no summons or requisition from the Commission existed, distinguish Section 10(3)(h) where a court warrant or order is required, and invoke the 14 April 1976 Section 22(a) notification under which even an accused facing trial gets a limited passport with an undertaking. Concede the emergency exception but insist that no emergency was shown."
      },
      {
        label: "Union's advocacy angles and disposition",
        text: "Defend the statute as Parliament's answer to Satwant Singh: Sections 3, 5, 6, 10 and 10(5) together provide a procedure established by law, with an appeal when the Passport Authority acts and judicial review of Central Government orders under Article 226 and Article 32. Submit that 'in the interests of the general public' is not vague in a field involving foreign relations; that the tests of validity are pragmatic, not abstract; and that wide discretion is permissible where procedural safeguards exist. Rely on Chinta Lingam to defend Section 10(5) and on the emergency exception for pre-hearing impounding. Then deploy the Attorney General's statement: a representation heard within two weeks, any impounding capped at six months, and the passport in Court custody. The Court disposed of the petition without a formal order, no costs, passport with the Registrar: argue over whether that is vindication or avoidance."
      }
    ]
  },
  {
    id: "hussainara-1979",
    title: "Hussainara Khatoon v. Home Secretary, State of Bihar - Right to Speedy Trial and Undertrial Release (1979 AIR 1360)",
    category: "Constitutional Law / Criminal Procedure - Habeas Corpus, Speedy Trial and Undertrial Detention",
    court: "Supreme Court of India (3-Judge Bench): Justices P. N. Bhagwati, R. S. Pathak and A. D. Koshal; judgment dated 12 February 1979 in Writ Petition No. 57 of 1979",
    charges: "Writ of habeas corpus seeking release of undertrial prisoners detained for years without trial for petty offences. Constitutional challenge under Articles 14 and 21 of the Constitution of India and the bail provisions of the Code of Criminal Procedure, 1973 (Sections 437, 497 and 498), raising speedy trial, bail on personal bond, free legal aid and access to justice (cf. Article 39A and, subsequently, CrPC Section 436A / BNSS Section 480).",
    summary: "In a habeas corpus petition built on Indian Express reports of 8 and 9 January 1979, the Supreme Court held that a procedure which keeps large numbers of people behind bars without trial for years cannot be 'reasonable, just or fair' under Article 21, and that speedy trial - a reasonably expeditious trial - though not specifically enumerated, is implicit in the fundamental right to life and liberty (per Bhagwati and Koshal, JJ., Pathak, J. concurring). Because the State of Bihar did not appear despite notice, the Court proceeded on the petitioners' allegations and, by its order of 5 February 1979, directed the named undertrials' release on executing a personal bond without any monetary obligation or sureties, deferring the question of unconditional release to the final hearing fixed for 19 February 1979. It condemned the property-oriented bail system as discriminatory against the poor and required that personal bonds be individualised and freed of mechanical solvency demands. The State cannot shelter behind financial or administrative difficulty: it must set up more courts and man them with competent judges, and legal aid and access to justice are obligations it must fulfil - principles later echoed in Article 39A and CrPC Section 436A (now BNSS Section 480).",
    sourceDocTitle: "Hussainara Khatoon v. Home Secretary, State of Bihar",
    parties: [
      {
        side: "judge",
        name: "Justice P. N. Bhagwati",
        role: "Author of the Court's opinion (for himself and Koshal, J.)",
        persona: "Delivers the leading judgment: grounds speedy trial in Article 21 through Maneka Gandhi, condemns the property-oriented bail system, and fashions the personal-bond remedy. Question him on the 'reasonable, fair and just' test, the eight roots-in-community factors, why the State's absence cannot defeat relief, and why solvency inquiries should be abandoned.",
        personality: "Solemn, morally forceful, impatient with State indifference; uses vivid language about 'ticket-numbers' and human rights."
      },
      {
        side: "judge",
        name: "Justice R. S. Pathak",
        role: "Concurring judge (separate opinion)",
        persona: "Emphasises that imprisonment may follow a judgment of guilt but should not precede it; that the CrPC already contains ample power for non-monetary release on a bond without sureties; and that an explicit statutory provision for such release is urgently needed. Test him on the scope of judicial discretion, the Moti Ram factors and the 'exceptional' personal-bond order.",
        personality: "Measured, doctrinally careful, conciliatory but firm on liberty."
      },
      {
        side: "judge",
        name: "Justice A. D. Koshal",
        role: "Concurring judge (with Bhagwati, J.)",
        persona: "Concurs in the leading opinion and can be drawn out on the practical administration of justice: the need for more courts staffed by competent judges, the rejection of financial constraint as an excuse for detention, and the reform of bail machinery. A quieter voice to invite to summarise the practical directives.",
        personality: "Reserved, pragmatic, collegial."
      },
      {
        side: "defense",
        name: "Mrs. K. Hingorani",
        role: "Advocate for the petitioners (Hussainara Khatoon & Ors.)",
        persona: "Counsel for the petitioners; moves the habeas corpus petition, relies on the Indian Express cuttings, and argues for immediate personal-bond release. Invite her to articulate the Article 21 violation, the Article 14 critique of wealth-based bail, the three-to-ten-year delays, and why the State's nonappearance should not defeat interim relief.",
        personality: "Persuasive, rights-focused, insistent on urgent relief."
      },
      {
        side: "prosecution",
        name: "S. M. Jha",
        role: "Counsel for the Respondent, State of Bihar (named in the digest)",
        persona: "Appeared for the State of Bihar. Examine him on why no one appeared for the State on 5 February 1979, on jail statistics, and on the State's capacity to establish courts and provide legal aid. Where the digest is silent, treat his answers as contentions rather than established facts.",
        personality: "Formal, defensive, pressed by the Court's questioning."
      },
      {
        side: "prosecution",
        name: "U. P. Singh",
        role: "Counsel for the Respondent, State of Bihar (named in the digest)",
        persona: "Co-counsel for the State. Useful for testing any justification of monetary bail and sureties and the claim that resources are lacking; any factual position he takes on jail numbers or court infrastructure should be advanced as argument, not as record fact, since the State filed no appearance.",
        personality: "Cautious, procedural, defers to Jha."
      },
      {
        side: "prosecution",
        name: "Home Secretary, Government of Bihar",
        role: "Respondent - Home Secretary, State of Bihar (real party; personal name not given in the digest)",
        persona: "The nominal respondent responsible for jail administration and the conduct of trials. Question him on the number of undertrials, the availability of courts and legal aid, and the State's duty under Articles 21 and 39A. Because the State did not appear, frame his positions as advocacy contentions, not as evidence.",
        personality: "Bureaucratic, evasive, concerned with administrative burden."
      },
      {
        side: "witness",
        name: "Ram Naresh Yadav",
        role: "Undertrial prisoner in a Bihar jail (role-based name; the real affiants are named only in the Indian Express reports)",
        persona: "A poor undertrial held for years for a petty offence while his trial never began. He can describe jail life, loss of his job, the burden on his family, and his inability to furnish bail or solvent sureties, echoing the judgment's catalogue of grave consequences for the poor. He should be asked to give dates, the charge and the remand history.",
        isWitness: true,
        personality: "Weary, sincere, anxious about release and family."
      },
      {
        side: "witness",
        name: "Advocate Ashok Kumar Sinha",
        role: "Social worker / lawyer who inspected Bihar jails and helped compile the material (role-based name)",
        persona: "A socially motivated lawyer and social worker who visited the jails and gathered the facts later published in the Indian Express. He can speak to conditions, the names and durations of detention, and the need for free legal aid; tie his evidence to the newspaper cuttings annexed to the writ petition and to the Gujarat Legal Aid Committee critique.",
        isWitness: true,
        personality: "Activist, articulate, morally outraged."
      },
      {
        side: "witness",
        name: "Raghunath Prasad",
        role: "Jail Superintendent, Bihar (role-based name)",
        persona: "A jail official who can testify to overcrowding, the undertrial register, durations of custody and the remand/bail machinery. Press him on how many inmates have never been tried, on the mechanical demand for monetary bail and sureties, and on what records exist to verify the petitioners' figures.",
        isWitness: true,
        personality: "By-the-book, guarded, cooperative under questioning."
      }
    ],
    evidence: [
      {
        label: "P-1",
        title: "Indian Express reports dated 8 and 9 January 1979 (annexed to the writ petition)",
        description: "Newspaper reports incorporated into the habeas corpus petition as its factual foundation",
        content: "These two newspaper cuttings, dated 8 and 9 January 1979, were incorporated into the writ petition and form the factual foundation of the case. They reported that an alarmingly large number of men and women, including children, were behind prison bars in Bihar for years awaiting trial, often for trivial offences which, even if proved, would not warrant punishment for more than a few months, perhaps a year or two. The reports named individual undertrials, some of whom had been in jail for five, seven or nine years and a few for more than ten years, without their trial having begun. The Court recorded that, although notice had issued to the State two weeks earlier and sufficient opportunity was given, no one appeared for the State of Bihar on 5 February 1979; it therefore proceeded, at that stage, on the basis that these allegations were correct. Counsel should treat the cuttings as the petitioners' primary evidence, while noting the Court's own description of the information as 'most distressing'."
      },
      {
        label: "P-2",
        title: "Writ Petition No. 57 of 1979 - habeas corpus averments",
        description: "The petition seeking release of the named undertrials and the procedural posture",
        content: "The petition was a writ of habeas corpus filed on behalf of Hussainara Khatoon and others, arrayed against the Home Secretary, State of Bihar, Government of Bihar, Patna. Its central averment was that large numbers of men, women and children had been in jails for years awaiting trial, and that the offences charged were minor relative to the periods of pre-trial incarceration. Mrs. K. Hingorani appeared for the petitioners; S. M. Jha and U. P. Singh were counsel for the respondent. The relief sought was immediate release, and interim relief was granted by the order of 5 February 1979 directing release on personal bond. The matter was then posted for final hearing on 19 February 1979, when the Court indicated it would consider whether a person denied speedy trial is entitled to be unconditionally freed. Use this exhibit to frame the posture: an interim personal-bond order, with the larger constitutional question expressly left open."
      },
      {
        label: "J-1",
        title: "Order dated 5 February 1979 - release on personal bond",
        description: "The Supreme Court's interim order directing release without monetary obligation",
        content: "On 5 February 1979 the Supreme Court made the order whose reasons are set out in the judgments of 12 February 1979. Notice had issued to the State of Bihar two weeks earlier, but no one appeared on its behalf. The Court proceeded on the basis that the petitioners' allegations were correct and directed the release of the persons named in the order on their executing a personal bond. Pathak, J. described the order as 'somewhat unusual' because the personal bond in each case was not to be based on any monetary obligation - an exceptional measure adopted under the persuasive pressure of the particular facts and circumstances. The order was expressly interim: the petition was posted for final hearing on 19 February 1979. This exhibit is the Court's operative relief and the anchor for any discussion of bail without monetary obligation or sureties."
      },
      {
        label: "P-3",
        title: "Compilation of jail statistics and remand entries (Bihar undertrials)",
        description: "Record material on durations of pre-trial detention and the human cost",
        content: "This compilation, assembled from jail and remand records referred to in the petition and the judgments, records that undertrial prisoners in Bihar had been in custody for periods ranging from three to ten years without their trial having commenced. The judgments specifically note named undertrials in jail for five, seven or nine years, and 'a few of them, even more than 10 years', without trial. The offences, even if proved, would not have warranted punishment for more than a few months, perhaps a year or two. The Court observed that many of these persons must not even remember when they entered jail or for what offence, and that over the years they had 'ceased to be human beings' and become 'mere ticket-numbers'. Use these figures to quantify the delay relied on for the Article 21 argument, but attribute the underlying entries to the newspaper reports and petition averments rather than to a verified State return, since the State did not appear."
      },
      {
        label: "P-4",
        title: "Report of the Legal Aid Committee, Government of Gujarat (Chairman: Justice P. N. Bhagwati)",
        description: "Legal-aid material on the bail system quoted at length in the judgment",
        content: "The judgment quotes at length from the report of the Legal Aid Committee appointed by the Government of Gujarat under the chairmanship of Justice Bhagwati. The Committee condemned the bail system as 'extremely unsatisfactory and needs drastic change', observing that the risk of financial loss is not the only, nor even a major, deterrent to flight, and citing the Manhattan Bail Project and the D. C. Bail Project in the United States as evidence that appearance can be secured without monetary bail. It criticised the mechanical fixing of bail by reference to the seriousness of the charge rather than to the probability of flight or the accused's financial circumstances, calling this discriminatory against the poor. This exhibit is the judgment's principal legal-aid and access-to-justice material; it links the bail critique to the obligation to provide free legal aid and to Article 39A, though the Committee report itself is distinct from that constitutional provision."
      },
      {
        label: "R-1",
        title: "Bail and remand practice under CrPC 1973 (Sections 437, 497 and 498)",
        description: "The property-oriented bail machinery criticised in the judgment",
        content: "This exhibit collects the ordinary bail and remand practice which the Court found 'highly unsatisfactory'. Even after the re-enactment of the Code of Criminal Procedure, 1973, the law insisted that a personal bond contain a monetary obligation payable on failure to appear, and courts mechanically required sureties who had to establish solvency. The judgment recorded that bail amounts were often 'unrealistically excessive', so that poor accused were unable to satisfy the police or Magistrate of their solvency, while those with sureties faced an almost impossible task; some were fleeced by touts and professional sureties or forced into debt. The headnote cites Sections 437, 497 and 498 of the Code and Articles 14 and 21 of the Constitution. Note the procedural caveat: the State of Bihar did not appear, so the Court's description of this practice is a general critique, not a finding on a State return. Counsel for the State may contest individual applications of it as contentions."
      },
      {
        label: "P-5",
        title: "Constitutional and statutory framework - Articles 14, 21 and 39A; CrPC Section 436A / BNSS Section 480",
        description: "Provisions relevant to speedy trial, legal aid and undertrial bail",
        content: "This framework brief sets out the provisions relied on. The digest's referencedActs list Articles 14 and 21 of the Constitution and Sections 437, 497 and 498 of the Code of Criminal Procedure, 1973; Article 21, read with Maneka Gandhi, supplies the 'reasonable, fair and just' procedure requirement in which speedy trial is implicit, and Article 14 informs the equality critique of property-based bail. Article 39A (equal justice and free legal aid) is relevant to the access-to-justice dimension, and the judgment's reliance on the Gujarat Legal Aid Committee report reinforces that legal aid is an obligation of the State. For advocacy only, note the later statutory recognition of the undertrial principle in CrPC Section 436A and its modern counterpart BNSS Section 480 (2023); these post-date this judgment and should be presented as subsequent codification of its logic, not as provisions applied by the Court in 1979."
      }
    ],
    chunks: [
      {
        label: "Factual background",
        text: "The case began with a writ of habeas corpus (Writ Petition No. 57 of 1979) for Hussainara Khatoon and others against the Home Secretary, State of Bihar. The petition drew on Indian Express reports of 8 and 9 January 1979 describing an 'alarmingly large number' of men, women and children who had been behind bars for years awaiting trial in Bihar, many for trivial offences punishable by only a few months or a year or two. The judgments record individual undertrials held for five, seven or nine years, and a few beyond ten years, without trial having begun. Notice issued to the State two weeks earlier, but on 5 February 1979 no one appeared for it, and the Court proceeded on the basis that the allegations were correct. It made an interim order for release on personal bond and adjourned final hearing to 19 February 1979. Bhagwati, J. called the situation a 'crying shame' and a 'travesty of justice', observing that the prisoners had become 'ticket-numbers' rather than human beings."
      },
      {
        label: "Statutory scheme",
        text: "The relevant legal framework, as recorded in the digest's referencedActs, is Articles 14 and 21 of the Constitution and Sections 437, 497 and 498 of the Code of Criminal Procedure, 1973. Article 21, as dynamically interpreted in Maneka Gandhi v. Union of India [1978] 2 SCR 621, requires a procedure that is 'reasonable, fair and just', not merely one prescribed by law; the Court read speedy trial into that requirement. Article 14 informs the argument that a bail system keyed to wealth creates unequal treatment of rich and poor accused. The cited CrPC sections governed bail and bonds, but Pathak, J. stressed that the Code - old and new - already contained ample power to release an undertrial on bail or on a bond without sureties for appearance; the defect was mechanical exercise of that power, not absence of it. Article 39A (equal justice and free legal aid) and, much later, CrPC Section 436A / BNSS Section 480 are relevant to the broader access-to-justice and undertrial theme but were not the provisions applied in the 1979 order."
      },
      {
        label: "Issues before the Court",
        text: "The Court framed several connected questions. First, whether prolonged pre-trial detention of large numbers of undertrials for petty offences, with trials not even commenced, violates Article 21's requirement of a 'reasonable, just or fair' procedure and offends Article 14. Second, whether speedy trial is a fundamental right, and if so what remedy follows when it is denied - a question the Court expressly left for the final hearing on 19 February 1979, including whether an accused must be unconditionally freed. Third, whether the property-oriented bail system, insisting on monetary obligations, sureties and solvency, discriminates against the poor and requires reform. Fourth, whether the existing CrPC provisions already authorised non-monetary personal-bond release, and what factors should guide it. Fifth, what institutional steps the State must take - more courts, competent judges, legal aid - and whether financial constraints can excuse delay. Note the State's nonappearance meant the Court proceeded on the petitioners' allegations at the interim stage."
      },
      {
        label: "Holding - speedy trial",
        text: "The core holding, per Bhagwati and Koshal, JJ., is that a procedure which keeps large numbers of people behind bars without trial for long cannot be regarded as 'reasonable, just or fair' under Article 21. Speedy trial - meaning reasonably expeditious trial - though not specifically enumerated, is implicit in the broad sweep of Article 21 and is an integral and essential part of the fundamental right to life and liberty; delay in trial by itself constitutes denial of justice. Expeditious trial and freedom from detention were described as human rights and basic freedoms. The Court held that law and courts must radically change their approach to pre-trial detention, reject the property-oriented bail system, and release accused on personal bond where they have roots in the community. It directed the State to set up more courts and man them with competent judges. Pathak, J. concurred, emphasising that imprisonment should follow, not precede, guilt, while reserving final comment on the legality of continued detention until the merits hearing."
      },
      {
        label: "Article 39A and legal aid",
        text: "The judgment treats access to justice and legal aid as part of the State's obligation, not a discretionary benefit. Bhagwati, J. observed that the bail system 'operates very harshly against the poor' and that the poor, unable to furnish bail or sureties, suffer psychological and physical deprivation, are prevented from preparing their defence, lose their jobs, and shift the burden of detention onto innocent family members. The Court quoted the Gujarat Legal Aid Committee, chaired by Justice Bhagwati, which called for drastic change and pointed to bail projects showing that appearance can be secured without money. This is the material from which a free-legal-aid argument is built: Article 39A's promise of equal justice and free legal aid, and the proposition that a system which detains the poor while the wealthy go free is an instrument of injustice. Because Article 39A was not expressly discussed in the digest, present it as a supporting principle and advocacy angle rather than as a ground of the 1979 order."
      },
      {
        label: "Personal bond and bail reform",
        text: "The Court set out a practical test for release on personal bond. Rejecting the idea that monetary loss is the only deterrent to flight, it held that where an accused has roots in the community and is unlikely to abscond, he may be released on his personal bond. It listed eight factors: length of residence; employment status, history and financial condition; family ties and relationships; reputation, character and monetary condition; prior criminal record including prior release on recognizance or bail; identity of responsible community members who would vouch for reliability; the nature of the offence and apparent probability of conviction and likely sentence, in so far as relevant to risk of nonappearance; and any other factors indicating community ties or risk of wilful failure to appear. The bond amount must be an individualised decision based on financial circumstances and absconding risk, not a schedule keyed to the charge; solvency inquiries that cause harassment should not be insisted on. Pathak, J. cited Moti Ram v. State of M.P. and the US Bail Reform Act, 1966 factors."
      },
      {
        label: "Precedents and comparative material",
        text: "Several authorities anchor the reasoning. Maneka Gandhi v. Union of India [1978] 2 SCR 621 is the cornerstone: Article 21 requires a procedure that is 'reasonable, fair and just', which is why a procedure lacking speedy trial fails. Moti Ram & Ors. v. State of M.P. [1978] 4 SCC 47 was relied on by Pathak, J. in discussing pre-trial release and security. The United States Bail Reform Act, 1966 (18 USS 3146(b)) supplied the list of release considerations, and President Lyndon B. Johnson's remarks on signing it - that a defendant stays in jail 'for one reason only - because he is poor' - were quoted. The judgment also reproduced a formulation that a detained person 'shall be entitled to trial within a reasonable time or to release pending trial'. The Gujarat Legal Aid Committee report, the Manhattan and D. C. Bail Projects, and the headnote's citation of Articles 14 and 21 and CrPC Sections 437, 497 and 498 complete the map of authorities available to counsel."
      },
      {
        label: "Advocacy angles by role",
        text: "For the judge: probe whether the State's nonappearance should be fatal, distinguish the interim personal-bond order from the unresolved merits question of unconditional release, and hold the line on 'reasonable, fair and just' procedure. For the petitioners' counsel (defense): emphasise the three-to-ten-year delays, trivial offences, Article 14 inequality and Article 21 violation, and press the eight personal-bond factors. For the State (prosecution): argue within the record's limits - contest individual detention figures as contentions, invoke Pathak, J.'s point that the CrPC already supplies the power, stress the need to ensure appearance, and avoid admitting financial constraint as a justification, which the Court rejected in substance. For witnesses: the undertrial should speak to loss of livelihood and family burden; the social worker/lawyer to jail conditions and the newspaper record; the jail superintendent to remand and bail mechanics. Across roles, treat Article 39A, CrPC Section 436A and BNSS Section 480 as later or supporting framework, not as holdings of this judgment."
      }
    ]
  },
  {
    id: "vishaka-1997",
    title: "Vishaka v. State of Rajasthan, AIR 1997 SC 3011 — Workplace Sexual Harassment and Article 32 Guidelines",
    category: "Constitutional Law / Public Interest Litigation / Gender Justice — Sexual Harassment at Workplace",
    court: "Supreme Court of India (3-Judge Bench); CJI J.S. Verma, Justices Sujata V. Manohar and B.N. Kirpal; decided 13 August 1997",
    charges: "Writ petition under Article 32 for enforcement of fundamental rights of working women — Articles 14, 15, 19(1)(g), 21 and 32; absence of domestic legislation on workplace sexual harassment; prayer for mandamus with preventive directions; underlying alleged gang rape of a social worker in a Rajasthan village is the subject of a separate criminal action.",
    summary: "The Supreme Court, exercising its Article 32 jurisdiction in a public interest class action triggered by the alleged brutal gang rape of a social worker in a Rajasthan village, framed binding guidelines to prevent sexual harassment of working women because no domestic legislation occupied the field. Holding that gender equality under Articles 14, 15 and 19(1)(g) and the right to life with dignity under Article 21 encompass protection from harassment, the Court read India's CEDAW obligations into these fundamental rights and declared the guidelines to be law under Article 141. Employers must prevent harassment, notify prohibitions and provide time-bound complaint mechanisms headed by a woman, at least half women members, with an independent third party, confidentiality and annual reporting. The directions were binding until suitable legislation, which came with the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013.",
    sourceDocTitle: "Vishaka v. State of Rajasthan",
    parties: [
      {
        side: "judge",
        name: "Chief Justice J.S. Verma",
        role: "Presiding Judge; author of the opinion",
        persona: "Authors the judgment. Steers the bench from the separate criminal case to the larger constitutional question, insists on filling the legislative vacuum under Article 32, and frames the twelve guidelines as law declared under Article 141. Press counsel to show how a workplace complaint mechanism can be both time-bound and confidential.",
        personality: "Solemn, schematic, institutionally mindful; keeps the court focused on systemic remedy rather than the individual criminal trial."
      },
      {
        side: "judge",
        name: "Justice Sujata V. Manohar",
        role: "Bench Judge",
        persona: "Concurring member of the three-judge bench. Her presence is a useful anchor for arguments about gender justice and the reading of CEDAW into fundamental rights. Question counsel on how international norms become enforceable domestically absent legislation, and on the significance of Article 15(3).",
        personality: "Measured, precise, attentive to equality doctrine."
      },
      {
        side: "judge",
        name: "Justice B.N. Kirpal",
        role: "Bench Judge",
        persona: "Concurring member of the bench. Test arguments about the binding nature of Article 32 directions and the division of labour between legislature, executive and judiciary; ask what happens when Parliament later occupies the field with the 2013 Act.",
        personality: "Pragmatic, administratively oriented, interested in workable enforcement."
      },
      {
        side: "prosecution",
        name: "Meenakshi Arora",
        role: "Counsel for the petitioner NGOs",
        persona: "Lead advocate for the class action brought by social activists and NGOs. The judgment records that she assisted the Court with full commitment. Argue that sexual harassment violates Articles 14, 15, 19(1)(g) and 21, that the right to life means life with dignity, and that a safe working environment is a condition precedent to the right to practise any profession.",
        personality: "Forceful, rights-based, fluent in constitutional framing."
      },
      {
        side: "prosecution",
        name: "Naina Kapur",
        role: "Counsel assisting the petitioners and the Court",
        persona: "Recorded in the judgment as having assisted the Court with full commitment. Develop the factual and comparative material: the CEDAW text, General Recommendations 22 to 24, the Beijing Platform for Action and the need for a complaints committee with an independent NGO member. Focus on practical safeguards, not just declaration of principle.",
        personality: "Research-driven, collaborative, focused on remedial design."
      },
      {
        side: "prosecution",
        name: "Fali S. Nariman",
        role: "Amicus Curiae",
        persona: "Appeared as amicus curiae and, in the judgment's words, rendered great assistance. Use the amicus role to press structural points: international conventions may be read into fundamental rights where there is no inconsistency and a domestic void; Article 32 directions must bind until legislation. Offer the Court a neutral, institutionally safe formulation.",
        personality: "Eminent, judicious, constitutional-statesman tone."
      },
      {
        side: "defense",
        name: "Solicitor General of India",
        role: "Counsel for the Union of India (name not specified in the judgment)",
        persona: "Appeared for the Union of India and, as the judgment notes, rendered valuable assistance in the true spirit of a Law Officer. The Union ultimately consented through him to the guidelines. Test the limits of judicial law-making, insist on administrative workability, and explain Articles 51(c), 73 and 253 while accepting that Union executive power fills the gap until Parliament legislates.",
        personality: "Cautious, institutional, constructive rather than obstructionist."
      },
      {
        side: "defense",
        name: "Counsel for the State of Rajasthan",
        role: "Respondent's counsel (name not recorded in the judgment; role-based persona)",
        persona: "Appeared for the State of Rajasthan, which was given notice of the petition. Emphasise that the alleged gang rape of the social worker is the subject of a separate criminal action and that the Court said no further mention of it was necessary. Press the objection that broad workplace guidelines go beyond the facts of the criminal case, while acknowledging the State's duty under Articles 42 and 51A(e).",
        personality: "Formal, federal, protective of state prerogatives."
      },
      {
        side: "witness",
        name: "Name withheld (the social worker survivor)",
        role: "Affiant / survivor; identity withheld, referred to only as the social worker",
        persona: "The judgment identifies the trigger as an incident of alleged brutal gang rape of a social worker in a village of Rajasthan and expressly states it is the subject of a separate criminal action. Speak only to dignity-based harm, the hazard of working in the field, and why a safe working environment matters. Do not narrate graphic details; the judgment deliberately does not. Name withheld for dignity and safety.",
        isWitness: true,
        personality: "Dignified, restrained, resolved; the court should treat this testimony with care and avoid re-traumatisation."
      },
      {
        side: "witness",
        name: "Vishaka (NGO coordinator; role-based name)",
        role: "Petitioner and NGO affiant",
        persona: "A social activist petitioner (the cause caption reads Vishaka & Ors). The judgment gives no biographical details, so treat this as a role-based persona. Testify to the pattern of harassment faced by working women, the absence of any internal complaint forum, and why a class action under Article 32 was necessary rather than an individual criminal complaint.",
        isWitness: true,
        personality: "Activist, articulate, systems-focused."
      },
      {
        side: "witness",
        name: "Investigating Officer (role-based name; not named in the judgment)",
        role: "Police officer in the separate criminal case",
        persona: "The judgment does not name any police officer or describe the FIR; treat all procedural detail as advocacy material, not record fact. Speak to the distinction between the separate criminal prosecution and the present writ: the criminal case addresses individual offenders, while the writ addresses the institutional vacuum in prevention and redress.",
        isWitness: true,
        personality: "Procedural, precise, careful about what is and is not on record."
      },
      {
        side: "witness",
        name: "Head of HR (role-based name; not named in the judgment)",
        role: "Employer representative and senior manager",
        persona: "The judgment lays the primary duty on employers and persons in charge of workplaces. As a role-based employer witness, address why standing orders under the Industrial Employment (Standing Orders) Act 1946 were not sufficient, what a Complaints Committee headed by a woman with an independent NGO member would change, and how confidentiality and annual reporting could be operationalised.",
        isWitness: true,
        personality: "Pragmatic, compliance-minded, candid about institutional gaps."
      }
    ],
    evidence: [
      {
        label: "P-1",
        title: "Writ Petition under Article 32 (Vishaka & Ors.)",
        description: "The class action that instituted the proceedings; establishes standing, public interest character and the relief prayed for.",
        content: "Exhibit P-1: The writ petition filed as a class action by social activists and NGOs under Article 32 of the Constitution for enforcement of the fundamental rights of working women under Articles 14, 19 and 21. The petition, as described by the Court, was brought to focus attention on a societal aberration, to assist in finding suitable methods for realising the true concept of gender equality, and to prevent sexual harassment of working women in all workplaces through judicial process so as to fill the vacuum in existing legislation. It sought a writ of mandamus accompanied by directions for prevention, on the footing that such violations are a recurring phenomenon and that the right to carry on an occupation depends on the availability of a safe working environment. The cause caption reads Vishaka & Ors. Use this exhibit to establish standing, the public interest character of the litigation, and the remedial relief prayed for."
      },
      {
        label: "P-2",
        title: "Material relating to the separate criminal action in Rajasthan",
        description: "The alleged gang rape of a social worker; must be used with care because the judgment deliberately says little about it.",
        content: "Exhibit P-2: Material relating to the separate criminal action arising from the alleged brutal gang rape of a social worker in a village of Rajasthan. The judgment records the incident only as the immediate cause for filing the writ and expressly states that it is the subject matter of a separate criminal action and that no further mention of it by the Court is necessary. Accordingly this exhibit must be used with care: the digest supplies no FIR number, date, named accused, police station or investigative detail. In the simulation, treat any such particulars as advocate submissions or role-player constructions, not findings of the Supreme Court. The permissible submission is narrow: the incident reveals the hazards to which a working woman may be exposed and the depravity to which sexual harassment can degenerate, and it demonstrates the urgency of an alternative mechanism in the absence of legislative measures."
      },
      {
        label: "R-1",
        title: "Position of the State of Rajasthan and the Union of India on the legal vacuum",
        description: "Respondents' recorded stance; the Union ultimately consented to the guidelines.",
        content: "Exhibit R-1: Statement of the respondent State of Rajasthan and the Union of India on the existing legal position. The judgment records that notice was given to both and that the Solicitor General appeared for the Union of India and rendered valuable assistance in the true spirit of a Law Officer. The Court took note that the present civil and penal laws in India do not adequately provide for specific protection of women from sexual harassment in workplaces and that enactment of such legislation would take considerable time. The Union of India ultimately consented through the Solicitor General to the guidelines being declared by the Court. Because the digest does not set out a formal written response, counsel should present this exhibit as a fair summary of the position recorded in the judgment rather than as a pleaded affidavit, and should not attribute unstated concessions to the State of Rajasthan."
      },
      {
        label: "J-1",
        title: "The twelve Vishaka Guidelines and Norms",
        description: "The operative directions of the Court, binding until legislation; the centrepiece of the simulation.",
        content: "Exhibit J-1: The guidelines and norms laid down by the Supreme Court in exercise of its Article 32 power, to be strictly observed at all workplaces until legislation is enacted. In summary: (1) employers must prevent and deter harassment and provide resolution procedures; (2) sexual harassment includes unwelcome sexually determined behaviour — physical contact and advances, demand or request for sexual favours, sexually coloured remarks, showing pornography, or any other unwelcome physical, verbal or non-verbal conduct of a sexual nature; (3) preventive steps include notified prohibition, disciplinary rules and standing orders under the Industrial Employment (Standing Orders) Act 1946; (4) criminal proceedings where an offence is made out; (5) disciplinary action for misconduct; (6) a time-bound complaint mechanism; (7) a Complaints Committee headed by a woman, at least half its members women, involving an independent NGO or body, maintaining confidentiality and making an annual report; (8) workers' initiatives; (9) awareness; (10) assistance where outsiders are responsible; (11) governments to consider legislation for the private sector; (12) no prejudice to rights under the Protection of Human Rights Act 1993."
      },
      {
        label: "J-2",
        title: "Constitutional provisions relied on",
        description: "The textual basis for the holding and for the binding character of the directions.",
        content: "Exhibit J-2: Extracts from the Constitution of India relied on in the judgment. Article 14 (equality), Article 15 (prohibition of discrimination on grounds including sex, with clause (3) permitting special provision for women and children), Article 19(1)(g) (to practise any profession or to carry out any occupation, trade or business), Article 21 (life and personal liberty), Article 32 (constitutional remedy), Article 42 (just and humane conditions of work and maternity relief), Article 51A(e) (fundamental duty to renounce practices derogatory to the dignity of women), Article 51(c) (foster respect for international law and treaty obligations), Article 253 (Parliament's power to implement treaties), Article 73 (executive power of the Union), Entry 14 of List I in the Seventh Schedule, and Article 141 (law declared by the Supreme Court binding on all courts). The Court held that right to life means life with dignity and that a safe working environment is integral to the right to work."
      },
      {
        label: "P-3",
        title: "CEDAW, General Recommendations and Beijing commitments",
        description: "The international norms read into fundamental rights in the absence of domestic law.",
        content: "Exhibit P-3: Convention on the Elimination of All Forms of Discrimination against Women material relied on by the Court. Article 11 requires States Parties to take all appropriate measures to eliminate discrimination against women in employment, including the right to work as an inalienable right and the right to protection of health and to safety in working conditions. Article 24 requires national measures aimed at full realisation of the rights recognised in the Convention. General Recommendation paras 22-24 on violence and equality in employment state that gender-specific violence such as sexual harassment can seriously impair equality in employment, define the unwelcome conduct, and call for effective complaints procedures and remedies including compensation. India ratified the Convention on 25 June 1993 with reservations which the Court held not material in the present context. The Court also relied on the Beijing Platform for Action and the 1995 Beijing Statement of Principles of the Independence of the Judiciary."
      },
      {
        label: "J-3",
        title: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013",
        description: "The later legislation contemplated by the Court; useful as subsequent legislative history, not as 1997 law.",
        content: "Exhibit J-3: The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013, as the later statutory culmination of the Vishaka principles. The Supreme Court had directed that its guidelines would be binding and enforceable in law until suitable legislation was enacted to occupy the field; Parliament later gave statutory force to these norms. In the simulation this exhibit is the answer to the question of what happened next: it provides a statutory definition of sexual harassment, requires every organisation with the prescribed number of employees to constitute an Internal Committee, mandates that its Presiding Officer be a woman and that at least half its members be women, provides for a member from an NGO or body familiar with the subject, extends protection to the unorganised sector through Local Committees, and requires annual reporting. Counsel should present this as subsequent legislative history, not as law applied in 1997."
      }
    ],
    chunks: [
      {
        label: "Factual background and trigger",
        text: "The writ petition was filed as a class action by social activists and NGOs concerned with the condition of working women. The immediate cause was an incident of alleged brutal gang rape of a social worker in a village of Rajasthan. The Supreme Court deliberately confined its reference to that incident: it is the subject matter of a separate criminal action, and no further mention of it by the Court was necessary. The incident was used only to reveal the hazards to which a working woman may be exposed, the depravity to which sexual harassment can degenerate, and the urgency of safeguards by an alternative mechanism in the absence of legislative measures. The Court treated each such incident as violating the fundamental rights of gender equality and of life and liberty, and as also engaging the victim's right under Article 19(1)(g) to practise any profession. Notice was given to the State of Rajasthan and the Union of India."
      },
      {
        label: "The legislative vacuum",
        text: "The Court recorded that the present civil and penal laws in India do not adequately provide for specific protection of women from sexual harassment in workplaces, and that enactment of such legislation would take considerable time. This vacuum was the central justification for judicial intervention. The primary responsibility for ensuring safety and dignity through suitable legislation, and for creating an enforcement mechanism, lies with the legislature and the executive; but where instances of harassment resulting in violations of fundamental rights are brought under Article 32, effective redress requires guidelines to fill the legislative vacuum. A writ of mandamus, the Court said, must be accompanied by directions for prevention because such violations are a recurring phenomenon. The guidelines were framed with the consent of the Union of India through the Solicitor General, after the matter progressed through several hearings, and were declared to be binding until legislation occupied the field."
      },
      {
        label: "Constitutional issues framed",
        text: "The petition invoked Articles 14, 19 and 21; the Court added Article 15 and treated Article 32 as the remedial gateway. Its reasoning linked gender equality to protection from harassment: the meaning and content of the fundamental rights are of sufficient amplitude to compass all facets of gender equality, including prevention of sexual harassment or abuse. The right to carry on any occupation, trade or profession depends on the availability of a safe working environment, and the right to life means life with dignity. Article 15(3) permits special provision for women; Article 42 speaks of just and humane conditions of work; Article 51A(e) imposes a fundamental duty to renounce practices derogatory to the dignity of women. Counsel should frame the central issue as whether the State's failure to provide a workplace redress mechanism itself breaches these guarantees, and whether the Court may prescribe binding norms pending legislation."
      },
      {
        label: "Guidelines: definition, duties, prevention",
        text: "The first cluster of guidelines imposes the substantive duty and defines the conduct. It is the duty of the employer or other responsible persons in workplaces and institutions to prevent or deter acts of sexual harassment and to provide procedures for resolution, settlement or prosecution. Sexual harassment includes unwelcome sexually determined behaviour, whether direct or by implication: physical contact and advances; a demand or request for sexual favours; sexually coloured remarks; showing pornography; and any other unwelcome physical, verbal or non-verbal conduct of a sexual nature. The conduct is discriminatory where the woman has reasonable grounds to believe her objection would disadvantage her in employment, including recruitment or promotion, or where it creates a hostile work environment, and it may constitute a health and safety problem. Preventive steps require notified prohibition, disciplinary rules in government and public sector bodies, inclusion in standing orders under the Industrial Employment (Standing Orders) Act 1946 for private employers, and appropriate conditions of work, leisure, health and hygiene."
      },
      {
        label: "Complaints Committee and inquiry process",
        text: "The remedial architecture is set out in guidelines 4 through 10. Where conduct amounts to an offence under the Indian Penal Code or other law, the employer must initiate appropriate action by complaint to the appropriate authority, and must ensure that victims and witnesses are not victimised or discriminated against; the victim may seek transfer of the perpetrator or of herself. Misconduct under service rules attracts disciplinary action. Independently of criminal or disciplinary characterisation, an appropriate complaint mechanism must exist to ensure time-bound treatment of complaints. That mechanism should provide, where necessary, a Complaints Committee, a special counsellor or other support service including maintenance of confidentiality. The Committee must be headed by a woman, with not less than half its members women, and should involve a third party — an NGO or other body familiar with sexual harassment — to avoid pressure from senior levels. It must make an annual report to the government department concerned, and employers must report on compliance."
      },
      {
        label: "Constitutional basis and Article 141",
        text: "The Court grounded its directions in Article 32 and declared them to be law laid down by the Supreme Court under Article 141. It emphasised that the directions would be strictly observed in all workplaces and would be binding and enforceable in law until suitable legislation was enacted. Supporting provisions included Article 51(c), directing the State to foster respect for international law and treaty obligations, Article 253 read with Entry 14 of the Union List, and Article 73, which allows the Union's executive power to extend to matters on which Parliament may legislate. The Court reasoned that until Parliament expressly provides measures to curb the evil, the executive power of the Union and the Court's Article 32 power must meet the challenge. It also relied on the Beijing Statement of Principles of the Independence of the Judiciary, adopted in 1995, whose objectives include ensuring that all persons live securely under the rule of law and promoting within proper limits the observance and attainment of human rights."
      },
      {
        label: "CEDAW and international norms",
        text: "The Court held that international conventions and norms are to be read into fundamental rights in the absence of enacted domestic law occupying the field, provided there is no inconsistency. It relied on CEDAW Articles 11 and 24 and General Recommendations 22 to 24, which treat sexual harassment as gender-specific violence impairing equality in employment and call for effective complaints procedures and remedies including compensation. India ratified CEDAW on 25 June 1993 with reservations not material to the case, and had made commitments at the Fourth World Conference on Women in Beijing to a national policy on women, a Commission for Women's Rights and a monitoring mechanism. Nilabati Behera v State of Orissa (1993) 2 SCC 746 was cited for the proposition that an enforceable right to compensation is not alien to a guaranteed right, as a public law remedy under Article 32 distinct from tort. Minister for Immigration and Ethnic Affairs v Teoh 128 ALR 535 was cited for legitimate expectation."
      },
      {
        label: "Subsequent legislation: the 2013 Act",
        text: "The Court's order expressly contemplated that its binding directions would operate only until suitable legislation was enacted to occupy the field. That event came with the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013, which gave statutory force to the Vishaka framework. The Act carries forward a statutory definition of sexual harassment, places duties on employers to provide a safe working environment and to prevent harassment, and requires constitution of an Internal Committee in organisations above the prescribed size, headed by a woman with at least half its members women and including a member from an NGO or body familiar with the issue. It provides for Local Committees to reach the unorganised sector and for annual reporting. For the simulation, the Act is useful both as evidence of the enduring correctness of the 1997 holding and as a foil: ask whether the guidelines added anything the later statute did not, and whether the 2013 Act fully implements the confidentiality and third-party independence guarantees."
      },
      {
        label: "Advocacy angles for the simulation",
        text: "For the petitioners, the strongest line is systemic: a safe working environment is a precondition to Article 19(1)(g), and the absence of any complaint forum makes the formal right to work illusory for women. Stress that the Court itself said a mandamus must carry preventive directions because violations recur. For the State and Union, the productive argument is not that harassment is acceptable but that judicial norms must be administratively workable, consistent with federal and executive competence, and respectful of the pending separate criminal case. Amicus should defend the constitutional technique of reading CEDAW into fundamental rights where there is a domestic void and no inconsistency. Bench candidates should probe two tensions: how a committee can be both confidential and accountable through annual reporting, and how third-party NGO participation avoids senior-level pressure without compromising employer responsibility. All sides must remember that the judgment deliberately says little about the underlying criminal incident."
      }
    ]
  },
  {
    id: "dk-basu-1996",
    title: "D.K. Basu v. State of West Bengal — Custodial Death, Arrest Safeguards & Compensation (AIR 1997 SC 610)",
    category: "Constitutional Law · Custodial Death / Police Torture (Articles 21 & 22)",
    court: "Supreme Court of India, 2-Judge Bench (Kuldip Singh & A.S. Anand, JJ.), 18 December 1996",
    charges: "No formal criminal charge — public interest writ petition (criminal) under Article 32 invoking Articles 21 and 22; allegations of lock-up death and torture; statutory framework CrPC ss. 41, 46, 49, 50, 53-55, 56, 57, 167, 176 (modern BNSS ss. 35, 43, 46, 47, 51, 53-56, 57, 58, 187, 196); penal provisions IPC ss. 220, 330, 331 (BNS s. 120(1)-(2))",
    summary: "Acting on a 26 August 1986 letter from the Executive Chairman, Legal Aid Services, West Bengal, and a later letter about the custodial death of Mahesh Bihari, the Supreme Court treated the material as a public interest petition under Article 32 and issued notices to all States and the Law Commission. The Court held that custodial torture and death strike at the Rule of Law and that Article 21 and Article 22(1) rights survive arrest; it laid down eleven binding safeguards for arrest and detention — visible identification and name tags, a witness-attested and countersigned memo of arrest, intimation to a friend or relative, diary entries, an injury inspection memo and medical examination every 48 hours, copies to the Magistrate, access to counsel during interrogation, and a district and State control room — to operate until legislation supersedes them. It reaffirmed Nilabati Behera: for an established infringement of the right to life in custody the State is vicariously liable on a principle of strict liability, sovereign immunity is no answer, and monetary compensation in public law is an appropriate remedy, compensatory rather than punitive, without prejudice to a civil suit. Failure to follow the safeguards invites departmental action and contempt of court.",
    sourceDocTitle: "D.K. Basu v. State of West Bengal",
    parties: [
      {
        side: "judge",
        name: "Hon'ble Justice Kuldip Singh",
        role: "Judge, Supreme Court of India (bench member credited as author in the reported metadata)",
        persona: "Constitutional purist with a strong Rule-of-Law instinct. Frames custodial violence as an assault on human dignity and insists that courts must forge new tools to protect Article 21. Patient with the amicus, visibly sceptical of States that claim 'everything is well', and insistent that a declaration alone is no remedy.",
      },
      {
        side: "judge",
        name: "Hon'ble Dr. A.S. Anand",
        role: "Judge, Supreme Court of India (author of the reported opinion, 'Dr. Anand, J.')",
        persona: "Author of the reasoning reproduced in the digest. Asks searching questions about arrest diaries, medical evidence and the impossibility of proof when the lock-up is beyond public gaze. Insists on contemporaneous recording, transparency, accountability and public-law compensation.",
      },
      {
        side: "prosecution",
        name: "Counsel for the Petitioners (D.K. Basu & Ashok K. Johri)",
        role: "Lead Counsel, Legal Aid Services, West Bengal — public interest petition under Article 32",
        persona: "Public-interest litigator. Grounds the petition in the letter of 26 August 1986 and the newspaper reports of lock-up deaths, then folds in Johri's 29 July 1987 letter on Mahesh Bihari. Presses for enforceable minimum safeguards and compensation, not abstract declarations.",
      },
      {
        side: "prosecution",
        name: "Dr. A.M. Singhvi",
        role: "Amicus Curiae appointed by the Court to assist on the framing of guidelines",
        persona: "Senior advocate expressly thanked in the judgment for valuable assistance. Synthesises Bar and State submissions into concrete suggestions; useful for bridging positions and for placing the Law Commission's 113th Report and the proposed Section 114-B before the Bench.",
      },
      {
        side: "defense",
        name: "Counsel for the State of West Bengal",
        role: "Respondent's Counsel — State of West Bengal",
        persona: "Defends the counter-affidavit: the police are not hushing up lock-up deaths and action is initiated wherever personnel are found responsible; the writ is misconceived, misleading and untenable. Initially argues that existing CrPC safeguards suffice, but can be pressed to concede the need for uniform, visible norms.",
      },
      {
        side: "witness",
        name: "Smt. Kusum Bihari (simulation name; relative of Mahesh Bihari, Pilkhana, Aligarh)",
        role: "Affiant and kin of the deceased — role-based name, as the digest names the deceased but not his relatives",
        persona: "Grieving relative who learns of the death through the letter Ashok Kumar Johri wrote to the Chief Justice on 29 July 1987. Speaks to the family's exclusion from the lock-up record and to never receiving intimation, an inspection memo or post-mortem information.",
        isWitness: true,
        personality: "Emotional but precise about dates; becomes evasive if pressed for documents she was never given, which is exactly the evidentiary gap the Court seeks to close.",
      },
      {
        side: "witness",
        name: "SI Rakesh Kumar (simulation name; arresting officer)",
        role: "Arresting Officer / station staff — role-based name for the custodial record witness",
        persona: "Custodial officer who must explain the arrest memo, the diary entry naming the next friend informed, the time of production before the Magistrate, whether an inspection memo was signed and a copy given, and whether a lawyer was permitted during questioning.",
        isWitness: true,
        personality: "By-the-book at first, relying on oral practice rather than contemporaneous entries; vulnerable when compared with the eleven requirements, especially the 8 to 12 hour intimation and the 12 hour control-room communication.",
      },
      {
        side: "witness",
        name: "Dr. A. Mukherjee (simulation name; District Medical Officer / jail medical officer)",
        role: "Medical Officer on the approved panel — role-based name for the medical evidence witness",
        persona: "Doctor who would perform the inspection memo at arrest and the examinations every 48 hours; can speak to whether injuries were recorded in writing, whether a copy was supplied, and whether the panel of approved doctors existed at district and tehsil level.",
        isWitness: true,
        personality: "Clinically detached. Distinguishes injuries present at arrest from injuries claimed after custody and resists opining on cause of death without the post-mortem report.",
      },
      {
        side: "witness",
        name: "SI Shyamsunder Trivedi (station in-charge in the Court's cited illustration)",
        role: "Illustrative witness from State of M.P. v. Shyamsunder Trivedi, the Nathu Banjara lock-up death discussed in the judgment",
        persona: "Named in the judgment's illustration: a roznamcha entry claimed Nathu Banjara was released at about 10.30 p.m., while a next-morning report spoke of an 'unknown person' found near a tank. Useful for testing why the Court demanded contemporary records and a non-technical approach to custodial crime.",
        isWitness: true,
        personality: "Defensive and procedural; invokes the panchnama recording no definite cause of death, while the prosecution points to last-seen-together evidence, fabricated clues and hasty cremation as a 'lavaris'.",
      },
    ],
    evidence: [
      {
        label: "P-1",
        title: "PIL Letter of D.K. Basu and Contemporaneous Press Reports (26 August 1986)",
        description: "The letter from the Executive Chairman, Legal Aid Services, West Bengal, to the Chief Justice of India and the news items it enclosed, treated as a writ petition.",
        content: "D.K. Basu, Executive Chairman of Legal Aid Services, West Bengal, a non-political organisation registered under the Societies Registration Act, wrote to the Chief Justice of India on 26 August 1986 enclosing reports in the Telegraph of 20, 21 and 22 July 1986 and in the Statesman and Indian Express of 17 August 1986 on deaths in police lock-ups. The letter urged the development of 'custody jurisprudence', modalities for compensating victims or their families, and accountability, noting that efforts are often made to hush up lock-up deaths so that the crime goes unpunished and 'flourishes'. It asked that the letter and news items be treated as a public interest writ petition. The Court did so and issued notice on 9 February 1987. Use this exhibit to establish the genesis of the jurisdiction, its all-India character, and the petitioners' standing as a legal-aid body rather than a private litigant.",
      },
      {
        label: "P-2",
        title: "Ashok Kumar Johri's Letter and the Death of Mahesh Bihari (29 July 1987)",
        description: "Second petition and the Court's 14 August 1987 order expanding the inquiry to all States and the Law Commission.",
        content: "Ashok Kumar Johri addressed a letter to the Chief Justice of India on 29 July 1987 drawing attention to the death of one Mahesh Bihari of Pilkhana, Aligarh, in police custody. It was treated as a second writ petition and directed to be listed with D.K. Basu's petition. By its order of 14 August 1987 the Court observed that allegations of 'lock-up deaths' were increasing in almost every State, that there appeared to be no effective machinery to deal with them, and directed notices to all State Governments and to the Law Commission of India for suggestions returnable in two months. Affidavits followed from West Bengal, Orissa, Assam, Himachal Pradesh, Madhya Pradesh, Haryana, Tamil Nadu, Meghalaya, Maharashtra, Manipur, the Union Territory of Chandigarh and the Law Commission. Argue from this exhibit that the jurisdiction is preventive as well as remedial.",
      },
      {
        label: "P-3",
        title: "Counsel's Authorities: Custodial Jurisprudence and Reform",
        description: "Brief of precedents and Law Commission material for submissions; some items are advocacy authorities not discussed in the reported judgment.",
        content: "Authorities for the simulation: Joginder Kumar v. State (1994) 4 SCC 260, requiring reasonable satisfaction before arrest and warning that 'no arrest can be made because it is lawful'; Nilabati Behera (spelt Neelabati Bahera in the digest) v. State of Orissa (1993) 2 SCC 746, where compensation was awarded to the mother of a young man beaten to death in custody and sovereign immunity was held unavailable; and State of M.P. v. Shyamsunder Trivedi, where an acquittal was reversed, convictions under Section 304 Part II/34 IPC were recorded, and fines of Rs. 20,000 to Rs. 50,000 were directed to be paid to the heirs with safeguards on disbursement. Counsel may also cite Sunil Batra v. Delhi Administration and Prem Shankar Shukla v. Delhi Administration for the propositions that constitutional rights survive confinement and that restraint must be no more than necessary; those two are advocacy authorities and are not discussed in the reported judgment. The Law Commission's 113th Report recommended Section 114-B of the Indian Evidence Act.",
      },
      {
        label: "J-1",
        title: "The Eleven Requirements for Arrest and Detention",
        description: "The Court's operative directions, issued until legal provisions are made, reproduced in substance.",
        content: "The Court directed the following to be followed in all cases of arrest or detention until legal provision is made: (1) accurate, visible and clear identification and name tags with designations for personnel, their particulars entered in a register; (2) a memo of arrest prepared at the time, attested by at least one witness who is a family member or a respectable person of the locality, countersigned by the arrestee and recording date and time; (3) a friend, relative or person interested in the arrestee's welfare to be informed as soon as practicable of the arrest and place of detention, unless the attesting witness is himself such a friend or relative; (4) where the next friend lives outside the district or town, intimation through the District Legal Aid Organisation and the police station concerned by telegraph within 8 to 12 hours; (5) the arrestee to be made aware of the right to have someone informed as soon as arrested; (6) a detention-diary entry recording the arrest, the next friend informed and the officials in custody; (7) an inspection memo of major and minor injuries at arrest if requested, signed by both, with a copy to the arrestee; (8) examination by a trained doctor on the approved panel every 48 hours; (9) copies of the memo and related documents to the Illaqa Magistrate; (10) access to a lawyer during interrogation, though not throughout; (11) a control room at district and State headquarters, information within 12 hours displayed on a conspicuous notice board.",
      },
      {
        label: "J-2",
        title: "Constitutional and Statutory Scheme — Then and Now",
        description: "Articles 20(3), 21 and 22 read with Chapter V CrPC and the corresponding BNSS provisions.",
        content: "Article 21 forbids deprivation of life or personal liberty save by procedure established by law and has been read to include the right to live with human dignity, and therefore protection against torture. Article 22(1) requires that an arrestee be informed of the grounds and be free to consult a legal practitioner of choice; Article 22(2) requires production before the nearest Magistrate within 24 hours excluding journey time; Article 20(3) protects against self-incrimination. Chapter V CrPC supplies the statutory layer: s. 41 arrest without warrant, s. 46 manner of arrest, s. 49 no unnecessary restraint, s. 50 grounds and bail intimation, ss. 53, 54 and 55 medical examination and identification, s. 56 production without delay, s. 57 the 24-hour rule, s. 167 remand and s. 176 the Magistrate's inquiry into cause of death. The corresponding BNSS provisions are ss. 35, 43, 46, 47, 51, 53 to 56, 57, 58, 187 and 196. Note that several protections were judicially reinforced because statutory text alone had not prevented custodial crime.",
      },
      {
        label: "R-1",
        title: "State's Counter-Affidavit and Law Commission Material",
        description: "The respondent's pleaded case and the reform material placed before the Court.",
        content: "In response to the notice of 9 February 1987 the State of West Bengal filed a counter maintaining that the police were not hushing up lock-up deaths and that wherever personnel were found responsible action was being initiated; it characterised the writ as misconceived, misleading and untenable in law. Other States filed affidavits, many initially asserting that 'everything was well' within their jurisdictions. The Law Commission forwarded its 113th Report on injuries in police custody and suggested Section 114-B of the Indian Evidence Act, under which an injury sustained while a person was in police custody would raise a presumption that the custodian caused it, the court having regard to the period of custody, the victim's statement, medical evidence and any record made by a Magistrate. The Court recorded that counsel ultimately rose above their briefs and assisted in framing guidelines. Use R-1 to test whether departmental action is an adequate constitutional answer.",
      },
      {
        label: "R-2",
        title: "Arrest Diary, Roznamcha Entries and Medical / Post-Mortem Record",
        description: "Record-keeping material discussed in the judgment, consolidated as a simulation exhibit.",
        content: "In the Court's Shyamsunder Trivedi illustration, Nathu Banjara was tortured at Rampura police station on 13 October 1986 and died in custody. The defence relied on a roznamcha entry (Ex. P/22A) recording release at about 10.30 p.m., a death report (Ex. P/9) about an 'unknown person' found by a tank the next morning, and a panchnama (Ex. P/27) stating that no definite cause of death was known. The High Court reversed the acquittal, relying on the deceased being last seen alive at the station, fabricated documentary clues and hasty cremation as a 'lavaris'. The reported judgment contains no post-mortem findings for D.K. Basu himself; for the simulation, any post-mortem advanced by a party should be treated as a contested contention, tested against the Court's requirement of an arrest-time injury memo and medical examination every 48 hours. Ask the medical witness whether the entries were contemporaneous.",
      },
    ],
    chunks: [
      {
        label: "Fact background",
        text: "The proceeding began not with a charge sheet but with a letter. On 26 August 1986 the Executive Chairman of Legal Aid Services, West Bengal, wrote to the Chief Justice of India about newspaper reports of deaths in police lock-ups, asking the Court to develop 'custody jurisprudence', to devise compensation for victims and families, and to secure accountability because lock-up deaths were often hushed up. The letter was treated as a writ petition and notice issued on 9 February 1987. A second letter from Ashok Kumar Johri on 29 July 1987 about Mahesh Bihari of Pilkhana, Aligarh, was tagged with it. On 14 August 1987 the Court issued notices to all States and the Law Commission. Affidavits came from numerous States and from the Law Commission; the Court also invited Dr. A.M. Singhvi to assist as amicus. The judgment is therefore a preventive constitutional inquiry into police powers, not an adjudication of a single murder charge.",
      },
      {
        label: "Constitutional provisions",
        text: "Article 21 provides that no person shall be deprived of life or personal liberty except according to procedure established by law. The Court reiterates that this expression includes the right to live with human dignity, and therefore carries a guarantee against torture and assault by the State or its functionaries, whether during investigation, interrogation or otherwise. Article 22(1) forbids detention without informing the arrestee of the grounds and guarantees the right to consult and be defended by a legal practitioner of choice. Article 22(2) requires production before the nearest Magistrate within 24 hours, excluding journey time. Article 20(3) bars compulsion to be a witness against oneself. Crucially, the Court answers its own question — does a citizen shed fundamental rights the moment a policeman arrests him? — with an emphatic no. Convicts, undertrials and detainees retain Article 21 rights subject only to restrictions permitted by law.",
      },
      {
        label: "Statutory map",
        text: "Chapter V of the CrPC, 1973 governs arrest. Section 41 permits arrest without warrant in specified circumstances; s. 46 lays down the manner of arrest; s. 49 forbids more restraint than is necessary to prevent escape; s. 50 requires communication of the full particulars of the offence and the grounds, plus intimation of the right to bail; ss. 53, 54 and 55 deal with medical examination and identification; s. 56 requires production before a Magistrate without unnecessary delay; s. 57 echoes Article 22(2); s. 167 governs remand; and s. 176 requires a Magistrate's inquiry when a person dies in custody. In the BNSS the corresponding provisions are s. 35 (arrest without warrant), s. 43 (manner), s. 46 (restraint), s. 47 (grounds), ss. 51, 53 to 56 (medical, identification, health and safety), s. 57, s. 58, s. 187 and s. 196. The Court's point is that these provisions existed yet custodial violence persisted.",
      },
      {
        label: "Issues framed",
        text: "Three questions structure the hearing. First, can the Court under Article 32 develop enforceable 'custody jurisprudence' where existing law is not enforced, or must it merely declare the law? Second, what minimum procedure must police follow at and after arrest so that the arrested person's dignity is not left to the goodwill of the custodian? Third, is a declaration enough when a life has already been lost in custody, or does the Court have power in public law to award monetary compensation against the State? An allied evidentiary question runs through the judgment: with the lock-up beyond public gaze, witnesses either policemen or frightened co-prisoners, and station records in the hands of the accused officers, how is a custodial tort or death ever to be proved? The Law Commission's answer was a statutory presumption; the Court's answer combined guidelines, strict liability in compensation and a call for legislative change.",
      },
      {
        label: "Eleven safeguards (substance)",
        text: "The eleven requirements: (1) visible, accurate name tags and identification for personnel, with particulars in a register; (2) a memo of arrest at the time, attested by a family member or respectable local witness, countersigned by the arrestee and dated and timed; (3) intimation to a friend, relative or interested person of the arrest and place of detention, unless the attesting witness is that person; (4) where the next friend lives outside the district or town, intimation through the District Legal Aid Organisation and the police by telegraph within 8 to 12 hours; (5) the arrestee must be told of that right immediately; (6) a detention-diary entry naming the next friend informed and the officials in custody; (7) at request, an inspection memo of all major and minor injuries at arrest, signed by both and copied to the arrestee; (8) examination by a trained doctor on the approved panel every 48 hours; (9) copies of the documents sent to the Illaqa Magistrate; (10) permission to meet a lawyer during interrogation, though not throughout; (11) a district and State control room, informed within 12 hours and displaying the information on a conspicuous notice board.",
      },
      {
        label: "Burden of proof in custody",
        text: "The Court dwelled on the practical impossibility of proving torture in a police station: deaths are not entered in lock-up records, bodies are disposed of or described as deaths after release, first information reports from kin are not entertained, and prosecutions end in acquittal for want of direct evidence. It noted with approval the Law Commission's 113th Report recommendation to insert Section 114-B in the Indian Evidence Act: if a person sustained injury while in police custody, the court may presume that the officer having custody caused it, having regard to the period of custody, the victim's statement, medical evidence and any Magistrate's record. The Court lamented that the amendment had not been made and invited Parliament's attention. In State of Madhya Pradesh v. Shyamsunder Trivedi, the appreciation of last-seen-together circumstances and false records led to convictions under Section 304 Part II/34 IPC. In the simulation, argue the presumption as a counsel's submission, not as an enacted section.",
      },
      {
        label: "Compensation in public law",
        text: "The Court holds that a mere declaration of custodial violence or lock-up death is no meaningful remedy. Drawing on Nilabati Behera, Rudul Shah, Bhim Singh, Saheli and decisions from Ireland, Trinidad and Tobago and New Zealand, it affirms that where infringement of the fundamental right to life is established, compensation is an appropriate and sometimes the only effective redress. The claim lies in public law, not in tort: the State is vicariously liable on a principle of strict liability, the defence of sovereign immunity is unavailable, and the State may seek indemnity from the wrongdoer. The emphasis is compensatory, not punitive — the object is to apply balm to the wounds, while punishment is left to the criminal courts. Quantum depends on the facts; no straitjacket formula exists. Compensation is in addition to traditional remedies, without prejudice to a civil suit, and any civil damages may be adjusted against it.",
      },
      {
        label: "Precedents and reform",
        text: "Joginder Kumar v. State (1994) 4 SCC 260 is the immediate precursor: existence of the power to arrest is one thing, justification for using it another, and a lawyer's five-day 'assistance' to police was disbelieved. Nilabati Behera v. State of Orissa (1993) 2 SCC 746 supplies the compensation principle and rejects sovereign immunity for contravention of Article 21. Neelabati Bahera is the spelling used in the digest and is the same authority. State of Madhya Pradesh v. Shyamsunder Trivedi supplies the investigative illustration: Nathu Banjara died at Rampura station, the defence relied on a roznamcha release entry and a panchnama of an unknown body, and the Supreme Court restored convictions, directing fines to be paid to the heirs. Sunil Batra and Prem Shankar Shukla may be argued by counsel as part of the wider Article 21 prison-restraint line, but the reported judgment does not discuss them; frame them as advocacy, not as the Court's own citations.",
      },
      {
        label: "Advocacy angles: petitioner and State",
        text: "For the petitioners and amicus: the safeguards flow from Articles 21 and 22(1), are to be strictly followed, and apply with equal force to other governmental agencies; breach attracts departmental action and contempt of court, with proceedings maintainable in any High Court of territorial jurisdiction. Press for circulation by the Director General of Police and Home Secretary to every police station, notification at a conspicuous place, and publicity through radio, television and local-language pamphlets. For the State: the counter says police do not suppress lock-up deaths and that action is taken against guilty personnel; argue that existing CrPC provisions already cover arrest, medical examination and remand, that the directions were interim 'till legal provisions are made', and that compensation must be compensatory with no fixed formula. Expect the Bench to ask what concrete record exists for each safeguard in the particular custody.",
      },
    ],
  },
  {
    "id": "shreya-singhal-2015",
    "title": "Shreya Singhal v. Union of India — 2015 INSC 257",
    "category": "Constitutional · Free Speech & IT Law",
    "court": "Supreme Court of India (Two-Judge Bench: Justices R.F. Nariman and J. Chelameswar)",
    "charges": "Constitutional challenge under Art. 32 to Information Technology Act 2000 § 66A, § 69A, § 79; alleged violations of Constitution of India Arts. 14, 19(1)(a), 19(2), 21",
    "summary": "A batch of writ petitions challenged Section 66A of the Information Technology Act, 2000 after arrests including the arrest of two young women in Palghar, Maharashtra, over a Facebook post, alleging that the provision criminalised vague and overbroad online speech. The Supreme Court struck down Section 66A in its entirety as violative of Article 19(1)(a) and not saved by Article 19(2), holding it void for vagueness, overbreadth, and an unconstitutional chilling effect on free speech. The Court upheld Section 69A and the 2009 Blocking Rules as constitutionally valid with procedural safeguards, and read down Section 79(3)(b) and Rule 3(4) of the 2011 Intermediary Guidelines to require actual knowledge through a court order or government notification confined to Article 19(2) grounds.",
    "sourceDocTitle": "Shreya Singhal v. Union of India",
    "parties": [
      {
        "side": "judge",
        "name": "Justice Rohinton Fali Nariman",
        "role": "Presiding Judge, Supreme Court of India",
        "persona": "Analytically precise and doctrinally rigorous. Tests restrictions against Article 19(2) categories, insists on clear definitions for penal speech offences, and probes the difference between discussion, advocacy, and incitement."
      },
      {
        "side": "judge",
        "name": "Justice J. Chelameswar",
        "role": "Companion Judge, Supreme Court of India",
        "persona": "Measured and constitutionally focused. Presses counsel on procedural safeguards, proportionality of state power over online speech, and the practical impact of enforcement on ordinary citizens."
      },
      {
        "side": "prosecution",
        "name": "Mr. Tushar Mehta, Additional Solicitor General",
        "role": "Lead Counsel for Union of India",
        "persona": "Defends the statutory scheme as necessary to tackle online abuse, phishing, and offensive communications. Argues for reading down rather than striking down, invokes legislative deference, and maintains that safeguards and existing interpretations prevent arbitrary misuse.",
        "personality": "Composed, doctrinal, and policy-oriented; concedes implementation concerns but resists a facial invalidation of the provision."
      },
      {
        "side": "defense",
        "name": "Senior Advocate for Petitioners (W.P. (Crl.) No. 167 of 2012)",
        "role": "Lead Counsel for Shreya Singhal and Connected Petitioners",
        "persona": "Forcefully argues that Section 66A criminalises innocuous speech through undefined terms like annoyance and inconvenience, creating vagueness, overbreadth, and chilling effects. Emphasises real-world arrests and the absence of any Article 19(2) nexus.",
        "personality": "Direct and rights-focused; uses concrete arrest examples and constitutional first principles to expose arbitrary enforcement."
      },
      {
        "side": "witness",
        "name": "Ms. Shaheen Dhada",
        "role": "Arrested Student / Affiant on Section 66A Enforcement",
        "persona": "Deposes to the Palghar incident where a Facebook post and a like led to arrest under Section 66A, illustrating the provision's chilling effect on ordinary online expression.",
        "isWitness": true,
        "personality": "Soft-spoken but clear; factual about the arrest experience, social consequences, and fear of posting online afterward."
      },
      {
        "side": "witness",
        "name": "Inspector Rajesh Pawar",
        "role": "Investigating Officer, Palghar Police Station (FIR Registration)",
        "persona": "Police officer called to explain the registration of FIR and arrest decisions in the Palghar Facebook post matter, and how officers interpreted terms such as annoyance and offensiveness on the ground.",
        "isWitness": true,
        "personality": "Procedural and defensive; relies on complaint receipt and statutory language, but struggles when asked for objective standards distinguishing lawful criticism from criminal annoyance."
      },
      {
        "side": "witness",
        "name": "Ms. Ananya Iyer",
        "role": "Intermediary Compliance Representative, Social Media Platform",
        "persona": "Platform representative explaining how intermediaries receive takedown requests, court orders, and government blocking directions, and the operational burden of judging legality across millions of user posts.",
        "isWitness": true,
        "personality": "Technical and cautious; emphasizes the need for clear legal process, actual notice, and safeguards before restricting user content."
      }
    ],
    "evidence": [
      {
        "label": "P-1",
        "title": "Section 66A, Information Technology Act, 2000 (as amended 2009)",
        "description": "Impugned penal provision criminalising online messages causing annoyance, inconvenience, insult, enmity, hatred, or ill will.",
        "content": "Section 66A punished sending, by computer resource or communication device, information that is grossly offensive or menacing; information known to be false used persistently to cause annoyance, inconvenience, danger, obstruction, insult, injury, criminal intimidation, enmity, hatred, or ill will; or an electronic mail/message sent to cause annoyance, inconvenience, deception, or misleading origin. The provision carried imprisonment up to three years and fine. Petitioners contend its undefined terms fail to give fair notice, invite arbitrary arrests, and do not map to any Article 19(2) ground, making it facially unconstitutional."
      },
      {
        "label": "P-2",
        "title": "FIR and Arrest Record — Palghar Facebook Post Incident",
        "description": "Police record reflecting arrest of two young women after a Facebook post and a like concerning a Mumbai shutdown.",
        "content": "The record concerns the Palghar incident in Maharashtra where two young women were arrested following a Facebook post criticising a shutdown and a related 'like'. The petitioners rely on this episode as a paradigmatic example of Section 66A's misuse: ordinary political expression was treated as criminal because it allegedly caused annoyance or offense. The exhibit is used to demonstrate the chilling effect on citizens, the subjective discretion exercised by police, and the absence of objective standards in the statutory text."
      },
      {
        "label": "R-1",
        "title": "Section 69A, IT Act & Information Technology (Procedure and Safeguards for Blocking for Access of Information by Public) Rules, 2009",
        "description": "Blocking power and procedural safeguards relied upon by the Union to justify regulated online restrictions.",
        "content": "Section 69A authorises the Central Government or specially authorised officer to direct blocking of public access to online information in the interest of sovereignty and integrity of India, defence, security of the State, friendly relations with foreign States, public order, or incitement to cognizable offences, with reasons recorded in writing. The 2009 Rules prescribe procedure, including a designated officer, committee review, and opportunity of hearing to the originator, and also recognise blocking through a competent court order. The Union argues these safeguards make Section 69A a narrow, constitutionally valid restriction."
      },
      {
        "label": "R-2",
        "title": "Section 79, IT Act & Information Technology (Intermediary Guidelines) Rules, 2011",
        "description": "Intermediary safe harbour framework and due-diligence obligations at issue in the read-down challenge.",
        "content": "Section 79 grants intermediaries conditional exemption from liability for third-party content, but Section 79(3)(b) removes protection where an intermediary fails to expeditiously remove or disable access upon receiving actual knowledge or being notified by the appropriate government or its agency. Rule 3(4) of the 2011 Intermediary Guidelines required action on user complaints alleging unlawfulness. Petitioners argue this regime enables private censorship by forcing intermediaries to adjudicate legality. The Court examines whether 'actual knowledge' must be tied to a court order or government notification under Article 19(2)."
      },
      {
        "label": "J-1",
        "title": "Comparative and Constitutional Precedents on Speech Restrictions",
        "description": "Authorities discussed in the judgment on vagueness, clear and present danger, advocacy/incitement, and public order.",
        "content": "The judgment canvasses U.S. First Amendment jurisprudence, including Abrams v. United States on the marketplace of ideas, Whitney v. California on clear and present danger and the advocacy-incitement distinction, Chaplinsky v. New Hampshire on narrowly limited unprotected classes, and Brandenburg v. Ohio's imminent lawless action formulation as discussed in argument. Indian precedents include Romesh Thappar v. State of Madras, Kameshwar Prasad v. State of Bihar, and Superintendent, Central Prison v. Ram Manohar Lohia on public order. These authorities frame whether Section 66A targets protected discussion or only incitement within Article 19(2)."
      },
      {
        "label": "P-3",
        "title": "Affidavit on Chilling Effect and Arbitrary Enforcement",
        "description": "Compilation of instances and user impact showing self-censorship caused by uncertain criminal liability for online speech.",
        "content": "The affidavit records multiple instances where citizens, journalists, and ordinary users were subjected to complaints or arrests under Section 66A for posts perceived as offensive, annoying, or inconvenient. It explains that users cannot reasonably predict criminal liability because the statute does not define key terms or require mens rea calibrated to Article 19(2) harms. The material supports the petitioners' chilling effect argument: speakers avoid legitimate criticism, satire, or dissent to evade police action. The defence responds that isolated misuse cannot invalidate a statute, while petitioners contend the text itself invites arbitrariness."
      }
    ],
    "chunks": [
      {
        "label": "Factual Background: Palghar Arrests and Writ Petitions",
        "text": "The constitutional challenge in Shreya Singhal arose from a batch of writ petitions under Article 32 questioning online speech regulation under the Information Technology Act, 2000. Section 66A, inserted by the 2009 Amendment, became the immediate cause of concern after several arrests, including the arrest of two young women in Palghar, Maharashtra, over a Facebook post criticising a bandh and a related like. The petitioners argued that the provision was being used to punish ordinary expression. The Union of India defended the provision as a response to new forms of online misuse, including offensive messages, phishing, and identity-related harms."
      },
      {
        "label": "Statutory Scheme: Sections 66A, 69A and 79",
        "text": "Section 66A criminalised sending grossly offensive or menacing information, false information sent persistently to cause annoyance, inconvenience, danger, obstruction, insult, injury, criminal intimidation, enmity, hatred, or ill will, and electronic mail sent for annoyance, inconvenience, deception, or misleading origin. Section 69A empowered the Central Government to block public access to information on specified Article 19(2)-adjacent grounds through written reasoned orders and prescribed safeguards. Section 79 provided intermediary safe harbour but removed it under Section 79(3)(b) upon actual knowledge or government notice, while the 2011 Intermediary Guidelines imposed due-diligence obligations including takedown on complaints."
      },
      {
        "label": "Constitutional Issues: Vagueness, Overbreadth, Chilling Effect",
        "text": "The principal issues were whether Section 66A violated Article 19(1)(a) and was saved by Article 19(2), and whether it was void for vagueness under Article 14 and arbitrary in effect under Article 21. Petitioners argued that terms like annoyance, inconvenience, grossly offensive, and menacing were undefined and subjective, leaving citizens without fair notice and giving police unchecked discretion. They also advanced overbreadth: the provision swept within protected speech, including discussion and advocacy that caused no incitement. The chilling effect argument stressed that fear of arrest would deter legitimate online expression, while the Union argued the provision could be read down and misuse was not a ground for invalidity."
      },
      {
        "label": "Holding: Section 66A Struck Down",
        "text": "The Supreme Court struck down Section 66A in its entirety as unconstitutional. Applying Article 19(1)(a) and the limits in Article 19(2), the Court held that the provision covered speech far beyond permitted grounds such as public order, incitement, defamation, decency, or morality. It found the provision vague because ordinary people could not know what conduct was criminal and enforcement authorities could act arbitrarily. It also held Section 66A overbroad because it punished protected discussion and advocacy, not merely incitement. The Court recognised a chilling effect on free expression, concluding that the possibility of abuse was embedded in the statutory language itself, not merely in executive action."
      },
      {
        "label": "Section 69A and Blocking Rules Upheld",
        "text": "Unlike Section 66A, Section 69A was upheld as a narrowly drawn blocking mechanism. The Court noted that blocking can occur only on specified grounds: sovereignty and integrity of India, defence of India, security of the State, friendly relations with foreign States, public order, or preventing incitement to cognizable offences. The power must be exercised by written reasoned order and is subject to the 2009 Blocking Rules, which include procedural safeguards such as review by a committee and an opportunity of hearing to the originator. The Court also observed that blocking may occur pursuant to a competent court order, reinforcing that Section 69A is not an unguided executive censorship power."
      },
      {
        "label": "Section 79 and Intermediary Guidelines Read Down",
        "text": "The Court upheld Section 79 as an exemption provision but read down Section 79(3)(b). It held that an intermediary loses safe harbour only upon receiving actual knowledge through a court order or being notified by the appropriate government or its agency that unlawful acts relatable to Article 19(2) are to be removed. The Court rejected requiring intermediaries to adjudicate millions of private complaints, warning that such a duty would create private censorship. Rule 3(4) of the Information Technology (Intermediary Guidelines) Rules, 2011 was read down similarly. With these caveats, Section 79 and the 2011 Guidelines were held valid."
      },
      {
        "label": "Precedents and Speech Doctrine",
        "text": "The judgment situates Indian free speech doctrine in a comparative constitutional context. It discusses U.S. authorities such as Abrams v. United States on the marketplace of ideas, Whitney v. California on advocacy versus incitement and clear and present danger, and Chaplinsky v. New Hampshire on limited unprotected categories. On the Indian side, it draws on Romesh Thappar v. State of Madras for the foundational role of free speech in democracy, and public order jurisprudence including Ram Manohar Lohia to distinguish public order from mere law and order. These authorities support the Court's conclusion that Section 66A penalised protected expression without a proximate Article 19(2) justification."
      },
      {
        "label": "Advocacy Angles for Simulation",
        "text": "Petitioners should argue that Section 66A's undefined terms made ordinary political speech criminal, using the Palghar arrests to show real chilling effects and arbitrary police discretion. They can stress that annoyance or inconvenience is not an Article 19(2) ground and that the internet cannot be subjected to lower constitutional protection. The Union can contend that online harm spreads rapidly, Parliament acted to address cyber abuse, and safeguards or reading down can preserve the provision. On Sections 69A and 79, counsel should test whether procedural safeguards, court-order notice, and Article 19(2) limits adequately prevent executive or private censorship while preserving legitimate governance of unlawful content."
      }
    ]
  },
  {
    id: "puttaswamy-2017",
    title: "K.S. Puttaswamy (Retd.) v. Union of India - Privacy, Aadhaar and the 2017 INSC 801 Reference",
    category: "Constitutional Law / Fundamental Rights / Right to Privacy (Aadhaar-UIDAI Reference)",
    court: "Supreme Court of India (Nine-Judge Constitution Bench)",
    charges: "Constitutional reference under Articles 12, 14, 19, 21 and 32 of the Constitution of India; challenge to the Aadhaar-Unique Identification Authority of India scheme and the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016; reconsideration of M.P. Sharma v. Satish Chandra and Kharak Singh v. State of U.P.",
    summary: "The nine-judge Constitution Bench answered the reference unanimously: privacy is a fundamental right, intrinsic to the right to life and personal liberty under Article 21 and part of the freedoms guaranteed by Part III, and M.P. Sharma and Kharak Singh were overruled insofar as they denied it. The plurality held privacy is not absolute; a lawful intrusion requires a law, a legitimate state aim and proportionality, meaning a rational nexus between object and means under a procedure that is fair, just and reasonable. Five judges wrote separately, differing in route and emphasis but not in result. The plurality declined to enumerate every privacy interest, treating reasonableness and case-by-case development as the path to justiciable claims, while counsel for Gujarat urged a reasonable-expectation screen separating serious from trivial invasions.",
    sourceDocTitle: "K.S. Puttaswamy (Retd.) v. Union of India",
    parties: [
      {
        side: "judge",
        name: "Hon'ble CJI Jagdish Singh Khehar",
        role: "Chief Justice of India; presiding judge and member of the plurality",
        persona: "Presides over the reference and joins the plurality authored by Chandrachud J. Keeps counsel to the questions actually referred and insists on institutional integrity and judicial discipline.",
        personality: "Stern about scope; stops advocates who drift into the merits of Aadhaar and asks which constitutional provision and which remedy they are addressing."
      },
      {
        side: "judge",
        name: "Hon'ble Justice J. Chelameswar",
        role: "Supreme Court Judge; separate concurring opinion",
        persona: "Textual and historical in approach; tests whether unenumerated rights can be fundamental and whether the Constituent Assembly's silence amounts to exclusion.",
        personality: "Sharp on originalist arguments; presses counsel to explain how a dignity-based liberty fits the constitutional text."
      },
      {
        side: "judge",
        name: "Hon'ble Justice S. A. Bobde",
        role: "Supreme Court Judge; separate concurring opinion",
        persona: "Carefully records the competing submissions and examines whether the reasoning of Kharak Singh survives Cooper and Maneka.",
        personality: "Patient but probing; asks for the precise ratio of each older precedent before accepting or discarding it."
      },
      {
        side: "judge",
        name: "Hon'ble Justice R. K. Agrawal",
        role: "Supreme Court Judge; member of the plurality",
        persona: "Joins the plurality; focused on whether State action can point to a valid law, a legitimate aim and a rational connection to that aim.",
        personality: "Concise and procedure-minded; cuts through rhetoric to ask what legal authority justified the intrusion."
      },
      {
        side: "judge",
        name: "Hon'ble Justice Rohinton Fali Nariman",
        role: "Supreme Court Judge; separate concurring opinion",
        persona: "Comparative-law oriented; examines the standard of review, substantive due process and the danger of majoritarian denial of rights, referring to ADM Jabalpur and Koushal.",
        personality: "Intellectually restless; invites counsel to justify any test that would let a majority define the content of a fundamental right."
      },
      {
        side: "judge",
        name: "Hon'ble Justice Abhay Manohar Sapre",
        role: "Supreme Court Judge; separate concurring opinion",
        persona: "Strict about the limits of the reference; reminds counsel that the nine-judge Bench was not constituted to decide the validity of the Aadhaar Act.",
        personality: "Procedurally exacting; rebukes attempts to overrule unrelated decisions or litigate the scheme's policy merits."
      },
      {
        side: "judge",
        name: "Dr Justice D. Y. Chandrachud",
        role: "Supreme Court Judge; author of the plurality opinion",
        persona: "Dignity-centred and rights-protective; structures the analysis through liberty, autonomy, informational privacy, the overruling of older authority and the threefold requirement.",
        personality: "Analytical and expansive in questioning; expects counsel to engage with positive as well as negative obligations and with non-State threats to privacy."
      },
      {
        side: "judge",
        name: "Hon'ble Justice Sanjay Kishan Kaul",
        role: "Supreme Court Judge; separate concurring opinion",
        persona: "Emphasises the privacy of the home, family, marriage, procreation and sexual orientation, and rejects majoritarian answers to constitutional rights.",
        personality: "Warm but firm; asks how technology changes the idea of entry into a house and presses the factual-matrix approach to restrictions."
      },
      {
        side: "judge",
        name: "Hon'ble Justice S. Abdul Nazeer",
        role: "Supreme Court Judge; member of the plurality",
        persona: "Attentive to welfare-state justifications for collecting data and to the need for a carefully structured data-protection regime.",
        personality: "Practical; asks how a ruling protecting privacy can coexist with targeted delivery of subsidies, benefits and services."
      },
      {
        side: "prosecution",
        name: "Gopal Subramanium",
        role: "Senior Counsel for the Petitioners (lead)",
        persona: "Lead challenger; grounds the claim in dignity, autonomy and Article 21 and attacks the premise that privacy must be expressly enumerated to be fundamental.",
        personality: "Eloquent and philosophical; concedes privacy is not absolute but insists any intrusion must satisfy law, legitimate aim and proportionality."
      },
      {
        side: "prosecution",
        name: "Shyam Divan",
        role: "Senior Counsel for the Petitioners",
        persona: "Forensic on the consequences of demographic and biometric collection; urges that technology now permits entry into a citizen's house without knocking.",
        personality: "Precise and tech-aware; pressed on whether consent to one entrant authorises entry by others, he returns to the privacy of the home."
      },
      {
        side: "defense",
        name: "K. K. Venugopal",
        role: "Attorney General for India, for the Union of India and UIDAI",
        persona: "Defends the scheme; argues privacy is vague, not expressly protected and already addressed by statute, invoking M.P. Sharma and Kharak Singh.",
        personality: "Combative but institutional; presses originalist and Constituent Assembly points and tests the consequences for welfare delivery."
      },
      {
        side: "defense",
        name: "Rakesh Dwivedi",
        role: "Senior Counsel for the State of Gujarat (supporting the Union)",
        persona: "Advances the intermediate position: a reasonable-expectation-of-privacy screen, a serious-versus-trivial distinction and a structured proportionality checklist.",
        personality: "Pragmatic and systematic; offers factors on context, family life, injury, sensitivity and prior disclosure, then demands legislation, public interest, nexus and non-excessiveness."
      },
      {
        side: "witness",
        name: "Justice K. S. Puttaswamy (Retd.)",
        role: "Lead Petitioner and first affiant",
        persona: "Retired Supreme Court judge who challenged Aadhaar on privacy grounds; deposes to being asked for demographic and biometric data as a condition of accessing public benefits.",
        isWitness: true,
        personality: "Dignified and measured; frames the dispute as a constitutional principle rather than a personal grievance."
      },
      {
        side: "witness",
        name: "UIDAI Official - Deputy Director (Enrolment & Authentication)",
        role: "Respondent's technical affiant on the Aadhaar architecture",
        persona: "Explains enrolment and authentication: demographic and biometric particulars, central storage, matching at point of use and the stated purpose of targeted delivery under the 2016 Act.",
        isWitness: true,
        personality: "Formal and defensive; concedes the scale of the database but stresses statutory purpose and anti-leakage design, and becomes cautious when pressed on audit and safeguards."
      },
      {
        side: "witness",
        name: "Dr. A. Menon - Technology and Data Protection Expert",
        role: "Independent expert affiant (role-based name)",
        persona: "Technologist addressing aggregation, function creep and re-identification risk; notes the Union's Office Memorandum of 31 July 2017 constituting the Justice B. N. Srikrishna Committee.",
        isWitness: true,
        personality: "Analytic and cautionary; distinguishes anonymity from security and concedes that risk is reduced, not eliminated, by encryption."
      }
    ],
    evidence: [
      {
        label: "P-1",
        title: "Constitutional Provisions and the Frame of the Reference",
        description: "Articles 12, 14, 19, 21 and 32 and the three-judge order that produced the nine-judge reference.",
        content: "Simulator brief on the constitutional frame. Article 21 provides that no person shall be deprived of life or personal liberty except according to procedure established by law; Maneka read that procedure as fair, just and reasonable. Article 14 supplies the guarantee against arbitrariness and the zone of reasonableness; Article 19 protects the specified freedoms, including speech and movement; Article 12 defines the State whose action is challenged; Article 32 gives this Court original writ jurisdiction. W.P. (C) No. 494 of 2012 and connected matters put the Aadhaar-UIDAI scheme under scrutiny. The three-judge order of 11 August 2015 recorded that the norms for and compilation of demographic biometric data were challenged as violating privacy. Counsel should be ready to say which provision does the work and why a constitutional value can be implied rather than enumerated."
      },
      {
        label: "P-2",
        title: "Gobind v. State of Madhya Pradesh, (1975) 2 SCC 148",
        description: "The surveillance and history-sheet case that first articulated an Indian privacy doctrine.",
        content: "Gobind v. State of Madhya Pradesh is the three-judge decision on police history sheets and surveillance under the Madhya Pradesh Police Regulations. The Court took note of Griswold v. Connecticut and the penumbral-rights reasoning, and accepted that privacy could be an emanation from the specific guarantees in Articles 19(1)(a), 19(1)(d) and 21. It also said the right would have to go through a process of case-by-case development and was not absolute; an infringement had to be tested against a compelling state interest and a direct nexus with the object of the regulation. The plurality later observed that much of Gobind proceeded on an assumption that such a right existed. Use this exhibit to argue both the lineage of privacy doctrine and its historic hesitancy."
      },
      {
        label: "P-3",
        title: "R. Rajagopal v. State of Tamil Nadu, (1994) 6 SCC 632",
        description: "Authority on the right to be let alone, publication and commercial exploitation of persona.",
        content: "R. Rajagopal v. State of Tamil Nadu is the line of authority on publication and the right to be let alone. The Court held that the right to privacy is part of the right to life and personal liberty under Article 21 and is also implicit in the freedom of speech and expression under Article 19(1)(a), because freedom of the individual includes the freedom to keep certain matters private. It recognised that publication of true facts about a public figure may be permissible where the matter is of public interest, but not for curiosity or commercial gain, and that no one may commercially exploit another's persona without authority. The reference treats Rajagopal as one of the subsequent decisions that correctly stated the law, subject to the principles laid down in this judgment."
      },
      {
        label: "R-1",
        title: "M.P. Sharma v. Satish Chandra, (1954) SCR 1077",
        description: "Eight-judge decision on search, seizure and Article 20(3), overruled on privacy.",
        content: "M.P. Sharma v. Satish Chandra, District Magistrate, Delhi, was decided by eight judges. An investigation under the Companies Act into an alleged embezzlement and falsification of records led to search warrants and seizure of documents. The challenge under Article 19(1)(f) failed, and the Court held that a search or seizure was not compelled production of documents by the occupier, so Article 20(3) was not infringed. Justice Jagannadhadas observed that the Constitution makers had not subjected search and seizure to a fundamental right to privacy analogous to the Fourth Amendment, and that such a right could not be imported by strained construction into Article 20(3). That observation was pressed by the Attorney General as a full answer to the privacy claim. The nine-judge Bench overruled the decision insofar as it denied constitutional protection."
      },
      {
        label: "R-2",
        title: "Kharak Singh v. State of Uttar Pradesh, (1964) 1 SCR 332",
        description: "Six-judge surveillance case: night visits struck down, privacy denied, dissent later approved.",
        content: "Kharak Singh v. State of Uttar Pradesh was decided by six judges after the petitioner, once challaned for dacoity and released for want of evidence, was placed on a history sheet and subjected to police surveillance under Regulation 236 of the U.P. Police Regulations. The measures included secret picketing, night domiciliary visits, periodic inquiries and reporting of movements. The majority held that a midnight knock did not infringe Article 19(1)(d) because locomotion was not impeded, but struck down night domiciliary visits as an unauthorized intrusion into the home violating personal liberty under Article 21. In dealing with the remaining clauses, the majority stated that the right of privacy was not a guaranteed right under the Constitution. Justice Subba Rao dissented, treating the rights as overlapping. The reference overruled Kharak Singh to the extent of that statement."
      },
      {
        label: "J-1",
        title: "The Threefold Requirement from the Plurality Conclusions",
        description: "Legality, legitimate state aim and proportionality, with fair, just and reasonable procedure.",
        content: "Plurality conclusions in Part T of the reported judgment. An invasion of privacy, like any invasion of life or personal liberty, must meet three requirements: (i) legality, meaning the existence of a law, an express Article 21 requirement; (ii) need, defined as a legitimate state aim, which keeps the law within the zone of reasonableness mandated by Article 14 and screens out manifest arbitrariness; and (iii) proportionality, ensuring a rational nexus between the objects of the law and the means adopted, so that the nature and quality of the encroachment are not disproportionate to the purpose. Judicial review does not re-appreciate the legislature's value judgment but examines palpable or manifest arbitrariness. The procedure must be fair, just and reasonable. Privacy has both a negative content, restraining intrusion, and a positive content, obliging the State to protect the individual. Legitimate aims identified include national security, crime prevention and investigation, innovation and preventing the dissipation of social welfare benefits."
      },
      {
        label: "J-2",
        title: "Aadhaar Record and the Limits of the Nine-Judge Reference",
        description: "Enrolment and authentication backdrop, the 2016 Act, the Srikrishna Committee and the scope caveat.",
        content: "Record extract and simulation note on the Aadhaar backdrop. The connected writ petitions challenge the Aadhaar card scheme, described in the opinions as a database of personal identity and biometric information covering every Indian and as the collection and compilation of demographic and biometric data. The three-judge order of 11 August 2015 noted that the norms for compilation were attacked as violating privacy, which led to the reference. The Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016 is the statutory framework invoked for welfare delivery and authentication. During the hearing the Union placed on record an Office Memorandum dated 31 July 2017 constituting a committee chaired by Justice B. N. Srikrishna to recommend data-protection principles and a draft Bill. Important limit for role-play: the nine-judge Bench repeatedly said it was not deciding the constitutional validity of the Aadhaar Act."
      }
    ],
    chunks: [
      {
        label: "Factual background",
        text: "The litigation began with W.P. (C) No. 494 of 2012, Justice K. S. Puttaswamy (Retd.) and another v. Union of India, and a large batch of transferred cases, writ petitions and contempt petitions. The underlying challenge is to the Aadhaar card scheme, which the Court described as an effort to build a database of personal identity and biometric information covering every Indian, with demographic and biometric particulars collected and compiled for use across public services. Bobde J. called it the world's largest endeavour of its kind. The petitioners argued that the very collection of such data, without a constitutionally recognized right of privacy, violated their freedoms. The Attorney General for India responded that no such fundamental right existed, relying on the eight-judge decision in M.P. Sharma and the six-judge decision in Kharak Singh. Underlying facts about enrolment and authentication are backdrop only: this Bench was asked to decide whether privacy is a protected constitutional value, not to try the Aadhaar Act's validity."
      },
      {
        label: "The reference to nine judges",
        text: "The three-judge Bench's order of 11 August 2015 recorded the Attorney General's objection and the petitioners' answer that M.P. Sharma and Kharak Singh rested on A. K. Gopalan's theory of watertight fundamental rights, already displaced by R. C. Cooper and Maneka Gandhi, and that Maneka had approved Justice Subba Rao's dissent in Kharak Singh. Noting later smaller-Bench decisions in Gobind, R. Rajagopal and PUCL, the three judges found an apparent unresolved contradiction and held that institutional integrity and judicial discipline required scrutiny by a larger Bench, since reading the older observations literally would denude Article 21 of vigour. On 18 July 2017 a Constitution Bench presided over by the Chief Justice ordered that the correctness of the two older decisions be placed before a nine-judge Bench, and the matters were listed accordingly on 19 July 2017. Judgment followed on 24 August 2017."
      },
      {
        label: "Questions before the Bench",
        text: "Counsel were addressed on five questions: whether there is a constitutionally protected right to privacy; if so, whether it is an independent fundamental right or arises from within existing guarantees such as life and personal liberty; the doctrinal foundations of the claim; the content of privacy; and the nature of the State's regulatory power. The Court refused to give an exhaustive catalogue of what privacy includes, preferring to indicate its broad contours: dignity, autonomy, liberty, the home, informational self-determination and the negative and positive dimensions of the right. Related controversies argued but not all resolved included originalist reliance on Constituent Assembly debates, whether statutory data-protection protection displaces a constitutional right, whether privacy is an elitist construct, whether it is merely a common-law right, and the criticism that a substantive due process approach is alien to Indian constitutional law. In a writ reference under Articles 12, 14, 19, 21 and 32, counsel should tie each contention to a concrete provision and remedy."
      },
      {
        label: "Unanimous holding and opinions",
        text: "The operative order disposed of the reference in four terms: M.P. Sharma, which held privacy unprotected, was overruled; Kharak Singh was overruled to the extent it held the same; privacy was protected as an intrinsic part of Article 21 and as part of the freedoms guaranteed by Part III; and the subsequent decisions affirming privacy laid down the correct law. The judgment on behalf of the Chief Justice, Justice R. K. Agrawal, Justice S. Abdul Nazeer and Dr Justice D. Y. Chandrachud was delivered by Chandrachud J. Justices Chelameswar, S. A. Bobde, Abhay Manohar Sapre, Rohinton Fali Nariman and Sanjay Kishan Kaul delivered separate judgments. They differed in route and emphasis - natural law and inalienable rights, dignity, comparative and international law, substantive due process, positive obligations - but not in the result. Role-players should not manufacture a dissent in the reference; the argument is about reasoning, scope and application of the threefold test."
      },
      {
        label: "The threefold test",
        text: "For the plurality, the threefold requirement flows from the interdependence of Article 21's protection of life and personal liberty and Article 14's guarantee against arbitrary state action. First, there must be a law in existence to justify the encroachment; Article 21 permits deprivation only according to a procedure established by law, and Maneka requires that procedure to be fair, just and reasonable. Second, the law must serve a need in terms of a legitimate state aim, keeping it within the zone of reasonableness and free of palpable or manifest arbitrariness; courts review the aim for arbitrariness rather than re-deciding the legislature's value judgment. Third, the means must be proportional to the object, with a rational nexus between the two, so that the quality and extent of the intrusion are not disproportionate to the purpose. Legitimate aims named include national security, preventing and investigating crime, encouraging innovation and the spread of knowledge, and preventing the dissipation of welfare benefits. Privacy also imposes a positive obligation to protect individuals, including against non-State actors."
      },
      {
        label: "Home, family and sexual orientation",
        text: "Justice Kaul's concurrence, at paragraphs 78 and 79, gives the simulation its most human passage. Technology, he accepted, now allows a citizen's house to be entered without knocking, and the intruder may be a State or a non-State actor. It is the individual's choice who enters the house, how he lives and in what relationship; privacy of the home protects the family, marriage, procreation and sexual orientation as aspects of dignity. Permission to one person does not authorize entry by others, and the only check is that the intrusion must not harm another or affect that person's rights, in physical form and through technology. Whether restrictions become necessary depends on the factual matrix of each case, and the prospect of more litigation is no reason to deny a primordial right. Kaul J. also agreed with Chandrachud J. that privacy cannot be denied to a miniscule fraction of the population; majoritarian preference does not govern constitutional rights, and sexual orientation is an attribute of privacy."
      },
      {
        label: "Precedents displaced and affirmed",
        text: "The doctrinal foundation of M.P. Sharma and Kharak Singh was Gopalan's view that the fundamental rights provisions are isolated silos, with Article 21 a residue after Article 19. That view was abrogated by the eleven-judge Bench in R. C. Cooper and developed in Maneka Gandhi, which held that reasonableness under Article 14 infuses Article 21 and expressly approved Justice Subba Rao's dissent in Kharak Singh. M.P. Sharma's observations about the absence of a privacy right, made while rejecting an Article 20(3) challenge to a search and seizure, were accordingly overruled. Kharak Singh was overruled only to the extent it denied privacy, while its invalidation of night domiciliary visits as a violation of ordered liberty remained. Gobind, R. Rajagopal, PUCL and later authorities were affirmed subject to the principles in this judgment. Kaul J. also endorsed the express overruling of ADM Jabalpur, noting its implied overruling in I. R. Coelho."
      },
      {
        label: "Advocacy angles for counsel",
        text: "Petitioners' counsel - Gopal Subramanium, Kapil Sibal, Arvind Datar, Shyam Divan, Anand Grover, Meenakshi Arora, Sajan Poovayya and Jayant Bhushan, with J. S. Attri for Himachal Pradesh - argued from dignity, autonomy and Article 21, stressing informational privacy, non-State actors and the power of technology to enter a home without knocking. For the Union, Attorney General K. K. Venugopal, Tushar Mehta, Rakesh Dwivedi, Aryama Sundaram, Gopal Sankaranarayanan and Arghya Sengupta contended that privacy was vague and inchoate, not expressly protected, already covered by statutes, and a threat to welfare delivery if constitutionalized. Dwivedi for Gujarat proposed an intermediate route: a reasonable expectation of privacy screen asking about context, private or family life, whether the claim is serious or trivial, the injury and extent of disclosure, whether data are sensitive identification material, and whether they were already disclosed. He then urged that infringement be by legislation, in the public interest, reasonable and connected to that interest, not excessive, and subject to other fundamental-rights tests. States divided, some supporting the Union and others the petitioners."
      },
      {
        label: "Scope limits and how to argue the reference",
        text: "Sapre J. expressly declined to entertain attempts to overrule unrelated decisions or to attack the Aadhaar scheme's validity: the Bench was constituted to answer only the questions referred, and a reference court cannot travel beyond them. That limit is a trap for unwary role-players: the correct questions are whether privacy is a fundamental right, how an intrusion is justified, and how the threefold test applies, not whether Aadhaar itself survives. The Court declined an exhaustive catalogue, saying the Constitution must evolve with felt necessities and technological change (Part T, conclusion G). Kaul J. added that interplay with other fundamental rights and the necessity of restrictions depend on the factual matrix. The plurality commended a robust data-protection regime, noting the Union's 31 July 2017 Office Memorandum constituting the Justice B. N. Srikrishna Committee. Arguments should therefore be framed as illustrations of legality, legitimate aim, proportionality and reasonableness, not as a verdict on the 2016 Act."
      }
    ]
  },
  {
    id: "mukesh-nirbhaya-2017",
    title: "Mukesh v. State (NCT of Delhi) — 2017 INSC 448 (Delhi Gang Rape and Murder, Death Penalty Confirmation)",
    category: "Criminal · Sexual Violence and Homicide · Death Penalty / Appellate Review",
    court: "Supreme Court of India, Three-Judge Bench (Criminal Appeal Nos. 607-608 and 609-610 of 2017; 2017 INSC 448, decided 5 May 2017)",
    charges: "Indian Penal Code ss. 302, 376(2)(g), 376A, 376D, 376E, 307, 201, 120B, 365/366, 377, 396/395 read with ss. 397 and 412; Code of Criminal Procedure 1973 s. 366 (confirmation of death sentences); Indian Evidence Act 1872 ss. 34 and 65-B. Modern BNS/BNSS counterparts: BNS ss. 103(1), 64, 65, 70, 71, 109, 238 and 61(2); BNSS s. 404.",
    summary: "The Supreme Court's three-judge bench, with Dipak Misra, J. writing for himself and Ashok Bhushan, J. and R. Banumathi, J. concurring separately, dismissed the appeals and affirmed the convictions and death sentences imposed on the adult appellants for the gang rape and murder of a twenty-three-year-old para-medical student in Delhi on the night of 16 December 2012; the sixth participant in the crime was treated as a juvenile in conflict with law and fell outside the capital-sentence determination. The bench held that the case squarely fitted the 'rarest of rare' category, where any other punishment is 'unquestionably foreclosed', pointing to the sustained violence, the internal injuries caused by an iron rod and the attempt to kill and conceal. It rejected the contention that the prosecution case was manufactured under public pressure, and treated the offence as an assault on human dignity that stirred the conscience of society, observing that crimes against women are a human-rights issue and that gender justice must not remain only on paper.",
    sourceDocTitle: "Mukesh v. State (NCT of Delhi)",
    parties: [
      {
        side: "judge",
        name: "Hon'ble Justice Dipak Misra",
        role: "Presiding Judge; authored the majority for himself and Ashok Bhushan, J.",
        persona: "Anchors the bench in constitutional and sentencing jurisprudence. Insists that every link of the circumstantial chain be tested against the proved record and that a 'rarest of rare' finding be reasoned, not rhetorical. Presses counsel on whether life imprisonment was genuinely foreclosed, and scrutinises the identification and recovery evidence rather than accepting the gravity of the charge as proof."
      },
      {
        side: "judge",
        name: "Hon'ble Justice Ashok Bhushan",
        role: "Judge concurring in the majority opinion",
        persona: "Quiet, textual and precise. Probes the statutory framework under IPC ss. 376A, 376D and 376E and the confirmation of capital sentences under CrPC s. 366. Asks counsel to map each charge to its statutory ingredients and to explain why the procedural criticisms do not displace the conviction."
      },
      {
        side: "judge",
        name: "Hon'ble Justice R. Banumathi",
        role: "Judge, separate concurrence (paras 146-149)",
        persona: "Concurrs in affirming the death sentences and emphasises the societal-conscience dimension: the nationwide reaction, NCRB statistics on crimes against women, and the need for gender justice in implementation rather than on paper. Invites counsel to address whether public outrage can ever substitute for legal proof, and whether the sentence serves a deterrence rationale."
      },
      {
        side: "prosecution",
        name: "Mr. Siddharth Luthra",
        role: "Senior Counsel for the State (NCT of Delhi)",
        persona: "Argued that the investigation was flawless and exemplary. Builds the case on the FIR, the companion's account, the medical and forensic material, the CCTV, and the disclosure-based recoveries. Urges the bench to read the dying declarations, the MLC and PW-1's narrative as mutually reinforcing, and to treat the scientific evidence as independent corroboration."
      },
      {
        side: "defense",
        name: "Mr. M. L. Sharma",
        role: "Lead Counsel for the appellants",
        persona: "Attacks the investigation as faulty, biased and driven by public pressure. Presses defects in the dying declarations, the section 161 CrPC statements, the medical examination, the test identification parade, the search and seizure, and the arrest procedure. Argues the appellants were used as guinea pigs to protect others and to preserve the agency's credibility."
      },
      {
        side: "defense",
        name: "Mr. A. P. Singh",
        role: "Counsel for the appellants",
        persona: "Complements Sharma with a forensic attack on the chain of custody, the timing of the recoveries and the section 65-B certificates for electronic records. Repeatedly returns to the proposition that suspicion, however grave, cannot replace proof beyond reasonable doubt, and that each alleged discovery must be shown to be a genuine consequence of information given by the accused."
      },
      {
        side: "defense",
        name: "Mukesh Singh (appellant)",
        role: "Accused-Appellant; driver of the bus",
        persona: "The appellant at the centre of the disclosure-and-recovery evidence: the informant's Samsung phone, bloodstained clothes from his brother's garage and the route chart Ex. PW-80/H were recovered at his instance, and PW-1 identified him at the test identification parade. In role-play he maintains that the recoveries were planted and that he was only driving; counsel uses his instructions to test custody and arrest procedure at Karoli."
      },
      {
        side: "witness",
        name: "PW-1 · Awninder Pratap",
        role: "The victim's male companion and first informant (FIR No. 413/2012)",
        persona: "Survived the assault after being thrown from the bus. Deposes to boarding at Munirka, the six men inside, the beating with iron rods, the robberies, the sexual violence against the victim and being dumped near the Mahipalpur flyover. Identified Mukesh and Akshay at the test identification parades conducted by PW-17 Sandeep Garg.",
        isWitness: true,
        personality: "Traumatised but precise on sequence; becomes evasive when defence counsel presses him on whether the lights were off, his exact seating, and differences between his 3:45 a.m. statement and later supplementary statements under section 161 CrPC."
      },
      {
        side: "witness",
        name: "PW-49 · Dr. Rashmi Ahuja",
        role: "Medical officer, Safdarjung Hospital; prepared the victim's MLC and recorded history",
        persona: "Prepared the MLC (Ex. PW-49/B) and recorded the history in Ex. PW-49/A: a gang rape in a moving bus by four to five persons, slaps, kicks, bite marks, two acts of intercourse and rectal penetration, after which the victims were thrown from the vehicle. Documents the vaginal and rectal tears and the external injuries.",
        isWitness: true,
        personality: "Clinical and detail-oriented, reads from the MLC. Firm on the seven to eight centimetre posterior vaginal tear and the communicating rectal tear, but concedes she recorded the history as given, did not witness the assault, and cannot herself fix the number of assailants."
      },
      {
        side: "witness",
        name: "PW-74 · S.I. Subhash Chand",
        role: "Investigating Officer who seized the bus and recorded Ram Singh's disclosure (Ex. P-74/F)",
        persona: "Deposes to tracing bus DL-1PC-0149 at Ravi Das Jhuggi Camp, seizing it as Ex. P1 under memo Ex. PW-74/K, and recovering the red seat cover, yellow curtains, key, ashes, partly burnt clothes, a mobile phone, iron rods, bloodstained clothes and the debit card of the victim's mother, Asha Devi.",
        isWitness: true,
        personality: "Methodical on seizure memos and the physical description of the bus. Pressed on whether the 'Yadav' marking and stripes were noted before or after arrest, and on the custody of the iron rods between seizure and examination."
      },
      {
        side: "witness",
        name: "PW-80 · S.I. Pratibha Sharma",
        role: "Investigating Officer in charge of FIR No. 413/2012",
        persona: "Recorded supplementary statements, coordinated the arrests of Mukesh, Pawan and Vinay, and prepared the route chart Ex. PW-80/H on 23 December 2012 at Mukesh's instance. Presents the investigation as a sequence of documented steps linking description, arrest and recovery.",
        isWitness: true,
        personality: "Procedural and defensive about the order of events; relies on contemporaneous memos but is challenged on why recoveries followed disclosure rather than independent detection and on delays in preparing the route chart."
      },
      {
        side: "witness",
        name: "PW-30 · Shri Pawan Kumar",
        role: "Metropolitan Magistrate who recorded the final dying declaration (Ex. PW-30/D)",
        persona: "Went to the hospital on 25 December 2012 when the attending doctors said the victim was conscious but unable to speak. Recorded her account through questions framed so that she could respond by gestures or writing, producing Ex. PW-30/D.",
        isWitness: true,
        personality: "Careful and anxious to demonstrate compliance with procedure. Stresses the doctors' opinion on fitness. Pressed on whether multiple-choice questions and gestures satisfy the requirement of a voluntary and reliable declaration."
      }
    ],
    evidence: [
      {
        label: "J-1",
        title: "Charging and Confirmation Framework — IPC, CrPC, Evidence Act and BNS Equivalents",
        description: "Statement of the provisions invoked in FIR No. 413/2012 and their modern counterparts.",
        content: "Section 302 IPC prescribes death or imprisonment for life for murder; ss. 376A, 376D and 376E address rape causing death or a persistent vegetative state, gang rape, and repeated offences after a prior conviction. Section 376(2)(g) covers rape by several persons acting in concert; s. 307 punishes attempt to murder, s. 201 the causing of disappearance of evidence, and s. 120B criminal conspiracy. Sections 365/366 (kidnapping) and 377 were also invoked, along with ss. 396/395 read with 397 and 412. Indian Evidence Act s. 34 makes a conspiracy relevant in a criminal proceeding, and s. 65-B governs certificates for electronic records. Under CrPC s. 366 a death sentence requires confirmation; the modern counterparts are BNS ss. 103(1), 64, 65, 70, 71, 109, 238 and 61(2), and BNSS s. 404. Counsel should be ready to map each charge to its statutory ingredient."
      },
      {
        label: "P-1",
        title: "FIR No. 413/2012 and Initial Medical Record (Ex. PW-49/A, PW-49/B)",
        description: "First information and the medical history and injuries recorded at Safdarjung Hospital.",
        content: "FIR No. 413/2012 was registered at PS Vasant Vihar at 5:40 a.m. on 17 December 2012 after the informant's first statement at 3:45 a.m., under s. 120B and ss. 365/366/376(2)(g)/377/307/302 and/or 396/395 with 397/201/412 IPC. PW-49 Dr. Rashmi Ahuja prepared the victim's MLC (Ex. PW-49/B) and recorded the history in Ex. PW-49/A: she described a gang rape in a moving bus by four to five persons, slaps, kicks, bite marks, two acts of intercourse and rectal penetration, after which she and her friend were thrown from the vehicle. The recorded injuries included a posterior vaginal wall tear of about seven to eight centimetres, a rectal tear of four to five centimetres communicating with it, a hanging vaginal tag, facial bruises and multiple bite marks. Twenty samples were sealed and handed to PW-59 Inspector Raj Kumari. The defence attacks the delay and the wording of the history; the prosecution treats the MLC as independent corroboration of PW-1."
      },
      {
        label: "P-2",
        title: "Dying Declarations of 21 and 25 December 2012 (Ex. PW-30/D)",
        description: "Successive statements of the victim recorded by a Sub-Divisional Magistrate and a Metropolitan Magistrate.",
        content: "The prosecution relies on statements of the victim recorded while she was hospitalised and treated as dying declarations. On 21 December 2012, after she was declared fit, PW-27 Smt. Usha Chaturvedi, Sub-Divisional Magistrate, recorded an elaborate declaration in which the victim described the incident, including the insertion of rods, and said the accused addressed one another as 'Ram Singh, Thakur, Raju, Mukesh, Pawan and Vinay'. On 25 December 2012 PW-30 Shri Pawan Kumar, Metropolitan Magistrate, found her conscious but unable to speak and recorded Ex. PW-30/D through questions framed so that she could answer by gestures or writing. Defence counsel argues that the first declaration was influenced by the presence of others and the second by leading multiple-choice questions, so neither is a free and reliable account. The State answers that the two declarations are consistent with each other and with the MLC and PW-1's narrative."
      },
      {
        label: "P-3",
        title: "Bus DL-1PC-0149 and Disclosure-Based Recoveries (Ex. P1, Ex. P-74/F)",
        description: "Seizure of the vehicle and articles recovered on the statements of the accused.",
        content: "Ram Singh was arrested on 17 December 2012 after the bus DL-1PC-0149 was traced to Ravi Das Jhuggi Camp, R.K. Puram. PW-74 SI Subhash Chand recorded his disclosure (Ex. P-74/F) and seized the bus as Ex. P1 (memo Ex. PW-74/K), together with a red seat cover, yellow curtains, the key (Ex. P-74/2), partly burnt clothes, ashes and a mobile phone. The disclosure also led to bloodstained clothes, iron rods and the debit card of the victim's mother, Asha Devi. Mukesh was apprehended at village Karoli on 18 December; at his instance the informant's Samsung Galaxy phone was recovered, a route chart (Ex. PW-80/H) was prepared on 23 December, and bloodstained clothes were traced to his brother's garage. Akshay's disclosure led to bloodstained clothes, a ring, metro cards and a phone. The defence contends the recoveries were manufactured after arrest; the State relies on the contemporaneous memos and the witnesses to the seizures."
      },
      {
        label: "P-4",
        title: "Forensic, DNA and CCTV Material with Section 65-B Certificates",
        description: "Scientific evidence relied on by the prosecution and challenged by the defence.",
        content: "The State's scientific case rests on material collected at the scene and at hospital. CCTV from Select City Walk Mall, Saket, produced by PW-25 Rajender Singh Bisht (Ex. PW-25/C-1, C-2 and photographs PW-25/B-1 to B-7), with a s. 65-B certificate proved by PW-26 Sandeep Singh (Ex. PW-26/A), placed the two victims at the mall. CCTV from Hotel Delhi 37 near the dumping spot showed at 9:34 p.m. and 9:53 p.m. a white bus with yellow and green stripes, the word 'Yadav' and no wheel cap on the front left tyre — details matching PW-1's description. Twenty sealed samples from the victim, including swabs, nail scrapings, hair and blood, were handed over for examination; the prosecution treats the forensic and DNA analysis as corroboration of the medical and ocular account. The defence challenges the section 65-B certificates and the chain of custody of the sealed samples."
      },
      {
        label: "P-5",
        title: "Post-Mortem and Cause of Death (Ex. PW-34/A, PW-34/B, PW-34/C)",
        description: "Foreign forensic pathology evidence completing the chain from injury to death.",
        content: "The victim was shifted to Mt. Elizabeth Hospital, Singapore, on 27 December 2012 and died there at 4:45 a.m. on 29 December 2012. PW-34 Dr. Paul Chui, Forensic Pathologist at the Health Sciences Authority, Singapore, proved the post-mortem report (Ex. PW-34/A), its scanned copy (Ex. PW-34/B) and the toxicology report of 4 January 2013 (Ex. PW-34/C). The recorded cause of death was sepsis with multiple organ failure following the injuries sustained on 16 December; the report also documents numerous bite marks. The prosecution uses the post-mortem to complete the chain from the assault to the death, and to support the s. 302 charge. The defence may test whether the interval, the treatment in two countries and the intervening surgeries break the causal link, and whether the pathologist could reliably attribute the injuries to the events described by PW-1."
      },
      {
        label: "R-1",
        title: "Bachan Singh, Machhi Singh and Devender Sharma — Death Penalty Authorities",
        description: "The precedents governing the 'rarest of rare' test applied by the bench.",
        content: "Bachan Singh v. State of Punjab (1980) 2 SCC 684 holds that death may be imposed only in the gravest cases, where the alternatives are unquestionably foreclosed, and that special reasons must be recorded; the crime and the criminal, not merely the offence, are relevant. Machhi Singh v. State of Punjab (1983) 3 SCC 470 elaborates the 'rarest of rare' test through guideposts such as the manner of commission, the motive, the nature of the victim and the social impact, while warning against a mechanical checklist. Devender Sharma v. Union of India (2015) 11 SCC 154 reaffirmed that the death penalty remains constitutionally permissible but confined to exceptional cases. In this appeal the bench applied these authorities to facts it found exceptional, while Banumathi, J. concurred on the view that no other punishment was foreclosed. Counsel should argue the test, not the headline: mitigation, reform and life imprisonment must be addressed and answered."
      }
    ],
    chunks: [
      {
        label: "Factual background: 16 December 2012",
        text: "On 16 December 2012 a twenty-three-year-old para-medical student and her male friend watched a film at PVR, Select City Walk Mall, Saket, and took an auto to Munirka bus stand. Around 8:30 p.m. they boarded a white chartered bus, DL-1PC-0149, marked with yellow and green stripes and the word 'Yadav', saying they were going towards Dwarka or Palam Road. Six men were already on board: four in the driver's cabin and two just behind it. The two paid the fare of twenty rupees and sat on the left. The lights were put off and no other passengers were taken. The friend, PW-1 Awninder Pratap, was beaten with iron rods when he protested, robbed of his phone, cards, watch, rings, shoes and cash, and forced to the floor. The victim was subjected to sexual violence by several of the men, including the driver Mukesh, and to further violence with an iron rod. Both were thrown from the moving bus near the Mahipalpur flyover on NH-8. Raj Kumar, PW-72, a night patrolman, heard their calls and arranged help; PCR van Zebra 54 took them to Safdarjung Hospital. The victim later died in Singapore."
      },
      {
        label: "Investigation and arrest sequence",
        text: "The first statement of PW-1 was recorded at 3:45 a.m. on 17 December 2012, leading to FIR No. 413/2012 at 5:40 a.m. at PS Vasant Vihar and its transfer to PW-80 SI Pratibha Sharma. The victim's MLC was prepared by PW-49 Dr. Rashmi Ahuja; PW-51 Dr. Sachin Bajaj examined PW-1. Surgeons led by PW-50 Dr. Raj Kumar Chejara operated on 17, 19 and 23 December. Guided by the bus description, police traced DL-1PC-0149 to Ravi Das Jhuggi Camp and arrested Ram Singh on 17 December; PW-74 SI Subhash Chand seized the bus and recorded his disclosure. Vinay Sharma and Pawan @ Kaalu were arrested next; Mukesh was apprehended at Karoli on 18 December and Akshay at village Karmalahang, Aurangabad, Bihar, on 21 December. Medical examination of the accused recorded injuries described as possible struggle marks. Test identification parades were conducted by PW-17 Sandeep Garg, Metropolitan Magistrate, at which PW-1 identified Mukesh and Akshay. Call detail records were obtained with section 65-B certificates. One of the six, Ram Singh, died during the proceedings and was described in the judgment as since deceased."
      },
      {
        label: "Issues on appeal",
        text: "The appellants attacked the investigation root and branch. Their counsel, M.L. Sharma and A.P. Singh, urged that the case was built on suspicion and public pressure, that the appellants were treated as guinea pigs to protect others or to preserve the credibility of the prosecuting agency, and that the investigation was biased, maladroit and indifferent to individual dignity. Specific complaints concerned the recording of the dying declarations, statements under s. 161 CrPC, the medical examination, the test identification parade, the manner of search and seizure, and the procedure of arrest. Siddharth Luthra for the State defended the investigation as flawless and exemplary, relying on scientific methods and the convergence of independent evidence. Sanjay R. Hegde, as friend of the Court, argued that the investigation was flawed and unreliable. The bench therefore had to decide both a factual question — whether the evidence was reliable enough to sustain the convictions — and a legal one: whether, if the charges were made out, the sentence of death was constitutionally permissible under the 'rarest of rare' doctrine."
      },
      {
        label: "Circumstantial-evidence chain",
        text: "The case has no eyewitness to the interior of the bus other than PW-1, whose account the defence attacked; the prosecution therefore presented a chain of mutually supporting circumstances. First, the mall CCTV and the section 65-B certificate placed both victims at the place from which they were last seen alive. Second, PW-1's description of the bus — its registration DL-1PC-0149, the yellow and green stripes and the word 'Yadav' — matched the vehicle seized three days later and the Hotel Delhi 37 CCTV images at 9:34 and 9:53 p.m. Third, the medical evidence, the twenty sealed samples and the forensic analysis corroborated sexual assault and the injuries PW-1 described. Fourth, recoveries of the victims' property and bloodstained clothing from the accused followed their disclosures. Fifth, the test identification parades supplied identification evidence against Mukesh and Akshay. Sixth, the MLCs of the accused recorded injuries consistent with a struggle. The bench's task was to ask whether these links, taken together, excluded every reasonable hypothesis of innocence."
      },
      {
        label: "Dying declarations: evidentiary value",
        text: "Statements of the victim were treated as dying declarations. The earliest was recorded at the hospital; the second, on 21 December 2012, was recorded by PW-27 Usha Chaturvedi, Sub-Divisional Magistrate, after a doctor certified her fit, and is the most detailed, naming the men by the aliases they used and describing the insertion of rods. The third, Ex. PW-30/D, was recorded on 25 December by PW-30 Pawan Kumar, Metropolitan Magistrate, when the victim was conscious but could not speak; questions were framed so that she could answer by gestures or writing. A dying declaration is not substantive evidence in itself but may be relied upon if it is voluntary, truthful and made when the declarant was in a fit state; defects go to weight, not always to admissibility. The defence pressed the presence of others, the use of leading multiple-choice questions and the inconsistency between an oral account and gestures. The State relied on consistency with the MLC and PW-1's narration and on the recording by judicial officers."
      },
      {
        label: "Disclosure statements and recoveries",
        text: "Section 27 of the Indian Evidence Act makes information received from an accused in custody admissible so far as it leads to the discovery of a fact, and only that portion of the statement is proved. The prosecution relied on a series of such disclosures. Ram Singh's statement (Ex. P-74/F) preceded the seizure of the bus, the iron rods, bloodstained clothes and the debit card of the victim's mother; Pawan's (Ex. PW-60/G) led to the identification of the boarding point at Munirka and the place where the victims were thrown out. Mukesh's disclosures led to the informant's Samsung phone, bloodstained clothes from his brother's garage and the route chart Ex. PW-80/H; Vinay's to the victim's Nokia phone and PW-1's Hush Puppies shoes; Akshay's to clothes, a ring, metro cards and a phone. The defence argument was that the recoveries were staged, that the articles were already known to the police and that the memos did not establish a genuine discovery. The State's answer was the existence of contemporaneous seizure memos and independent witnesses."
      },
      {
        label: "The 'rarest of rare' test",
        text: "Bachan Singh v. State of Punjab (1980) 2 SCC 684 requires the court to choose death only where life imprisonment is unquestionably inadequate, and to record special reasons; it treats the crime and the criminal, not merely the offence, as relevant. Machhi Singh v. State of Punjab (1983) 3 SCC 470 identifies guideposts — the manner of commission, the motive, the nature of the victim, the magnitude of the crime and its social impact — while warning against a mechanical checklist. Devender Sharma v. Union of India (2015) 11 SCC 154 reaffirmed that the penalty remains exceptional. Applied here, the majority stressed the prolonged nature of the assault, the serious internal injuries caused by an iron rod, the unnatural sex, the attempt to kill both victims and the efforts at concealment. Banumathi, J. concurred, stating that the case fell within the 'rarest of rare' category and that any other punishment was 'unquestionably foreclosed'. A candidate arguing mitigation must engage with these findings, not ignore them."
      },
      {
        label: "Sentencing and the juvenile accused",
        text: "The trial court convicted the adult accused and imposed death sentences; the Delhi High Court upheld them, and the Supreme Court affirmed. CrPC s. 366 required confirmation of the death sentences by the High Court and then by the Supreme Court in the appeals; in the modern BNSS regime the corresponding confirmation provision is s. 404. The majority opinion of Dipak Misra, J., for himself and Ashok Bhushan, J., and the concurrence of Banumathi, J., together make the sentencing reasoning: the brutality of the crime, its effect on the collective conscience and the inadequacy of any lesser sentence. The sixth participant in the crime was a juvenile in conflict with law, dealt with within the juvenile justice framework rather than through the death-sentence appeals before the Court; the bench's affirmance of capital sentences concerned the adult appellants. Ram Singh, another of the six, had died during the proceedings. Counsel should distinguish carefully between the case of the juvenile and the sentencing of the adults."
      },
      {
        label: "Advocacy angles for both sides",
        text: "For the State: lead with the convergence of independent strands — the companion's account, the matching bus and CCTV, the MLC and the sealed forensic samples, the disclosure-based recoveries and the identifications — and argue that no single defect, taken alone, displaces the chain. Emphasise that the dying declarations came from judicial officers and that the medical record was made before any accusation was levelled at these appellants. On sentence, address the authorities squarely and rely on the manner of commission and the attempt at concealment. For the appellants: do not merely label the investigation biased; identify the precise breach and its consequence — which statement was recorded late, which memo lacks a witness, where the chain of custody breaks, and why the identification parade was suggestive. Distinguish between suspicion and proof beyond reasonable doubt. On sentence, put the alternative of life imprisonment and the possibility of reform in issue so that the 'unquestionably foreclosed' finding is tested rather than assumed. For the bench: insist that intense public interest must not lower the standard of proof."
      }
    ]
  },
  {
    id: "navtej-johar-2018",
    title: "Navtej Singh Johar v. Union of India (2018 INSC 790)",
    category: "Constitutional Law",
    court: "Supreme Court of India (5-Judge Constitution Bench)",
    charges: "Constitutional challenge to Indian Penal Code s.377 (\"carnal intercourse against the order of nature\") and its modern BNS s. 377 analogue as framed by counsel; Articles 14, 15, 19(1)(a) and 21; constitutional morality versus popular morality; Suresh Kumar Koushal overruled.",
    summary: "A five-Judge Constitution Bench unanimously read down Indian Penal Code s.377, holding that criminalising consensual sexual acts between adults above 18 in private violates Articles 14, 15, 19 and 21, with consent required to be free, voluntary and free of duress or coercion. The provision continues to govern non-consensual acts against adults, all acts of carnal intercourse with minors, and bestiality; concluded prosecutions are not reopened, but the ruling may be relied on in pending matters. The Court overruled Suresh Kumar Koushal, treated sexual orientation as protected by equality, non-discrimination, expression and dignity, and rejected majoritarian morality in favour of constitutional morality.",
    sourceDocTitle: "Navtej Singh Johar v. Union of India",
    parties: [
      {
        side: "judge",
        name: "Chief Justice Dipak Misra",
        role: "Chief Justice of India; presiding judge, author of the judgment for himself and Khanwilkar, J.",
        persona: "Keep the argument anchored to the text of s.377 and the four Part III provisions. Press counsel to state precisely what survives the reading down and how pending trials should be handled.",
        personality: "Measured and synthesizing; tests broad claims against constitutional text."
      },
      {
        side: "judge",
        name: "Justice A. M. Khanwilkar",
        role: "Judge, Constitution Bench; joined the opinion of Misra, CJI.",
        persona: "In simulation, probe whether judicial intervention is premature while Parliament remains free to amend or repeal, and what standards should guide reading down.",
        personality: "Institutional and cautious about separation of powers."
      },
      {
        side: "judge",
        name: "Justice Rohinton Fali Nariman",
        role: "Judge, Constitution Bench; wrote a separate concurring opinion.",
        persona: "Question the reasoning in Koushal, especially the appeal to a small number of prosecutions and to social disapproval as a basis for upholding a penal law.",
        personality: "Doctrinal, precedent-focused, and alert to overbroad statutory language."
      },
      {
        side: "judge",
        name: "Justice D. Y. Chandrachud",
        role: "Judge, Constitution Bench; wrote a separate concurring opinion; author of the Puttaswamy majority quoted at the reference.",
        persona: "Invite argument on privacy, dignity and orientation as components of constitutional rights, and on why majoritarian acceptance cannot determine Part III protection.",
        personality: "Analytical and rights-centered."
      },
      {
        side: "judge",
        name: "Justice Indu Malhotra",
        role: "Judge, Constitution Bench; author of the concluding opinion in the available extract, containing the operative declaration.",
        persona: "Demand a clean formulation of relief: the exact class protected, the requirement of free consent, the carve-outs, and the treatment of concluded versus pending prosecutions.",
        personality: "Precise about remedies and attentive to the human cost of delayed justice."
      },
      {
        side: "prosecution",
        name: "Tushar Mehta",
        role: "Additional Solicitor General for the Union of India, recorded as appearing for the respondent.",
        persona: "Defend the surviving core of s.377 for non-consensual acts, minors and bestiality; clarify how far any stance on consensual adult conduct actually goes before conceding anything.",
        personality: "Formal, textual, and careful to separate scope from constitutionality."
      },
      {
        side: "defense",
        name: "Arvind P. Datar",
        role: "Senior counsel for a petitioner; argued at the three-Judge reference that Koushal followed social rather than constitutional morality.",
        persona: "Lead the challenge on vagueness, immutability of orientation and the duty of the Court to enforce Part III rather than await legislative change.",
        personality: "Sharp on principle and quick with precedent."
      },
      {
        side: "defense",
        name: "Mukul Rohatgi",
        role: "Senior counsel for the petitioners in Writ Petition (Criminal) No. 76 of 2016.",
        persona: "Develop the Article 21 case on sexuality, sexual autonomy and choice of partner, and connect it to dignity and privacy.",
        personality: "Broad constitutional framing with disciplined relief."
      },
      {
        side: "defense",
        name: "Dr. Menaka Guruswamy",
        role: "Counsel for the petitioner in Writ Petition (Criminal) No. 121 of 2018.",
        persona: "Emphasise equality and non-discrimination, and answer the argument that decriminalisation should be left entirely to the legislature.",
        personality: "Precise, evidence-aware and persuasive on lived consequences."
      },
      {
        side: "defense",
        name: "Anand Grover",
        role: "Senior counsel for the petitioners in Writ Petition (Criminal) Nos. 100 and 101 of 2018.",
        persona: "Focus on the public-health and rights consequences of criminalisation and on the misuse of s.377 for harassment and blackmail.",
        personality: "Direct, pragmatic and attentive to enforcement realities."
      },
      {
        side: "witness",
        name: "Navtej Singh Johar",
        role: "Lead petitioner and affiant; named in the cause title as the first petitioner.",
        persona: "Give a first-person account of living under a law that treats voluntary same-sex intimacy as an offence; distinguish personal experience from the legal submissions.",
        personality: "Dignified and restrained; speaks to identity and fear without overstating legal conclusions.",
        isWitness: true
      },
      {
        side: "witness",
        name: "Sub-Inspector V. R. Sharma (illustrative composite)",
        role: "Police officer depicted as registering an FIR under s.377 against consenting adults; no officer is named in the digest.",
        persona: "Testify to the pre-2018 statutory text and the fact of registration, not to any petitioner's orientation; resist the suggestion that the FIR was a personal moral judgment.",
        personality: "Procedural and defensive, relies on the wording of the section as it then stood.",
        isWitness: true
      },
      {
        side: "witness",
        name: "Dr. Anita Menon (illustrative composite)",
        role: "Consultant psychiatrist and public-health expert called by the petitioners; name and testimony are role-based because the digest names no such witness.",
        persona: "Explain the professional view, relied on by petitioners, that sexual orientation is natural and not a mental illness; separate clinical opinion from the constitutional question.",
        personality: "Measured, careful with qualifications, and resistant to leading questions.",
        isWitness: true
      }
    ],
    evidence: [
      {
        label: "P-1",
        title: "Section 377 IPC and the fundamental-rights provisions",
        description: "The impugned provision, the declarations sought in the lead writ petition, and the constitutional provisions invoked.",
        content: "Section 377 of the Indian Penal Code penalises \"carnal intercourse against the order of nature\" with imprisonment and fine. The digest records that phrase but not the full section, so counsel should verify exact wording from the judgment corpus before quoting it. The lead petition sought declarations that the right to sexuality, sexual autonomy and choice of a sexual partner are part of Article 21, and that s.377 is unconstitutional. Reliance is placed on Article 14 equality, Article 15 non-discrimination, Article 19(1)(a) expression, and Article 21 life, dignity and privacy. The petitioners also point to the Criminal Law (Amendment) Act, 2013 and a child-protection statute whose title is truncated in the available extract as intervening statutory regimes. The Union should test whether those regimes displace the need for reading down, or whether the constitutional defect lies in the retained language itself."
      },
      {
        label: "P-2",
        title: "Illustrative FIRs and case records under s.377",
        description: "Two records of prosecution under s.377 tendered to show the practical effect of the provision; parties and numbers are illustrative.",
        content: "Two certified FIRs and consequent case records in which s.377 was invoked against consenting adults are offered as illustrations for this simulation; the digest names no accused, officer or FIR number, so these are not represented as actual exhibits from the judgment. The petitioners' case, as summarised by the Court, is that the provision is used to perpetrate harassment, blackmail and torture, and that orientation is effectively criminalised because any sexual intercourse by such persons may be treated as against the \"order of nature\". Koushal had dismissed such misuse as no ground for striking down the section and stressed the small number of prosecutions. The FIRs are tendered to show lived consequences, not to prove that every prosecution was malicious. The Union may answer that abuse of a provision does not establish unconstitutionality and that individual misuse has other remedies."
      },
      {
        label: "P-3",
        title: "Note of the Union's submission at the hearing",
        description: "A simulation formulation of the Additional Solicitor General's stance, to be checked against the transcript.",
        content: "A note of the oral submission made by the Additional Solicitor General for the Union of India, whose appearance for the respondent is recorded in paragraph 14 of the judgment. The digest does not set out the full text of that submission, so treat this exhibit as the simulation's formulation of the Union's position and verify it against the corpus. The petitioners will argue that the Union's stance effectively accepted that consensual sexual acts between adults in private cannot be brought within a reasonable restriction under Part III, leaving only the form of relief. The respondent's advocate should resist overstatement: even a measured stance on adult consensual conduct does not concede the petitioners' broader claims about expression, dignity or the fate of pending prosecutions. Ask the bench to distinguish a concession on scope from a concession on constitutionality."
      },
      {
        label: "R-1",
        title: "Suresh Kumar Koushal v. Naz Foundation (2014) 1 SCC 1",
        description: "The two-Judge decision under reconsideration and the propositions later rejected by the Constitution Bench.",
        content: "Suresh Kumar Koushal v. Naz Foundation is the judgment under reconsideration. The closing opinion records its reasoning: s.377 regulates acts, not identities, and those who commit carnal intercourse \"against the order of nature\" form a distinct class; LGBT persons are a \"miniscule fraction\" with few prosecutions, so no Article 14, 15 or 21 challenge could succeed; harassment, blackmail and torture, even if established, would not invalidate the section; and the legislature remained free to repeal or amend. The five-Judge Bench overruled it. For the simulation, the Union's advocate should reconstruct the strongest version of these propositions, while petitioner's counsel deploy the Court's answers: undefined and open-ended language, immutability of orientation, facial neutrality masking discrimination, and the duty of a court to enforce Part III rather than await majoritarian legislation."
      },
      {
        label: "R-2",
        title: "Naz Foundation, NALSA, Puttaswamy and ALI v. State",
        description: "Authorities relied on by petitioners and intervenors, including one comparative decision to be verified before citation.",
        content: "A bundle of authorities relied on by the petitioners and intervenors. Naz Foundation v. Government of NCT of Delhi (2009) 111 DRJ 1 was the Delhi High Court decision overturned by Koushal. NALSA v. Union of India (2014) 5 SCC 438, quoted in the opening opinion, treats gender identity as fundamental to life and reads \"sex\" in Articles 15 and 16 to include gender identity; petitioners argue sexual orientation deserves comparable protection. K. S. Puttaswamy v. Union of India (2017) 10 SCC 1 is the nine-Judge decision whose majority, speaking through Chandrachud, J., is quoted at the reference for the proposition that sexual orientation is an essential component of constitutional rights, not a matter of majoritarian favour or acceptance. ALI v. State is offered as further comparative authority relied on by the petitioners; confirm its holding from the corpus before citing it as binding precedent."
      },
      {
        label: "J-1",
        title: "Yogyakarta Principles and comparative human-rights material",
        description: "Persuasive international material offered on dignity, non-discrimination and the status of consensual same-sex intimacy.",
        content: "Materials on international and comparative perspective, including a bundle the petitioners describe as the Yogyakarta Principles. The judgment's table of contents lists a dedicated section surveying the United States, Canada, South Africa, the United Kingdom and other jurisdictions, and the reference itself draws on Mosley v. News Group Newspapers Ltd. for the proposition that freedom to conduct one's sex life and personal relationships, subject to permitted exceptions, countervails public interest. The Principles are tendered to show an international consensus that orientation is not pathology and that criminalisation of consensual same-sex intimacy is incompatible with dignity and non-discrimination. Because the digest excerpt does not reproduce the Principles, counsel should present them as persuasive comparative material rather than as a source of binding Indian law; the Union may test their status and their bearing on the Part III question."
      },
      {
        label: "J-2",
        title: "Professional material on sexual orientation and mental health",
        description: "Extracts supporting the public-health witness and the petitioners' submission that orientation is not an illness.",
        content: "A short compilation of professional-material extracts placed before the Court on the petitioners' account that sexual orientation is neither a physical nor a mental illness. Paragraph 15 of the opening opinion records their reliance on the American Psychological Association's view that sexual orientation is a natural condition and that same-sex and opposite-sex attraction are naturally equal, differing mainly in incidence. The exhibit is the factual foundation for the public-health witness: it supports the contention that \"order of nature\" cannot be defined by procreative capacity alone and that stigma, not orientation, produces the harm. Counsel for the Union should probe the limits of the material: a professional consensus about pathology does not by itself resolve what conduct the State may criminalise. The bench may ask how the material bears on consent, minors and non-consensual acts."
      }
    ],
    chunks: [
      {
        label: "Factual background and the reference",
        text: "The lead matter, Writ Petition (Criminal) No. 76 of 2016, was filed by Navtej Singh Johar and others against the Union of India through the Secretary, Ministry of Law and Justice, seeking declarations that sexuality, sexual autonomy and choice of a sexual partner fall within Article 21 and that s.377 IPC is unconstitutional. Five connected petitions were taken up with it. When the matter came before a three-Judge Bench on 8 January 2018, Arvind P. Datar argued that Koushal had been guided by majoritarian social morality rather than constitutional morality and that its reading of Article 21 was narrowly tied to Article 14. The three-Judge Bench noted that counsel did not challenge the bestiality portion of s.377 and confined the challenge to consenting acts between adults. Observing that the \"order of nature\" is not a constant phenomenon and that Koushal required reconsideration, it referred the matter to a larger Bench. That is how the five-Judge Constitution Bench came to hear the case."
      },
      {
        label: "Colonial pedigree of s.377",
        text: "Counsel for the petitioners described s.377 as a relic of Victorian-era morality, enacted in a colonial code at a time when sexual activity was treated as legitimate chiefly if procreative. The opening opinion records the argument that \"order of nature\" is limited to a procreative conception that ignores inborn traits, developed orientations and bodily autonomy. Because the digest excerpt does not reproduce a full legislative history, this brief should be argued as the petitioners' genealogy of the provision rather than as an uncontested historical finding. Its utility is interpretive: if the statutory phrase draws its content from a discarded social consensus, the Court must decide whether to keep giving it effect under a Constitution committed to dignity and equality. The Union's answer is that the age of a statute is not a constitutional defect and that the legislature, not the Court, should decide on repeal or amendment."
      },
      {
        label: "Questions for the Constitution Bench",
        text: "Four clusters of questions emerged. First, whether Koushal wrongly rejected the equality and privacy challenge by appealing to the small number of LGBT persons and the paucity of prosecutions. Second, whether s.377, which leaves \"carnal intercourse against the order of nature\" undefined, is unconstitutionally vague and sweeps within its net consensual adult intimacy in private. Third, which fundamental rights are engaged: Article 14 equality, Article 15 non-discrimination on the ground of sex and sexual orientation, Article 19(1)(a) expression, and Article 21 life, dignity, privacy and autonomy. Fourth, what remedy follows: reading down, and with what effect on concluded trials, pending trials, appeals and revisions. Intervenors added religious and moral objections, while the petitioners invoked NALSA and Puttaswamy. Candidates should keep the scope disciplined: counsel for the petitioners expressly did not attack the bestiality limb."
      },
      {
        label: "The operative holding and its limits",
        text: "The conclusion is recorded in paragraph 21 of Malhotra, J.'s opinion and answers the reference. Insofar as s.377 criminalises consensual sexual acts of adults, meaning persons above 18 who are competent to consent, in private, it violates Articles 14, 15, 19 and 21; consent must be free, completely voluntary and devoid of duress or coercion. The reading down does not reopen concluded prosecutions, but it may be relied on in all pending matters at trial, appellate or revisional stages. Section 377 continues to govern non-consensual sexual acts against adults, all acts of carnal intercourse against minors, and acts of bestiality. Suresh Kumar Koushal is overruled. The writ petitions were allowed. In simulation, the winning side must articulate both the declaration and its boundaries; overclaiming that s.377 was erased entirely would misstate the holding."
      },
      {
        label: "Unanimity and separate opinions",
        text: "The judgment is unanimous but not a single voice. Misra, CJI wrote for himself and Khanwilkar, J.; Nariman, Chandrachud and Malhotra, JJ. wrote separately, and the available closing excerpt is the concluding portion of Malhotra, J.'s opinion. The CJI's opinion structures the case through identity, constitutional morality, dignity, sexual orientation, privacy, progressive realisation, comparative law and a \"litmus test\" for the provision's survival. Malhotra, J.'s conclusion stresses that history owes an apology to the community and their families, that orientation is an innate feature of identity, and that criminalising voluntary same-sex intimacy in private discriminates on the basis of sexual orientation. Counsel should not attribute a distinct holding to any judge beyond what the corpus supports; instead, use the separate opinions to show how distinct constitutional routes converge on the same result."
      },
      {
        label: "Constitutional morality versus popular morality",
        text: "The reference itself was framed in these terms. Datar told the three-Judge Bench that Koushal had followed social morality grounded in majoritarian perception, while the issue belonged to constitutional morality. The Court quoted the idea that the morality the public perceives and the morality the Constitution conceives may diverge, and that individual autonomy and orientation cannot be atrophied unless the restriction is reasonable when measured against constitutional morality rather than popular favour. The same opinion cautioned that fear of law is compatible with civilised society only when the law has constitutional acceptability. In argument, the petitioners should deploy this to answer the claim that Parliament alone may change the law: a provision that survives only because a majority tolerates its targets is precisely what Part III exists to correct. The Union can respond that moral disapproval must be translated into an ascertainable legal standard before invalidation."
      },
      {
        label: "Transformative constitutionalism and dignity",
        text: "The table of contents of the CJI's opinion devotes separate chapters to the Constitution as an organic charter, transformative constitutionalism and LGBT rights, constitutional morality, human dignity, sexual orientation, privacy, and progressive realisation of rights. That architecture matters for advocacy: the petitioners' case is not merely that s.377 causes distress but that the Constitution requires the State to recognise identities and to remove legal markers of inferiority. NALSA is the starting point, with its observation that discrimination on the ground of \"sex\" includes gender identity and its account of the civil consequences of recognition. Puttaswamy supplies the privacy premise, including the statement quoted at the reference that sexual orientation is an essential component of rights not dependent on majoritarian acceptance. Candidates should connect these strands to the remedy: reading down removes criminal stigma while leaving the legislature room to legislate prospectively."
      },
      {
        label: "Precedent and advocacy angles",
        text: "Koushal's four propositions and the Court's replies provide the cleanest advocacy structure. Koushal said the section punishes acts, not people; the Court answered that \"order of nature\" is undefined, too wide and capable of covering consenting adults in private, citing A. K. Roy v. Union of India for the requirement that crimes be defined with reasonable definiteness. Koushal relied on the \"miniscule fraction\" argument; the Court answered that numerical strength cannot determine the enforcement of Part III. Koushal treated harassment and blackmail as irrelevant to vires; the Court held that facial neutrality masks hostile discrimination. Koushal deferred to the legislature; the Court said it cannot remain a mute spectator and must read down the provision. The J. S. Verma Committee report, quoted in the closing opinion, is useful for the submission that the Constitution protects sexually despised minorities. The Union's best response is to defend the surviving core: minors, non-consent and bestiality."
      }
    ]
  },
];

export async function seedCases(only?: string[]) {
  const sql = db();
  const requested = Array.isArray(only) ? [...new Set(only)] : null;
  const selected = requested ? SEED_CASES.filter((c) => requested.includes(c.id)) : SEED_CASES;

  if (requested) {
    const known = new Set(SEED_CASES.map((c) => c.id));
    const unknown = requested.filter((id) => !known.has(id));
    if (unknown.length) throw new Error(`Unknown case ids: ${unknown.join(", ")}`);
  }

  for (const c of selected) {
    console.log(`[seed] Seeding case: ${c.id} (${c.title})`);

    // A case built on a landmark judgment links to that judgment's document so
    // retrieval can scope to it without duplicating its chunks.
    let sourceDocumentId: string | null = null;
    if (c.sourceDocTitle) {
      const [doc] = await sql`
        SELECT id FROM documents
        WHERE case_id IS NULL AND title LIKE ${c.sourceDocTitle + "%"}
        ORDER BY title LIMIT 1
      `;
      sourceDocumentId = doc?.id ?? null;
      if (!sourceDocumentId) {
        console.warn(`[seed] no judgment document matches "${c.sourceDocTitle}" for ${c.id}`);
      }
    }

    // 1. Insert / update case row
    await sql`
      INSERT INTO cases (id, title, category, court, charges, summary, seeded, source_document_id)
      VALUES (${c.id}, ${c.title}, ${c.category}, ${c.court}, ${c.charges}, ${c.summary}, true, ${sourceDocumentId})
      ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title, 
        category = EXCLUDED.category,
        court = EXCLUDED.court,
        charges = EXCLUDED.charges,
        summary = EXCLUDED.summary,
        source_document_id = EXCLUDED.source_document_id
    `;

    // 2. Clean existing case-specific parties, evidence, chunks, and documents
    await sql`DELETE FROM case_parties WHERE case_id = ${c.id}`;
    await sql`DELETE FROM case_evidence WHERE case_id = ${c.id}`;
    await sql`DELETE FROM chunks WHERE case_id = ${c.id}`;
    await sql`DELETE FROM documents WHERE case_id = ${c.id}`;

    // 3. Insert parties
    for (const p of c.parties) {
      await sql`
        INSERT INTO case_parties (case_id, side, name, role, persona_prompt, is_witness, personality)
        VALUES (${c.id}, ${p.side}, ${p.name}, ${p.role}, ${p.persona}, ${Boolean(p.isWitness)}, ${p.personality ?? ""})
      `;
    }

    // 4. Insert evidence items
    for (const e of c.evidence) {
      await sql`
        INSERT INTO case_evidence (case_id, exhibit_label, title, description, content)
        VALUES (${c.id}, ${e.label}, ${e.title}, ${e.description}, ${e.content})
      `;
    }

    // 5. Insert document container
    const [doc] = await sql`
      INSERT INTO documents (case_id, kind, title, status)
      VALUES (${c.id}, 'hf_seed', ${c.title + " fact sheet"}, 'indexed')
      RETURNING id
    `;

    // 6. Generate 4096d Qwen3 embeddings for all chunks in batch
    const chunkTexts = c.chunks.map((ch) => ch.text);
    let vectors: number[][] = [];
    try {
      vectors = await embed(chunkTexts);
      console.log(`[seed] Generated ${vectors.length} Qwen3 embeddings (4096d) for ${c.id}`);
    } catch (err) {
      console.warn(`[seed] Embeddings failed for ${c.id}: ${err instanceof Error ? err.message : String(err)}`);
    }

    // 7. Insert chunks with vector embeddings
    for (let idx = 0; idx < c.chunks.length; idx++) {
      const ch = c.chunks[idx];
      const vec = vectors[idx];
      const vecStr = vec && vec.length === EMBED_DIM ? `[${vec.join(",")}]` : null;

      if (vecStr) {
        await sql`
          INSERT INTO chunks (document_id, case_id, section_label, text, token_count, embedding)
          VALUES (${doc.id}, ${c.id}, ${ch.label}, ${ch.text}, ${ch.text.split(/\s+/).length}, ${vecStr}::vector)
        `;
      } else {
        await sql`
          INSERT INTO chunks (document_id, case_id, section_label, text, token_count)
          VALUES (${doc.id}, ${c.id}, ${ch.label}, ${ch.text}, ${ch.text.split(/\s+/).length})
        `;
      }
    }

    console.log(`[seed] Successfully indexed ${c.chunks.length} chunks, ${c.evidence.length} exhibits, ${c.parties.length} parties for ${c.id}`);
  }
}
