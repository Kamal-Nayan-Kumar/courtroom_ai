# Courtroom AI Design System & Architectural Standards

This document records the foundational design decisions, typography schema, color palette, component rules, and layout contracts for Courtroom AI.

## 1. Product Aesthetic & Design Intent

Courtroom AI is a serious legal simulation platform designed for Indian advocates, moot court teams, and law students.
The design communicates precision, judicial authority, and clarity.
It avoids decorative clutter, arbitrary emojis, and ungrounded color shifts.

## 2. Typography Schema

The system uses three specific font families, each with a strict domain boundary:

### Primary UI Font: Geist Sans (`font-sans`)
- **Role:** All interactive UI, body copy, headings, labels, form controls, tables, buttons, and navigation.
- **Why:** Neutral grotesque sans-serif with exceptional readability at both small and display sizes. Prevents visual fatigue during lengthy deposition reviews.
- **Scale:**
  - Page Titles: `text-2xl` to `text-3xl` (`24px` - `30px`), `font-bold`
  - Section Headers: `text-lg` to `text-xl` (`18px` - `20px`), `font-semibold`
  - Card & Modal Titles: `text-sm` to `text-base` (`14px` - `16px`), `font-semibold`
  - Body & Form Text: `text-xs` to `text-sm` (`12px` - `14px`), `font-normal` or `font-medium`
  - Secondary Metadata & Badges: `text-xs` (`12px`), `font-medium`
  - Minimum legible threshold: No critical UI text below `11px` (avoid `9px` / `10px` micro-text).

### Editorial Judicial Accent Font: Playfair Display (`font-editorial`)
- **Role:** Reserved strictly for key ceremonial legal phrases (e.g. "Indian Courtroom" in the hero headline, and judicial quotation marks).
- **Rule:** Never used for form inputs, table headers, buttons, or standard dashboard cards.

### Statutory & Code Monospace Font: Geist Mono (`font-mono`)
- **Role:** Reserved strictly for statutory sections (e.g. `BNS § 103(1)`, `BSA § 63(4)`), docket numbers (e.g. `CRL.A. 402/2026`), system engine versions, and timestamps.
- **Rule:** Regular prose, navigation links, and standard buttons must never use monospace.

## 3. Color Palette & Semantic Roles

The color scheme balances deep slate/zinc neutrals with two signature legal accents:

### Neutrals
- **Background:** `#FAFAFA` (Canvas) and `#FFFFFF` (Cards and Surfaces)
- **Primary Text:** `#09090B` (Zinc-950, deep ink)
- **Muted Text:** `#71717A` (Zinc-500) and `#52525B` (Zinc-600)
- **Borders & Dividers:** `#E4E4E7` (Zinc-200)

### Signature Accents
- **Judicial Navy (`#1E3A8A` / Tailwind `blue-900`):**
  - Represents the prosecution, constitutional precedents, active trial streams, and primary legal references.
- **Advocate Amber (`#D97706` / Tailwind `amber-600`):**
  - Represents defense strategy, co-counsel AI whisper cards, active docket warnings, and judge bench accents.
  - Ambient fluid glows on hero flanks: `amber-300/25` with `blur-3xl`.

### Functional Status Indicators
- **Emerald (`#059669`):** Sustained objections, verified evidence hashes, active streams.
- **Amber (`#D97706`):** Action-needed prep tasks, contested evidence.
- **Rose/Red (`#DC2626`):** Hostile witness risks, evidentiary gaps, objection triggers.

## 4. Iconography & De-Cluttering Standards

- **No Decorative Emojis:** Standardized on monochrome Lucide React icons.
- **Icon Sizing:**
  - Inline metadata icons: `size-3.5` (`14px`)
  - Button icons: `size-3.5` to `size-4` (`14px` - `16px`)
  - Feature & card header icons: `size-4` to `size-5` (`16px` - `20px`)
- **Logo Usage:** Always use the official Courtroom AI icon (`/logo_icon.png`) in a clean rounded container with matching text. Never substitute with generic third-party scale icons.

## 5. Page Layout Contracts

### Landing Page (`/`)
- Hero section with balanced fluid amber ambient glows on widescreen flanks.
- Tight vertical rhythm between trust bar and interactive 3-pane simulator (maximum `40px` gap).
- Clear CTA footer with status pill in clean sans font.

### Authentication Pages (`/login` and `/signup`)
- Symmetrical two-column grid:
  - Column 1 (Left): Focused auth form (Name, Email, Password, Google SSO).
  - Column 2 (Right): Full-height cinematic legal imagery (`/courtroom_interior.png` on login, `/chambers_dusk.png` on signup) with subtle dark gradient overlay and advocate testimonial.
- Mobile: Form displays first; visual column hides cleanly below `lg` breakpoint.

### Dashboard (`/dashboard`)
- Collapsible sidebar with centered official logo and high-contrast dark active pills (`!bg-zinc-950 !text-white`).
- Clean top header without redundant static breadcrumbs.
- Command palette modal widened to `max-w-3xl` for full legal citation readability.
- KPI cards, prep queue, and docket table formatted with legible typography and consistent padding.

### Case Prep Studio (`/case/[id]/prep`)
- Tabbed workspace for Case File & Chronology, RAG Precedents, and Witness AI Coaching.
- Clean header without duplicate breadcrumbs.
- Explicit witness persona cards and real-time stress testing simulator.

## 6. Technical Stack & Libraries

- **Framework:** Next.js 16.4 (Turbopack, App Router)
- **Styling:** Tailwind CSS v4 with `@tailwindcss/turbopack`
- **UI Components:** shadcn/ui built on Radix UI primitives
- **Icons:** `lucide-react`
- **Motion:** `framer-motion`
- **Charts:** `recharts`
