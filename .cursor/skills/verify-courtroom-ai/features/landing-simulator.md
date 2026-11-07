# Feature: Landing Page & 3-Pane Courtroom Simulator

Interactive landing page and real-time multi-agent courtroom simulator.

## Sub-features

1. Hero section with balanced warm ambient glows and tightened trust bar.
2. 3-Pane Indian Courtroom Simulator with elevated Judge Bench, Witness Box, Prosecution Desk, Defense Desk, and Co-Counsel Whisper.
3. Live streaming transcripts with timestamped statutory citations.
4. CTA footer with status pill and legal links.

## How to get to it (user POV)

Open `http://localhost:3000/` in any browser or click the brand logo from any page.

## Driving it with browser harness

1. Load `http://localhost:3000/`.
2. Verify hero headline styling: "Master the Indian Courtroom Before You Step Inside."
3. Scroll to `#simulation`.
4. Click the "Simulated Role" toggle to alternate between Defense Counsel and Public Prosecutor.
5. Click "Raise Objection" button and assert objection transcript appears.
6. Click "Use Argument" on the Co-Counsel AI whisper card.

## Gotchas

- Live timer increments every second. Assert transcript items by speaker role or content prefix rather than static clock.
