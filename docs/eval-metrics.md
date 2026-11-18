# Courtroom AI — Retrieval Evaluation Metric Definitions

This document is the single source of truth for how retrieval quality is measured
in Courtroom AI. Every reported number in the report and in
`data/eval/*.json` must be derivable from these definitions.

## Corpus

- `cases` — playable simulation cases (Delhi Liquor, Electoral Bonds): `chunks.case_id` set.
- `documents` with `kind = 'judgment'` — three 2024 judgments ingested for legal-reference: `chunks.case_id IS NULL`.
  - Sita Soren v. Union of India (2024 INSC 161)
  - Bilkis Yakub Rasool v. Union of India (2024 INSC 24)
  - Sukanya Shantha v. Union of India (2024 INSC 753)

## Relevance definition (v2, 2026-11-14)

Three definitions are reported side by side in every ablation. They are intentionally
different so that the sensitivity of each number is visible.

| Name | Definition |
|---|---|
| **lenient** | Chunk matches if the expected citation string appears anywhere in `section_label` or `text`. |
| **doc** | Chunk's document matter == expected matter (Delhi Liquor / Electoral Bonds / Sita Soren / Bilkis / Sukanya). |
| **strict** | doc AND (if a paragraph anchor exists, the chunk overlaps the anchor with Jaccard >= 0.5). If no paragraph anchor exists for the question, strict degrades to doc. This is a slight relaxation of relevance — it cannot be made stricter given the corpus lacks paragraph anchors for most judgments. |

### Anchor loading (strict only)

Anchors are loaded from `chunks` rows whose `section_label` exactly matches
`2024 INSC {161|24|753} | Para N`, where `N` is any digit group in `expected_paragraph`.
Judgments without paragraph-numbered chunks (Bilkis ~0, Sukanya 1/6) yield empty anchors;
strict degrades to doc-level. Anchor overlap uses Jaccard over lowercase alphanumeric tokens
longer than 2 characters, computed as |intersection of anchor tokens and chunk tokens| /
|union of anchor tokens and chunk tokens|. A threshold of **Jaccard >= 0.5** defines a hit.
An overlap of 1.000 indicates the anchor chunk itself (e.g. `2024 INSC 161 | Para 12`)
was retrieved.

### Retrieval scope evaluated

Both the global eval path and the case-scoped production path are measured on the same 30 questions:

| Mode | Predicate |
|---|---|
| **global** | `embedding IS NOT NULL` (all 914 chunks) |
| **case-or-null** | `case_id = X OR case_id IS NULL` — the app's playable scope |

A case-scoped question can ground itself in the judgment corpus only via `case_id IS NULL`;
judgments carry NULL case_id in this corpus.

## Metrics

## Metrics

- **Precision@5** = (# relevant chunks in top 5) / 5.
- **Recall@5** = 1 if any relevant chunk appears in top 5, else 0 (binary per question, averaged).
- **Recall@10** = 1 if any relevant chunk appears in top 10, else 0.
- **MRR@10** = 1 / rank of the first relevant chunk (top 10), else 0.
- **Citation accuracy** = 1 only if the first relevant chunk is at rank 1, else 0 (per question, averaged).
- **Top-1 accuracy** = same as citation accuracy (rank == 1).

## Query modes evaluated

Two scopes are measured on the same question set (Step 1 decision 1):

| Mode | SQL predicate |
|---|---|
| **Global** (current eval) | `embedding IS NOT NULL` — no case restriction |
| **Scoped** (app path) | `case_id = <expected-case-id> OR case_id IS NULL` — judgments visible from any case query |

Case queries in production currently use `case_id = X` only, which excludes
judgment chunks entirely. Step 3 will treat that as a bug.

## Ranking modes

For each evaluated query we record raw vector order and these scoring blends
(before any reranking fix):

- `vector-only`
- `hybrid-0.2/0.8` (keyword×0.2 + cosine×0.8)
- `hybrid-0.4/0.6` (current production)
- `hybrid-0.6/0.4` (keyword-heavy)
- `keyword-only`

All scores clamp cosine to [0,1] and keyword to [0,1] before blending.

## Limitation declarations

- Questions in the original 30 were authored against the same five matters the
  system retrieves over. Metrics are therefore **not** an unbiased estimate of
  general legal-retrieval performance; they are an internal consistency measure.
- The held-out set (`data/eval/heldout_questions.json`) exists to measure
  generalisation of any change. It is never used for tuning.
- The LLM judge used for the faithfulness harness is not a human annotator;
  its calibration is documented in `docs/eval-metrics.md` §Faithfulness below.

## Faithfulness measurement

- For each of 20 RAG questions, the generated answer is split into atomic
  claims (LLM-assisted split, reviewed manually on a sample of 5).
- Each claim is labelled `supported` / `unsupported` / `contradicted` by an
  LLM judge prompted with the answer + the retrieved chunks only.
- **Reported metric**: percentage of claims `supported`. `contradicted` and
  `unsupported` are both reported separately.
- The judge is non-deterministic; variance across two runs is reported.
- **Invented-specifics scan**: for witness and judge turns, regex-extract
  concrete artifacts (dates, diary/entry/page numbers, section/article
  references, party names) and flag any that do not appear in the case chunks
  or exhibits. This is a necessary-not-sufficient check.
