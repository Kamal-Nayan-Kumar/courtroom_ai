# Feature: Case Prep Studio

Interactive preparation studio for evidentiary analysis, Supreme Court precedent indexing, and witness AI cross-examination coaching.

## Sub-features

1. Case header with trial readiness meter and perspective toggle (Defense vs. Prosecution).
2. Tab 1: Case File & Evidence Chronology with paragraph pinning to trial brief.
3. Tab 2: RAG Legal Research with citation list and precedent save-to-brief. The "Query Hybrid RAG" button only raises a notification; it does not filter the static authorities list.
4. Tab 3: Witness AI Coaching Simulator with demeanor adjustments and stress testing against perjury traps.

## How to get to it (user POV)

Navigate to `http://localhost:3000/case/402/prep` or click "Witness Prep Lab" from the dashboard sidebar or docket table.

## Driving it with browser harness

1. Load `http://localhost:3000/case/402/prep`.
2. Verify clean header with no redundant breadcrumbs.
3. Click tab triggers: "1. Case File & Chronology", "2. RAG Precedent Builder", and "3. Witness Coaching Simulator".
4. On Tab 3, click "Stress-Test" on witness PW-1 and assert new chat messages appear after the simulated inference delay, with a Resilience Score.
5. Click "Switch to Prosecutor" button and verify role perspective updates.

## Gotchas

- Stress-test simulation uses a `600ms` delay to simulate model inference before appending the deposition counter-statement.
- The case header is a plain flex column, not sticky positioned.
