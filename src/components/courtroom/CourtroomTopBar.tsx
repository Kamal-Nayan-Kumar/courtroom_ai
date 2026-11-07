"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PanelLeft,
  Shield,
  Scale,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CourtroomRole } from "@/types/courtroomArena";

interface CourtroomTopBarProps {
  currentRole: CourtroomRole;
  onRoleToggle: () => void;
  coCounselEnabled: boolean;
  onCoCounselToggle: () => void;
  isLeftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  onRequestVerdict: () => void;
}

export function CourtroomTopBar({
  currentRole,
  onRoleToggle,
  coCounselEnabled,
  onCoCounselToggle,
  isLeftPanelOpen,
  onToggleLeftPanel,
  onRequestVerdict,
}: CourtroomTopBarProps) {
  // Live session timer starting at 18:42 (1122 seconds)
  const [secondsElapsed, setSecondsElapsed] = useState(1122);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="h-13 shrink-0 border-b border-zinc-200/90 bg-white px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4 select-none z-20">
      {/* LEFT: Exit button, Case Docket & Stage */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 shrink-0 gap-1.5"
        >
          <Link href="/case/402/prep">
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Exit to Pre-Trial Prep</span>
            <span className="sm:hidden">Exit</span>
          </Link>
        </Button>

        <div className="h-4 w-px bg-zinc-200 hidden sm:block shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className="font-mono text-[11px] font-medium bg-zinc-50 border-zinc-300 text-zinc-800 shrink-0 px-2 py-0.5"
          >
            CRL.A. 402/2026
          </Badge>

          <span className="text-xs font-semibold text-zinc-900 truncate hidden lg:inline max-w-[220px]">
            State of Maharashtra vs. Arjun Sharma
          </span>

          <Badge
            variant="secondary"
            className="text-[11px] font-medium bg-zinc-100 text-zinc-700 border-zinc-200 hidden 2xl:inline-flex px-2 py-0.5 shrink-0"
          >
            Stage 2 of 4: Cross-Examination of PW-1
          </Badge>
        </div>
      </div>

      {/* CENTER: Multi-Agent Bus Status */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-600 whitespace-nowrap shrink-0">
        <span className="relative flex size-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-emerald-600" />
        </span>
        <span className="font-semibold text-zinc-800">LangGraph Multi-Agent Bus:</span>
        <span className="text-emerald-700 font-medium">Active</span>
        <span className="text-zinc-300">·</span>
        <span className="text-zinc-500">4 Agents Listening (18ms)</span>
      </div>

      {/* RIGHT: Panel toggle, Role Switcher, Co-Counsel toggle, Live Timer & Verdict */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Toggle Left Case Dossier */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleLeftPanel}
          title={isLeftPanelOpen ? "Collapse Case File Drawer" : "Expand Case File Drawer"}
          className={`h-8 px-2 sm:px-2.5 text-xs border-zinc-200 hover:bg-zinc-100 ${
            isLeftPanelOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-600"
          }`}
        >
          <PanelLeft className="size-3.5" />
          <span className="hidden md:inline ml-1.5 text-[11px]">
            {isLeftPanelOpen ? "Hide Case File" : "Show Case File"}
          </span>
        </Button>

        {/* Role Switcher Pill */}
        <button
          type="button"
          onClick={onRoleToggle}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-800 transition-colors cursor-pointer"
          title="Click to switch counsel perspective"
        >
          {currentRole === "defense" ? (
            <>
              <Shield className="size-3.5 text-zinc-700 shrink-0" />
              <span className="hidden sm:inline">Playing as:</span>
              <span className="font-semibold text-zinc-950">Defense Counsel</span>
            </>
          ) : (
            <>
              <Scale className="size-3.5 text-zinc-700 shrink-0" />
              <span className="hidden sm:inline">Playing as:</span>
              <span className="font-semibold text-zinc-950">Public Prosecutor</span>
            </>
          )}
        </button>

        {/* Co-Counsel Proactive Toggle */}
        <button
          type="button"
          onClick={onCoCounselToggle}
          className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
            coCounselEnabled
              ? "bg-[#FFFDF7] border-amber-200/90 text-amber-950"
              : "bg-zinc-50 border-zinc-200 text-zinc-500"
          }`}
          title="Toggle real-time AI strategist hints"
        >
          <Sparkles
            className={`size-3.5 ${
              coCounselEnabled ? "text-amber-600" : "text-zinc-400"
            }`}
          />
          <span>Co-Counsel:</span>
          <span className="font-semibold">
            {coCounselEnabled ? "Proactive" : "Muted"}
          </span>
        </button>

        {/* Session Timer */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-200 font-mono text-xs text-zinc-700">
          <Clock className="size-3 text-zinc-400 shrink-0" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>

        {/* Conclude Session / Request Verdict Button */}
        <Button
          onClick={onRequestVerdict}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs font-medium border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <CheckCircle2 className="size-3.5 mr-1 text-zinc-500" />
          <span className="hidden sm:inline">Conclude & Request Verdict</span>
          <span className="sm:hidden">Verdict</span>
        </Button>
      </div>
    </header>
  );
}
