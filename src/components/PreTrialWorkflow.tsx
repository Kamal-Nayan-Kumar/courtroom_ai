"use client";

import React, { useState } from "react";
import {
  Search,
  UploadCloud,
  FileCheck2,
  BrainCircuit,
  Sliders,
  Scale,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

export function PreTrialWorkflow() {
  const [selectedTemperament, setSelectedTemperament] = useState<
    "strict" | "fact-focused" | "inquisitor"
  >("strict");
  const [coachingQuestionIndex, setCoachingQuestionIndex] = useState(0);

  const coachingPrompts = [
    {
      q: "“Did you personally observe the accused near the gate?”",
      coachAdvice: "Coach Witness: Answer strictly on what you saw, do not speculate on vehicle color.",
      resilience: "Resilience Score: 94%",
    },
    {
      q: "“Isn’t it true the lighting at 11:30 PM was completely pitch black?”",
      coachAdvice: "Coach Witness: Point to the municipal street lamp marked in Panchnama Exhibit 4.",
      resilience: "Resilience Score: 88%",
    },
    {
      q: "“Why did you wait 48 hours to inform the investigating officer?”",
      coachAdvice: "Coach Witness: Explain medical treatment timeline with hospital OPD slip.",
      resilience: "Resilience Score: 91%",
    },
  ];

  return (
    <section id="workflow" className="py-16 sm:py-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono-code font-medium mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Pre-Trial Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Before You Argue: The 3-Step Preparation Engine
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Great trial advocacy is won before the gavel ever drops. Parse complex briefs,
            adversarially stress-test your witnesses, and calibrate your bench strategy.
          </p>
        </div>

        {/* 3-Step Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Deep Case Research & Brief Builder */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-900 mb-5 group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code uppercase font-semibold text-blue-900 tracking-wider">
                Step 01 · Intelligence
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-1.5 mb-2.5">
                Deep Case Research & Brief Builder
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Search landmark Indian cases across Supreme Court and High Courts or upload your own
                moot memorial PDF. Our parser auto-extracts chronologies, procedural loopholes,
                and applicable BNS/BNSS/BSA sections.
              </p>

              {/* Interactive Mini-Widget */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-2.5 font-mono-code">
                <div className="flex items-center justify-between text-zinc-500 text-[11px]">
                  <span>BRIEF PARSER</span>
                  <span className="text-emerald-700 font-semibold">● 100% Extracted</span>
                </div>
                <div className="p-2 rounded bg-white border border-zinc-200 text-zinc-800 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Crl. Appeal 402/2026_Brief_Final.pdf</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-white p-2 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">Precedents</span>
                    <span className="font-bold text-zinc-900">14 SC Rulings</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">Loopholes Flagged</span>
                    <span className="font-bold text-amber-700">3 Panchnama Gaps</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-medium text-zinc-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Full mapping between IPC and BNS equivalents</span>
            </div>
          </div>

          {/* Card 2: Adversarial Witness Coaching */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 mb-5 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code uppercase font-semibold text-amber-800 tracking-wider">
                Step 02 · Simulation Lab
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-1.5 mb-2.5">
                Adversarial Witness Coaching
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Assign roles to your Witness AI and run stress-tests before trial. The engine
                generates aggressive cross-examination traps, measuring how well your witness
                sticks to deposition facts under hostile fire.
              </p>

              {/* Interactive Coaching Prompt Card */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-950 uppercase tracking-wide">
                    Live Stress-Test #{coachingQuestionIndex + 1}
                  </span>
                  <button
                    onClick={() =>
                      setCoachingQuestionIndex(
                        (prev) => (prev + 1) % coachingPrompts.length
                      )
                    }
                    className="text-amber-800 font-semibold underline text-[10.5px] hover:text-amber-950"
                  >
                    Next Trap &rarr;
                  </button>
                </div>
                <p className="text-zinc-900 font-serif italic text-xs leading-snug">
                  {coachingPrompts[coachingQuestionIndex].q}
                </p>
                <div className="p-2 rounded bg-white/90 border border-amber-200/70 text-[11px] text-zinc-700">
                  {coachingPrompts[coachingQuestionIndex].coachAdvice}
                </div>
                <div className="flex items-center justify-between text-[10.5px] font-mono-code text-zinc-500 pt-1">
                  <span>Hostility: Level 4/5</span>
                  <span className="text-emerald-700 font-bold">
                    {coachingPrompts[coachingQuestionIndex].resilience}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-medium text-zinc-700">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Prevents witness perjury &amp; Section 145 BSA impeachment</span>
            </div>
          </div>

          {/* Card 3: Role Selection & Strategy */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-5 group-hover:scale-105 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono-code uppercase font-semibold text-zinc-700 tracking-wider">
                Step 03 · Execution
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-1.5 mb-2.5">
                Role Selection &amp; Bench Calibration
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                Choose to argue as Public Prosecutor or Defense Counsel. Configure the Judge AI’s
                temperament and strictness to match specific trial environments or appellate benches.
              </p>

              {/* Interactive Bench Temperament Selector */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-3">
                <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Select Judge AI Temperament
                </div>
                <div className="space-y-1.5">
                  {[
                    {
                      id: "strict",
                      name: "Strict Constitutionalist",
                      desc: "Demands precise Article & statutory citations; zero tolerance for hearsay.",
                    },
                    {
                      id: "fact-focused",
                      name: "Fact-Focused Trial Judge",
                      desc: "Interrogates Panchnama dates, seizure logs, and forensic chain.",
                    },
                    {
                      id: "inquisitor",
                      name: "Active Bench Inquisitor",
                      desc: "Constantly interrupts arguments with counter-factual scenarios.",
                    },
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      onClick={() =>
                        setSelectedTemperament(
                          temp.id as "strict" | "fact-focused" | "inquisitor"
                        )
                      }
                      className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                        selectedTemperament === temp.id
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-xs"
                          : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className="font-semibold text-xs">{temp.name}</div>
                      <div
                        className={`text-[10.5px] mt-0.5 leading-tight ${
                          selectedTemperament === temp.id ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {temp.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-zinc-900">
              <span>Ready to enter courtroom</span>
              <a
                href="#simulation"
                className="inline-flex items-center gap-1 text-blue-900 hover:underline"
              >
                <span>Launch Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
