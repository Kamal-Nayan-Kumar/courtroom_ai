export interface CaseRow {
  id: string;
  title: string;
  category: string;
  court: string;
  charges: string;
  summary: string;
  seeded: boolean;
  status: string;
}

export interface PartyRow {
  id: string;
  case_id: string;
  side: string;
  name: string;
  role: string;
  persona_prompt: string;
  is_witness: boolean;
  personality: string;
}

export interface EvidenceRow {
  id: string;
  case_id: string;
  exhibit_label: string;
  title: string;
  description: string;
  content: string;
}

export interface SessionRow {
  id: string;
  user_id: string;
  case_id: string;
  student_role: string;
  duration_limit_sec: number;
  started_at: string;
  ended_at: string | null;
  status: string;
  outcome: string | null;
}

export interface TurnRow {
  id: string;
  session_id: string;
  seq: number;
  actor: string;
  speaker_name: string;
  kind: string;
  text: string;
  citation: string;
  created_at: string;
}

export interface ScoreRow {
  id: string;
  session_id: string;
  argument_score: number | null;
  objection_score: number | null;
  composure_score: number | null;
  legal_accuracy_score: number | null;
  overall: number | null;
  judge_summary: string;
  strengths: string[];
  weaknesses: string[];
}

export interface ChunkRow {
  id: string;
  document_id: string | null;
  case_id: string | null;
  section_label: string;
  text: string;
  embedding?: unknown;
  token_count: number;
}
