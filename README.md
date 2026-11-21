# Courtroom AI (कचहरी AI) — Autonomous Multi-Agent Courtroom Simulator & Legal RAG

> **Academic Project**: Mini Project Report on *Courtroom AI: A Retrieval-Augmented Indian Courtroom Simulator*  
> **Institution**: Department of Data Science and Artificial Intelligence, **Indian Institute of Information Technology Dharwad (IIIT Dharwad)**  
> **Authors**: **Rahul Patel (23BDS047)** & **Kamal Nayan Kumar (23BDS026)**  
> **Project Supervisor**: **Dr. Sunil Saumya**, Assistant Professor, IIIT Dharwad  
> **Date**: November 2026

An autonomous, multi-agent courtroom simulation and legal research platform tailored for Indian law students, advocates, and moot court teams. Designed for Indian procedural jurisprudence (**Bharatiya Nyaya Sanhita 2023**, **Bharatiya Nagarik Suraksha Sanhita 2023**, **Bharatiya Sakshya Adhiniyam 2023**, **PMLA 2002**, and landmark Supreme Court constitutional precedents).

---

## 🏛️ System Architecture

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

---

## 📚 1. Legal Knowledge Base & Corpus (9,862 Chunks Across 16 Documents)

The knowledge base is indexed with genuine legal reference documents and simulation trial dossiers (100% 4096-dim Qwen3 vectors, 0 skipped, 0 nulls):

| # | Case / Precedent | Citation / Domain | Key Legal Topics | Exhibits & Roles | Chunks |
|---|------------------|-------------------|------------------|------------------|:------:|
| **1** | **State v. Arvind Kejriwal (Delhi Liquor Policy)** | Special PMLA Court / HC / SC (2022-DLP-01) | Criminal conspiracy (BNS § 61(2)), electronic records (BSA § 63), money laundering (PMLA §§ 3, 4, 45). | 7 Admitted Exhibits (A–G), 7 Parties | 16 |
| **2** | **Assoc. for Democratic Reforms v. Union of India** | `2024 INSC 113` (5-Judge Bench) | Unconstitutionality of Electoral Bonds Scheme, voter right to information (Art. 19(1)(a)). | 6 Exhibits (A–F), 5 Parties | 10 |
| **3** | **Sita Soren v. Union of India (2024)** | `2024 INSC 161` (7-Judge Bench) | Legislative privileges (Articles 105/194), bribery criminal liability, overruling *P.V. Narasimha Rao*. | Full reported judgment | 236 |
| **4** | **Bilkis Yakub Rasool v. Union of India (2024)** | `2024 INSC 24` (2-Judge Bench) | Remission of life sentences (Section 432 CrPC), appropriate government doctrine, judicial review. | Full reported judgment | 380 |
| **5** | **Sukanya Shantha v. Union of India (2024)** | `2024 INSC 753` (2-Judge Bench) | Prison caste discrimination (Articles 14, 15, 17, 21), striking down discriminatory colonial manuals. | Full reported judgment | 286 |

### Landmark Judgment Corpus (10 further Supreme Court judgments)

Verbatim official judgment text sourced from Indian Kanoon (`scripts/extract-judgments.mjs`), chunked and embedded with the same Qwen3-Embedding-8B pipeline:

| # | Judgment | Citation / Bench | Key Legal Topics | Chunks |
|---|----------|------------------|------------------|:------:|
| **6** | **Kesavananda Bharati Sripadagalvaru v. State of Kerala** | `AIR 1973 SC 1461` (13-Judge Constitution Bench) | Basic structure doctrine (Art. 368), parliamentary sovereignty, Arts. 13, 25, 32. | 3,549 |
| **7** | **Additional District Magistrate, Jabalpur v. Shivakant Shukla** | `AIR 1976 SC 1207` (5-Judge Bench) | Habeas corpus during the Emergency, Art. 21, MISA detenues (overruled in 2021). | 1,151 |
| **8** | **Maneka Gandhi v. Union of India** | `1978 AIR 597` (7-Judge Bench) | Art. 21 "procedure established by law", passport impoundment, natural justice. | 742 |
| **9** | **Hussainara Khatoon v. Home Secretary, State of Bihar** | `1979 AIR 1360` (3-Judge Bench) | Undertrial prisoners, speedy trial, bail without sureties (Arts. 14, 21). | 61 |
| **10** | **Vishaka v. State of Rajasthan** | `AIR 1997 SC 3011` (3-Judge Bench) | Sexual-harassment-at-workplace guidelines, Arts. 14, 15, 21, 32. | 33 |
| **11** | **D.K. Basu v. State of West Bengal** | `AIR 1997 SC 610` (2-Judge Bench) | Arrest safeguards, custodial deaths, arrest memoranda (Arts. 21, 22; CrPC §§ 54, 55, 57, 167). | 95 |
| **12** | **Shreya Singhal v. Union of India** | `2015 INSC 257` (2-Judge Bench) | Struck down IT Act § 66A, Art. 19(1)(a), intermediary takedown rules (§§ 69A, 79). | 239 |
| **13** | **K.S. Puttaswamy (Retd.) v. Union of India** | `2017 INSC 801` (9-Judge Constitution Bench) | Right to privacy under Art. 21, overruling *M.P. Sharma* and *Kharak Singh*. | 1,214 |
| **14** | **Mukesh v. State (NCT of Delhi)** | `2017 INSC 448` (3-Judge Bench) | Nirbhaya appeal: gang rape, death penalty, IPC §§ 302, 376A, 376D, 376E. | 844 |
| **15** | **Navtej Singh Johar v. Union of India** | `2018 INSC 790` (5-Judge Constitution Bench) | Struck down IPC § 377, sexual orientation, Arts. 14, 15, 19, 21. | 999 |

Re-run the pipeline with `node scripts/extract-judgments.mjs --only <id>` → `node scripts/ingest-judgments.mjs` → `node scripts/backfill-embeddings.mjs`, then check everything with `node scripts/verify-judgment-corpus.mjs`.

---

## ⚡ 2. Qwen3-Embedding-8B Migration

The embedding infrastructure was migrated from local CPU-based Nomic (768-dim) to OpenRouter's cloud-hosted **Qwen3-Embedding-8B**:

- **Model ID**: `qwen/qwen3-embedding-8b`
- **API Endpoint**: `https://openrouter.ai/api/v1/embeddings`
- **Output Dimensions**: 4096
- **Architecture Highlights**:
  - Implemented in `src/lib/embed.ts` with strict runtime dimension assertion (`assert len == 4096`).
  - Batching up to 20 items per request, sliced to 8,000 characters.
  - Exponential backoff with HTTP 429 rate-limit `retry-after` handling.
  - Zero local CPU/GPU footprint — eliminated native ONNX binary dependencies.
  - Symmetrical model usage across document ingestion (`/api/documents`) and query-time search (`/api/rag/ask`).

---

## 🗄️ 3. Neon Postgres Database Migration

- **Active Database**: `snowy-bread-71537502` (endpoint `ep-red-hat-ao4wpm6r`)
- **Safety Rollback Point**: Neon branch `pre-qwen3-backup` (`br-floral-paper-aov881rv`) created prior to migration.
- **Migration Details**:
  - Altered `chunks.embedding` column from `vector(768)` to `vector(4096)`.
  - Updated `documents_kind_check` constraint to support `'judgment'` and `'legal_ref'`.
  - Purged legacy 768-dim Nomic vectors to eliminate mixed-model vector pollution.
  - Backfilled 100% of chunks with 4096-dim Qwen3 vectors (0 skipped, 0 nulls).

---

## 🔍 4. Retrieval Resolution: The `case-or-null` Scope Fix

### The Problem
In earlier iterations, the RAG query enforced strict `WHERE case_id = :active_case`. When students asked broader constitutional or precedent questions from inside a trial prep page (e.g., Delhi Liquor), external Supreme Court reference judgments returned **0 chunks**.

### The Solution
Implemented the `case-or-null` scope predicate:
```sql
WHERE (case_id = :active_case OR case_id IS NULL)
```
- Case-specific trial exhibits remain strictly isolated (Delhi queries never return Electoral Bonds exhibits).
- General Supreme Court precedents (ingested with `case_id IS NULL`) remain globally accessible to all trial prep pages.

### Empirical Proof
Querying *"Does parliamentary privilege protect a legislator who takes a bribe?"* inside the Delhi Liquor prep page retrieves **6/6 top chunks from *Sita Soren* (`2024 INSC 161`)** with **0.8255 cosine similarity** (previously 0 chunks).

---

## 🛡️ 5. Anti-Hallucination & Evidentiary Fidelity

Generic LLMs fail in legal training because they fabricate specific dates and statutory sections when pressed by counsel. Courtroom AI solves this with **negative constraint prompt engineering**:

- **The Negative Constraint Rule**: *"If the record provides a date span but no daily dates, state clearly that the record does not provide individual dates."*
- **Empirical Stress Test**: Interrogating PW-1 (ED IO) in the Witness Lab on pre-arrest summons timing:
  - *Response*: Correctly cites Exhibit A, states 9 summonses were issued between October 2023 and March 2024, and explicitly notes the record does not provide daily dates (`inventedDates: false`).
- **Automated Specifics Scan** (`data/eval/specifics_scan.json`):
  - Scanned 40+ dialogue turns across witness and judge agents.
  - **Fabricated dates**: 0
  - **Fabricated statutory sections**: 0

---

## ⚖️ 6. Procedural Evidence Engine: Bharatiya Sakshya Adhiniyam, 2023

- **Real-Time Objection Mechanics**: Students can trigger objections during cross-examination (relevance, hearsay, leading questions, improper impeachment).
- **Reasoned Judicial Rulings**: The simulated Bench (Justice V. Gopalan) does not merely say *Sustained* or *Overruled*. It delivers an on-the-record procedural ruling citing statutory law:
  > *"OBJECTION OVERRULED. The question seeks to test the veracity and consistency of the investigating officer's procedural timeline under Section 146 of the Bharatiya Sakshya Adhiniyam, 2023. The witness shall answer."*
- **Automated Bench Appraisal**: At session conclusion, the judge generates a 5-dimensional scorecard (1 to 5 scale):
  1. Argument Quality
  2. Objection Handling
  3. Composure & Decorum
  4. Legal Accuracy
  5. Overall Advocacy Score (with qualitative feedback)

---

## 📊 7. Empirical Evaluation & Quantitative Benchmarks

Measured on automated evaluation suites (`scripts/run-legal-eval.mjs`, `data/eval/ablation_gold.json`, `data/eval/specifics_scan.json`):

| Evaluation Metric | Benchmark Set ($n=20$) | Held-Out Test Set ($n=47$) |
|---|:---:|:---:|
| **Document MRR@10 (Vector-Only)** | **100.0%** | **93.6%** |
| **Top-1 Document Accuracy** | **100.0%** | **93.6%** |
| **Gold-Chunk MRR@10** | **68.3%** | **65.6%** |
| **Recall@5** | **100.0%** | **97.9%** |
| **Fabricated Dates Detected** | **0** | **0** |
| **Fabricated Sections Detected** | **0** | **0** |

---

## 📁 8. Demo, Presentation & Video Production Package

All project presentation assets are organized in [`demo/presentation/`](file:///home/rahul/Work/courtroom_ai/demo/presentation/):

- **System Documentation & Architecture Report**:
  - [`Courtroom_AI_Complete_System_Documentation.pdf`](file:///home/rahul/Work/courtroom_ai/Courtroom_AI_Complete_System_Documentation.pdf) *(26-page high-fidelity PDF report with 27 embedded figures, diagrams, and comprehensive academic conclusion)*
  - [`Courtroom_AI_Complete_System_Documentation.docx`](file:///home/rahul/Work/courtroom_ai/Courtroom_AI_Complete_System_Documentation.docx) *(Editable Word document, 8.1MB)*
  - Also copied to: [`/home/rahul/Downloads/Courtroom_AI_Complete_System_Documentation.pdf`](file:///home/rahul/Downloads/Courtroom_AI_Complete_System_Documentation.pdf) and [`/home/rahul/Downloads/Courtroom_AI_Complete_System_Documentation.docx`](file:///home/rahul/Downloads/Courtroom_AI_Complete_System_Documentation.docx)
- **PowerPoint Presentation Deck**:
  - [`Courtroom_AI_Structured_Presentation.pptx`](file:///home/rahul/Work/courtroom_ai/demo/presentation/Courtroom_AI_Structured_Presentation.pptx) *(22-slide official IIIT Dharwad presentation with embedded figures and Presenter Notes)*
  - Also copied to: [`/home/rahul/Downloads/Courtroom_AI_Structured_Presentation.pptx`](file:///home/rahul/Downloads/Courtroom_AI_Structured_Presentation.pptx)
- **Interactive Browser Presenter**:
  - [`index.html`](file:///home/rahul/Work/courtroom_ai/demo/presentation/index.html) *(Double-click to open side-by-side slide and narration viewer in any browser)*
- **Scripts**:
  - [`SCRIPT_DETAILED.md`](file:///home/rahul/Work/courtroom_ai/demo/presentation/SCRIPT_DETAILED.md) *(Comprehensive 7-minute deep dive with professor Q&A points)*
  - [`SCRIPT_VOICEOVER.md`](file:///home/rahul/Work/courtroom_ai/demo/presentation/SCRIPT_VOICEOVER.md) *(Clean 3:30 script for ElevenLabs / CapCut / Premiere video editing)*
- **Real App Snapshots & Slides**:
  - `00-overview-contact-sheet.png` (Contact sheet of all 10 simulation turns)
  - `01-dashboard.png` (Chamber Docket)
  - `02-case-file.png` (Exhibits A–G)
  - `03-rag-statutes.png` (BNS & PMLA statutory retrieval)
  - `04-rag-judgment.png` (Sita Soren 2024 INSC 161 precedent query)
  - `05-witness-lab.png` (PW-1 interrogation)
  - `06-courtroom-setup.png` (Defense vs Prosecution role setup)
  - `07-judge-opening.png` (Justice Gopalan gavel address)
  - `08-streaming.png` (Live token streaming capture)
  - `09-objection.png` (Section 146 BSA objection ruling)
  - `10-verdict.png` (Bench Appraisal scorecard)
  - `11-slide-a-results.png` (Empirical evaluation results)
  - `12-slide-b-limits.png` (Academic limitations and governance)

---

## 🚀 Quick Start

### 1. Environment Configuration

Create a `.env.local` file with the following credentials:

```bash
# Neon Postgres
DATABASE_URL="postgresql://neondb_owner:[PASSWORD]@[HOST]-pooler.[REGION].aws.neon.tech/neondb?sslmode=require"

# OpenRouter (Qwen3 embeddings & LLM reasoning)
OPENROUTER_API_KEY="sk-or-v1-..."

# Groq (Optional fast courtroom dialogue generation)
GROQ_API_KEY="gsk_..."
```

### 2. Run Scripts

```bash
# Ingest judgments into vector database
node scripts/ingest-judgments.mjs

# Backfill embeddings using Qwen3 via OpenRouter
node scripts/backfill-embeddings.mjs

# Run automated legal retrieval evaluation benchmark
node scripts/run-legal-eval.mjs

# Run regression tests
node scripts/regression-tests.mjs

# Start Next.js development server
npm run dev
```

---

## ⚖️ Academic Limitations & Ethical Governance

1. **Corpus Scope**: Currently indexed across 16 documents — 13 verbatim Supreme Court judgments (including 10 landmark constitution-bench and civil/criminal precedents) and 3 trial dossiers, 9,862 chunks; expanding to broader commercial and High Court jurisprudence is ongoing.
2. **Judicial Score Variance**: Automated Bench Appraisal scores exhibit a 1–2 point variance across repeated runs due to LLM sampling dynamics.
3. **Faithfulness Evaluation**: Evaluated across a scoreable sample of $n=27$ turns.
4. **Governance Disclaimer**: All judicial, witness, and opposing counsel personas are synthetic educational simulations. Courtroom AI is strictly an educational training sandbox for law students, **not legal advice**.
