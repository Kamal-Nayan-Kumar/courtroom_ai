"use client";

import React, { useState } from "react";
import {
  Gavel,
  Shield,
  Scale,
  User,
  Sparkles,
  Tv,
  CheckCircle2,
  X,
  Volume2,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react";
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

  const currentHint = coCounselHints[hintIndex] || coCounselHints[0];

  const handleNextHint = () => {
    setHintIndex((prev) => (prev + 1) % coCounselHints.length);
  };

  // Helper for 3-bar animated waveform
  const renderAudioWaveform = (isDark = false) => (
    <div className="flex items-center gap-0.5 h-3 px-1">
      <span
        className={`w-0.5 h-2 rounded-full animate-pulse ${
          isDark ? "bg-white" : "bg-zinc-800"
        }`}
        style={{ animationDuration: "600ms" }}
      />
      <span
        className={`w-0.5 h-3.5 rounded-full animate-pulse ${
          isDark ? "bg-white" : "bg-zinc-800"
        }`}
        style={{ animationDuration: "400ms" }}
      />
      <span
        className={`w-0.5 h-1.5 rounded-full animate-pulse ${
          isDark ? "bg-white" : "bg-zinc-800"
        }`}
        style={{ animationDuration: "500ms" }}
      />
    </div>
  );

  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#F6F6F3] bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px] select-none">
      {/* Top Architecture Blueprint Header Strip */}
      <div className="h-8 border-b border-zinc-200/80 bg-white/70 backdrop-blur-xs px-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 shrink-0">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-zinc-400" />
          <span>SESSIONS COURTROOM ARCHITECTURAL VIEW · TOP-DOWN 2D</span>
        </div>
        <div className="flex items-center gap-3">
          <span>SCALE: 1:50</span>
          <span>·</span>
          <span>AUDIO ENGINE: STATEFUL PROMPT BUS</span>
        </div>
      </div>

      {/* Main 2D Courtroom Canvas Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between gap-5 max-w-4xl mx-auto w-full">
        {/* ============================================================== */}
        {/* 1. TOP ZONE: THE HON'BLE BENCH (Elevated Judicial Dais)         */}
        {/* ============================================================== */}
        <div className="w-full flex flex-col items-center">
          <div
            onClick={() => onSelectSpeaker("judge")}
            className={`w-full max-w-lg rounded-xl border p-4 transition-all duration-200 cursor-pointer shadow-xs ${
              activeSpeaker === "judge"
                ? "bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900 shadow-md"
                : "bg-white/95 border-zinc-300 text-zinc-900 hover:border-zinc-400"
            }`}
          >
            {/* Wooden Dais Step Accent */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/50">
              <div className="flex items-center gap-2">
                <Gavel
                  className={`size-4 ${
                    activeSpeaker === "judge"
                      ? "text-amber-400"
                      : "text-zinc-700"
                  }`}
                />
                <span className="font-serif text-xs tracking-wider uppercase font-semibold">
                  Courtroom No. 3 · Sessions Judge Bench
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {activeSpeaker === "judge" && (
                  <div className="flex items-center gap-1 text-[11px] font-mono bg-zinc-800 text-amber-300 px-2 py-0.5 rounded">
                    {renderAudioWaveform(true)}
                    <span>Speaking</span>
                  </div>
                )}
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono ${
                    activeSpeaker === "judge"
                      ? "border-zinc-700 bg-zinc-800 text-zinc-300"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600"
                  }`}
                >
                  Strict Proceduralist
                </Badge>
              </div>
            </div>

            {/* Judge Details */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`size-9 rounded-full flex items-center justify-center font-serif text-sm font-bold shrink-0 ${
                    activeSpeaker === "judge"
                      ? "bg-zinc-800 text-white border border-zinc-700"
                      : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                  }`}
                >
                  VG
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">
                    {personas.judge?.name || "Hon'ble Justice V. Gopalan"}
                  </div>
                  <div
                    className={`text-[11px] truncate ${
                      activeSpeaker === "judge"
                        ? "text-zinc-300"
                        : "text-zinc-500"
                    }`}
                  >
                    Sessions Court, Greater Mumbai · Coram Bench
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                  activeSpeaker === "judge"
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
                title="View Judge AI Persona & Memory"
              >
                Inspect AI
              </button>
            </div>

            {/* Live Judge State Thought Indicator */}
            <div
              className={`mt-2.5 p-2 rounded text-[11px] font-mono flex items-center gap-1.5 ${
                activeSpeaker === "judge"
                  ? "bg-zinc-800/90 text-zinc-200 border border-zinc-700"
                  : "bg-zinc-50 text-zinc-700 border border-zinc-200"
              }`}
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">
                {personas.judge?.liveThought}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. UPPER-MIDDLE ZONE: CLERK & DIGITAL EVIDENCE TABLE           */}
        {/* ============================================================== */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-lg p-2.5 shadow-2xs flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="size-6 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                <Tv className="size-3.5 text-zinc-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  Active Exhibit on Bench Projection
                </div>
                <div className="font-medium text-zinc-900 truncate text-[11.5px]">
                  {activeExhibit ? (
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-zinc-950">
                        [{activeExhibit.label}]
                      </span>
                      <span>{activeExhibit.name}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-400 italic">
                      No exhibit currently presented to Court
                    </span>
                  )}
                </div>
              </div>
            </div>

            {activeExhibit && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono py-0 px-1.5 bg-zinc-50 border-zinc-300 text-zinc-700"
                >
                  {activeExhibit.admissibility}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearExhibit}
                  className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-900"
                  title="Clear Active Exhibit"
                >
                  <X className="size-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. CENTER ZONE: THE WITNESS BOX (कटघरा / Witness Stand)        */}
        {/* ============================================================== */}
        <div className="w-full flex justify-center">
          <div
            onClick={() => onSelectSpeaker("witness")}
            className={`w-full max-w-sm rounded-xl border p-3.5 transition-all duration-200 cursor-pointer shadow-xs relative ${
              activeSpeaker === "witness"
                ? "bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900 shadow-md"
                : "bg-white border-zinc-300 text-zinc-900 hover:border-zinc-400"
            }`}
          >
            {/* Architectural Katghara / Witness Box Railing Indicator */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/50">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-xs bg-zinc-400" />
                <span className="text-xs font-semibold tracking-wide">
                  Witness Stand (कटघरा)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {activeSpeaker === "witness" && (
                  <div className="flex items-center gap-1 text-[11px] font-mono bg-zinc-800 text-amber-300 px-2 py-0.5 rounded">
                    {renderAudioWaveform(true)}
                    <span>Deposing</span>
                  </div>
                )}
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono ${
                    activeSpeaker === "witness"
                      ? "border-zinc-700 bg-zinc-800 text-zinc-300"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600"
                  }`}
                >
                  Under Oath
                </Badge>
              </div>
            </div>

            {/* Witness Info */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div
                className={`size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  activeSpeaker === "witness"
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                }`}
              >
                RK
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold truncate">
                  {witnessProfile.name}
                </div>
                <div
                  className={`text-[11px] truncate ${
                    activeSpeaker === "witness"
                      ? "text-zinc-300"
                      : "text-zinc-500"
                  }`}
                >
                  PW-1 · Senior Forensic Examiner
                </div>
              </div>
            </div>

            {/* Subtle Stress / Credibility Progress Bar */}
            <div
              className={`p-2 rounded-md ${
                activeSpeaker === "witness" ? "bg-zinc-800" : "bg-zinc-50"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span
                  className={
                    activeSpeaker === "witness"
                      ? "text-zinc-300"
                      : "text-zinc-600"
                  }
                >
                  Witness Composure:
                </span>
                <span
                  className={`font-mono font-bold ${
                    activeSpeaker === "witness"
                      ? "text-amber-300"
                      : "text-zinc-900"
                  }`}
                >
                  {witnessComposure}%
                </span>
              </div>
              <Progress
                value={witnessComposure}
                className="h-1.5 bg-zinc-300 [&>div]:bg-zinc-900"
              />
              <span
                className={`text-[10px] font-mono block mt-1 truncate ${
                  activeSpeaker === "witness"
                    ? "text-zinc-400"
                    : "text-zinc-500"
                }`}
              >
                {witnessComposure < 70
                  ? "Pressured on 105-min custody gap"
                  : "Defending SHA-256 integrity"}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. BOTTOM ZONE: OPPOSING COUNSEL DESKS (Left & Right Split)    */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
          {/* Bottom-Left Desk: Prosecution Table */}
          <div
            onClick={() => onSelectSpeaker("prosecutor")}
            className={`rounded-xl border p-3 transition-all duration-200 cursor-pointer shadow-xs ${
              activeSpeaker === "prosecutor"
                ? "bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900 shadow-md"
                : "bg-white border-zinc-300 text-zinc-900 hover:border-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200/50">
              <div className="flex items-center gap-1.5">
                <Scale
                  className={`size-3.5 ${
                    activeSpeaker === "prosecutor"
                      ? "text-amber-400"
                      : "text-zinc-700"
                  }`}
                />
                <span className="text-xs font-semibold">
                  Prosecution Counsel Table
                </span>
              </div>
              {activeSpeaker === "prosecutor" && (
                <div className="flex items-center gap-1 text-[10px] font-mono bg-zinc-800 text-amber-300 px-1.5 py-0.5 rounded">
                  {renderAudioWaveform(true)}
                  <span>Arguing</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 mb-2">
              <div
                className={`size-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  activeSpeaker === "prosecutor"
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                }`}
              >
                MD
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">
                  Adv. M. Deshpande
                </div>
                <div
                  className={`text-[10.5px] truncate ${
                    activeSpeaker === "prosecutor"
                      ? "text-zinc-300"
                      : "text-zinc-500"
                  }`}
                >
                  Public Prosecutor AI (State of Maharashtra)
                </div>
              </div>
            </div>

            <div
              className={`p-1.5 rounded text-[10.5px] font-mono flex items-center gap-1.5 truncate ${
                activeSpeaker === "prosecutor"
                  ? "bg-zinc-800 text-zinc-300"
                  : "bg-zinc-50 text-zinc-600 border border-zinc-100"
              }`}
            >
              <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
              <span className="truncate">
                Listening for leading questions (Ready to object)
              </span>
            </div>
          </div>

          {/* Bottom-Right Desk: Defense Table (You + Co-Counsel AI) */}
          <div
            onClick={() => onSelectSpeaker("defense")}
            className={`rounded-xl border p-3 transition-all duration-200 cursor-pointer shadow-xs ${
              activeSpeaker === "defense"
                ? "bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900 shadow-md"
                : "bg-white border-zinc-900 text-zinc-900 hover:border-zinc-950"
            }`}
          >
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200/50">
              <div className="flex items-center gap-1.5">
                <Shield
                  className={`size-3.5 ${
                    activeSpeaker === "defense"
                      ? "text-amber-400"
                      : "text-zinc-900"
                  }`}
                />
                <span className="text-xs font-bold">
                  Defense Table (You & Co-Counsel)
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-[10px] font-mono py-0 px-1.5 ${
                  activeSpeaker === "defense"
                    ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                    : "bg-zinc-100 border-zinc-300 text-zinc-800"
                }`}
              >
                Lead Advocate
              </Badge>
            </div>

            <div className="flex items-center gap-2.5 mb-2">
              <div
                className={`size-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  activeSpeaker === "defense"
                    ? "bg-zinc-800 text-white border border-zinc-700"
                    : "bg-zinc-900 text-white"
                }`}
              >
                YOU
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">
                  Adv. Kamal Nayan & Adv. Saathi AI
                </div>
                <div
                  className={`text-[10.5px] truncate ${
                    activeSpeaker === "defense"
                      ? "text-zinc-300"
                      : "text-zinc-500"
                  }`}
                >
                  Defense Counsel · Mumbai Sessions Bar
                </div>
              </div>
            </div>

            <div
              className={`p-1.5 rounded text-[10.5px] font-mono flex items-center gap-1.5 truncate ${
                activeSpeaker === "defense"
                  ? "bg-zinc-800 text-zinc-300"
                  : "bg-zinc-50 text-zinc-600 border border-zinc-100"
              }`}
            >
              <Sparkles className="size-3 text-amber-500 shrink-0" />
              <span className="truncate">
                Co-Counsel active: Section 63(4) challenge queued
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. FLOATING CO-COUNSEL AI POP-UP / SIDE WHISPER                 */}
      {/* ============================================================== */}
      {coCounselEnabled && currentHint && (
        <div className="p-3 sm:p-4 pointer-events-none sticky bottom-0 w-full flex justify-center z-10">
          <div className="w-full max-w-xl pointer-events-auto transition-all duration-200">
            {isCoCounselCollapsed ? (
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsCoCounselCollapsed(false)}
                  className="h-8 gap-1.5 px-3 rounded-full shadow-md bg-[#FFFDF8] border-amber-300 text-amber-950 hover:bg-[#FFF9EE] text-xs font-medium"
                >
                  <Sparkles className="size-3.5 text-amber-600" />
                  <span>💡 Co-Counsel AI ({coCounselHints.length} Hints Ready)</span>
                  <ChevronUp className="size-3.5 text-amber-700 ml-0.5" />
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200/90 bg-[#FFFDF7] p-3.5 shadow-lg text-xs space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-amber-600" />
                    <span className="font-semibold text-zinc-900">
                      💡 Co-Counsel AI Whisper · Real-Time Strategy
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-amber-50 text-amber-900 border-amber-300 font-mono py-0 px-1.5"
                    >
                      {currentHint.badge}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleNextHint}
                      className="text-[10.5px] font-mono text-zinc-500 hover:text-zinc-900 px-1.5 py-0.5 rounded hover:bg-amber-100/50"
                      title="Next hint"
                    >
                      Next ({hintIndex + 1}/{coCounselHints.length}) ➜
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCoCounselCollapsed(true)}
                      className="size-6 p-0 text-zinc-400 hover:text-zinc-900"
                      title="Minimize hint"
                    >
                      <ChevronDown className="size-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-zinc-800 text-[11.5px] leading-relaxed">
                  {currentHint.whisper}
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-100">
                  <Button
                    size="sm"
                    onClick={() => onInsertQuestion(currentHint.suggestedAction)}
                    className="h-7 px-2.5 text-[11px] bg-zinc-900 text-white hover:bg-zinc-800 shadow-2xs font-medium"
                  >
                    <span>Insert Question into Mic/Input ➜</span>
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
                      className="h-7 px-2 text-[11px] border-amber-300 bg-white hover:bg-amber-50 text-amber-950 font-medium"
                    >
                      <span>Cite Arjun Panditrao Precedent</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCoCounselCollapsed(true)}
                    className="h-7 px-2 text-[11px] text-zinc-500 hover:text-zinc-900 ml-auto"
                  >
                    Dismiss
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
