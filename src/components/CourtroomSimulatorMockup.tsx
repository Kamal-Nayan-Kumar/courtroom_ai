"use client";

import React, { useState, useEffect } from "react";
import {
  Gavel,
  Shield,
  FileText,
  Volume2,
  Clock,
  Send,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Check,
  ChevronRight,
  Maximize2,
  Minus,
  Sparkles,
  RefreshCw,
  Scale,
  Mic,
} from "lucide-react";
import {
  DEFAULT_CASE_FILE,
  INITIAL_TRANSCRIPTS,
  SAMPLE_HINTS,
} from "../data/courtroomData";
import { TranscriptMessage, UserRole } from "../types/courtroom";

export function CourtroomSimulatorMockup() {
  const [role, setRole] = useState<UserRole>("defense");
  const [activeLeftTab, setActiveLeftTab] = useState<"fir" | "exhibits" | "witness">("fir");
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>(INITIAL_TRANSCRIPTS.defense);
  const [inputText, setInputText] = useState("");
  const [activeHint, setActiveHint] = useState(SAMPLE_HINTS.defense);
  const [seconds, setSeconds] = useState(862); // 14 mins 22 secs
  const [isJudgeSpeaking, setIsJudgeSpeaking] = useState(false);
  const [judgeReaction, setJudgeReaction] = useState<string | null>(null);
  const [checklist, setChecklist] = useState(DEFAULT_CASE_FILE.prepChecklist);
  const [mobilePaneTab, setMobilePaneTab] = useState<"brief" | "courtroom" | "transcript">("courtroom");

  // Live trial clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `00:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Switch role between Defense and Prosecution
  const handleRoleToggle = () => {
    const nextRole: UserRole = role === "defense" ? "prosecution" : "defense";
    setRole(nextRole);
    setTranscripts(INITIAL_TRANSCRIPTS[nextRole]);
    setActiveHint(SAMPLE_HINTS[nextRole]);
    setJudgeReaction(null);
  };

  // Co-Counsel "Use Argument" button handler
  const handleApplyCoCounselHint = () => {
    setInputText(activeHint.suggestedArgument);
  };

  // Submit Argument or Question to Court
  const handleSendArgument = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: TranscriptMessage = {
      id: `usr-${Date.now()}`,
      speaker: role === "defense" ? "Defense Counsel (You)" : "Prosecutor AI",
      speakerRole: role === "defense" ? "defense" : "prosecutor",
      content: inputText,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      citation: activeHint.statuteCitation,
    };

    setTranscripts((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate Bench response after 1 second
    setIsJudgeSpeaking(true);
    setJudgeReaction("Evaluating counsel's proposition under BSA Sec 63...");

    setTimeout(() => {
      const benchRulings = [
        "Noted, Counsel. The prosecution must produce the contemporaneous sealing diary before lunch recess.",
        "Objection noted. PW-1 is directed to answer specifically whether the hash log was signed by the Magistrate.",
        "Counsel's submission under Section 105 BNSS is taken on record. Proceed to your next anchor.",
      ];
      const randomRuling = benchRulings[Math.floor(Math.random() * benchRulings.length)];

      const judgeMsg: TranscriptMessage = {
        id: `judge-${Date.now()}`,
        speaker: "Judge AI",
        speakerRole: "judge",
        content: randomRuling,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        citation: "Ruling: Coram Justice S. K. Deshmukh",
      };

      setTranscripts((prev) => [...prev, judgeMsg]);
      setIsJudgeSpeaking(false);
      setJudgeReaction(null);
    }, 1400);
  };

  // Instant Objection Trigger
  const handleRaiseObjection = () => {
    const objectionText = role === "defense"
      ? "Objection, My Lord! The Prosecutor is leading the witness on secondary digital evidence without establishing primary non-availability under Sec 63(2) BSA."
      : "Objection, My Lord! Learned Defense Counsel is impeaching the witness on matters beyond the charge sheet annexures.";

    setInputText(objectionText);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <section id="simulation" className="py-12 sm:py-16 bg-white border-y border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-sans font-medium mb-2.5">
              <Scale className="w-3.5 h-3.5" />
              <span>Interactive Session Prototype</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              The 3-Pane Indian Courtroom Simulator
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 mt-1 max-w-xl">
              Experience proactive agents reacting in real-time. Switch roles, audit case exhibits,
              and receive tactical BNS/BSA citations from your Co-Counsel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-medium hidden sm:inline">
              Simulated Role:
            </span>
            <button
              onClick={handleRoleToggle}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 shadow-2xs transition-all hover:border-zinc-400"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
              <span>
                Switch to {role === "defense" ? "Public Prosecutor" : "Defense Counsel"}
              </span>
            </button>
          </div>
        </div>

        {/* Browser Shell / Courtroom Window */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="bg-zinc-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs border-b border-zinc-800">
            {/* Left Window Dots & Case Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="h-4 w-px bg-zinc-700 hidden sm:block" />
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-white tracking-tight">
                  {DEFAULT_CASE_FILE.caseNumber}
                </span>
                <span className="text-zinc-400 hidden sm:inline">·</span>
                <span className="text-zinc-200 truncate max-w-xs font-medium">
                  {DEFAULT_CASE_FILE.title}
                </span>
              </div>
            </div>

            {/* Right Status Controls */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-100 font-mono text-[11px]">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{formatTimer(seconds)}</span>
              </div>

              <div
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                  role === "defense"
                    ? "bg-amber-400 text-zinc-950 border-amber-300 shadow-2xs"
                    : "bg-blue-400 text-zinc-950 border-blue-300 shadow-2xs"
                }`}
              >
                <Shield className="w-3 h-3 text-zinc-950" />
                <span>
                  {role === "defense" ? "Defense Counsel" : "Public Prosecutor"}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Pane Switcher (Visible only below lg) */}
          <div className="lg:hidden flex items-center bg-zinc-100 p-1.5 border-b border-zinc-200 text-xs font-medium">
            <button
              onClick={() => setMobilePaneTab("brief")}
              className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                mobilePaneTab === "brief"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Case Brief
            </button>
            <button
              onClick={() => setMobilePaneTab("courtroom")}
              className={`flex-1 py-1.5 rounded-md text-center transition-all flex items-center justify-center gap-1.5 ${
                mobilePaneTab === "courtroom"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>2D Courtroom</span>
            </button>
            <button
              onClick={() => setMobilePaneTab("transcript")}
              className={`flex-1 py-1.5 rounded-md text-center transition-all ${
                mobilePaneTab === "transcript"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Live Transcript
            </button>
          </div>

          {/* 3-Pane Body Grid, fixed height so transcripts scroll inside instead of stretching the window */}
          <div className="grid grid-cols-1 lg:grid-cols-12 h-auto lg:h-[660px] divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 max-h-[660px]">
            {/* LEFT PANE: Case File & Prep, fixed height with internal scroll */}
            <div
              className={`${
                mobilePaneTab === "brief" ? "flex" : "hidden"
              } lg:flex lg:col-span-3 bg-zinc-50/50 flex-col p-4 text-xs min-h-0 lg:h-full lg:max-h-[660px] overflow-hidden`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-900 uppercase tracking-wider text-[11px]">
                  <FileText className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Case Brief & Prep</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono-code">
                  Court No. 3
                </span>
              </div>

              {/* Sub-tabs */}
              <div className="flex rounded-md bg-zinc-200/70 p-0.5 mt-3 text-[11px] font-medium text-zinc-600">
                <button
                  onClick={() => setActiveLeftTab("fir")}
                  className={`flex-1 py-1 rounded text-center transition-all ${
                    activeLeftTab === "fir"
                      ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                      : "hover:text-zinc-950"
                  }`}
                >
                  FIR & Facts
                </button>
                <button
                  onClick={() => setActiveLeftTab("exhibits")}
                  className={`flex-1 py-1 rounded text-center transition-all ${
                    activeLeftTab === "exhibits"
                      ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                      : "hover:text-zinc-950"
                  }`}
                >
                  Exhibits (3)
                </button>
                <button
                  onClick={() => setActiveLeftTab("witness")}
                  className={`flex-1 py-1 rounded text-center transition-all ${
                    activeLeftTab === "witness"
                      ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                      : "hover:text-zinc-950"
                  }`}
                >
                  PW-1 Brief
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-3">
                {activeLeftTab === "fir" && (
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg bg-white border border-zinc-200 shadow-2xs">
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">
                        FIR Narrative
                      </p>
                      <p className="text-zinc-700 leading-relaxed text-[11.5px]">
                        {DEFAULT_CASE_FILE.firSnippet}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">
                        Statutory Sections
                      </p>
                      <div className="space-y-1.5">
                        {DEFAULT_CASE_FILE.sections.map((sec) => (
                          <div
                            key={sec.section}
                            className={`p-2 rounded border text-[11px] font-mono-code ${sec.badgeColor}`}
                          >
                            <span className="font-bold">{sec.code} {sec.section}</span>:{" "}
                            <span className="font-sans text-[11px] text-zinc-700">
                              {sec.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">
                        Pre-Trial Checklist
                      </p>
                      <div className="space-y-1.5">
                        {checklist.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => toggleChecklistItem(item.id)}
                            className="w-full flex items-start gap-2 p-1.5 rounded hover:bg-zinc-100 text-left transition-colors"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center border ${
                                item.done
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "border-zinc-300 bg-white"
                              }`}
                            >
                              {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span
                              className={`text-[11px] leading-tight ${
                                item.done
                                  ? "line-through text-zinc-400"
                                  : "text-zinc-700"
                              }`}
                            >
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === "exhibits" && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">
                      Marked Trial Exhibits
                    </p>
                    {DEFAULT_CASE_FILE.exhibits.map((ex) => (
                      <div
                        key={ex.id}
                        className="p-2.5 rounded-lg bg-white border border-zinc-200 shadow-2xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 font-mono-code text-[11px]">
                            {ex.id}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              ex.admissibility === "Contested"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {ex.admissibility}
                          </span>
                        </div>
                        <p className="font-medium text-zinc-800 text-[11.5px]">{ex.name}</p>
                        <p className="text-[10.5px] text-zinc-500 font-mono-code">
                          {ex.bnaCitation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeLeftTab === "witness" && (
                  <div className="space-y-3">
                    <div className="p-2.5 rounded-lg bg-white border border-zinc-200 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-950 text-xs">
                          {DEFAULT_CASE_FILE.witnessBrief.witnessName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-medium">
                          Expert Witness
                        </span>
                      </div>
                      <p className="text-zinc-600 text-[11px]">
                        {DEFAULT_CASE_FILE.witnessBrief.designation}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80">
                      <p className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                        Pre-deposition Vulnerability
                      </p>
                      <p className="text-zinc-700 text-[11px] leading-relaxed">
                        {DEFAULT_CASE_FILE.witnessBrief.keyTestimony}
                      </p>
                      <div className="mt-2 text-[10.5px] font-semibold text-red-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{DEFAULT_CASE_FILE.witnessBrief.prepRiskScore}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CENTER PANE: 2D Indian Courtroom Schematic, fixed height, neat and clean */}
            <div
              className={`${
                mobilePaneTab === "courtroom" ? "flex" : "hidden"
              } lg:flex lg:col-span-5 bg-zinc-50 p-4 flex-col relative overflow-hidden min-h-0 lg:h-full lg:max-h-[660px]`}
            >
              {/* Bench Header / 2D Layout Title */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80">
                <div className="flex items-center gap-1.5 text-zinc-700 text-xs font-semibold">
                  <Gavel className="w-3.5 h-3.5 text-amber-700" />
                  <span>Hon&apos;ble Bench · Sessions Court No. 3</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono-code">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time Audio Stream</span>
                </div>
              </div>

              {/* 2D Architectural Schematic Canvas, scrolls internally so the pane never grows */}
              <div className="flex-1 py-3 space-y-3 overflow-y-auto min-h-0 pr-0.5">
                {/* 1. Elevated Judge Bench, static header pill above the card so nothing overlaps */}
                <div className="mx-auto max-w-xs text-center">
                  <div className="inline-block px-3 py-1 rounded-full bg-zinc-900 text-amber-300 text-[11px] font-bold tracking-wider uppercase border border-zinc-700 mb-2">
                    Hon&apos;ble Judge Bench
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-zinc-300 shadow-xs text-center transition-all">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
                        J
                      </div>
                      {isJudgeSpeaking && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-zinc-950">
                        Justice S. K. Deshmukh
                      </p>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-amber-600" />
                        <span>{isJudgeSpeaking ? "Ruling on submission..." : "Listening intently..."}</span>
                      </p>
                    </div>
                  </div>

                  {judgeReaction && (
                    <div className="mt-2 text-xs font-mono bg-amber-50 text-amber-900 p-2 rounded-md border border-amber-200">
                      {judgeReaction}
                    </div>
                  )}
                  </div>
                </div>

                {/* Gavel Connector Lines (Subtle Courtroom Floor Markings) */}
                <div className="flex justify-center items-center gap-8 text-xs text-zinc-400 font-mono">
                  <div className="h-4 w-px bg-zinc-300" />
                  <span>[ TRIAL FLOOR · BAR AREA ]</span>
                  <div className="h-4 w-px bg-zinc-300" />
                </div>

                {/* 2. Witness Box ( कटघरा ) - Middle Center */}
                <div className="mx-auto max-w-sm p-3.5 rounded-xl bg-white border border-zinc-300 shadow-xs text-center relative group">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                      कटघरा · Witness Box
                    </span>
                    <span className="text-sm font-bold text-zinc-900">
                      PW-1: Dr. N. Kulkarni
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    Senior Cyber Forensic Examiner · Under Cross-Examination
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-medium border border-red-200/70">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Conceded hash delay discrepancy</span>
                  </div>
                </div>

                {/* 3. Counsel Desks: Prosecution (Left) vs Defense (Right) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {/* Prosecution Desk */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all ${
                      role === "prosecution"
                        ? "bg-blue-50/90 border-blue-900 ring-2 ring-blue-900/20 shadow-md"
                        : "bg-white border-zinc-200 opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-950">
                        Prosecution Desk
                      </span>
                      {role === "prosecution" ? (
                        <span className="px-2 py-0.5 rounded bg-blue-900 text-white text-xs font-bold">
                          YOU
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-xs font-semibold">
                          AI AGENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-zinc-950">
                      Public Prosecutor Salve
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Arguing electronic custody chain
                    </p>
                  </div>

                  {/* Defense Desk */}
                  <div
                    className={`p-3.5 rounded-xl border transition-all ${
                      role === "defense"
                        ? "bg-amber-50/90 border-amber-600 ring-2 ring-amber-500/20 shadow-md"
                        : "bg-white border-zinc-200 opacity-80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                        Defense Desk
                      </span>
                      {role === "defense" ? (
                        <span className="px-2 py-0.5 rounded bg-amber-600 text-white text-xs font-bold">
                          YOU
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-xs font-semibold">
                          AI AGENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-zinc-950">
                      Defense Advocate (You)
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      Challenging 63(4) BSA certificate
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Co-Counsel AI Pop-up Card */}
              <div className="mt-3 p-3.5 rounded-xl border border-amber-300 bg-amber-50/95 shadow-sm text-xs relative backdrop-blur-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span className="font-bold text-amber-950 text-xs uppercase tracking-wide">
                      Co-Counsel AI Whisper · Adv. Saathi
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-950 text-xs font-mono font-semibold">
                    {activeHint.statuteCitation}
                  </span>
                </div>

                <p className="text-zinc-800 text-xs mt-2 leading-relaxed">
                  {activeHint.hint}
                </p>

                <div className="mt-2.5 pt-2 border-t border-amber-200/70 flex items-center justify-between gap-2">
                  <span className="text-xs text-amber-950 font-medium truncate max-w-[240px]">
                    Recommendation: Impeach hash integrity
                  </span>
                  <button
                    onClick={handleApplyCoCounselHint}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-2xs transition-colors shrink-0"
                  >
                    <span>Use Argument</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PANE: Live Streaming Multi-Agent Transcript, fixed height with internal scroll */}
            <div
              className={`${
                mobilePaneTab === "transcript" ? "flex" : "hidden"
              } lg:flex lg:col-span-4 bg-white flex-col p-4 text-xs h-full min-h-0 lg:max-h-[660px] overflow-hidden`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div className="flex items-center gap-1.5 font-semibold text-zinc-950">
                  <Volume2 className="w-3.5 h-3.5 text-blue-900" />
                  <span>Live Trial Transcript</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono-code font-medium">
                  Streaming Active
                </span>
              </div>

              {/* Chat Stream Area — scrolls inside the fixed-height pane instead of stretching it */}
              <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3 min-h-0">
                {transcripts.map((msg) => {
                  const isJudge = msg.speakerRole === "judge";
                  const isUser = msg.speakerRole === role;
                  const isPros = msg.speakerRole === "prosecutor";
                  const isWitness = msg.speakerRole === "witness";

                  return (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-lg border text-xs transition-all ${
                        isJudge
                          ? "bg-amber-50/70 border-amber-300/80 text-zinc-950 border-l-4 border-l-amber-600 shadow-2xs"
                          : isUser
                          ? "bg-amber-50/50 border-amber-200 text-zinc-900"
                          : isPros
                          ? "bg-blue-50/60 border-blue-200 text-zinc-900"
                          : "bg-zinc-50 border-zinc-200 text-zinc-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-semibold text-xs ${
                              isJudge ? "text-amber-900 font-bold" : "text-zinc-950"
                            }`}
                          >
                            [{msg.speaker}]
                          </span>
                          {msg.citation && (
                            <span
                              className={`text-xs font-mono ${
                                isJudge ? "text-amber-800/80" : "text-zinc-500"
                              }`}
                            >
                              · {msg.citation}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-mono ${
                            isJudge ? "text-amber-800/70" : "text-zinc-400"
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      <p
                        className={`text-[11.5px] leading-relaxed ${
                          isJudge ? "text-zinc-900 font-medium" : "text-zinc-800"
                        }`}
                      >
                        {msg.content}
                      </p>

                      {msg.isObjectionable && !isUser && (
                        <div className="mt-2 pt-1.5 border-t border-blue-200/60 flex items-center justify-between">
                          <span className="text-[10px] text-blue-800 font-medium">
                            Potential evidentiary ground detected
                          </span>
                          <button
                            onClick={handleRaiseObjection}
                            className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold shadow-2xs transition-colors"
                          >
                            Objection!
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar & Quick Triggers pinned to bottom */}
              <div className="mt-auto pt-3 border-t border-zinc-200 space-y-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleRaiseObjection}
                    className="flex-1 py-1 px-2 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold text-center transition-colors flex items-center justify-center gap-1"
                  >
                    <AlertCircle className="size-3 text-red-600 shrink-0" />
                    <span>Raise Objection</span>
                  </button>
                  <button
                    onClick={() =>
                      setInputText(
                        "Dr. Kulkarni, did you personally inspect the physical DVR before running SHA-256 in the lab?"
                      )
                    }
                    className="flex-1 py-1 px-2 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800 text-[10.5px] font-medium text-center transition-colors"
                  >
                    Examine PW-1
                  </button>
                </div>

                {/* Input Bar Form */}
                <form onSubmit={handleSendArgument} className="relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Address the Hon'ble Bench or examine witness..."
                    className="w-full pl-3 pr-16 py-2 rounded-lg border border-zinc-300 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950 focus:bg-white transition-all font-sans"
                  />
                  <div className="absolute right-1 flex items-center gap-1">
                    <button
                      type="button"
                      title="Simulate Voice Input"
                      onClick={() => setInputText(activeHint.suggestedArgument)}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/60"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-1.5 rounded-md bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white transition-colors"
                      title="Submit Argument"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>
                <p className="text-xs text-zinc-500 text-center font-sans">
                  Press Enter to submit · Agents evaluate admissibility in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
