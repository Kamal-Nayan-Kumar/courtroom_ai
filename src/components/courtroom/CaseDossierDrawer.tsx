"use client";

import React, { useState } from "react";
import {
  FileText,
  FolderOpen,
  Bookmark,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Send,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChronologyFact,
  CourtroomExhibit,
  PinnedPrecedent,
  PinnedStatute,
  WitnessProfile,
} from "@/types/courtroomArena";

interface CaseDossierDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  facts: ChronologyFact[];
  exhibits: CourtroomExhibit[];
  activeExhibitId: string;
  onSelectExhibit: (exhibit: CourtroomExhibit) => void;
  statutes: PinnedStatute[];
  precedents: PinnedPrecedent[];
  witnessProfile: WitnessProfile;
  currentWitnessComposure: number;
  onCiteFact: (factText: string) => void;
}

export function CaseDossierDrawer({
  isOpen,
  onToggle,
  facts,
  exhibits,
  activeExhibitId,
  onSelectExhibit,
  statutes,
  precedents,
  witnessProfile,
  currentWitnessComposure,
  onCiteFact,
}: CaseDossierDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("facts");

  if (!isOpen) {
    return (
      <aside className="w-12 shrink-0 border-r border-zinc-200 bg-white flex flex-col items-center py-3 select-none transition-all">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          title="Expand Case Dossier Drawer"
          className="size-8 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
        >
          <ChevronRight className="size-4" />
        </Button>

        <div className="mt-8 flex flex-col gap-6 items-center text-zinc-400">
          <button
            type="button"
            onClick={() => {
              setActiveTab("facts");
              onToggle();
            }}
            title="FIR & Chronology Facts"
            className="hover:text-zinc-900 transition-colors"
          >
            <FileText className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("exhibits");
              onToggle();
            }}
            title="Evidence Exhibits"
            className="hover:text-zinc-900 transition-colors"
          >
            <FolderOpen className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("brief");
              onToggle();
            }}
            title="My Pinned Brief"
            className="hover:text-zinc-900 transition-colors"
          >
            <Bookmark className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("witness");
              onToggle();
            }}
            title="Witness Boundaries"
            className="hover:text-zinc-900 transition-colors"
          >
            <Users className="size-4" />
          </button>
        </div>

        <div className="mt-auto writing-mode-vertical text-[10px] font-mono uppercase tracking-widest text-zinc-400 py-4 rotate-180">
          Case Dossier
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 md:w-88 xl:w-96 shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full overflow-hidden select-none transition-all">
      {/* Top Drawer Title & Collapse */}
      <div className="h-10 px-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/60 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-zinc-600" />
          <span className="text-xs font-semibold text-zinc-900 tracking-tight">
            Case File & Pinned Prep Drawer
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          title="Collapse Drawer"
          className="size-7 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200/60"
        >
          <ChevronLeft className="size-4" />
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-3 pt-2 pb-1 border-b border-zinc-100 bg-white shrink-0">
          <TabsList className="grid grid-cols-4 w-full h-8 bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/80">
            <TabsTrigger
              value="facts"
              className="text-[11px] font-medium py-1 px-1 rounded data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
            >
              FIR & Facts
            </TabsTrigger>
            <TabsTrigger
              value="exhibits"
              className="text-[11px] font-medium py-1 px-1 rounded data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
            >
              Exhibits ({exhibits.length})
            </TabsTrigger>
            <TabsTrigger
              value="brief"
              className="text-[11px] font-medium py-1 px-1 rounded data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
            >
              Brief
            </TabsTrigger>
            <TabsTrigger
              value="witness"
              className="text-[11px] font-medium py-1 px-1 rounded data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
            >
              Witness
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: FIR & Facts Chronology */}
        <TabsContent
          value="facts"
          className="flex-1 overflow-y-auto p-3 space-y-2.5 focus-visible:outline-none min-h-0"
        >
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1 border-b border-zinc-100 font-mono">
            <span>FIR NO. 89/2026 · PS COLABA</span>
            <span className="text-amber-700 font-medium">3 Discrepancies</span>
          </div>

          {facts.map((fact) => (
            <div
              key={fact.id}
              className={`p-2.5 rounded-lg border text-xs transition-colors ${
                fact.isDiscrepancy
                  ? "bg-[#FFFDF9] border-amber-200/90"
                  : "bg-white border-zinc-200/80"
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1 font-mono">
                <span className="text-[11px] font-semibold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">
                  {fact.time}
                </span>
                {fact.isDiscrepancy && (
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-amber-50 text-amber-900 border-amber-300 font-mono py-0 px-1.5"
                  >
                    Discrepancy
                  </Badge>
                )}
              </div>

              <div className="font-semibold text-zinc-900 mb-0.5">
                {fact.title}
              </div>
              <p className="text-zinc-600 text-[11px] leading-relaxed">
                {fact.description}
              </p>

              {fact.discrepancy && (
                <div className="mt-1.5 p-1.5 rounded bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950 flex items-start gap-1">
                  <AlertTriangle className="size-3 text-amber-700 shrink-0 mt-0.5" />
                  <span>{fact.discrepancy}</span>
                </div>
              )}

              <div className="mt-2 pt-1.5 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]">
                  {fact.sectionRef}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onCiteFact(
                      `Dr. Kulkarni, FIR entry timed at ${fact.time} states: "${fact.description}". ${
                        fact.discrepancy
                          ? `Explain this discrepancy: ${fact.discrepancy}`
                          : ""
                      }`
                    )
                  }
                  className="h-6 px-1.5 text-[10.5px] font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100"
                >
                  <Send className="size-2.5 mr-1 text-zinc-400" />
                  Cite in Argument
                </Button>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Tab 2: Exhibits */}
        <TabsContent
          value="exhibits"
          className="flex-1 overflow-y-auto p-3 space-y-2.5 focus-visible:outline-none min-h-0"
        >
          <div className="flex items-center justify-between text-[11px] text-zinc-500 pb-1 border-b border-zinc-100 font-mono">
            <span>EVIDENCE RECORD ON FILE</span>
            <span>Click to Present</span>
          </div>

          {exhibits.map((ex) => {
            const isPresented = ex.id === activeExhibitId;
            return (
              <div
                key={ex.id}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  isPresented
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                    : "bg-white border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                      isPresented
                        ? "bg-zinc-800 text-zinc-200"
                        : "bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    {ex.label} · {ex.type}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono py-0 px-1.5 ${
                      isPresented
                        ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                        : ex.admissibility === "Admitted"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
                    }`}
                  >
                    {ex.admissibility}
                  </Badge>
                </div>

                <div
                  className={`font-semibold mb-1 ${
                    isPresented ? "text-white" : "text-zinc-900"
                  }`}
                >
                  {ex.name}
                </div>
                <p
                  className={`text-[11px] leading-relaxed mb-2 ${
                    isPresented ? "text-zinc-300" : "text-zinc-600"
                  }`}
                >
                  {ex.description}
                </p>

                {ex.statuteWarning && (
                  <div
                    className={`p-1.5 rounded text-[10.5px] mb-2 flex items-start gap-1 ${
                      isPresented
                        ? "bg-zinc-800 border border-zinc-700 text-amber-300"
                        : "bg-amber-50/70 border border-amber-200/70 text-amber-950"
                    }`}
                  >
                    <AlertTriangle className="size-3 text-amber-500 shrink-0 mt-0.5" />
                    <span>{ex.statuteWarning}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-zinc-200/30">
                  <span
                    className={`text-[10px] font-mono ${
                      isPresented ? "text-zinc-400" : "text-zinc-400"
                    }`}
                  >
                    {ex.timestamp}
                  </span>
                  <Button
                    size="sm"
                    variant={isPresented ? "secondary" : "outline"}
                    onClick={() => onSelectExhibit(ex)}
                    className={`h-6 px-2 text-[10.5px] font-medium ${
                      isPresented
                        ? "bg-white text-zinc-900 hover:bg-zinc-100"
                        : "border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                    }`}
                  >
                    {isPresented ? "Active on Bench ✓" : "Present to Court ➜"}
                  </Button>
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* Tab 3: My Pinned Brief (Statutes & Precedents from Step 3) */}
        <TabsContent
          value="brief"
          className="flex-1 overflow-y-auto p-3 space-y-3 focus-visible:outline-none min-h-0"
        >
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Statutory Foundations (BSA / BNS / BNSS)
            </div>
            <div className="space-y-2">
              {statutes.map((st) => (
                <div
                  key={st.section}
                  className="p-2.5 rounded-lg border border-zinc-200/90 bg-white text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-zinc-950">
                      {st.code} {st.section}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono ${st.badgeColor}`}
                    >
                      {st.code}
                    </Badge>
                  </div>
                  <div className="font-medium text-zinc-900 text-[11.5px] mb-0.5">
                    {st.title}
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    {st.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Supreme Court Authorities
            </div>
            <div className="space-y-2">
              {precedents.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-lg border border-zinc-200/90 bg-white text-xs"
                >
                  <div className="font-semibold text-zinc-900 text-[11.5px] mb-1">
                    {p.citation}
                  </div>
                  <div className="text-[10.5px] text-zinc-500 font-mono mb-1">
                    {p.court} ({p.year})
                  </div>
                  <p className="text-zinc-700 text-[11px] leading-relaxed mb-1.5 italic bg-zinc-50 p-1.5 rounded border border-zinc-100">
                    “{p.principle}”
                  </p>
                  <p className="text-zinc-600 text-[11px]">
                    <span className="font-medium text-zinc-900">Trial utility: </span>
                    {p.application}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Witness Boundaries & Composure */}
        <TabsContent
          value="witness"
          className="flex-1 overflow-y-auto p-3 space-y-3 focus-visible:outline-none min-h-0"
        >
          <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/70 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-zinc-950 text-sm">
                {witnessProfile.name}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-mono bg-zinc-100 text-zinc-700 border-zinc-300"
              >
                PW-1
              </Badge>
            </div>
            <p className="text-zinc-500 text-[11px] mb-2">
              {witnessProfile.designation}
            </p>

            {/* Dynamic Composure Meter */}
            <div className="space-y-1 pt-1 border-t border-zinc-200">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-600 font-medium">Witness Composure:</span>
                <span className="font-mono font-bold text-zinc-900">
                  {currentWitnessComposure}%
                </span>
              </div>
              <Progress
                value={currentWitnessComposure}
                className="h-2 bg-zinc-200 [&>div]:bg-zinc-800"
              />
              <span className="text-[10.5px] text-zinc-500 font-mono block">
                {currentWitnessComposure > 70
                  ? witnessProfile.composureLabel
                  : "Composure broken · Contradiction acknowledged"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 bg-[#FFFDF8] text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold mb-1">
              <AlertTriangle className="size-3.5 text-amber-600" />
              <span>Identified Vulnerability (Step 3)</span>
            </div>
            <p className="text-zinc-700 text-[11px] leading-relaxed">
              {witnessProfile.keyVulnerability}
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              Courtroom Boundary Rules
            </div>
            {witnessProfile.boundaryRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-2 rounded border border-zinc-200 bg-white text-[11px] text-zinc-700 flex items-start gap-1.5"
              >
                <CheckCircle2 className="size-3 text-zinc-500 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
