"use client";

import React from "react";
import Link from "next/link";
import {
  Shield,
  Scale,
  ArrowRightLeft,
  ChevronRight,
  Gavel,
  CheckCircle2,
  Play,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LegalRole } from "@/types/prepStudio";

interface CaseHeaderStickyProps {
  currentRole: LegalRole;
  onRoleToggle: () => void;
  readinessPercent: number;
  completedTasksCount: number;
  totalTasksCount: number;
}

export function CaseHeaderSticky({
  currentRole,
  onRoleToggle,
  readinessPercent,
  completedTasksCount,
  totalTasksCount,
}: CaseHeaderStickyProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Main Header Banner Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Metadata, Title, Role Toggle */}
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-950 text-white">
              CRL.A. 402/2026
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              Sessions Court, Mumbai · Courtroom No. 3
            </span>
            <Badge variant="outline" className="text-xs font-mono bg-rose-50 text-rose-800 border-rose-200">
              BNS Sec 103(1)
            </Badge>
            <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-800 border-blue-200">
              BSA Sec 63(4)
            </Badge>
            <Badge variant="outline" className="text-xs font-mono bg-emerald-50 text-emerald-800 border-emerald-200">
              BNSS Sec 187
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-zinc-950 tracking-tight">
            State of Maharashtra vs. Arjun Sharma
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Interactive Role Switcher Pill */}
            {currentRole === "defense" ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                <Shield className="size-3.5 text-amber-700" />
                <span>Your Role: <strong>Defense Counsel (Accused)</strong></span>
                <button
                  type="button"
                  onClick={onRoleToggle}
                  className="ml-1 text-xs underline font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                  title="Switch side to examine trial from prosecution perspective"
                >
                  <ArrowRightLeft className="size-3" />
                  <span>Switch to Prosecutor</span>
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
                <Scale className="size-3.5 text-blue-700" />
                <span>Your Role: <strong>Public Prosecutor (State)</strong></span>
                <button
                  type="button"
                  onClick={onRoleToggle}
                  className="ml-1 text-xs underline font-semibold text-blue-800 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
                  title="Switch side to examine trial from defense perspective"
                >
                  <ArrowRightLeft className="size-3" />
                  <span>Switch to Defense</span>
                </button>
              </div>
            )}

            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-500 font-mono">
              Target Coram: Strict Proceduralist Judge AI
            </span>
          </div>
        </div>

        {/* Right: Readiness Meter & Enter Courtroom CTA */}
        <div className="flex flex-col items-stretch gap-3 w-full sm:w-64 shrink-0">
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                <span>Trial Readiness</span>
              </span>
              <span className="font-mono text-zinc-600 font-bold tabular-nums">
                {readinessPercent}% ({completedTasksCount}/{totalTasksCount})
              </span>
            </div>
            <Progress value={readinessPercent} className="h-2 bg-zinc-100 w-full" />
            <span className="text-xs text-zinc-500 font-mono truncate">
              Witness prep completed · FIR analyzed
            </span>
          </div>

          <Button
            asChild
            size="sm"
            className="h-10 px-4 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shadow-md w-full"
          >
            <Link href="/case/402/courtroom" className="flex items-center gap-2 justify-center">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Enter 2D Courtroom Session</span>
              <ArrowRight className="size-3.5 ml-0.5 text-zinc-300" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
