"use client";

import React, { useState } from "react";
import { Sparkles, X, ChevronUp } from "lucide-react";
import { SPEAKER_META } from "@/components/courtroom/speakerMeta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AgentPersona,
  CoCounselHintItem,
  CourtroomExhibit,
  SpeakerId,
  WitnessProfile,
} from "@/types/courtroomArena";

interface CourtroomArena2DProps {
  activeSpeaker: SpeakerId | null;
  onSelectSpeaker: (speakerId: SpeakerId) => void;
  activeExhibit: CourtroomExhibit | null;
  onClearExhibit: () => void;
  witnessProfile: WitnessProfile;
  witnessComposure: number;
  personas: Record<string, AgentPersona>;
  coCounselHints: CoCounselHintItem[];
  coCounselEnabled: boolean;
  onInsertQuestion: (text: string) => void;
  onCitePrecedent: (text: string) => void;
}

export function CourtroomArena2D({
  activeSpeaker,
  onSelectSpeaker,
  activeExhibit,
  onClearExhibit,
  witnessProfile,
  witnessComposure,
  personas,
  coCounselHints,
  coCounselEnabled,
  onInsertQuestion,
  onCitePrecedent,
}: CourtroomArena2DProps) {
  const [isCoCounselCollapsed, setIsCoCounselCollapsed] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const JudgeIcon = SPEAKER_META.judge.icon;
  const WitnessIcon = SPEAKER_META.witness.icon;
  const ProsecutorIcon = SPEAKER_META.prosecutor.icon;
  const DefenseIcon = SPEAKER_META.defense.icon;

  const currentHint = coCounselHints[hintIndex] || coCounselHints[0];

  const handleNextHint = () => {
    setHintIndex((prev) => (prev + 1) % coCounselHints.length);
  };

  const cardStyle = (active: boolean, role: SpeakerId) =>
    active
      ? "bg-zinc-900 text-white border-zinc-900"
      : `${SPEAKER_META[role].theme.card} text-zinc-900`;

  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-dot-pattern select-none">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between gap-4 max-w-4xl mx-auto w-full">
        <div className="w-full flex justify-center">
          <div
            onClick={() => onSelectSpeaker("judge")}
            className={`w-full max-w-lg rounded-lg border p-4 transition-all cursor-pointer ${cardStyle(
              activeSpeaker === "judge",
              "judge"
            )}`}
          >
            <div className="flex items-center gap-2">
              <JudgeIcon className={`size-4 ${activeSpeaker === "judge" ? "text-white" : SPEAKER_META.judge.theme.icon}`} />
              <span className="text-xs font-semibold">{SPEAKER_META.judge.label}</span>
            </div>
            <div className={`text-xs mt-1 ${activeSpeaker === "judge" ? "text-zinc-300" : "text-zinc-500"}`}>Sessions Court</div>
          </div>
        </div>
        {activeExhibit ? (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-lg px-3 py-2 flex items-center justify-between gap-3 text-xs">
              <div className="min-w-0 flex items-center gap-2">
                <span className="font-medium text-zinc-900 truncate text-xs">
                  Exhibit {activeExhibit.label} · {activeExhibit.name}
                </span>
                <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5 shrink-0">
                  {activeExhibit.admissibility}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearExhibit}
                className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-900 shrink-0"
                title="Clear exhibit"
              >
                <X className="size-3" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-400">
              No exhibit presented
            </div>
          </div>
        )}
        <div className="w-full flex justify-center">
          <div
            onClick={() => onSelectSpeaker("witness")}
            className={`w-full max-w-md rounded-lg border p-3.5 transition-all cursor-pointer ${cardStyle(
              activeSpeaker === "witness",
              "witness"
            )}`}
          >
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <WitnessIcon className={`size-3.5 ${activeSpeaker === "witness" ? "text-white" : SPEAKER_META.witness.theme.icon}`} />
              {SPEAKER_META.witness.label}
            </div>
            <div className={`text-[11px] mb-2 truncate ${activeSpeaker === "witness" ? "text-zinc-300" : "text-zinc-500"}`}>PW-1</div>
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className={activeSpeaker === "witness" ? "text-zinc-300" : "text-zinc-600"}>
                  Composure
                </span>
                <span className="font-mono font-bold">{witnessComposure}%</span>
              </div>
              <Progress
                value={witnessComposure}
                className={`h-1.5 ${activeSpeaker === "witness" ? "bg-zinc-700 [&>div]:bg-white" : "bg-zinc-200 [&>div]:bg-zinc-900"}`}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div
            onClick={() => onSelectSpeaker("prosecutor")}
            className={`rounded-lg border p-3 transition-all cursor-pointer ${cardStyle(
              activeSpeaker === "prosecutor",
              "prosecutor"
            )}`}
          >
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <ProsecutorIcon className={`size-3.5 ${activeSpeaker === "prosecutor" ? "text-white" : SPEAKER_META.prosecutor.theme.icon}`} />
              {SPEAKER_META.prosecutor.label}
            </div>
            <div className={`text-[11px] ${activeSpeaker === "prosecutor" ? "text-zinc-300" : "text-zinc-500"}`}>
              Public Prosecutor
            </div>
          </div>

          <div
            onClick={() => onSelectSpeaker("defense")}
            className={`rounded-lg border p-3 transition-all cursor-pointer ${cardStyle(
              activeSpeaker === "defense",
              "defense"
            )}`}
          >
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <DefenseIcon className={`size-3.5 ${activeSpeaker === "defense" ? "text-white" : SPEAKER_META.defense.theme.icon}`} />
              {SPEAKER_META.defense.label}
            </div>
            <div className={`text-[11px] ${activeSpeaker === "defense" ? "text-zinc-300" : "text-zinc-500"}`}>
              Defense Counsel
            </div>
          </div>
        </div>
      </div>
      {coCounselEnabled && currentHint && (
        <div className="p-3 sm:p-4 w-full flex justify-center shrink-0">
          <div className="w-full max-w-xl">
            {isCoCounselCollapsed ? (
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCoCounselCollapsed(false)}
                  className="h-8 gap-1.5 px-3 rounded-full shadow-sm bg-white border-zinc-200 text-xs font-medium"
                >
                  <Sparkles className="size-3.5" />
                  <span>Co-Counsel hint</span>
                  <ChevronUp className="size-3.5 ml-0.5" />
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-200 bg-white p-3 text-xs flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="size-3.5 shrink-0 mt-0.5" />
                  <p className="text-zinc-800 text-xs leading-relaxed line-clamp-2 flex-1">
                    {currentHint.whisper}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => onInsertQuestion(currentHint.suggestedAction)}
                    className="h-7 px-2.5 text-xs bg-zinc-900 text-white hover:bg-zinc-800 font-medium"
                  >
                    Use
                  </Button>
                  {currentHint.precedentRef && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onCitePrecedent(
                          `My Lord, I rely directly on the 3-judge bench ruling in ${currentHint.precedentRef}: contemporaneous hash certification is non-negotiable.`
                        )
                      }
                      className="h-7 px-2 text-xs border-zinc-300 bg-white hover:bg-zinc-50 font-medium"
                    >
                      Cite precedent
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextHint}
                    className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-900 ml-auto"
                  >
                    Next
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCoCounselCollapsed(true)}
                    className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-900"
                  >
                    Hide
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
