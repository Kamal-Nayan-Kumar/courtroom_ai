"use client";

import React, { useState } from "react";
import { GraduationCap, Briefcase, CheckCircle, Scale, Sparkles, BookOpen } from "lucide-react";

export function BenefitsSection() {
  const [activeTab, setActiveTab] = useState<"students" | "lawyers">("students");

  const studentBenefits = [
    {
      title: "Conquer Courtroom Stage Fright",
      description:
        "Speak your arguments out loud before facing a live mock trial panel. Build instinctive confidence in addressing the Hon'ble Bench without freezing.",
      stat: "94% felt more poised in actual moots",
    },
    {
      title: "Stress-Test Your Moot Memorial",
      description:
        "Upload your memorial problem. The AI Judge Bench fires sharp constitutional and procedural counter-questions targeted directly at your weakest submissions.",
      stat: "Uncovers 3x more loopholes than self-reading",
    },
    {
      title: "Hands-on BNS / BNSS / BSA Mastery",
      description:
        "Bridge the gap between older textbook IPC/CrPC sections and newly enacted criminal statutes through interactive practical drills.",
      stat: "100% mapped statutory cross-references",
    },
    {
      title: "Instant Scoring & Decorum Breakdown",
      description:
        "Receive immediate numeric grading on citation precision, voice clarity, procedural decorum, and objection validity.",
      stat: "Detailed rubrics matching Bar Council standards",
    },
  ];

  const lawyerBenefits = [
    {
      title: "Dry-Run High-Stakes Bail & Interim Hearings",
      description:
        "Rehearse your twin-condition arguments under PMLA Sec 45 or anticipatory bail under BNSS Sec 482 before stepping into Sessions or High Court.",
      stat: "Pre-empt 85% of bench objections",
    },
    {
      title: "Expose Contradictions Before Hostile Cross-Exam",
      description:
        "Put your witness or the prosecution's star witness through rigorous adversarial cross-examination to find hidden timeline discrepancies.",
      stat: "Stress-tested across 5 hostility tiers",
    },
    {
      title: "Audit Digital Evidence Admissibility",
      description:
        "Master Section 63 BSA certificate compliance for call detail records, WhatsApp chats, and CCTV footage before trial marking.",
      stat: "Zero-defect evidentiary verification",
    },
    {
      title: "Senior Counsel Simulation for Chamber Juniors",
      description:
        "Empower junior associates and interns in your chamber to run case briefs independently, training them on trial strategy in record time.",
      stat: "Reduces senior prep review by 60%",
    },
  ];

  const currentList = activeTab === "students" ? studentBenefits : lawyerBenefits;

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-mono-code font-medium mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Targeted Value Proposition</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Engineered for India&apos;s Next Generation of Advocates
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Whether you are drafting your first moot memorial at an NLU or preparing for a bail hearing
            at the High Court, Courtroom AI sharpens your advocacy edge.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-100 border border-zinc-200 mt-8">
            <button
              onClick={() => setActiveTab("students")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "students"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-900" />
              <span>For Law Students &amp; Mooters</span>
            </button>
            <button
              onClick={() => setActiveTab("lawyers")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "lawyers"
                  ? "bg-white text-zinc-950 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-700" />
              <span>For Junior &amp; Chamber Advocates</span>
            </button>
          </div>
        </div>

        {/* 4-Card Grid for Active Tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentList.map((item, index) => (
            <div
              key={item.title}
              className="p-6 sm:p-7 rounded-2xl bg-[#FAFAFA] border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="w-7 h-7 rounded-lg bg-zinc-200 text-zinc-800 text-xs font-mono-code font-bold flex items-center justify-center">
                    0{index + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-zinc-200 text-emerald-800 text-[11px] font-mono-code font-medium">
                    {item.stat}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200/80 flex items-center gap-2 text-xs font-semibold text-zinc-800">
                <CheckCircle className="w-3.5 h-3.5 text-blue-900" />
                <span>Verified in Indian courtroom scenarios</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
