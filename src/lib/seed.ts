import { db } from "./db";
import { embed, EMBED_DIM } from "./embed";

export interface SeedCase {
  id: string;
  title: string;
  category: string;
  court: string;
  charges: string;
  summary: string;
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

    // 1. Insert / update case row
    await sql`
      INSERT INTO cases (id, title, category, court, charges, summary, seeded)
      VALUES (${c.id}, ${c.title}, ${c.category}, ${c.court}, ${c.charges}, ${c.summary}, true)
      ON CONFLICT (id) DO UPDATE SET 
        title = EXCLUDED.title, 
        category = EXCLUDED.category,
        court = EXCLUDED.court,
        charges = EXCLUDED.charges,
        summary = EXCLUDED.summary
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
