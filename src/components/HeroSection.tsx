"use client";

import React from "react";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  const institutionalPillars = [
    "NLSIU Bengaluru",
    "NALSAR Hyderabad",
    "WBNUJS Kolkata",
    "NLU Delhi",
    "Campus Law Centre (DU)",
    "ILC Symbiosis",
  ];

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gradient-to-b from-amber-50/40 via-blue-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative text-center">
        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/90 shadow-xs mb-6 sm:mb-8 hover:border-amber-300 transition-colors cursor-pointer group">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-100 group-hover:scale-110 transition-transform" />
          <span className="text-[12px] sm:text-[13px] font-medium text-zinc-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 inline" />
            <span>Introducing Adalat 1.0</span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-600 font-normal">
              Proactive Multi-Agent Moot & Trial Simulator
            </span>
          </span>
          <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.12]">
          Master the{" "}
          <span className="font-editorial italic font-normal text-blue-950 underline decoration-amber-400/50 decoration-wavy decoration-1 underline-offset-8">
            Indian Courtroom
          </span>{" "}
          Before You Step Inside.
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Practice real-world trials and moot memorials against proactive Judge, Opposing Counsel,
          and Witness AIs. Research precedents, coach witnesses, and argue live with a real-time
          Co-Counsel AI by your side.
        </p>

        {/* CTA Group */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <a
            href="#simulation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <span>Start Free Trial Case</span>
            <ArrowRight className="w-4 h-4 text-zinc-300" />
          </a>

          <a
            href="#workflow"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white hover:bg-zinc-50 text-zinc-800 font-medium text-sm border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-all"
          >
            <BookOpen className="w-4 h-4 text-zinc-500" />
            <span>Explore Public Cases (BNS / IPC)</span>
          </a>
        </div>

        {/* Trust Badges & Law Schools */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-200/80">
          <p className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-4">
            Built for Law Students (NLUs & Law Colleges), Moot Court Societies & Junior Advocates across India
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-zinc-600 font-medium">
            {institutionalPillars.map((institution) => (
              <div
                key={institution}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-zinc-200/60 shadow-2xs hover:border-zinc-300 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-900/70" />
                <span>{institution}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
