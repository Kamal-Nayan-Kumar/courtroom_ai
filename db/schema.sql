-- Courtroom AI schema (Neon Postgres + pgvector). Auth tables live in neon_auth schema (managed).
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','advocate')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  court TEXT NOT NULL DEFAULT '',
  charges TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  seeded BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  side TEXT NOT NULL CHECK (side IN ('prosecution','defense','judge','witness')),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  persona_prompt TEXT NOT NULL DEFAULT '',
  is_witness BOOLEAN NOT NULL DEFAULT false,
  personality TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS case_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  exhibit_label TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id TEXT REFERENCES cases(id) ON DELETE SET NULL,
  owner_id TEXT,
  kind TEXT NOT NULL CHECK (kind IN ('hf_seed','upload','fir','statute','judgment')),
  title TEXT NOT NULL,
  storage_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','indexed','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
  section_label TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  embedding vector(768),
  token_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);
CREATE INDEX IF NOT EXISTS chunks_case_idx ON chunks (case_id);
CREATE INDEX IF NOT EXISTS chunks_document_idx ON chunks (document_id);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  case_id TEXT NOT NULL REFERENCES cases(id),
  student_role TEXT NOT NULL CHECK (student_role IN ('defense','prosecution')),
  duration_limit_sec INTEGER NOT NULL DEFAULT 180,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live','ended')),
  outcome TEXT
);

CREATE TABLE IF NOT EXISTS session_turns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  seq INTEGER NOT NULL,
  actor TEXT NOT NULL CHECK (actor IN ('student','prosecutor','defense','judge','witness')),
  speaker_name TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'standard' CHECK (kind IN ('standard','objection','ruling','response')),
  text TEXT NOT NULL,
  citation TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS session_turns_session_idx ON session_turns (session_id, seq);

CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
  argument_score INTEGER CHECK (argument_score BETWEEN 0 AND 10),
  objection_score INTEGER CHECK (objection_score BETWEEN 0 AND 10),
  composure_score INTEGER CHECK (composure_score BETWEEN 0 AND 10),
  legal_accuracy_score INTEGER CHECK (legal_accuracy_score BETWEEN 0 AND 10),
  overall INTEGER CHECK (overall BETWEEN 0 AND 10),
  judge_summary TEXT NOT NULL DEFAULT '',
  strengths TEXT[] NOT NULL DEFAULT '{}',
  weaknesses TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prep_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
