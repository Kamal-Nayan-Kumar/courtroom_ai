"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { TranscriptItem } from "@/types/courtroomArena";
import { SPEAKER_META } from "@/components/courtroom/speakerMeta";

interface TranscriptPanelProps {
  transcript: TranscriptItem[];
}

function ReasoningBlock({
  steps,
  streaming,
}: {
  steps: string[];
  streaming: boolean;
}) {
  const [manualOpen, setManualOpen] = useState<boolean | null>(null);
  const open = manualOpen ?? streaming;

  if (steps.length === 0) {
    return streaming ? (
      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
        <Loader2 className="size-3 animate-spin shrink-0" />
        <span>Thinking…</span>
      </div>
    ) : null;
  }

  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50/70">
      <button
        type="button"
        onClick={() => setManualOpen(!open)}
        className="flex w-full items-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
        aria-expanded={open}
      >
        {streaming ? (
          <Loader2 className="size-3 animate-spin shrink-0" />
        ) : (
          <Brain className="size-3 shrink-0" />
        )}
        <span className="truncate">
          {streaming ? "Thinking · tool calls" : `Reasoning · ${steps.length} steps`}
        </span>
        <ChevronDown
          className={`size-3 ml-auto shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul className="space-y-1 px-2 pb-2">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <li
                key={i}
                className="flex items-start gap-1.5 text-[11px] text-zinc-600"
              >
                {streaming && isLast ? (
                  <Loader2 className="size-3 mt-0.5 animate-spin shrink-0 text-zinc-500" />
                ) : (
                  <Check className="size-3 mt-0.5 shrink-0 text-emerald-600" />
                )}
                <span className="min-w-0">{step}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  const [filter, setFilter] = useState<"all" | "rulings" | "objections">("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const filteredTranscript = transcript.filter((item) => {
    if (filter === "rulings") return item.kind === "ruling";
    if (filter === "objections") return item.kind === "objection";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white select-none">
      <div className="h-10 px-3.5 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0 gap-2">
        <span className="text-xs font-semibold text-zinc-900 shrink-0">Transcript</span>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              filter === "all"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("rulings")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              filter === "rulings"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Bench
          </button>
          <button
            type="button"
            onClick={() => setFilter("objections")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              filter === "objections"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Objections
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 bg-zinc-50/70">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs font-mono">
            No entries matching selected filter
          </div>
        ) : (
          filteredTranscript.map((item) => {
            const meta = SPEAKER_META[item.speakerRole];
            const Icon = meta?.icon;
            const label = meta?.label ?? item.speaker;
            const theme = meta?.theme;

            if (item.isUser) {
              return (
                <div key={item.id} className="flex flex-col items-end min-w-0">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-zinc-900 text-white p-3">
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                      {item.content}
                    </p>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-zinc-400 text-right">
                    {item.citation ? `${item.citation} · ` : ""}
                    {item.timestamp}
                  </div>
                </div>
              );
            }

            return (
            <div
              key={item.id}
              className="rounded-lg border border-zinc-200 bg-white p-3 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {Icon ? <Icon className={`size-3.5 shrink-0 ${theme?.icon ?? "text-zinc-500"}`} /> : null}
                  <span className={`font-bold text-xs ${theme?.label ?? "text-zinc-900"}`}>{label}</span>
                  {item.kind === "objection" && (
                    <Badge variant="outline" className={`text-[9px] uppercase py-0 px-1.5 shrink-0 ${theme?.badge ?? ""}`}>
                      Objection
                    </Badge>
                  )}
                  {item.kind === "ruling" && (
                    <Badge variant="outline" className={`text-[9px] uppercase py-0 px-1.5 shrink-0 ${theme?.badge ?? ""}`}>
                      Ruling
                    </Badge>
                  )}
                </div>
                <span className="font-mono text-[10px] text-zinc-500 shrink-0">{item.timestamp}</span>
              </div>

              {(item.reasoning || item.isStreaming) && (
                <ReasoningBlock
                  steps={item.reasoning ?? []}
                  streaming={!!item.isStreaming}
                />
              )}

              <p className="text-zinc-800 leading-relaxed text-[13px] whitespace-pre-wrap break-words">
                {item.content}
                {item.isStreaming && (
                  <span className="inline-block w-1.5 h-3 ml-1 bg-zinc-700 animate-pulse align-middle" />
                )}
              </p>

              {item.citation && (
                <div className="text-[10px] text-zinc-500 font-mono pt-1 border-t border-zinc-100">
                  {item.citation}
                </div>
              )}
            </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
