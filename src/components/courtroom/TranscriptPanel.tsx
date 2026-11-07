"use client";

import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TranscriptItem } from "@/types/courtroomArena";
import { SPEAKER_META } from "@/components/courtroom/speakerMeta";

interface TranscriptPanelProps {
  transcript: TranscriptItem[];
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
      <div className="h-10 px-3.5 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
        <span className="text-xs font-semibold text-zinc-900">Transcript</span>

        <div className="flex items-center gap-1">
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

      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs font-mono">
            No entries matching selected filter
          </div>
        ) : (
          filteredTranscript.map((item) => {
            const meta = SPEAKER_META[item.speakerRole];
            const Icon = meta?.icon;
            const label = meta?.label ?? item.speaker;
            return (
            <div
              key={item.id}
              className="rounded-lg border border-zinc-200 bg-white p-3 text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Icon ? <Icon className="size-3.5" /> : null}
                  <span className="font-bold text-xs text-zinc-900">{label}</span>
                  {item.kind === "objection" && (
                    <Badge variant="outline" className="text-[9px] uppercase py-0 px-1.5">
                      Objection
                    </Badge>
                  )}
                  {item.kind === "ruling" && (
                    <Badge variant="outline" className="text-[9px] uppercase py-0 px-1.5">
                      Ruling
                    </Badge>
                  )}
                </div>
                <span className="font-mono text-[10px] text-zinc-500">{item.timestamp}</span>
              </div>

              <p className="text-zinc-800 leading-relaxed text-[13px]">
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
