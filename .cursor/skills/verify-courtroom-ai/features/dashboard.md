# Feature: Advocate Dashboard

Central workspace for trial dockets, performance analytics, and rapid navigation.

## Sub-features

1. Collapsible sidebar with centered official logo and high-contrast dark active state.
2. Quick Command Palette (`Cmd+K`) with wide layout (`max-w-3xl`) and search for cases, statutes, and precedents.
3. 4-card performance metric strip (Win rate, objection accuracy, persuasion, resilience).
4. Pre-trial readiness queue and interactive active docket table.
5. Public case library grid with difficulty filters.

## How to get to it (user POV)

Navigate to `http://localhost:3000/dashboard` or click "Dashboard" in the navigation bar.

## Driving it with browser harness

1. Load `http://localhost:3000/dashboard`.
2. Click search trigger button or press `Cmd+K`.
3. Assert Command Palette dialog appears with wide dialog layout.
4. Click sidebar trigger to collapse sidebar. Assert official logo is centered and active Dashboard button is a high-contrast dark pill.
5. Select "Defense Counsel" in the role filter dropdown and verify docket table filters accordingly.

## Gotchas

- Quick action modals (`StartCaseModal`, `StatuteMapperDialog`, `WitnessPrepModal`) overlay the screen; close them with `Escape` to continue driving.
