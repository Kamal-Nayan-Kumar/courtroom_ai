import { db } from "./db";
import type { Row } from "./db";

export type BusType = "turn" | "objection" | "ruling" | "event" | "reasoning";
export type BusActor = "student" | "prosecutor" | "defense" | "judge" | "witness";
export type TurnDbKind = "standard" | "objection" | "ruling" | "response";

export interface BusPayload {
  text: string;
  speakerName: string;
  citation?: string;
  dbKind?: TurnDbKind;
}

export interface BusEnvelope {
  id: string;
  sessionId: string;
  seq: number;
  type: BusType;
  actor: BusActor;
  payload: BusPayload;
}

export interface EmitInput {
  sessionId: string;
  type: BusType;
  actor: BusActor;
  payload: BusPayload;
  node?: string;
}

const TYPE_TO_DB_KIND: Record<BusType, TurnDbKind> = {
  turn: "standard",
  objection: "objection",
  ruling: "ruling",
  event: "standard",
  reasoning: "standard",
};

function newId(): string {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }
  return `id-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export function newEnvelope(input: {
  sessionId: string;
  seq: number;
  type: BusType;
  actor: BusActor;
  payload: BusPayload;
}): BusEnvelope {
  return {
    id: newId(),
    sessionId: input.sessionId,
    seq: input.seq,
    type: input.type,
    actor: input.actor,
    payload: {
      text: input.payload.text,
      speakerName: input.payload.speakerName,
      citation: input.payload.citation ?? "",
      dbKind: input.payload.dbKind ?? TYPE_TO_DB_KIND[input.type],
    },
  };
}

function clip(s: string, n = 2200): string {
  return s.length > n ? s.slice(0, n) : s;
}

function toBusActor(actor: string): BusActor {
  if (actor === "student" || actor === "prosecutor" || actor === "defense" || actor === "judge" || actor === "witness") {
    return actor;
  }
  return "judge";
}

function dbKindToType(kind: string): BusType {
  if (kind === "objection") return "objection";
  if (kind === "ruling") return "ruling";
  return "turn";
}

export async function emit(input: EmitInput): Promise<BusEnvelope> {
  const sql = db();
  const { sessionId } = input;
  const dbKind = input.payload.dbKind ?? TYPE_TO_DB_KIND[input.type];
  const text = clip(input.payload.text);
  const speakerName = input.payload.speakerName;
  const citation = input.payload.citation ?? "";

  const [maxSeq] = await sql`
    SELECT COALESCE(MAX(seq), 0)::int AS max_seq FROM session_turns WHERE session_id = ${sessionId}
  `;
  const seq = (maxSeq?.max_seq ?? 0) + 1;

  const [row] = await sql`
    INSERT INTO session_turns (session_id, seq, actor, speaker_name, kind, text, citation)
    VALUES (${sessionId}, ${seq}, ${input.actor}, ${speakerName}, ${dbKind}, ${text}, ${citation})
    RETURNING *
  `;

  const envelope = newEnvelope({
    sessionId,
    seq: (row.seq as number) ?? seq,
    type: input.type,
    actor: toBusActor(String(row.actor ?? input.actor)),
    payload: {
      text: String(row.text ?? text),
      speakerName: String(row.speaker_name ?? speakerName),
      citation: String(row.citation ?? citation),
      dbKind,
    },
  });
  envelope.id = String(row.id ?? envelope.id);
  return envelope;
}

export async function readEvents(sessionId: string): Promise<BusEnvelope[]> {
  const sql = db();
  const rows = await sql`
    SELECT * FROM session_turns WHERE session_id = ${sessionId} ORDER BY seq ASC
  `;
  return rows.map((row: Row) => {
    const kind = String(row.kind ?? "standard");
    const type = dbKindToType(kind);
    return newEnvelope({
      sessionId,
      seq: Number(row.seq ?? 0),
      type,
      actor: toBusActor(String(row.actor ?? "judge")),
      payload: {
        text: String(row.text ?? ""),
        speakerName: String(row.speaker_name ?? ""),
        citation: String(row.citation ?? ""),
        dbKind: kind === "objection" || kind === "ruling" || kind === "response" ? kind : "standard",
      },
    }) as BusEnvelope;
  }).map((env, idx) => {
    const row = rows[idx] as Row;
    env.id = String(row.id ?? env.id);
    return env;
  });
}
