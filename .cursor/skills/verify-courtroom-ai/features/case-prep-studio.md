# Feature: Case Prep Studio

Interactive preparation studio for evidentiary analysis, Supreme Court precedent indexing, and witness AI cross-examination coaching.

## Sub-features

1. Sticky case header with trial readiness progress and perspective toggle (Defense vs. Prosecution).
2. Tab 1: Case File & Evidence Chronology with paragraph pinning to trial brief.
3. Tab 2: RAG Legal Research with live citation indexing and precedent retrieval.
4. Tab 3: Witness AI Coaching Simulator with demeanor adjustments and stress testing against perjury traps.

## How to get to it (user POV)

Navigate to `http://localhost:3000/case/402/prep` or click "Witness Prep Lab" from the dashboard sidebar or docket table.

## Driving it with browser harness

1. Load `http://localhost:3000/case/402/prep`.
2. Verify clean header with no redundant breadcrumbs.
3. Click tab triggers: "1. Case File & Chronology", "2. RAG Precedent Builder", and "3. Witness Coaching Simulator".
4. On Tab 3, click "Stress-Test" on witness PW-1 and assert simulated deposition dialogue streams in.
5. Click "Switch to Prosecutor" button and verify role perspective updates.

## Gotchas

- Stress-test simulation uses a 500ms delay to simulate model inference before appending the deposition counter-statement.
