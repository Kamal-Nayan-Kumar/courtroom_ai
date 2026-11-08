# Courtroom AI — Frontend Final Decisions

Decided 8 Nov 2026 (grilling Rounds 1-3). Status: research done, awaiting go-ahead on final plan.

## Round 3 decisions

13. **Neon**: New project named `mei`, free tier, Auth enabled, object storage if needed, region nearest India. Schema designed by agent. Research: region is `aws-ap-southeast-1` (Singapore). Closest to India. Region is fixed at creation. All products ship there (Postgres, Managed Better Auth, Object Storage, AI Gateway, Realtime).
14. **Env**: Agent creates `.env.example`. User creates `.env.local` with real keys. Required: `DATABASE_URL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `FIRECRAWL_API_KEY`, `HF_TOKEN`.
15. **Models**: One model for all agents (llama-3.3-70b-versatile primary), OpenRouter automatic fallback. Researched Groq docs: llama-3.3-70b is enterprise-priced, 280 t/s, 128K context. Free tier is tight: 30 RPM, 1K req/day, 8K TPM. That is why the fallback matters. Fallback candidate `openai/gpt-oss-120b` ($0.15/$0.60 per 1M, 500 t/s). No embedding API on Groq, so embeddings go on OpenRouter. Embeddings also have a free local-model option.
16. **Demo cases**: Web research used. Three famous, well-documented recent matters, one per category. All facts public from Wikipedia and court records.
    - Criminal: 2022 Delhi liquor policy case. CBI/ED proceedings on the 2021-22 Excise Policy. Arvind Kejriwal arrested 21 Mar 2024 after nine ED summons, first sitting CM arrested. SC interim bail 10 May-1 Jun 2024, surrendered 2 Jun, trial court bail 20 Jun stayed by Delhi HC 21 Jun, CBI arrest from Tihar 26 Jun, SC interim bail in ED case 12 Jul (stayed in jail on CBI case), SC bail 13 Sep 2024 after 5+ months.
    - Constitutional: Electoral bonds case, 2024 INSC 113. SC struck down the 2018 Electoral Bonds Scheme as unconstitutional, right to information under Article 19(1)(a). Five-judge bench led by CJI Chandrachud. Also struck down Companies Act/IT Act/RPA amendments.
    - Defamation/public law: Rahul Gandhi disqualification, 2023. Defamation conviction in Surat, 2-year sentence, Lok Sabha disqualification, SC stayed conviction Aug 2023.
    - Fact sheets to be drafted at build time. User may swap cases.
17. **RAG corpus**: Ingest from Hugging Face plus user PDF uploads. HF datasets found, all public ungated: `KanoonGPT/indian-case-laws` (912 downloads, parquet by year), `KanoonGPT/indian-legal-documents` (303), `jeeldoshi/IndianKanoon` (10). Start with the first two. Uploads PDF-only in v1. Embeddings on OpenRouter, free-tier model acceptable.
18. **Dashboard**: KPIs on top, recent cases next. Active-case drill-down and other detail in sidebar menus, not on dashboard home. Sidebar: Dashboard, My Cases, Public Cases, Prep Lab, Witness Lab, Courtroom. KPI set: sessions played, avg verdict score, objection sustain rate, cases completed, prep tasks done. All computed from stored session data, not mock.
19. **Persistence**: Full Neon Postgres. Users via Neon Auth. Tables for cases, sessions, transcripts, scores, documents, embeddings.
20. **Labs**: Build both Prep Lab and Witness Lab. Prep Lab = RAG research chat (case files + uploaded PDFs + web search) plus evidence/chronology workspace plus theory generation. Web search via Firecrawl API. Witness Lab = personas, coaching, trap/stress simulator, all LLM-backed.
21. **Landing**: Freeze PreTrialWorkflow section as marketing copy. No wiring in v1.
22. **Verification**: Test with T3 code in-app browser. Confirm each decided item works before calling it done. Build, then in-app browser checks plus Playwright smoke.

7. **Neon**: Neon skills added, CLI already present. Project/creation pending user confirmation of region and tier (Q13).
8. **LLM**: Groq is the primary. OpenRouter is fallback. API keys needed from user (secrets, not obtainable by agent).
9. **Courtroom simulator**: Student plays defense or prosecutor (chosen at entry). Turn orchestration mirrors real courtroom flow: objections, judge rulings, alternating party turns. Session length: 2-3 min default, 5 or 10 min options. End state: scored verdict report (argument quality, objection handling, composure, etc.) + transcript summary, inserted into dashboard data.
10. **Demo cases**: Real famous recent cases (to be selected with user, Q16).
11. **RAG**: Ingest from Hugging Face datasets + let users upload PDFs into the RAG corpus. (Corpus sources, embedding model, upload formats: Q17.)
12. **Dashboard**: Keep KPIs on top, then recent cases. Active-case details and other drill-downs move to other menu options, not the dashboard home.

## Round 1 decisions

1. **Scope of "final"**: Real working product, not mock. Core must be functional end to end with real LLMs. Pieces that cannot be fully functional yet are acceptable if core works. Demo content: 2-3 seeded cases, plus real user cases.
2. **Product surface**: Must have landing, login, signup, dashboard, case list, case prep, courtroom simulator, witness prep. Profile and settings left out.
3. **Case routing**: Wire real per-case ids. Every case renders its own data. Unknown ids get a not-found state.
4. **Landing page**: Light pass only (links, responsive). Real effort goes to the app.
5. **Auth**: Real auth with Neon. Neon CLI or env setup as needed.
6. **Theme**: Light only.
