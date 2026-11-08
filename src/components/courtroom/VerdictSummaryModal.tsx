"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gavel,
  CheckCircle2,
  Award,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

interface VerdictSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  witnessComposure: number;
}

export function VerdictSummaryModal({
  isOpen,
  onClose,
  witnessComposure,
}: VerdictSummaryModalProps) {
  const isExcluded = witnessComposure <= 65;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-6 border-zinc-200 shadow-2xl select-none">
        <DialogHeader className="pb-3 border-b border-zinc-100 pr-10">
          <div className="flex items-start gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shrink-0">
              <Gavel className="size-5 text-amber-400" />
            </div>
            <div className="min-w-0 pr-4">
              <DialogTitle className="text-sm sm:text-base font-bold text-zinc-950 font-serif tracking-wide leading-tight break-words whitespace-normal">
                Sessions Court · Interlocutory Appraisal
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 font-mono mt-0.5 break-words whitespace-normal">
                Coram: Hon&apos;ble Justice V. Gopalan · CRL.A. 402/2026
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-xs">
          {/* Ruling Banner */}
          <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/70 text-emerald-950 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
                <ShieldCheck className="size-4 text-emerald-700" />
                <span>Bench Ruling on Admissibility</span>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-100 border-emerald-400 text-emerald-900 font-mono text-[10px]"
              >
                Motion Granted
              </Badge>
            </div>
            <p className="text-[11.5px] leading-relaxed font-medium">
              Exhibit A (CCTV Footage) is rendered <strong className="font-bold underline">INADMISSIBLE</strong> under Section 63(4) BSA. Prosecution failed to establish contemporaneous hash certification or explain the 105-minute transit gap.
            </p>
          </div>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Bench Conviction Score
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                9.2 / 10
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                Top 3% of advocates
              </span>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Witness Impeachment
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                {100 - witnessComposure}%
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                PW-1 rattled on hash
              </span>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Statutory Precision
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                98%
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                Arjun Panditrao cited
              </span>
            </div>
          </div>

          {/* Detailed Judicial Assessment */}
          <div className="space-y-2 p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50">
            <div className="font-semibold text-zinc-900 text-xs">
              Hon&apos;ble Bench Strategic Observations:
            </div>
            <div className="space-y-1.5 text-[11px] text-zinc-700">
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Decisive Cross-Examination:</strong> Questioning PW-1 on the 105-minute gap between physical seizure and inward registration broke the chain of custody.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Timely Precedent Reliance:</strong> Invoking <em>Arjun Panditrao (2020)</em> directly foreclosed the Public Prosecutor&apos;s reliance on secondary hash validity.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <CheckCircle2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Next Phase Recommendation:</strong> In Stage 3 (Defense Evidence), produce DW-1 to authenticate the 23:52 HRS UPI receipt under Section 11 BSA to complete the alibi.
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs h-8"
            >
              <RotateCcw className="size-3 mr-1" />
              <span>Resume Cross-Examination</span>
            </Button>

            <Button
              asChild
              size="sm"
              className="text-xs h-8 bg-zinc-950 text-white hover:bg-zinc-800"
            >
              <Link href="/dashboard">
                <span>Return to Chamber Docket</span>
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
