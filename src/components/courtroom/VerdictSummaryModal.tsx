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
  caseTitle?: string;
  courtName?: string;
  judgeName?: string;
  score?: {
    argument_score: number | null;
    objection_score: number | null;
    composure_score: number | null;
    legal_accuracy_score: number | null;
    overall: number | null;
    judge_summary: string;
    strengths: string[];
    weaknesses: string[];
  } | null;
}

export function VerdictSummaryModal({
  isOpen,
  onClose,
  witnessComposure,
  caseTitle,
  courtName,
  judgeName,
  score,
}: VerdictSummaryModalProps) {
  const overall = score?.overall ?? null;
  const summary = score?.judge_summary ?? "The bench has recorded your submissions.";
  const strengths = score?.strengths ?? [];
  const weaknesses = score?.weaknesses ?? [];

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
                {courtName ?? "Court"} · Bench Appraisal
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 font-mono mt-0.5 break-words whitespace-normal">
                {judgeName ? `Coram: ${judgeName}` : "Coram: Hon'ble Bench"}
                {caseTitle ? ` · ${caseTitle}` : ""}
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
              {summary}
            </p>
          </div>

          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Overall
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                {overall ?? '–'} / 10
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                Bench score
              </span>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Argument
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                {score?.argument_score ?? '–'} / 10
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                Argument quality
              </span>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Objection
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                {score?.objection_score ?? '–'} / 10
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                Objection handling
              </span>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Composure
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                {score?.composure_score ?? '–'} / 10
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                Demeanour under pressure
              </span>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/80 text-center sm:col-span-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Legal accuracy
              </span>
              <span className="text-lg font-bold text-zinc-950 font-mono block my-0.5">
                {score?.legal_accuracy_score ?? '–'} / 10
              </span>
              <span className="text-[10px] text-zinc-600 font-medium">
                Correctness of legal propositions
              </span>
            </div>
          </div>

          {/* Detailed Judicial Assessment */}
          <div className="space-y-2 p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50">
            <div className="font-semibold text-zinc-900 text-xs">
              Bench Observations:
            </div>
            <div className="space-y-1.5 text-[11px] text-zinc-700">
              {strengths.map((s, i) => (
                <div key={`s-${i}`} className="flex items-start gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strength:</strong> {s}
                  </span>
                </div>
              ))}
              {weaknesses.map((w, i) => (
                <div key={`w-${i}`} className="flex items-start gap-1.5">
                  <CheckCircle2 className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Weakness:</strong> {w}
                  </span>
                </div>
              ))}
              {strengths.length === 0 && weaknesses.length === 0 && (
                <span className="text-zinc-500">
                  The bench did not return separate strengths or weaknesses for this session.
                </span>
              )}
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
