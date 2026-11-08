---
name: verify-courtroom-ai
description: "Verify Courtroom AI web application frontend workflows, interactive simulator, authentication pages, dashboard, case prep studio, and courtroom arena."
---

# Verify Courtroom AI

Use this skill to launch, inspect, drive, and verify Courtroom AI frontend user workflows and visual presentation.

## Launch

Start the local Next.js development server:

```bash
npm run dev
```

The app is ready when the server logs:
`✓ Ready in ...ms` and serves HTTP 200 on `http://localhost:3000`.

To run a production build and verify the optimized output:

```bash
npm run build && npm run start
```

## Doctor

Run this quick check before driving:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

- If `200`: instance is live and ready to drive.
- If not answering: check if port 3000 is open, verify process with `lsof -i :3000`, and start the server.

Type-check verification:

```bash
npx tsc --noEmit
```

## Drive

Drive the web interface via browser automation or in-app preview:

1. **Landing Page & 3-Pane Simulator (`/`):**
   - Click "Start Free Trial Case" or scroll to `#simulation`.
   - Click role switch button ("Switch to Public Prosecutor" / "Switch to Defense Counsel").
   - Click "Raise Objection" button, verify the input fills, submit, and verify a delayed Judge AI transcript entry appears.
   - Click "Use Argument" on the Co-Counsel hint card and submit argument to court.

2. **Authentication Flow (`/login` & `/signup`):**
   - Verify two-column layout: Imagery on Left, Form on Right.
   - Verify the large Playfair tagline quote with the amber rule above it renders with no clipping.
   - Fill email and password and click submit (or click "Enter demo chamber"). Verify redirect to `/dashboard`.

3. **Dashboard Workspace (`/dashboard`):**
   - Press `Cmd+K` or click the search input to trigger the wide Command Palette (`md:max-w-3xl`).
   - Click the sidebar collapse toggle and verify logo centering and high-contrast dark active state.
   - Filter active dockets by role ("Defense Counsel") or trial stage.

4. **Case Prep Studio (`/case/402/prep`):**
   - Switch between "1. Case File & Chronology", "2. RAG Precedent Builder", and "3. Witness Coaching Simulator".
   - Click "Stress-Test" on witness PW-1 and verify new chat messages plus a Resilience Score appear after the ~600ms simulated inference delay.

5. **Courtroom Arena (`/case/402/courtroom`):**
   - Confirm the bare shell (no sidebar or header), the grey dotted arena background, and the role-coloured bench cards (Judge amber, Witness rose, Prosecutor blue, Defense violet).
   - Send a question "To Witness" and confirm Defense then Witness transcript entries with matching colours, and a composure drop.
   - Click "Verdict" and confirm the wide modal keeps all content inside the card with no overflow.

## Evidence

Capture screenshot artifacts using browser automation:
- Save PNG evidence files in `.cursor/verification-evidence/` or project temp directories.
- Confirm HTTP 200 responses and clean accessibility tree snapshots with zero console error exceptions.

## Cleanup

Stop any background servers started specifically for testing:

```bash
kill $(lsof -t -i:3000) 2>/dev/null || true
```

Do not delete captured screenshot evidence during cleanup.
