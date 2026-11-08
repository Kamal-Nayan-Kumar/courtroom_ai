# Feature: Courtroom Arena

Three-pane mock trial for CRL.A. 402/2026: Case File dossier on the left, 2D courtroom arena in the center, transcript and advocate console on the right. Rendered without the dashboard sidebar or header.

## Sub-features

1. Role toggle between Defense Counsel and Public Prosecutor in the top bar, plus a session timer and Verdict button. Exit opens a shadcn AlertDialog confirmation (Stay / Exit to Prep Studio).
2. Center arena with grey dotted background (`.bg-dot-pattern`) and four bench cards: Judge, Witness (PW-1 with a live composure meter), Prosecutor, Defense.
3. Each speaker role has its own colour theme (`speakerMeta.ts`): Judge amber, Prosecutor blue, Defense violet, Witness rose, Clerk zinc, Co-counsel emerald. Only the heading carries the colour: icon, name, and Objection / Ruling badges. Card bodies stay default white.
4. Transcript panel with All / Bench / Objections filters. User-sent messages render as right-aligned chat bubbles. Judge, Witness, and Prosecutor responses render as cards. A party response streams word by word with a collapsible "thinking / tool calls" trace that auto-collapses to a "Reasoning · N steps" toggle when done. Objection and Ruling entries carry role-coloured badges and a mono citation footer.
5. Advocate console: target toggle (To Witness / To Judge), Objection / Exhibit / Statute popovers, textarea, and Send.
6. Case File drawer with Facts, Exhibits, and Brief tabs, plus Cite and Present actions.
7. Co-Counsel whisper card with Use, Cite precedent, Next, and Hide.
8. Verdict modal (`VerdictSummaryModal`): wide (`sm:max-w-2xl`), scrolls internally at `max-h-[90vh]`. Shows the Bench Ruling on Admissibility banner, Bench Conviction Score 9.2/10, Witness Impeachment derived from composure, Statutory Precision 98%, and strategic observations. Actions: Resume Cross-Examination and Return to Chamber Docket.

## How to get to it (user POV)

Navigate to `http://localhost:3000/case/402/courtroom`, or click "Resume Last Trial" / "Enter 3-Panel Courtroom Simulator" on the dashboard.

## Driving it with browser harness

1. Load `http://localhost:3000/case/402/courtroom` and confirm there is no sidebar or header.
2. Confirm the center arena shows the grey dotted background and the amber Judge, rose Witness, blue Prosecutor, and violet Defense cards.
3. Click a speaker card to open the persona modal, then close it.
4. In the advocate console, select "To Witness", type a cross-examination question, and send. Confirm your message appears as a right-aligned bubble, then the Witness response streams in as a card with an expanded tool-call trace that collapses to "Reasoning · 3 steps" when done, and the composure meter drops.
5. Raise an objection from the Objection popover. Confirm a Judge ruling streams in the same way and appears under the Bench filter.
6. Check the transcript cards: card bodies are white, only the icon, name, and badges carry the role colour.
7. Click "Exit" in the top bar. Confirm the AlertDialog asks for confirmation. Click "Stay" and verify you remain on the courtroom page.
8. Click "Verdict" in the top bar. Confirm the modal opens wide with the ruling banner and the three metric cards fully inside the card, no overflow. Press Escape to close.

## Gotchas

- The Witness card uses the dark active style while it is the selected speaker.
- Evidence screenshots `07-courtroom-arena.png` and `08-verdict-modal.png` in `.cursor/verification-evidence/` show the current dotted background and modal width.
