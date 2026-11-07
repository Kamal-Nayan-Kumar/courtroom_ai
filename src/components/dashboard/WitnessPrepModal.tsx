"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function WitnessPrepModal() {
  const { isWitnessModalOpen, setIsWitnessModalOpen, showNotification } = useDashboard();
  const [stressScore, setStressScore] = useState(84);
  const [coachingRuleApplied, setCoachingRuleApplied] = useState(false);

  const trapQuestions = [
    {
      q: "“Dr. Kulkarni, did you personally verify the physical seal on the DVR optical drive when you took custody at 11:00 AM on 14th August?”",
      trap: "Opponent aims to establish non-compliance with BNSS Sec 105 videography & spot seal rules.",
    },
    {
      q: "“Can you confirm why the SHA-256 mathematical hash was computed 48 hours after seizure rather than immediately upon arrival?”",
      trap: "Impeachment under Arjun Panditrao Khotkar (2020) threshold for electronic record integrity.",
    },
    {
      q: "“Who had key access to the forensic evidence locker during the intervening weekend?”",
      trap: "Attempts to induce speculation or admissions regarding unsealed storage custody.",
    },
  ];

  const handleApplyCoaching = () => {
    setCoachingRuleApplied(true);
    setStressScore(94);
    showNotification("Coaching boundary applied: Witness will deflect custody questions to IO.");
  };

  return (
    <Dialog open={isWitnessModalOpen} onOpenChange={setIsWitnessModalOpen}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-white border-zinc-200 shadow-xl">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-purple-900 text-white flex items-center justify-center font-bold">
                <Users className="size-4 text-purple-200" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
                  Adversarial Witness Coaching Lab
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Pre-Trial Stress Test · Witness PW-1: Dr. N. Kulkarni (Forensic Examiner)
                </DialogDescription>
              </div>
            </div>

            <Badge variant="outline" className="text-xs font-mono bg-rose-50 text-rose-800 border-rose-200">
              Vulnerability: High
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[64vh] overflow-y-auto flex flex-col gap-4">
          {/* Witness Profile Summary */}
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                PW-1
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-950">Dr. N. Kulkarni</div>
                <div className="text-[11px] text-zinc-500">
                  Senior Cyber Forensic Examiner, State Forensic Science Laboratory
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 font-mono">Composure Index</span>
              <div className="text-sm font-bold font-mono text-zinc-900">{stressScore}%</div>
            </div>
          </div>

          {/* Opposing Counsel Trap Matrix */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <AlertTriangle className="size-3.5 text-amber-600" />
              <span>Opposing Counsel AI Identified Vulnerabilities (4 Traps):</span>
            </label>

            <div className="flex flex-col gap-2">
              {trapQuestions.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-amber-200/80 bg-amber-50/40 flex flex-col gap-1 text-xs"
                >
                  <p className="font-serif italic text-zinc-950 font-medium">{t.q}</p>
                  <p className="text-[11px] text-amber-900 font-sans">{t.trap}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Coaching Guardrails */}
          <div className="p-3.5 rounded-xl border border-zinc-200 bg-white flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900">Coaching Guardrails:</span>
              {coachingRuleApplied ? (
                <Badge className="bg-emerald-700 text-white text-[10px]">
                  Applied to Witness Engine
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-zinc-500">
                  Pending
                </Badge>
              )}
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              &quot;Advise PW-1 to affirm only the technical hash calculations, and clearly testify that transit custody and station malkhana seals fall under the investigating police officer&apos;s panchnama.&quot;
            </p>
            {!coachingRuleApplied && (
              <Button
                size="sm"
                onClick={handleApplyCoaching}
                className="mt-1 h-7 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
              >
                Apply Guardrail & Lock Composure
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Targeting BSA Sec 63(4) Cross-Examination</span>
          <Button
            size="sm"
            onClick={() => setIsWitnessModalOpen(false)}
            className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
          >
            Done Coaching
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
