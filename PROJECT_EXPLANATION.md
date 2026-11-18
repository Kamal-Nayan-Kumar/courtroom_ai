# Courtroom AI: Comprehensive Project Explanation & Architecture Guide

> **Academic Affiliation**: Department of Data Science and Artificial Intelligence  
> **Institution**: Indian Institute of Information Technology Dharwad (IIIT Dharwad)  
> **Course**: B.Tech Mini Project (Academic Year 2026–2027)  
> **Project Title**: Courtroom AI: A Retrieval-Augmented Indian Courtroom Simulator  
> **Authors**: Rahul Patel (23BDS047) & Kamal Nayan Kumar (23BDS026)  
> **Project Supervisor**: Dr. Sunil Saumya, Assistant Professor, IIIT Dharwad  
> **Report Reference**: `report/CourtroomAI_MiniProject_Report.pdf` (November 2026)

---

## Table of Contents
1. [Executive Summary & Concept](#1-executive-summary--concept)
2. [The Pedagogical Problem & Research Motivation](#2-the-pedagogical-problem--research-motivation)
3. [System Architecture & Engineering Stack](#3-system-architecture--engineering-stack)
4. [Relational Data Model & State Machine](#4-relational-data-model--state-machine)
5. [The Legal Knowledge Corpus (914 Chunks, 5 Matters)](#5-the-legal-knowledge-corpus-914-chunks-5-matters)
6. [Vector Representation & Qwen-3 Cloud Migration (4096-D)](#6-vector-representation--qwen-3-cloud-migration-4096-d)
7. [Hybrid RAG Retrieval Engine & Cross-Case Scope Fix](#7-hybrid-rag-retrieval-engine--cross-case-scope-fix)
8. [Anti-Hallucination Engineering: Negative Constraints](#8-anti-hallucination-engineering-negative-constraints)
9. [Multi-Agent Courtroom Simulation Loop](#9-multi-agent-courtroom-simulation-loop)
10. [Procedural Evidence Engine: Bharatiya Sakshya Adhiniyam, 2023](#10-procedural-evidence-engine-bharatiya-sakshya-adhiniyam-2023)
11. [Low-Latency Real-Time Streaming Architecture (SSE / NDJSON)](#11-low-latency-real-time-streaming-architecture-sse--ndjson)
12. [Automated Judicial Bench Appraisal (5-Metric Rubric)](#12-automated-judicial-bench-appraisal-5-metric-rubric)
13. [Empirical Evaluation & Quantitative Results](#13-empirical-evaluation--quantitative-results)
14. [Step-by-Step Live Demonstration Walkthrough](#14-step-by-step-live-demonstration-walkthrough)
15. [Academic Limitations, Failure Modes & Governance](#15-academic-limitations-failure-modes--governance)
16. [Professor & Evaluator Defense Q&A Guide](#16-professor--evaluator-defense-qa-guide)

---

## 1. Executive Summary & Concept

**Courtroom AI** is an autonomous multi-agent trial simulation and legal research platform designed to train Indian law students, advocates, and moot court teams in trial advocacy, adversarial cross-examination, and procedural evidence law.

Unlike open-ended generative chatbots (such as ChatGPT, Claude, or Gemini) that converse without evidentiary boundaries, Courtroom AI functions as a **strictly grounded, deterministic simulation chamber**. All agent behaviors—whether the presiding judge, hostile witness, or opposing counsel—are strictly confined to an admitted evidentiary dossier and genuine Indian Supreme Court jurisprudence.

### Core Value Proposition
- **24/7 On-Demand Trial Advocacy**: Recreates high-pressure oral cross-examination without requiring faculty or peer availability.
- **Evidence-Grounded Reliability**: Eliminates LLM hallucinations by enforcing negative constraints (witnesses refuse to invent dates or facts absent from the record).
- **Procedural Adherence to New Criminal Codes**: First simulator engineered specifically for India's newly enacted procedural laws:
  - **Bharatiya Nyaya Sanhita (BNS), 2023** (Penal law replacing IPC)
  - **Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023** (Procedure replacing CrPC)
  - **Bharatiya Sakshya Adhiniyam (BSA), 2023** (Evidence replacing IEA 1872)
- **Objective Bench Appraisal**: Provides structured, rubric-based feedback across five advocacy dimensions.

---

## 2. The Pedagogical Problem & Research Motivation

### The Advocacy Training Gap
In traditional Indian legal education, curriculum heavily emphasizes appellate doctrinal study and memorization of case law. However, there is an immense gap between knowing doctrine and practicing trial advocacy:
1. **Time Pressure & Pacing**: In court, an advocate must think on their feet, formulating questions while listening to witness responses under strict judicial timers.
2. **Hostile Cross-Examination**: Witnesses rarely cooperate. Advocates must learn to identify omissions and pin witnesses to admitted exhibits.
3. **Instant Procedural Objections**: When opposing counsel asks a leading or irrelevant question, counsel has mere seconds to object under evidence rules.

### Why Standard Generative AI Fails in Law
Generic LLMs are fundamentally flawed for legal simulation due to three failure modes:
1. **Fact Fabrication**: When pressed by counsel (e.g., *"On what date was the second summons delivered?"*), generic models invent plausible-sounding calendar dates (e.g., *"November 14, 2023"*). In a trial, cross-examining based on invented facts is legal malpractice.
2. **Statutory Hallucination**: Generic LLMs frequently cite nonexistent sections or conflate repealed IPC sections with the new BNS provisions.
3. **Lack of Evidentiary Boundaries**: Standard models lack any concept of an *admitted evidentiary record*; they freely generate facts from their pre-training parameters rather than admitted case exhibits.

Courtroom AI solves this by coupling **dense 4096-dimensional vector retrieval on Neon PostgreSQL** with **negative-constraint prompt architectures**.

---

## 3. System Architecture & Engineering Stack

```
                                    ┌────────────────────────┐
                                    │    Next.js 16 App      │
                                    │   (App Router + SSR)   │
                                    └───────────┬────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
      ┌──────────────────────┐      ┌──────────────────────┐      ┌──────────────────────┐
      │   Courtroom Arena    │      │  Case Prep Studio    │      │    Legal RAG Core    │
      │  (Multi-Agent Loop)  │      │  (Witness Lab & QA)  │      │  (Hybrid 0.4 / 0.6)  │
      └──────────┬───────────┘      └──────────┬───────────┘      └──────────┬───────────┘
                 │                             │                             │
                 ▼                             ▼                             ▼
      ┌──────────────────────────────────────────────────────────────────────────────────┐
      │                         OpenRouter Cloud Embedding API                          │
      │                         Model: qwen/qwen3-embedding-8b                           │
      │                              Dimensions: 4096                                    │
      └────────────────────────────────────────┬─────────────────────────────────────────┘
                                               │
                                               ▼
      ┌──────────────────────────────────────────────────────────────────────────────────┐
      │                    Neon Serverless Postgres + pgvector                           │
      │                       Active Branch: main (snowy-bread)                          │
      │                        Table: chunks (embedding vector(4096))                   │
      └──────────────────────────────────────────────────────────────────────────────────┘
```

### Full-Stack Component Breakdown

| Layer | Technology | Key Responsibility in Courtroom AI |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (React 19)** | App Router, Server-Side Rendering (SSR), responsive dual-column Case File dossier, sticky audio/text advocate console. |
| **Real-Time Transport** | **Server-Sent Events (SSE)** | Delivers low-latency Newline-Delimited JSON (`NDJSON`) streaming events (`reasoning`, `delta`, `done`) to the transcript panel. |
| **Database & Vector Store** | **Neon Lakebase (PostgreSQL)** | Serverless Postgres with `pgvector` extension; manages relational cases, exhibits, sessions, turns, scores, and 4096-D chunk vectors. |
| **Embedding Model** | **Qwen3-Embedding-8B** | Hosted on OpenRouter cloud API; generates dense 4096-dimensional vectors with zero local CPU/memory footprint. |
| **Multi-Agent LLM Engine**| **OpenRouter / Groq APIs** | Orchestrates persona-separated LLMs for the Presiding Judge, Hostile Witness, and Opposing Counsel. |
| **Verification & Testing** | **Playwright (Chromium)** | Automated browser testing harness executing end-to-end trial sessions, measuring UI latency, and auditing hallucination regex scans. |

---

## 4. Relational Data Model & State Machine

The database schema is strictly relational to maintain data integrity, session isolation, and persistent trial transcripts:

```
┌─────────────┐       1:N       ┌──────────────────┐
│    cases    ├────────────────►│  case_evidence   │ (Exhibits A–G)
└──────┬──────┘                 └──────────────────┘
       │
       │ 1:N                    ┌──────────────────┐
       ├───────────────────────►│   case_parties   │ (Judge, Witness, Counsel)
       │                        └──────────────────┘
       │ 1:N                    ┌──────────────────┐
       ├───────────────────────►│    documents     │
       │                        └────────┬─────────┘
       │                                 │ 1:N
       │                                 ▼
       │                        ┌──────────────────┐
       │                        │      chunks      │ (vector(4096), Section labels)
       │                        └──────────────────┘
       │ 1:N
       ▼
┌─────────────┐       1:N       ┌──────────────────┐
│  sessions   ├────────────────►│  session_turns   │ (Transcript turns with sequence IDs)
└──────┬──────┘                 └──────────────────┘
       │ 1:1
       ▼
┌─────────────┐
│   scores    │ (Argument, Objection, Composure, Legal Accuracy, Overall)
└─────────────┘
```

### Session State Machine
A student practice session progresses through deterministic states:
1. **`OPENING`**: Session initialized via `POST /api/sessions`; Judge Justice Gopalan calls the matter to order.
2. **`EXAMINATION`**: Student submits questions to the witness; witness streams grounded answers.
3. **`OBJECTION`**: Student or opposing counsel intervenes; simulation pauses for judicial ruling.
4. **`RULING`**: Judge delivers on-the-record ruling citing statutory law (e.g., Section 146 BSA).
5. **`CLOSING`**: Timer expires or student concludes oral examination.
6. **`VERDICT`**: Automated judicial appraisal evaluates transcript and records scores.

---

## 5. The Legal Knowledge Corpus (914 Chunks, 5 Matters)

The knowledge base contains **914 indexed chunks** across five genuine legal matters (100% carrying valid 4096-dimensional Qwen3 embeddings):

### 1. Two Seeded Trial Simulation Matters (Playable Dossiers)
- **State v. Arvind Kejriwal (Delhi Liquor Policy Trial, 2022-DLP-01)**:
  - *Domain*: Prevention of Money Laundering Act (PMLA 2002) & Bharatiya Nyaya Sanhita (BNS 2023).
  - *Statutory Focus*: Criminal conspiracy (BNS § 61(2)), money laundering definition & proceeds of crime (PMLA §§ 3, 4), and mandatory twin conditions for bail (PMLA § 45).
  - *Admitted Exhibits (A–G)*: Official ED Section 50 summons chronology, March 22, 2021 Cabinet Note on wholesale margin increases (5% to 12%), search & seizure memos, forensic WhatsApp chat exports.
- **Association for Democratic Reforms v. Union of India (Electoral Bonds, 2024 INSC 113)**:
  - *Domain*: Constitutional Law & Fundamental Rights.
  - *Statutory Focus*: Articles 14, 19(1)(a), voter right to information, corporate political contributions.

### 2. Three Verbatim Supreme Court Reference Judgments
- **Sita Soren v. Union of India (`2024 INSC 161`, 7-Judge Constitution Bench)**:
  - Overruled the 1998 *P.V. Narasimha Rao* precedent.
  - Held that parliamentary privilege under Articles 105(2) and 194(2) does not grant immunity to legislators who accept bribes to cast a vote or give a speech.
- **Bilkis Yakub Rasool v. Union of India (`2024 INSC 24`, 2-Judge Bench)**:
  - Addressed premature executive remission under Section 432 CrPC.
  - Clarified the "appropriate government" doctrine: the state where the trial was held (Maharashtra) has sole jurisdiction, holding Gujarat's remission orders null and void due to usurpation of power.
- **Sukanya Shantha v. Union of India (`2024 INSC 753`, 2-Judge Bench)**:
  - Struck down discriminatory prison manual provisions across multiple states that assigned prison labor and barracks based on caste hierarchy as violating Articles 14, 15, 17, 21, and 23.

---

## 6. Vector Representation & Qwen-3 Cloud Migration (4096-D)

### Why Nomic Embed v1.5 (768-D) Was Replaced
Earlier builds used local ONNX-based Nomic embeddings. This presented severe bottlenecks:
1. **Semantic Compression**: Indian legal statutes feature dense, multi-clause sentences. Compressing these into 768 dimensions conflated distinct procedural provisions (e.g., general bail under CrPC vs. twin conditions under PMLA § 45).
2. **CPU & Memory Overhead**: Running native ONNX runtimes inside serverless web containers introduced high memory usage and cold-start latency.

### The Qwen3-Embedding-8B Architecture
We migrated to Alibaba's `qwen/qwen3-embedding-8b` via OpenRouter:
- **Dimensions**: 4096 (5.3x higher semantic resolution).
- **Endpoint**: `https://openrouter.ai/api/v1/embeddings`
- **Zero Local Footprint**: All vector generation is offloaded to the cloud API.
- **Database Schema Migration**:
  ```sql
  -- Rollback branch established: pre-qwen3-backup
  ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(4096);
  ```
- **Strict Verification**: Ingestion scripts enforce `assert embedding.length === 4096`. 100% of chunks in the database were re-embedded, eliminating mixed-model vector pollution.

---

## 7. Hybrid RAG Retrieval Engine & Cross-Case Scope Fix

### Mathematical Scoring Formulation
Courtroom AI employs a hybrid scoring algorithm combining dense semantic vector search with lexical keyword overlap:

$$S(p, q) = 0.4 \cdot K(p, q) + 0.6 \cdot C(p, q)$$

Where:
- $C(p, q)$ is the **cosine similarity** between the Qwen3 query vector and document chunk vector in pgvector.
- $K(p, q)$ is the **lexical term overlap** score, serving as a fallback and boosting exact statutory section matches (e.g., `§ 61(2)`).
- If cloud vector services are unavailable, the system smoothly defaults to $S(p, q) = K(p, q)$.

### The "case-or-null" Scope Fix
In legal practice, counsel arguing an excise fraud matter frequently needs to cite external constitutional rulings (e.g., legislative privilege or executive authority). 

- **The Defect**: Earlier code enforced strict `WHERE case_id = :active_case`. This meant that querying a Supreme Court precedent from inside the Delhi trial prep page returned **0 chunks**.
- **The Solution**: Implemented the `case-or-null` scope predicate:
  ```sql
  WHERE (case_id = :active_case OR case_id IS NULL)
  ```
- **The Result**: General Supreme Court judgments (`case_id IS NULL`) are globally retrievable from any trial page, while case exhibits remain strictly isolated.
- **Empirical Proof**: Querying *"Does parliamentary privilege protect a legislator who takes a bribe?"* inside the Delhi Liquor case prep page retrieves **6/6 top chunks from *Sita Soren* (`2024 INSC 161`)** with **0.8255 cosine similarity**.

---

## 8. Anti-Hallucination Engineering: Negative Constraints

The core innovation protecting Courtroom AI against generative hallucination is **negative-constraint prompt engineering**.

### The Stress Test
In `demo/presentation/05-witness-lab.png`, we interrogate PW-1 (Enforcement Directorate Investigating Officer) on summons dates:
> *Counsel*: "How many summons were issued to you before the arrest?"

### Generic LLM Failure vs. Courtroom AI Guardrail
- **Generic AI Behavior**: Models invent specific daily dates (e.g., *"The first was issued on Oct 14, the second on Nov 3..."*).
- **Courtroom AI Grounding Instruction**:
  > *"Answer strictly from Exhibit A. If the record provides a date span (e.g., between October 2023 and March 2024) but does not provide individual daily dates, you must explicitly state that the record does not provide individual dates."*
- **PW-1's Actual Generated Response**:
  > *"The case file (specifically Exhibit A) records that a total of 9 summons under Section 50 of the PMLA were issued between October 2023 and March 2024. The record does not state individual specific dates for each of the 9 summons."*

### Empirical Specifics Scan Result
Our automated scanner audited 40+ dialogue turns across witness and judge agents (`data/eval/specifics_scan.json`):
- **Fabricated Dates**: **0**
- **Fabricated Sections**: **0**

---

## 9. Multi-Agent Courtroom Simulation Loop

Courtroom AI orchestrates four specialized agent personas, each governed by role-specific system prompts:

```
                  ┌────────────────────────────────────────┐
                  │       PRESIDING JUDGE PERSONA          │
                  │       (Hon'ble Justice V. Gopalan)     │
                  │   - Enforces courtroom decorum         │
                  │   - Rules on objections under BSA      │
                  │   - Delivers Bench Appraisal verdict   │
                  └──────────────────┬─────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────────────┐    ┌──────────────────────────────────────┐
│        HOSTILE WITNESS PERSONA       │    │       OPPOSING COUNSEL PERSONA       │
│          (PW-1 IO Sharma)            │    │        (Prosecution / Defense)       │
│ - Defends investigation              │    │ - Intervenes with timely objections  │
│ - Strictly confined to Exhibit A     │    │ - Challenges speculative questioning │
│ - Refuses to invent facts            │    └──────────────────────────────────────┘
└──────────────────────────────────────┘
```

---

## 10. Procedural Evidence Engine: Bharatiya Sakshya Adhiniyam, 2023

In courtroom advocacy, mastering evidence law is paramount. When counsel triggers an Objection during examination, the Bench delivers a **reasoned statutory ruling**:

### Live Trial Example (`demo/presentation/09-objection.png`)
1. **Counsel Action**: Defense counsel raises an objection regarding procedural questioning.
2. **Bench Intervention**: Justice Gopalan immediately halts the examination.
3. **Statutory Ruling on the Record**:
   > *"OBJECTION OVERRULED. The question seeks to test the veracity and consistency of the investigating officer's procedural timeline under Section 146 of the Bharatiya Sakshya Adhiniyam, 2023. The witness shall answer."*

This bridges classroom statutory study with real-time application under India's new criminal jurisprudence.

---

## 11. Low-Latency Real-Time Streaming Architecture (SSE / NDJSON)

Advocacy requires immediate conversational tempo. Courtroom AI implements a streaming pipeline using **Server-Sent Events (SSE)** emitting Newline-Delimited JSON (`NDJSON`):

```
Client Browser                     Next.js API (/api/sessions/[id]/stream)          OpenRouter LLM
      │                                                │                                  │
      ├─── POST user question / objection ────────────►│                                  │
      │                                                ├─── Stream prompt with chunks ───►│
      │                                                │                                  │
      │◄── event: reasoning {"stage": "checking_exhibits"} ───────────────────────────────┤
      │                                                │                                  │
      │◄── event: delta {"text": "Exhibit A"} ─────────┴── Token stream delta ────────────┤
      │◄── event: delta {"text": " records 9..."} ─────┴── Token stream delta ────────────┤
      │                                                │                                  │
      │◄── event: done {"turnId": 142, "status": "ok"} ┴── Final turn persisted in DB ────┤
      │                                                │                                  │
```

- **Live Cursor & Deltas**: Tokens stream directly to the transcript panel with sub-second feedback, rendering an active cursor.
- **Server-Side Safety**: Prevents prompt injection and guarantees session ownership before tokens emit.

---

## 12. Automated Judicial Bench Appraisal (5-Metric Rubric)

Upon trial conclusion, the system executes an automated judicial evaluation across **five core advocacy competencies** on a 1–5 scale:

| Metric | Focus | Criteria |
|---|---|---|
| **1. Argument Quality** | Substantive Advocacy | Logical consistency, evidentiary backing from exhibits, absence of speculative claims. |
| **2. Objection Handling** | Procedural Advocacy | Timeliness, statutory grounding under BSA, respect for judicial rulings. |
| **3. Composure & Decorum** | Professional Demeanor | Courtroom etiquette, formal address to the Bench, deference under pressure. |
| **4. Legal Accuracy** | Statutory Correctness | Correct application of BNS, PMLA, and Supreme Court precedents. |
| **5. Overall Score** | Holistic Performance | Comprehensive trial impact and effectiveness of cross-examination. |

The appraisal modal (`demo/presentation/10-verdict.png`) also provides **qualitative judicial critiques**, detailing specific strengths and actionable areas for remediation.

---

## 13. Empirical Evaluation & Quantitative Results

Evaluated across automated testing harnesses (`scripts/run-legal-eval.mjs`, `data/eval/ablation_gold.json`, `data/eval/specifics_scan.json`):

### 1. Retrieval Accuracy Metrics (Qwen3-8B 4096-D)

| Metric | Benchmark Dataset ($n=20$) | Held-Out Test Set ($n=47$) |
|---|:---:|:---:|
| **Document MRR@10 (Vector-Only)** | **100.0%** | **93.6%** |
| **Top-1 Document Accuracy** | **100.0%** | **93.6%** |
| **Gold-Chunk MRR@10** | **68.3%** | **65.6%** |
| **Recall@5** | **100.0%** | **97.9%** |
| **Precision@5** | **71.3%** | **68.4%** |

### 2. Anti-Hallucination & Fidelity Audit
- **Fabricated Dates Detected**: **0** across 40+ inspected dialogue turns.
- **Fabricated Sections Detected**: **0** (all sections strictly correspond to BNS, PMLA, or BSA).
- **Faithfulness Sample**: $n=27$ scoreable trial turns audited for persona fidelity.

---

## 14. Step-by-Step Live Demonstration Walkthrough

When presenting Courtroom AI to evaluators, follow this exact sequential walkthrough:

1. **Dashboard (`01-dashboard.png`)**: Open the Chamber Docket; inspect active matters (*State v. Kejriwal*, *ADR v. UOI*).
2. **Case File (`02-case-file.png`)**: Enter Delhi Liquor Prep; review Exhibits A–G and 16 indexed fact chunks.
3. **Statutory RAG (`03-rag-statutes.png`)**: Query conspiracy & money laundering provisions; observe BNS § 61(2) & PMLA § 45 retrieval.
4. **Cross-Case Retrieval (`04-rag-judgment.png`)**: Query parliamentary bribery from inside Delhi page; observe 6/6 chunks retrieved from *Sita Soren* (`2024 INSC 161`).
5. **Witness Lab (`05-witness-lab.png`)**: Interrogate PW-1 on summons dates; verify non-hallucination of daily dates.
6. **Courtroom Setup (`06-courtroom-setup.png`)**: Configure Defense Counsel role and 3-minute oral session timer.
7. **Judge Opening (`07-judge-opening.png`)**: Enter arena; Justice Gopalan delivers opening gavel address; timer starts.
8. **Live Streaming (`08-streaming.png`)**: Cross-examine witness; observe real-time token streaming with typing cursor.
9. **Objection (`09-objection.png`)**: Click Objection; observe Judge rule `OBJECTION OVERRULED` citing Section 146 BSA.
10. **Verdict (`10-verdict.png`)**: Conclude trial; review 5-metric Bench Appraisal scorecard and feedback.
11. **Results Slides (`11-slide-a-results.png`, `12-slide-b-limits.png`)**: Present quantitative metrics and ethical disclosures.

---

## 15. Academic Limitations, Failure Modes & Governance

Responsible AI demands transparent disclosure of current system boundaries:
1. **Corpus Scope**: Currently indexed across five genuine legal matters (914 chunks). Expanding to commercial litigation and High Court records is ongoing.
2. **Judicial Score Variance**: Automated Bench Appraisal scores exhibit a 1–2 point variance across repeated runs on identical transcripts due to LLM sampling dynamics.
3. **Faithfulness Sample**: Faithfulness evaluated on a bounded scoreable sample of $n=27$ turns.
4. **Ethical Governance**: All judicial, witness, and counsel personas are synthetic educational simulations. Courtroom AI is strictly an educational training tool, **not legal advice**.

---

## 16. Professor & Evaluator Defense Q&A Guide

### Q1: Why not simply use ChatGPT or Claude with a system prompt?
**Answer**: ChatGPT has no concept of an admitted evidentiary record. When cross-examined by an advocate, ChatGPT will invent plausible dates, facts, and statutory provisions that do not exist. In legal advocacy, building a case theory around fabricated facts is malpractice. Courtroom AI couples strict negative-constraint prompts with 4096-dimensional pgvector retrieval, ensuring agents explicitly acknowledge the limits of the record rather than hallucinating.

### Q2: Why did you migrate from Nomic (768-D) to Qwen-3 (4096-D)?
**Answer**: Indian legal drafting features long, dense, multi-clause sentences. Nomic’s 768 dimensions compressed away subtle semantic distinctions between general criminal procedure and specialized statutes (such as PMLA § 45 twin bail conditions). Qwen3-8B provides 4096 dimensions, capturing subtle legal semantics and cross-case precedent linkages with zero local CPU overhead.

### Q3: What is the "case-or-null" scope fix and why does it matter?
**Answer**: In our initial build, queries on a case page used `WHERE case_id = :active_case`. This inadvertently blocked external Supreme Court reference judgments, resulting in 0 judgment chunks when asking constitutional questions. By changing the predicate to `WHERE case_id = :active_case OR case_id IS NULL`, external Supreme Court judgments remain universally accessible while case exhibits remain strictly isolated.

### Q4: How do you handle India's transition to the new criminal laws?
**Answer**: Courtroom AI is specifically updated for the new criminal jurisprudence: the Bharatiya Nyaya Sanhita (BNS 2023), Bharatiya Nagarik Suraksha Sanhita (BNSS 2023), and Bharatiya Sakshya Adhiniyam (BSA 2023). All statutory chunks, objections, and judicial rulings cite the new provisions (such as Section 146 BSA for testing witness veracity).

### Q5: How do you evaluate the quality of simulated advocacy?
**Answer**: The system uses a multi-dimensional Bench Appraisal evaluating transcripts across Argument Quality, Objection Handling, Composure, Legal Accuracy, and Overall Advocacy on a 1–5 scale, accompanied by qualitative judicial critiques.

---

*Authored by Rahul Patel & Kamal Nayan Kumar — Dept. of Data Science & AI, IIIT Dharwad.*
