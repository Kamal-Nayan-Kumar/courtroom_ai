"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PanelLeft,
  Shield,
  Scale,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CourtroomRole } from "@/types/courtroomArena";

interface CourtroomTopBarProps {
  currentRole: CourtroomRole;
  onRoleToggle: () => void;
  coCounselEnabled: boolean;
  onCoCounselToggle: () => void;
  isLeftPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  onRequestVerdict: () => void;
  caseId?: string;
  caseTitle?: string;
  secondsElapsed?: number;
}

export function CourtroomTopBar({
  currentRole,
  onRoleToggle,
  isLeftPanelOpen,
  onToggleLeftPanel,
  onRequestVerdict,
  caseId,
  caseTitle,
  secondsElapsed: secondsElapsedProp,
}: CourtroomTopBarProps) {
  const [secondsElapsed, setSecondsElapsed] = useState(secondsElapsedProp ?? 0);

  useEffect(() => {
    setSecondsElapsed(secondsElapsedProp ?? 0);
  }, [secondsElapsedProp]);

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
    <header className="h-12 shrink-0 border-b bg-white px-3 flex items-center justify-between gap-2 select-none z-20">
      <div className="flex items-center gap-2 shrink-0">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 shrink-0 gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              <span>Exit</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Exit the courtroom?</AlertDialogTitle>
              <AlertDialogDescription>
                Your current cross-examination session will be paused. You can resume it from the Chamber Docket.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Stay</AlertDialogCancel>
              <AlertDialogAction asChild className="bg-zinc-950 text-white hover:bg-zinc-800">
                <Link href={caseId ? `/case/${caseId}/prep` : "/dashboard"}>Exit to Prep Studio</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="h-4 w-px bg-zinc-200 shrink-0" />

        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className="font-mono text-[11px] font-medium bg-zinc-50 border-zinc-300 text-zinc-800 shrink-0 px-2 py-0.5"
          >
            CRL.A. 402/2026
          </Badge>

          <span className="text-xs font-semibold text-zinc-900 truncate hidden lg:inline max-w-[320px]">
            {caseTitle ?? "Courtroom Simulator"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleLeftPanel}
          title={isLeftPanelOpen ? "Collapse Case File" : "Expand Case File"}
          className={`h-8 w-8 p-0 ${
            isLeftPanelOpen ? "text-zinc-900 bg-zinc-100" : "text-zinc-600"
          }`}
        >
          <PanelLeft className="size-4" />
        </Button>

        <button
          type="button"
          onClick={onRoleToggle}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-800 transition-colors cursor-pointer"
          title="Click to switch counsel perspective"
        >
          {currentRole === "defense" ? (
            <>
              <Shield className="size-3.5 text-zinc-700 shrink-0" />
              <span className="font-semibold text-zinc-950">Defense Counsel</span>
            </>
          ) : (
            <>
              <Scale className="size-3.5 text-zinc-700 shrink-0" />
              <span className="font-semibold text-zinc-950">Public Prosecutor</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-200 font-mono text-xs text-zinc-700">
          <Clock className="size-3 text-zinc-400 shrink-0" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>

        <Button
          onClick={onRequestVerdict}
          variant="default"
          size="sm"
          className="h-8 px-2.5 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800"
        >
          <CheckCircle2 className="size-3.5 mr-1" />
          <span>Verdict</span>
        </Button>
      </div>
    </header>
  );
}
