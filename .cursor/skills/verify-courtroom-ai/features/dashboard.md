# Feature: Advocate Dashboard

Central workspace for trial dockets, performance analytics, and rapid navigation.

## Sub-features

1. Collapsible sidebar (`collapsible="icon"`) with centered official logo when collapsed and high-contrast dark active state.
2. Quick Command Palette (`Cmd+K`, or the search trigger in the header) with wide layout (`sm:max-w-2xl md:max-w-3xl`) and search for cases, statutes, and precedents.
3. 4-card performance metric strip (Win rate, objection accuracy, persuasion, resilience) with a performance chart.
4. Pre-trial readiness queue and interactive active docket table with a role filter dropdown (including "Defense Counsel") and trial stage filter.
5. Public case library grid with difficulty filters (All, Medium, Hard, Moot Level).
6. Three panel explainer cards (Case Dossier, 2D Courtroom Arena, Transcript & Console) plus a blue banner linking into the 3-panel simulator at `/case/402/courtroom`.

## How to get to it (user POV)

Navigate to `http://localhost:3000/dashboard` or click "Dashboard" in the navigation bar.

## Driving it with browser harness

1. Load `http://localhost:3000/dashboard`.
2. Click search trigger button or press `Cmd+K`.
3. Assert Command Palette dialog appears with wide dialog layout.
4. Click sidebar trigger to collapse sidebar. Assert official logo is centered and active Dashboard button is a high-contrast dark pill.
5. Select "Defense Counsel" in the role filter dropdown (DocketTable) and verify docket table filters accordingly.
6. Switch the cases tab between "My Recent Cases" and "Public Indian Cases", and try the difficulty filters in the public library grid.
7. Click "Resume Last Trial" or "Enter 3-Panel Courtroom Simulator" and verify navigation to `/case/402/courtroom` renders without the sidebar or header (courtroom-mode bare shell).

## Gotchas

- Quick action modals (`StartCaseModal`, `StatuteMapperDialog`, `WitnessPrepModal`, `CommandMenu`, `PrecedentViewerModal`) overlay the screen; close them with `Escape` to continue driving.
- On `/case/[id]/courtroom` the dashboard layout drops the sidebar and header entirely. Expect a bare fullscreen shell.
