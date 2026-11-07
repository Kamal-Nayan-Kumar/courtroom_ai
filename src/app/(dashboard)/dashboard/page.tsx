"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Plus,
  Briefcase,
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Award,
  Clock,
  History,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PerformanceMetricCards } from "@/components/dashboard/PerformanceMetricCards";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { WitnessPrepQueueCard } from "@/components/dashboard/WitnessPrepQueueCard";
import { DocketTable } from "@/components/dashboard/DocketTable";
import { PublicCaseLibraryGrid } from "@/components/dashboard/PublicCaseLibraryGrid";
import { useDashboard } from "@/context/DashboardContext";

export default function DashboardPage() {
  const { openNewCaseModal, showNotification } = useDashboard();
  const [activeTab, setActiveTab] = useState<"my-cases" | "public-library">("my-cases");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[10.5px] font-mono font-medium bg-emerald-50 text-emerald-800 border-emerald-200"
            >
              Sessions Coram Live
            </Badge>
            <span className="text-xs text-zinc-500 font-mono">
              Chamber Coram · Courtroom No. 3
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-sans text-zinc-950 tracking-tight">
            Good Morning, Counsel.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            You have 2 trials paused at Cross-Examination and 1 witness awaiting coaching.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 px-3.5 text-xs font-semibold border-zinc-300 hover:border-zinc-950 hover:bg-zinc-50 shadow-2xs text-zinc-900"
          >
            <Link href="/case/402/courtroom">
              <Play className="size-3.5 mr-1.5 fill-current text-zinc-800" />
              <span>Resume Last Trial (State vs. Sharma)</span>
              <ArrowRight className="size-3.5 ml-1 text-zinc-500" />
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-9 px-4 text-xs font-semibold bg-blue-900 text-white hover:bg-blue-800 shadow-xs"
          >
            <Link href="/case/402/courtroom">
              <span>Enter 3-Panel Courtroom Simulator</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => openNewCaseModal()}
            className="h-9 px-4 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs"
          >
            <Plus className="size-3.5 mr-1.5" />
            <span>Start New Case</span>
          </Button>
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Panel 1 · Case Dossier</span>
            <Badge variant="outline" className="text-[10px] font-mono">FIR, Exhibits, Brief</Badge>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Chronology facts, exhibits, pinned statutes, precedents, and witness bounds. Cite facts straight into your argument.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Panel 2 · 2D Courtroom Arena</span>
            <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-900 border-blue-200">Bench, Witness, Desks</Badge>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Top-down Indian Sessions Courtroom. Judge bench, katghara witness stand, prosecution and defense desks with live speaker state.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Panel 3 · Transcript & Console</span>
            <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 text-amber-900 border-amber-200">Steno Stream</Badge>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Live multi-agent transcript, objections, bench rulings, and advocate mic console with exhibit and statute one-click inserts.
          </p>
        </div>
        <div className="lg:col-span-3 rounded-2xl border border-blue-900 bg-blue-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-white">Practice your case in the 3-panel simulator</p>
            <p className="text-xs text-blue-100">State of Maharashtra vs. Arjun Sharma · CRL.A. 402/2026 · Cross-examination of PW-1 Dr. Kulkarni</p>
          </div>
          <Button asChild size="sm" className="h-9 px-4 text-xs font-semibold bg-white text-blue-900 hover:bg-zinc-100 shrink-0">
            <Link href="/case/402/courtroom">
              <Play className="size-3.5 mr-1.5 fill-current" />
              <span>Enter 2D Courtroom</span>
              <ArrowRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
      <section>
        <PerformanceMetricCards />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <PerformanceChart />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <WitnessPrepQueueCard />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <Tabs
          defaultValue="my-cases"
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "my-cases" | "public-library")}
          className="w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
            <TabsList className="bg-zinc-100 p-1 rounded-xl border border-zinc-200/80">
              <TabsTrigger
                value="my-cases"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
              >
                <Briefcase className="size-3.5 mr-1.5 text-zinc-500" />
                <span>My Recent Cases (Active & Completed)</span>
                <Badge
                  variant="outline"
                  className="ml-2 text-[10px] py-0 px-1.5 font-mono bg-zinc-50 text-zinc-600 border-zinc-200"
                >
                  5
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value="public-library"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
              >
                <BookOpen className="size-3.5 mr-1.5 text-zinc-500" />
                <span>Public Indian Cases (Practice Library)</span>
                <Badge
                  variant="outline"
                  className="ml-2 text-[10px] py-0 px-1.5 font-mono bg-blue-50 text-blue-800 border-blue-200"
                >
                  6
                </Badge>
              </TabsTrigger>
            </TabsList>

            <span className="text-xs font-mono text-zinc-500">
              Updated Live · Coram Sync Enabled
            </span>
          </div>
          <TabsContent value="my-cases" className="mt-2 focus-visible:outline-none">
            <DocketTable />
          </TabsContent>
          <TabsContent value="public-library" className="mt-2 focus-visible:outline-none">
            <PublicCaseLibraryGrid />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
