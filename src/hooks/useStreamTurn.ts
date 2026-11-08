"use client";

import { useCallback, useRef, useState } from "react";
import type { SpeakerId, TranscriptItem } from "@/types/courtroomArena";

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

type StreamEvent =
  | { type: "delta"; text: string }
  | { type: "reasoning"; step: string }
  | { type: "done"; turn: TurnRow };

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function speakerForKind(kind: string): { role: SpeakerId; label: string; transcriptKind: TranscriptItem["kind"] } {
  if (kind === "judge" || kind === "objection" || kind === "ruling") {
    return { role: "judge", label: "Judge", transcriptKind: "ruling" };
  }
  return { role: "witness", label: "Witness", transcriptKind: "witness" };
}

function turnToItem(turn: TurnRow, reasoning: string[]): TranscriptItem {
  const roleMap: Record<string, SpeakerId> = {
    judge: "judge",
    witness: "witness",
    prosecutor: "prosecutor",
    defense: "defense",
    student: "defense",
  };
  const speakerRole = roleMap[turn.actor] ?? "witness";
  const transcriptKind =
    turn.kind === "ruling"
      ? "ruling"
      : turn.kind === "objection"
        ? "objection"
        : turn.actor === "witness" || turn.kind === "response"
          ? "witness"
          : "standard";
  let timestamp = nowTime();
  if (turn.created_at) {
    const parsed = new Date(turn.created_at);
    if (!Number.isNaN(parsed.getTime())) timestamp = parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
  return {
    id: turn.id || `turn-${turn.seq}`,
    speaker: turn.speaker_name || "Court",
    speakerRole,
    content: turn.text || "",
    timestamp,
    citation: turn.citation || undefined,
    kind: transcriptKind,
    reasoning: reasoning.length ? [...reasoning] : undefined,
    isStreaming: false,
  };
}

export function useStreamTurn(sessionId: string) {
  const [streaming, setStreaming] = useState(false);
  const [reasoning, setReasoning] = useState<string[]>([]);
  const [streamingItem, setStreamingItem] = useState<TranscriptItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamingRef = useRef(false);

  const push = useCallback(
    async (text: string, kind: string): Promise<TranscriptItem | null> => {
      if (streamingRef.current) return null;
      if (!sessionId) {
        setError("No session available.");
        return null;
      }
      const trimmed = (text ?? "").trim().slice(0, 4000);
      if (!trimmed) return null;

      streamingRef.current = true;
      setStreaming(true);
      setReasoning([]);
      setError(null);

      const meta = speakerForKind(kind);
      const itemId = `streaming-${Date.now()}`;
      let content = "";
      let steps: string[] = [];
      setStreamingItem({
        id: itemId,
        speaker: meta.label,
        speakerRole: meta.role,
        content: "",
        timestamp: nowTime(),
        kind: meta.transcriptKind,
        isStreaming: true,
        reasoning: [],
      });

      try {
        const res = await fetch(`/api/sessions/${encodeURIComponent(sessionId)}/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, kind }),
        });

        if (!res.ok || !res.body) {
          let message = `Stream failed (${res.status})`;
          try {
            const json = (await res.json()) as { error?: string };
            if (json?.error) message = json.error;
          } catch {
            // ignore
          }
          throw new Error(message);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let finalTurn: TurnRow | null = null;

        const handleEvent = (event: StreamEvent) => {
          if (event.type === "reasoning") {
            steps = [...steps, event.step];
            setReasoning(steps);
            setStreamingItem((prev) =>
              prev ? { ...prev, reasoning: [...steps] } : prev
            );
          } else if (event.type === "delta") {
            content += event.text;
            setStreamingItem((prev) => (prev ? { ...prev, content } : prev));
          } else if (event.type === "done") {
            finalTurn = event.turn;
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              handleEvent(JSON.parse(line) as StreamEvent);
            } catch {
              // ignore malformed line
            }
          }
        }
        if (buffer.trim()) {
          try {
            handleEvent(JSON.parse(buffer) as StreamEvent);
          } catch {
            // ignore
          }
        }

        if (finalTurn) {
          const item = turnToItem(finalTurn, steps);
          setReasoning(steps);
          return item;
        }
        // Stream closed without a done event.
        setError("Stream ended without a response.");
        return null;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Stream failed";
        setError(message);
        return null;
      } finally {
        streamingRef.current = false;
        setStreaming(false);
        setStreamingItem(null);
      }
    },
    [sessionId]
  );

  const reset = useCallback(() => {
    setStreaming(false);
    setReasoning([]);
    setStreamingItem(null);
    setError(null);
    streamingRef.current = false;
  }, []);

  return { streaming, reasoning, streamingItem, push, error, reset };
}
