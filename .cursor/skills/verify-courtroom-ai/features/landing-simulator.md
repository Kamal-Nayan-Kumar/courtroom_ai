# Feature: Landing Page & 3-Pane Courtroom Simulator

Interactive landing page and real-time multi-agent courtroom simulator.

## Sub-features

1. Hero section with balanced warm ambient glows and tightened trust bar.
2. 3-Pane Indian Courtroom Simulator with elevated Judge Bench, Witness Box, Prosecution Desk, Defense Desk, and Co-Counsel Whisper.
3. Live trial clock (ticks every second) with timestamped statutory citations on transcript messages. New transcript entries appear when you submit an argument, after a delayed Judge AI reply.
4. CTA footer with status pill and legal links.

## How to get to it (user POV)

Open `http://localhost:3000/` in any browser or click the brand logo from any page.

## Driving it with browser harness

1. Load `http://localhost:3000/`.
2. Verify hero headline styling: "Master the Indian Courtroom Before You Step Inside."
3. Scroll to `#simulation`.
4. Click the role switch button ("Switch to Public Prosecutor" / "Switch to Defense Counsel") to alternate between Defense Counsel and Public Prosecutor.
5. Click "Raise Objection" and verify the input fills with the objection text, then submit it and verify a Judge AI transcript entry appears after a short delay.
6. Click "Use Argument" on the Co-Counsel AI whisper card and verify the input fills with the suggested argument.

## Gotchas

- Live timer increments every second. Assert transcript items by speaker role or content prefix rather than static clock.
- "Raise Objection" only fills the input. The transcript entry appears after submitting.
