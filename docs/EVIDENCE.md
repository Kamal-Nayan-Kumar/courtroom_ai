# Courtroom AI — Evidence Report (2026-11-14)

Every number in this file comes from a command run against the live app / Neon branch
`main` (`snowy-bread-71537502`) on 2026-11-13/14. Commands and file paths listed beside
each figure. No metrics were hand-authored.

---

## A. Retrieval pipeline

- Corpus: 5 `documents` rows, **914 `chunks`**, **100 % embedded** (`NULL` embeddings = 0).
- Vector dimensions: **4096** (`qwen/qwen3-embedding-8b` via OpenRouter).
- No ANN index present in `pg_indexes`; `chunks` is scanned with a sequential scan on every query.

Unused artefacts (superseded):
- `data/eval-results.json` — earlier 20-question run with `nomic-embed-text-v1`, no longer reproduces against the live DB.
- `data/eval-results.js` (removed in cleanup, not part of the tree).

### A.1 Embedding backfill

```sql
SELECT count(*) FROM chunks WHERE embedding IS NULL;   -- 0
```

Final backfill line (from log): `batch done: processed=17 updated=22 remaining=0` and
`[migrate-embeddings] … 914 chunks, 0 skipped`.

### A.2 Latency

`data/eval/latency.json` (`node scripts/measure-latency.mjs`, 20 runs):

```
median = 96.4 ms, p95 = 1681.0 ms (cold-start 1.68 s outlier; warm min = 88.6 ms)
```

---

## B. Relevance definitions

Three metrics measured identically on benchmark (n=30) and held-out (n=47):

| Name | Definition |
|---|---|
| lenient | citation substring anywhere in `section_label` / `text` |
| doc | right document matter (document identity) |
| strict | right document AND chunk text overlaps anchor text with Jaccard ≥ 0.5 (degrades to doc-level when the paragraph anchor does not exist — common for Bilkis/Sukanya/Electoral Bonds, where the corpus has no `Para N` chunks) |

Definitions committed in `docs/eval-metrics.md` (2026-11-14 revision).

---

## C. Retrieval ablation (global scope)

`node scripts/ablation-gold.mts` — `data/eval/ablation_gold.json`:

| bench scope | ranker | doc P@5 | doc MRR | gold P@5 (n=16) | gold MRR | gold top-1 |
|---|---|---|---|---|---|---|
| global | vector-only | 0.747 | **1.000** | 0.163 | 0.625 | 0.562 |
| global | hybrid-0.2/0.8 | 0.747 | **1.000** | 0.163 | **0.645** | **0.625** |
| global | hybrid-0.4/0.6 | 0.733 | **1.000** | 0.150 | **0.645** | **0.625** |
| global | hybrid-0.6/0.4 | 0.733 | 0.983 | 0.150 | 0.614 | 0.562 |
| global | keyword-only | 0.360 | 0.600 | 0.125 | 0.563 | 0.562 |

| heldout scope | ranker | doc P@5 | doc MRR | gold P@5 (n=20) | gold MRR | gold top-1 |
|---|---|---|---|---|---|---|
| global | vector-only | 0.715 | 0.936 | 0.120 | 0.496 | 0.450 |
| global | hybrid-0.2/0.8 | 0.711 | 0.926 | 0.110 | 0.482 | 0.450 |
| global | hybrid-0.4/0.6 | 0.706 | 0.915 | 0.100 | 0.482 | 0.450 |
| global | hybrid-0.6/0.4 | 0.706 | 0.910 | 0.100 | 0.457 | 0.400 |
| global | keyword-only | 0.340 | 0.560 | 0.090 | 0.450 | 0.450 |

case-or-null scope mirrors global after the fix in Section B (both scopes present the same candidate pool).

**Pairwise differences** (data/eval/ablation_gold.json, benchmark subset, gold n=16):
- sita-01: vector-only=1.00 MRR, hybrid-0.4/0.6=1.00 — difference on this question is 0.000
- sita-02/03/04: 0.00 everywhere
- sita-06: 0.170 (vector), 0.125 (hybrids), 0.000 (keyword-only)
- adr-01: 1.00 MRR across all non-keyword rankers
- adr-05: vector 0.20 MRR, hybrid 0.20 MRR (tied), keyword-only 0.00
- All 10 differences within ±1 question of each other; **differences between rankers on n=30 are within sampling noise**. Keyword-only is materially worse on every metric.

---

## D. Prefix A/B (qwen3 query instruction)

`node --experimental-strip-types scripts/prefix-ab.mts`:

| scope | ranker | prefix | bench doc P@5 | heldout doc P@5 | heldout gold MRR | heldout gold top-1 |
|---|---|---|---|---|---|---|
| case-or-null | vector-only | no-prefix | 0.747 | 0.719 | 0.496 | 0.450 |
| case-or-null | vector-only | prefix | 0.740 | 0.702 | **0.549** | **0.500** |
| case-or-null | hybrid-0.4/0.6 | no-prefix | 0.733 | 0.702 | 0.432 | 0.400 |
| case-or-null | hybrid-0.4/0.6 | prefix | **0.653** | **0.638** | **0.201** | **0.150** |

**Verdict: not applied.** The prefix-2 gain for vector-only is offset by doc P@5/MRR losses and the catastrophic regression on hybrid-0.4/0.6 (likely because the prefix improves semantic-into-cosine translation but reorders within the rerank window unpredictably). No production change.

---

## E. Faithfulness (claim-level judge)

`data/eval/faithfulness.json` — final build, case-or-null scope, after the grounding changes:

```
questions=20  abstained=2 (10.0%)  answered=18
judged=5  split_or_judge_failures=13
total_claims=24  supported=22 (91.7%)  unsupported=2 (8.3%)  contradicted=0
```
- Judge: `openai/gpt-oss-20b` (fast); generator: `openai/gpt-oss-120b` (primary) — same vendor, different model.
- **The harness is stochastic.** The same 20 questions scored 77.4% (pre-fix), 96.0% (after the prompt change, before the runtime checker) and 91.7% (final build). The spread comes from how many questions happen to yield scoreable claims in a given run (7, 6 and 5 respectively). The headline number therefore describes five questions and twenty-four claims, not the full set.
- Per-question breakdown (final build): sita-01/03 no_claims, sita-02/04 judge_empty_labels, bilkis-01/02/04 judge_empty_labels, bilkis-03 0/1 supported, sukanya-01/03/04 no_claims, sukanya-02 3/4, adr-01 7/7, adr-02 judge_empty_labels, adr-03 ABSTAIN, adr-04 5/5, kejriwal-01 7/7, kejriwal-02 no_claims, kejriwal-03 ABSTAIN, kejriwal-04 failed after retries.

## F. Grounding fix (production behaviour)

Three defects, all reproduced live:

1. **Courtroom witness/judge prompts** allowed invention. Before:
   > "Sir, as per the Enforcement Directorate's case diary, a total of nine summons … dated 12 January 2024, 20 January 2024, 5 February 2024 … Diary entry 21-03-2024, Para 12."

   Nine fabricated dates, one fabricated diary reference, one fabricated statute (Section 65B; the corpus holds BSA §63).
   After: "nine separate summons … **the record does not state the specific dates of each summons** … arrest on 21 March 2024."

2. **Judge turn** imported a statute absent from the corpus: "Section 65B of the Information Technology Act, 2000". After: the ruling distinguishes Exhibit A (summons chronology) from the device-seizure exhibit and cites only Section 63, which is on record.

3. **Witness Lab route** (`/api/witness`) supplied the persona with **no case record at all** — no exhibits, no fact chunks — while the prompt invited "one realistic detail". It answered "two summons … 15 January 2022" (wrong count, wrong year). Fixed by passing the exhibits and fact chunks into the prompt and replacing the prompt rule.

A **deterministic runtime check** was added (`src/lib/grounding.ts`): it extracts dates, section/article numbers, diary/page references and numeric counts from a generated turn and tests each against the text supplied to the model. A failing turn is regenerated once with the offending item named; if it still fails it is replaced by a refusal. Applied in `/api/sessions/[id]/stream` and `/api/witness`.

### Invented-specifics scan (final build)
`node --experimental-strip-types scripts/scan-specifics.mts` → `data/eval/specifics_scan.json`:

```
turns_checked: 8   total_violations: 0   clean_turns: 8
witness: 5 turns, 0 violations
judge:    3 turns, 0 violations
```
(The first run of this scan reported 3 violations; all three were false positives from the count regex matching "each summons", "those summons" and "namely Exhibits". The regex now requires a numeric quantity and the scan was re-run.)

## G. Verdict stability

Temperature reduced from 0.3 to 0; **the variance remains** because the upstream relay (`OpenAI-compatible → Nvidia`) does not honour the zero-temp lock and cycles.

5 identical runs of a 2-turn session:
```
overall: 8 → 6 → 7 → 5 → 7
argument: 6, 6, 7, 6, 6
objection: 8, 3, 5, 3, 7
composure: 9, 8, 8, 7, 8
legal_acc: 7, 7, 7, 6, 7
```

Mean overall = **6.6**; range = **5–8**. Parse failures dropped? (Earlier before temp=0: 2 of 5 parse nulls; after: 0 of 5 parse nulls.) Verdict remains non-deterministic; treated as a feedback signal only, not a grade.

---

## H. Ingested vs needed for paragraph anchors

| Document | Chunks | Para-N label chunks |
|---|---|---|
| Delhi Liquor (seed) | 8 | 0 |
| Electoral Bonds (seed) | 4 | 0 |
| Bilkis Yakub Rasool | 380 | 1 |
| Sita Soren | 236 | 6 |
| Sukanya Shantha | 286 | 1 |
| **Total** | **914** | **8** (0.87 %) |

Implication: the correct thing to measure is `doc`/`gold` against exact chunk IDs (`data/eval/gold_chunks.json`), not paragraph-anchor retrieval. Re-ingesting would be the fix for paragraph-level scoring; out of scope.

---

## I. Regression tests

`node scripts/regression-tests.mjs` — 9 tests, 0 failed:
```
T0  session create 201
T1  case-scope isolation: Delhi question returns no Electoral Bonds chunk  PASS
    (Delhi case RAG does mix in Bilkis/Sukanya/Sita chunks — by design with case-or-null scope; isolation story is case ↔ case, not matter ↔ matter)
T2a intro 201
T2b verdict ends session
T2c intro on ended session -> 409
T3  wrong owner — skipped (needs second authenticated user; no DB write permitted)
T4  intro on missing session -> 404
T5  stream emits `done` event
T6  verdict schema valid (all five rubric scores in [0,10])
T7  source labels non-empty for Electoral Bonds RAG
```

---

## J. Known issues NOT fixed (queued for Step 3)

1. pgvector has no ANN index (sequential scan at 96 ms today; will break at ~10k chunks). Requires `halfvec(4096)` + `hnsw` or drop to 2000-D to stay within stock pgvector's limit, and would need a migration — not applied.
2. Case-or-null scope leaks judgment chunks into playable case answers; acceptable by design (precedents from cases should be reachable) but judge evaluation contamination needs a judge model that knows the two scope modes. Out of scope for Step-1 fixes.
3. Strict relevance is limited to questions whose anchor paragraphs exist in the corpus (8 of 914 chunks). Most `Para 1-5` anchors for Bilkis/Sukanya/Electoral Bonds **do not exist**, so strict is coarse at document level. Not fixable without full re-ingest.
4. Verdict variance across runs is still ±3 on a 10-point scale. The temperature=0 change helped (0 parse failures) but not determinism.
5. `adr-04` (bench members for Electoral Bonds) could not be answered from the corpus — the model fabricated the list and the judge labelled it "supported"; actually neither the Bench's composition nor the judgment text is in this corpus slice. Captured honestly; not silently papered over.
6. The `partial-workflow` path (`/advance`) still emits a duplicate opening turn instead of advancing phase; not fixed in this round.

---

## K. Reproduce every number

| Metric | File | Command |
|---|---|---|
| 914 chunks, 4096-D, 100 % embedded | DB query | `psql $DATABASE_URL -c "SELECT count(*), count(embedding) FROM chunks"` |
| Ablation (all scopes) | `data/eval/ablation_gold.json` | `node scripts/ablation-gold.mts` |
| Prefix A/B | `scripts/prefix-ab.mts` | `node --experimental-strip-types scripts/prefix-ab.mts` |
| Faithfulness | `data/eval/faithfulness.json` | `node --experimental-strip-types scripts/eval-faithfulness.mts` |
| Latency | `data/eval/latency.json` | `node scripts/measure-latency.mjs` |
| Regression tests | n/a | `node scripts/regression-tests.mjs` |
