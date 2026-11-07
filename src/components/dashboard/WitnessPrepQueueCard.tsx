"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileText,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/DashboardContext";
import { PREP_QUEUE_TASKS } from "@/data/dashboardData";

export function WitnessPrepQueueCard() {
  const { setIsWitnessModalOpen, setIsBriefModalOpen, showNotification } = useDashboard();

  const handleAction = (type?: "coach-witness" | "review-brief" | "open-fir") => {
    if (type === "coach-witness") {
      setIsWitnessModalOpen(true);
    } else if (type === "review-brief") {
      setIsBriefModalOpen(true);
    } else {
      showNotification("FIR No. 89/2025 PS Colaba: Charge Sheet & Electronic Hash chain reviewed.");
    }
  };

  return (
    <Card className="bg-white border-zinc-200/90 shadow-2xs h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-start justify-between space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-zinc-950">
              Pre-Trial & Witness Prep Queue
            </CardTitle>
            <Badge
              variant="outline"
              className="text-xs font-mono bg-amber-50 text-amber-900 border-amber-200"
            >
              Active Case: Sharma
            </Badge>
          </div>
          <CardDescription className="text-xs text-zinc-500 mt-1">
            Essential trial readiness checklist before stepping into Courtroom No. 3.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          {PREP_QUEUE_TASKS.map((task) => {
            const isDone = task.status === "done";
            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? "bg-zinc-50/60 border-zinc-200/60 text-zinc-600"
                    : "bg-amber-50/30 border-amber-200/70 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {isDone ? (
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-semibold ${
                            isDone ? "text-zinc-700 line-through decoration-zinc-400" : "text-zinc-950"
                          }`}
                        >
                          {task.title}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs font-mono py-0.5 px-2 ${
                            isDone
                              ? "bg-zinc-100 text-zinc-500 border-zinc-200"
                              : "bg-amber-100/70 text-amber-900 border-amber-300"
                          }`}
                        >
                          {task.tag}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                        {task.subtitle}
                      </p>
                    </div>
                  </div>

                  {task.actionLabel && (
                    <Button
                      asChild={task.actionType === "coach-witness" || task.actionType === "review-brief"}
                      size="sm"
                      variant={isDone ? "ghost" : "default"}
                      onClick={task.actionType === "open-fir" ? () => handleAction("open-fir") : undefined}
                      className={`h-8 px-3 text-xs font-medium shrink-0 ml-1 ${
                        isDone
                          ? "text-zinc-500 hover:text-zinc-800"
                          : "bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xs"
                      }`}
                    >
                      {task.actionType === "coach-witness" || task.actionType === "review-brief" ? (
                        <Link href="/case/402/prep">
                          <span>{task.actionLabel}</span>
                          <ArrowRight className="size-3 ml-1" />
                        </Link>
                      ) : (
                        <>
                          <span>{task.actionLabel}</span>
                          <ArrowRight className="size-3 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Readiness Summary banner at bottom */}
        <div className="mt-2 pt-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/80 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 sm:p-4 rounded-b-xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-blue-700" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-zinc-900">Admissibility Risk: </span>
              <span className="text-zinc-600">High (Ex-A Hash Delay)</span>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="h-8 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white shadow-2xs px-3.5"
          >
            <Link href="/case/402/prep">
              Launch Witness Lab
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
