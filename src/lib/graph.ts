import { db } from "./db";
import type { Row } from "./db";
import { chat } from "./llm";
import { emit } from "./agentBus";
import type { BusActor, BusType, TurnDbKind } from "./agentBus";

export type NextActor = "witness_answer" | "opponent_reply" | "ruling" | "directions" | "opening";

export interface JudgeDecision {
  next: NextActor;
  witness?: string;
  ruling?: "sustained" | "overruled";
  reason?: string;
  direction?: string;
}

export interface PendingTurn {
  type: BusType;
  actor: BusActor;
  speakerName: string;
  text: string;
  citation: string;
  dbKind?: TurnDbKind;
  node?: string;
}

export interface GraphState {
  session: Row;
  case: Row;
  parties: Row[];
  turns: Row[];
  evidence: Row[];
  nextActor: NextActor | null;
  decision: JudgeDecision | null;
  createdTurns: Row[];
  reasoning: string[];
  pendingTurns: PendingTurn[];
}

export interface RunAdvanceResult {
  session: Row;
  turns: Row[];
  created: Row[];
  reasoning: string[];
}

const NEXT_ACTORS: NextActor[] = ["witness_answer", "opponent_reply", "ruling", "directions", "opening"];

function clip(s: string, n = 1400): string {
  return s.length > n ? s.slice(0, n) : s;
}

function transcriptBlock(turns: Row[]): string {
  return turns.map((t) => `[${String(t.speaker_name ?? t.actor ?? "?")} · ${String(t.kind ?? "?")}] ${clip(String(t.text ?? ""), 600)}`).join("\n\n") || "(no turns yet)";
}

function buildCaseBrief(state: GraphState): string {
  const c = state.case;
  return `Case: ${String(c.title ?? "Untitled")}
Court: ${String(c.court ?? "")}
Charges: ${String(c.charges ?? "")}
Summary: ${String(c.summary ?? "")}

Exhibits on record:
${state.evidence.map((e) => `- ${String(e.exhibit_label ?? "")} ${String(e.title ?? "")}`).join("\n") || "- none yet"}

Transcript so far:
${transcriptBlock(state.turns)}`;
}

function safeJson(raw: string): Record<string, string> {
  try {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const parsed = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === "string") out[k] = v;
      }
      return out;
    }
  } catch {
    // ignore
  }
  return { next: "opponent_reply" };
}

function parseDecision(raw: string): JudgeDecision {
  const obj = safeJson(raw);
  const next = NEXT_ACTORS.includes(obj.next as NextActor) ? (obj.next as NextActor) : "opponent_reply";
  return {
    next,
    witness: obj.witness,
    ruling: obj.ruling === "sustained" || obj.ruling === "overruled" ? obj.ruling : undefined,
    reason: obj.reason,
    direction: obj.direction,
  };
}

function judgeParty(state: GraphState): Row | undefined {
  return state.parties.find((p) => String(p.side) === "judge");
}

function witnessParty(state: GraphState): Row | undefined {
  return state.parties.find((p) => String(p.side) === "witness");
}

function opponentParty(state: GraphState): Row | undefined {
  const studentRole = String(state.session.student_role ?? "defense");
  return studentRole === "defense"
    ? state.parties.find((p) => String(p.side) === "prosecution")
    : state.parties.find((p) => String(p.side) === "defense");
}

function judgeName(state: GraphState): string {
  return String(judgeParty(state)?.name ?? "Hon'ble Justice");
}

function openingText(state: GraphState): string {
  const caseId = String(state.session.case_id ?? state.case.id ?? "");
  const title = String(state.case.title ?? "");
  const court = String(state.case.court ?? "");
  const courtPart = court ? ` Court: ${court}.` : "";
  return `Case ${caseId} called: ${title}.${courtPart} Counsels may proceed.`;
}

async function loadState(sessionId: string): Promise<GraphState> {
  const sql = db();
  const [sess] = await sql`SELECT * FROM sessions WHERE id = ${sessionId} LIMIT 1`;
  if (!sess) throw new Error("Session not found");
  const [caseRow] = await sql`SELECT * FROM cases WHERE id = ${sess.case_id} LIMIT 1`;
  const parties = await sql`SELECT * FROM case_parties WHERE case_id = ${sess.case_id}`;
  const turns = await sql`SELECT * FROM session_turns WHERE session_id = ${sessionId} ORDER BY seq ASC`;
  const evidence = await sql`SELECT * FROM case_evidence WHERE case_id = ${sess.case_id} LIMIT 6`;
  return {
    session: sess,
    case: caseRow ?? { id: sess.case_id, title: "", court: "", charges: "", summary: "" },
    parties,
    turns,
    evidence,
    nextActor: null,
    decision: null,
    createdTurns: [],
    reasoning: [],
    pendingTurns: [],
  };
}

export async function judgeDecide(state: GraphState): Promise<GraphState> {
  const witness = witnessParty(state);
  const studentRole = String(state.session.student_role ?? "defense");
  const caseBrief = buildCaseBrief(state);

  const decisionRaw = await chat({
    messages: [
      {
        role: "system",
        content: `You are the Hon'ble Judge running an Indian courtroom simulation. Student plays ${studentRole}. Decide the single next step in the trial flow.

Output ONLY a JSON object, no prose, one of:
{"next":"opponent_reply"}
{"next":"witness_answer","witness":"${witness ? String(witness.name) : "PW-1"}"}
{"next":"ruling","ruling":"sustained|overruled","reason":"one sentence"}
{"next":"directions","direction":"one sentence order to a party"}
{"next":"opening"}

Rules: if the last student turn was an objection, rule sustained only if legally strong. Else prefer witness_answer when a question was put to a witness, opponent_reply after a submission, directions when stuck, opening when no turns yet.`,
      },
      { role: "user", content: caseBrief },
    ],
    maxTokens: 300,
    temperature: 0.4,
  });

  let decision = parseDecision(decisionRaw);
  const reasoningParts: string[] = [`judgeDecide: selected next=${decision.next}`];

  if (state.turns.length === 0 && decision.next !== "opening") {
    reasoningParts.push(`judgeDecide: no transcript yet, overriding next=${decision.next} to opening`);
    decision = { ...decision, next: "opening" };
  }

  if (decision.next === "ruling" && decision.reason) {
    reasoningParts.push(`judgeDecide: ruling basis ${decision.reason}`);
  }
  if (decision.next === "directions" && decision.direction) {
    reasoningParts.push(`judgeDecide: direction ${decision.direction}`);
  }

  state.decision = decision;
  state.nextActor = decision.next;
  state.reasoning.push(...reasoningParts);
  return state;
}

export async function actorGenerate(state: GraphState): Promise<GraphState> {
  const witness = witnessParty(state);
  const opponent = opponentParty(state);
  const caseBrief = buildCaseBrief(state);
  const next = state.nextActor ?? state.decision?.next;

  if (next === "witness_answer" && witness) {
    const answer = await chat({
      messages: [
        {
          role: "system",
          content: `You are ${String(witness.name)}, ${String(witness.role ?? "witness")}. Personality: ${String(witness.personality ?? witness.persona_prompt ?? "")}. Answer the counsel's last question truthfully to the case facts, in character as a witness under oath in an Indian court. 3-5 sentences, natural hesitation allowed, one realistic detail. No fake statutes.`,
        },
        { role: "user", content: caseBrief },
      ],
      maxTokens: 700,
      temperature: 0.7,
    });
    state.pendingTurns.push({
      type: "turn",
      actor: "witness",
      speakerName: String(witness.name),
      text: clip(answer, 2200),
      citation: String(witness.role ?? ""),
      dbKind: "response",
      node: "actorGenerate",
    });
    state.reasoning.push("actorGenerate: witness answer drafted for the bench record.");
    return state;
  }

  if (next === "opponent_reply" && opponent) {
    const reply = await chat({
      messages: [
        {
          role: "system",
          content: `You are ${String(opponent.name)}, ${String(opponent.role ?? "counsel")} opposing the student. Respond to the student's last submission, in courtroom tone, 3-5 sentences. Press your side's best point, cite one real Indian statute (BNS/BSA/BNSS) by number correctly.`,
        },
        { role: "user", content: caseBrief },
      ],
      maxTokens: 700,
      temperature: 0.6,
    });
    const actor: BusActor = String(state.session.student_role) === "defense" ? "prosecutor" : "defense";
    state.pendingTurns.push({
      type: "turn",
      actor,
      speakerName: String(opponent.name),
      text: clip(reply, 2200),
      citation: String(opponent.role ?? ""),
      dbKind: "standard",
      node: "actorGenerate",
    });
    state.reasoning.push("actorGenerate: opponent reply drafted against the student submission.");
    return state;
  }

  state.reasoning.push(`actorGenerate: skipped, next=${String(next ?? "none")} needs no actor speech.`);
  return state;
}

export async function judgeRule(state: GraphState): Promise<GraphState> {
  const next = state.nextActor ?? state.decision?.next;
  const jName = judgeName(state);
  const caseBrief = buildCaseBrief(state);
  const decision = state.decision;

  if (next === "ruling") {
    const ruling = decision?.ruling === "sustained" ? "sustained" : "overruled";
    const verdict = ruling === "sustained" ? "OBJECTION SUSTAINED" : "OBJECTION OVERRULED";
    const text = await chat({
      messages: [
        {
          role: "system",
          content: `You are ${jName}. Rule on the objection in the transcript. One short ruling sentence plus order. Cite one real statute or precedent briefly. Verdict: ${verdict}. Reason basis: ${decision?.reason ?? ""}`,
        },
        { role: "user", content: caseBrief },
      ],
      maxTokens: 500,
      temperature: 0.4,
    });
    state.pendingTurns.push({
      type: "ruling",
      actor: "judge",
      speakerName: jName,
      text: clip(text, 2200),
      citation: "Bench ruling on objection",
      dbKind: "ruling",
      node: "judgeRule",
    });
    state.reasoning.push(`judgeRule: objection ${ruling}, order entered.`);
    return state;
  }

  if (next === "directions") {
    const text = decision?.direction ?? "Counsel will proceed.";
    state.pendingTurns.push({
      type: "ruling",
      actor: "judge",
      speakerName: jName,
      text: clip(text, 2200),
      citation: "Bench direction",
      dbKind: "ruling",
      node: "judgeRule",
    });
    state.reasoning.push("judgeRule: bench direction recorded.");
    return state;
  }

  if (next === "opening") {
    const text = openingText(state);
    state.pendingTurns.push({
      type: "event",
      actor: "judge",
      speakerName: jName,
      text: clip(text, 2200),
      citation: "Court opening",
      dbKind: "standard",
      node: "judgeRule",
    });
    state.reasoning.push("judgeRule: court called the case, counsels directed to proceed.");
    return state;
  }

  state.reasoning.push(`judgeRule: skipped, next=${String(next ?? "none")} is not a bench turn.`);
  return state;
}

export async function persist(state: GraphState): Promise<GraphState> {
  const sql = db();
  const sessionId = String(state.session.id);
  const [maxBefore] = await sql`
    SELECT COALESCE(MAX(seq), 0)::int AS max_seq FROM session_turns WHERE session_id = ${sessionId}
  `;
  const beforeSeq = maxBefore?.max_seq ?? 0;

  for (const pending of state.pendingTurns) {
    await emit({
      sessionId,
      type: pending.type,
      actor: pending.actor,
      payload: {
        text: pending.text,
        speakerName: pending.speakerName,
        citation: pending.citation,
        dbKind: pending.dbKind,
      },
      node: pending.node,
    });
  }

  const created = await sql`
    SELECT * FROM session_turns WHERE session_id = ${sessionId} AND seq > ${beforeSeq} ORDER BY seq ASC
  `;
  const allTurns = await sql`
    SELECT * FROM session_turns WHERE session_id = ${sessionId} ORDER BY seq ASC
  `;
  state.createdTurns = created;
  state.turns = allTurns;
  state.pendingTurns = [];
  state.reasoning.push(`persist: ${created.length} turn(s) written to session_turns.`);
  return state;
}

export async function runAdvanceGraph(input: { sessionId: string }): Promise<RunAdvanceResult> {
  const state = await loadState(input.sessionId);
  await judgeDecide(state);
  const next = state.nextActor ?? state.decision?.next;
  if (next === "witness_answer" || next === "opponent_reply") {
    await actorGenerate(state);
  } else {
    await judgeRule(state);
  }
  await persist(state);
  return {
    session: state.session,
    turns: state.turns,
    created: state.createdTurns,
    reasoning: state.reasoning,
  };
}

export async function runIntroGraph(input: { sessionId: string }): Promise<RunAdvanceResult> {
  const state = await loadState(input.sessionId);
  state.decision = { next: "opening" };
  state.nextActor = "opening";
  state.reasoning.push("intro: opening sequence requested, judge to call the case.");
  await judgeRule(state);
  await persist(state);
  return {
    session: state.session,
    turns: state.turns,
    created: state.createdTurns,
    reasoning: state.reasoning,
  };
}
