# Courtroom AI — Final Build Plan

Basis: docs/frontend-final-decisions.md. Budget constraint: zero paid services. Free tier and free model only. Nothing here needs a credit card.
Status: Phase 1 built and verified (build passes, routes 200, cases seeded). LLM flows need user keys. See build log at the end.

## Cost rules

- Neon: free tier project `mei`, region Singapore (`aws-ap-southeast-1`). Region locked at creation, cannot change.
- LLM: Groq free tier, `openai/gpt-oss-120b` primary, `openai/gpt-oss-20b` secondary for fast small calls, OpenRouter free model only as overflow. No paid keys.
- Embeddings: OpenRouter free embedding model, or local transformers model if free tier is unavailable.
- Web search: Firecrawl free tier (key needed, free account).
- Hugging Face: public datasets, no cost, token optional for rate limits.

## Architecture

Next.js app, App Router. Server-only keys. All LLM/RAG calls go through server routes or server actions, never from the browser.

```
browser -> Next API routes -> Neon Postgres (+pgvector), Groq/OpenRouter, Firecrawl, HF ingest
```

Auth: Neon Managed Better Auth via `@neon/auth`. Server instance in `lib/auth/server.ts`. Client in `lib/auth/client.ts`. API route `app/api/auth/[...path]/route.ts`. Proxy in `proxy.ts` guarding `/dashboard/*` and `/case/*`, redirect to `/login`.

## Database schema (Neon Postgres)

- `neon_auth` schema: managed by Neon Auth, do not touch.
- `profiles`: id, user_id (FK to auth user), name, role (student/advocate), created_at.
- `cases`: id (slug), title, category, court, charges, summary, favorite, created_by, seeded (bool), status.
- `case_parties`: case_id, side (prosecution/defense/judge), name, role, persona_prompt, is_witness, witness_personality.
- `case_evidence`: case_id, exhibit_label, title, description, content.
- `documents`: id, case_id, owner_id, kind (hf_seed/upload/fir/statute), title, storage_url, status (pending/indexed/failed), created_at. PDF bytes go to Neon Object Storage if enabled, else Postgres bytea fallback.
- `chunks`: id, document_id, case_id, section_label (BNS §, judgment para), text, embedding vector(768), token_count. pgvector index.
- `sessions`: id, user_id, case_id, student_role (defense/prosecution), duration_limit_sec, started_at, ended_at, status, outcome.
- `session_turns`: id, session_id, seq, actor (student/prosecutor/defense/judge/witness), kind (argument/objection/ruling/response), text, citation, created_at.
- `scores`: session_id, argument_score, objection_score, composure_score, legal_accuracy_score, overall, judge_summary, strengths, weaknesses. Filled by LLM rubric at end.

## Simulator orchestration

State machine per session: OPENING -> EXAMINATION -> OBJECTION -> RULING -> ARGUMENT -> CLOSING -> VERDICT.

- Student picks role (defense/prosecution) when entering `/case/[id]/courtroom`.
- Orchestrator prompt decides next actor. Student turn is typed input. AI turns call Groq. Objection flow: student or AI raises objection, judge rule prompt returns sustained/overruled with reasoning and statute citation.
- Timer: 3 min default, options 2, 3, 5, 10. Timer enforced client side, server stops at limit.
- End: LLM judge summary prompt scores rubric (argument, objection handling, composure, legal accuracy). Transcript + scores saved to Neon. Dashboard pulls latest from `scores`.

## RAG prep lab

1. Ingest: Python script in `scripts/` pulls `KanoonGPT/indian-case-laws` and `KanoonGPT/indian-legal-documents` parquet, chunks by section, embeds, writes to `chunks`. Runs offline, one time.
2. Upload: PDF upload in Prep Lab, parse client-side with `pdfjs-dist` or server side, chunk, embed, index. PDF only in v1.
3. Query: hybrid (pgvector cosine + keyword), inject top chunks into Groq prompt. Firecrawl search adds web citations behind a toggle.

## Pages and wiring

- `/`, `/login`, `/signup`: light pass only. Login/signup wired to Neon Auth (email+password, plus Google OAuth if enabled in console). Remove demo-login fake button.
- `/dashboard`: KPIs computed from DB (sessions played, avg verdict score, objection sustain rate, cases completed, prep tasks done), recent cases, recent sessions. Active-case drill-down moves to sidebar menus.
- `/case/[id]`: real routing. Each slug renders its own data from `cases`. Unknown slug = 404 state.
- `/case/[id]/prep`: Case Header, Chronology + Evidence workspace, RAG Research chat (real), Theory generation (real).
- `/case/[id]/courtroom`: 3-pane arena (dossier drawer, 2D arena, transcript, advocate console), real LLM turns, timer, verdict modal from `scores`.
- `/witness-prep` alias stays, renders the case prep witness tab.

## Env (`.env.example` shipped, `.env.local` by user)

NEON_AUTH_BASE_URL, NEON_AUTH_COOKIE_SECRET, DATABASE_URL, GROQ_API_KEY, OPENROUTER_API_KEY, FIRECRAWL_API_KEY, HF_TOKEN.

## Build order

1. Neon project + Auth enabled + schema (region Singapore).
2. Auth wiring (server, client, proxy, login/signup real).
3. DB access layer + case routing + 404.
4. Seed 3 cases with parties, evidence, fact sheets.
5. LLM service (Groq + OpenRouter fallback) + simulator orchestration + timer + verdict scoring.
6. RAG ingest script + Prep Lab chat + PDF upload.
7. Witness Lab (personas, trap simulator, LLM coaching).
8. Dashboard KPIs from DB.
9. Landing light pass.
10. Verification: build, T3 code in-app browser pass over auth, case list, prep chat, courtroom turn, verdict report. Click every button.

## Open items needing user

- Run `neon` CLI org picker once (interactive, picks org `KAMAL NAYAN`).
- Create Neon project `mei` in console (free) if CLI is blocked, enable Auth there, paste Auth URL + secret.
- Free API keys in `.env.local`: Groq, OpenRouter, Firecrawl, HF.

## Build log

### Infra (done)
- Neon project `mei` created: id `polished-sound-85319816`, region `aws-ap-southeast-1` (Singapore). Auth enabled. Base URL and DB URL live in `.env.local`.
- Schema in `db/schema.sql`, applied, 10 public tables verified.
- `.env.example` and `.env.local` created.

### Code (done)
- Auth wiring: server, client, API route, proxy guard, real login/signup.
- API routes: cases, dashboard, sessions (create/list/turns/advance/verdict), rag ask, seed.
- LLM layer: Groq primary `openai/gpt-oss-120b`, fast `gpt-oss-20b`, OpenRouter fallback.
- Courtroom page: role/duration picker, real turns, LLM advance, real verdict modal.
- Prep page: case file, RAG chat, theory generator, witness lab from DB.
- Dashboard: KPIs from DB, practice cases, recent verdicts.
- `npm run build` passes. Dev check: cases return 3 seeds, prep/courtroom/login 200.

### Not done / needs user
- LLM keys empty in `.env.local` (`GROQ_API_KEY`, `OPENROUTER_API_KEY`, `FIRECRAWL_API_KEY`). LLM flows fail until filled.
- Auth click-through not yet verified in T3 browser.
- Embeddings not wired (keyword retrieval only). HF ingest and PDF upload not built.

### Phase 2 (subagents, all done)
- Agent A: vector RAG in /api/rag/ask (cosine, keyword fallback), POST /api/embeddings/backfill, scripts/backfill-embeddings.mjs, EMBED_DIM=768 validated.
- Agent B: scripts/ingest-hf.mjs (datasets-server rows API, --limit 200/dataset), POST/GET /api/documents (pdf-parse 1.1.1, 10MB cap, chunk 800/100 via src/lib/chunk.ts).
- Agent C: POST /api/witness (persona + trap heuristic), prep witness live chat, sidebar 6 real items, scripts/verify-app.mjs.
- Verified: build passes with all new routes, tsc clean, API smoke passes (cases 200, dashboard guard, witness 401, unknown slug 404).

### Blocked on user keys
- .env.local: GROQ_API_KEY, OPENROUTER_API_KEY, FIRECRAWL_API_KEY, HF_TOKEN. Until filled, LLM/embeddings/HF-ingest live paths and backfill are not run. Order after keys: run node scripts/ingest-hf.mjs, backfill embeddings, T3 browser click-through.

### Phase 3 (what shipped)
- scripts/ingest-hf.mjs: added `--offline` fixture mode. Writes 9 built-in fixtures (BNS § 103, BNS § 61(2), BNSS § 173, BNSS § 35, BSA § 63, BSA § 3, plus 3 case facts: Delhi liquor policy, electoral bonds, defamation) as documents + chunks with NULL embeddings. `--limit` slices the fixture list. Live HF path unchanged. Exits 0 in offline mode.
- src/app/api/rag/ask/route.ts: hybrid rerank. Vector rows now scored as keyword*0.4 + cosine*0.6, sorted descending, top 6 returned. Keyword score is the fraction of question terms present in the chunk. Keyword fallback path unchanged when embeddings are missing. Response contract unchanged: {answer, sources, usedWeb, usedVector}.
- scripts/verify-app.mjs: added existence probes for GET /api/documents, POST /api/embeddings/backfill, and POST /api/search (expect 401 signed-out / 400 validation, not 404). POST /api/witness probe already existed and is kept.

### Phase 3 (what still needs keys)
- Live HF ingest (`node scripts/ingest-hf.mjs`) needs HF_TOKEN or open datasets-server access. Until then only `--offline` fixtures were run.
- Embeddings backfill (scripts/backfill-embeddings.mjs and POST /api/embeddings/backfill) needs OPENROUTER_API_KEY. Offline chunks have NULL embeddings, so RAG uses the keyword fallback until backfill runs.
- RAG chat answers need GROQ_API_KEY (or OpenRouter fallback); web citations need FIRECRAWL_API_KEY.
- POST /api/search exists in this tree (POST-only, 401 when signed out). The verify probe uses POST to match its method; a GET probe would return 405.

### Phase 3 (wave 2, all done incl. fixes)
- Graph orchestrator: src/lib/graph.ts nodes judgeDecide, actorGenerate, judgeRule, persist. runAdvanceGraph + runIntroGraph (welcome turn, no keys needed). Agent bus src/lib/agentBus.ts with ACP envelopes.
- Streaming: POST /api/sessions/[id]/stream NDJSON (reasoning, delta, done). Hook useStreamTurn. Courtroom page wired. Response reasoning kept in memory, transcript persisted.
- Voice/search: src/hooks/useSpeech.ts (en-IN recognition + synthesis), mic button real, POST /api/search Firecrawl proxy.
- Corpus: ingest --offline fixtures (8 docs, 22 chunks now), RAG rerank keyword*0.4 + cosine*0.6.
- Fixes by parent: streaming agent overwrote courtroom page with mock base, restored session flow + UUID-bound streaming + intro welcome, verdict modal re-armed with real scores (overall, composure, legal accuracy, strengths, weaknesses).
- Verified: build passes with 19 routes (incl. intro, stream, search, documents, backfill), verify script all PASS, case detail 200.

### Still needs user keys
- .env.local: GROQ_API_KEY, OPENROUTER_API_KEY, FIRECRAWL_API_KEY, HF_TOKEN. Then live E2E: auth click-through, courtroom turn stream, verdict, RAG ask, backfill.

## Rounds 4+ closed (this session)
- Courtroom speech (done): Web Speech mic wired to stdin (input) + read-back synthesis; used in prep/coach contexts where applicable.
- Debate/meta (done): transcript streaming, reasoning chips, persona modal, verdict rubric.
- Access control (done): Neon Auth, proxy guards, 401 paths verified.
- Corpus (in progress): 8,520 chunks ingested; backfill running locally (500/8,520 at last check). Vector search fills as embeddings land. Keyword RAG works now.
- Sessions dashboard (done for data, partial UI): recent sessions + scores stored; dashboard shows KPIs + practice cases + recent verdicts.

## What remains (in order)
1. Finish backfill (local CPU, no key needed). Check count before any vector claim.
2. RAG ask with usedVector:true end-to-end (needs auth cookie; verify in browser).
3. Ensemble/rag-with-web toggle in prep (Firecrawl live).
4. HF ingest larger (currently 200+200 rows; raise when ready).
5. Prod moves: Vercel deploy, NEXT_PUBLIC_APP_URL, OAuth provider in console (Google), Sarvam TTS if voice v2 wanted.
