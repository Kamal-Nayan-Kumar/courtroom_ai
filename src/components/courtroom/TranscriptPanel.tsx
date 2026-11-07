"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  Gavel,
  Shield,
  Scale,
  User,
  Filter,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TranscriptItem } from "@/types/courtroomArena";

interface TranscriptPanelProps {
  transcript: TranscriptItem[];
}

export function TranscriptPanel({ transcript }: TranscriptPanelProps) {
  const [filter, setFilter] = useState<"all" | "rulings" | "objections">("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
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
      {/* Transcript Header with Filter Pills */}
      <div className="h-10 px-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-zinc-600" />
          <span className="text-xs font-semibold text-zinc-900">
            Live Courtroom Record (Steno Stream)
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              filter === "all"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-200/70"
            }`}
          >
            All ({transcript.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("rulings")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              filter === "rulings"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-200/70"
            }`}
          >
            Bench Rulings
          </button>
          <button
            type="button"
            onClick={() => setFilter("objections")}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              filter === "objections"
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-200/70"
            }`}
          >
            Objections Only
          </button>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
        {filteredTranscript.length === 0 ? (
          <div className="text-center py-12 text-zinc-400 text-xs font-mono">
            No entries matching selected filter
          </div>
        ) : (
          filteredTranscript.map((item) => {
            // Render Turn 4: Objection in muted rose card
            if (item.kind === "objection") {
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-xs text-rose-950 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10.5px]">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                      <Scale className="size-3 text-rose-700" />
                      <span>{item.speaker}</span>
                      <Badge
                        variant="outline"
                        className="text-[9.5px] bg-rose-100/70 border-rose-300 text-rose-900 py-0 px-1"
                      >
                        PROACTIVE INTERRUPTION
                      </Badge>
                    </div>
                    <span className="text-rose-600">{item.timestamp}</span>
                  </div>

                  <p className="font-semibold text-rose-950 leading-relaxed text-[11.5px]">
                    {item.content}
                  </p>

                  {item.citation && (
                    <div className="text-[10px] text-rose-800/80 font-mono pt-1 border-t border-rose-200/60">
                      {item.citation}
                    </div>
                  )}
                </div>
              );
            }

            // Render Turn 5: Bench ruling in calm slate/emerald card
            if (item.kind === "ruling") {
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-emerald-200/90 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10.5px]">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Gavel className="size-3 text-emerald-700" />
                      <span>{item.speaker}</span>
                      <Badge
                        variant="outline"
                        className="text-[9.5px] bg-emerald-100/70 border-emerald-300 text-emerald-900 py-0 px-1"
                      >
                        BENCH RULING
                      </Badge>
                    </div>
                    <span className="text-emerald-700">{item.timestamp}</span>
                  </div>

                  <p className="font-semibold text-emerald-950 leading-relaxed text-[11.5px]">
                    {item.content}
                  </p>

                  {item.citation && (
                    <div className="text-[10px] text-emerald-800/80 font-mono pt-1 border-t border-emerald-200/60">
                      {item.citation}
                    </div>
                  )}
                </div>
              );
            }

            // Standard dialogue (Prosecutor, Witness, Defense)
            const isDefense = item.speakerRole === "defense";
            const isWitness = item.speakerRole === "witness";

            return (
              <div
                key={item.id}
                className={`rounded-xl border p-3.5 text-xs space-y-1.5 transition-colors ${
                  isDefense
                    ? "bg-zinc-50/90 border-zinc-300 text-zinc-950"
                    : isWitness
                    ? "bg-white border-zinc-200/90 text-zinc-900"
                    : "bg-white border-zinc-200 text-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10.5px]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    {isDefense ? (
                      <Shield className="size-3 text-zinc-900" />
                    ) : isWitness ? (
                      <User className="size-3 text-zinc-600" />
                    ) : (
                      <Scale className="size-3 text-zinc-600" />
                    )}
                    <span className={isDefense ? "text-zinc-950 font-bold" : "text-zinc-800"}>
                      {item.speaker}
                    </span>
                  </div>
                  <span className="text-zinc-400">{item.timestamp}</span>
                </div>

                <p className="text-zinc-800 leading-relaxed text-[11.5px]">
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
