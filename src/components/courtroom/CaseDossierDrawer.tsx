"use client";

import React, { useState } from "react";
import {
  FileText,
  FolderOpen,
  Bookmark,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  onCiteFact,
}: CaseDossierDrawerProps) {
  const [activeTab, setActiveTab] = useState<string>("facts");

  if (!isOpen) {
    return (
      <aside className="w-12 shrink-0 border-r border-zinc-200 bg-white flex flex-col items-center py-3 select-none">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          title="Expand Case File"
          className="size-8 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
        >
          <ChevronRight className="size-4" />
        </Button>

        <div className="mt-6 flex flex-col gap-4 items-center text-zinc-400">
          <button
            type="button"
            onClick={() => {
              setActiveTab("facts");
              onToggle();
            }}
            title="Facts"
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
            title="Exhibits"
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
            title="Brief"
            className="hover:text-zinc-900 transition-colors"
          >
            <Bookmark className="size-4" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full overflow-hidden select-none">
      <div className="h-10 px-3.5 border-b border-zinc-200 flex items-center justify-between shrink-0">
        <span className="text-xs font-semibold text-zinc-900">Case File</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          title="Collapse Drawer"
          className="size-7 p-0 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
        >
          <ChevronLeft className="size-4" />
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-3 pt-2 pb-1 border-b border-zinc-100 shrink-0">
          <TabsList className="grid grid-cols-3 w-full h-8 bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/80">
            <TabsTrigger
              value="facts"
              className="text-[11px] font-medium py-1 px-1 rounded data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
            >
              Facts
            </TabsTrigger>
            <TabsTrigger
              value="exhibits"
              className="text-[11px] font-medium py-1 px-1 rounded data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
            >
              Exhibits
            </TabsTrigger>
            <TabsTrigger
              value="brief"
              className="text-[11px] font-medium py-1 px-1 rounded data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs"
            >
              Brief
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="facts"
          className="flex-1 overflow-y-auto p-3 space-y-3 focus-visible:outline-none min-h-0"
        >
          {facts.map((fact) => (
            <div key={fact.id} className="text-xs">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-[11px] text-zinc-500">{fact.time}</span>
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
                  className="h-6 px-1.5 text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                >
                  Cite
                </Button>
              </div>
              <div className="font-semibold text-zinc-900 mt-1">{fact.title}</div>
              <p className="text-zinc-600 text-xs leading-relaxed mt-0.5">
                {fact.description}
              </p>
              {fact.discrepancy && (
                <p className="text-xs text-amber-700 mt-1">{fact.discrepancy}</p>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent
          value="exhibits"
          className="flex-1 overflow-y-auto p-3 space-y-2.5 focus-visible:outline-none min-h-0"
        >
          {exhibits.map((ex) => {
            const isPresented = ex.id === activeExhibitId;
            return (
              <div
                key={ex.id}
                className="p-2.5 rounded-lg border border-zinc-200 bg-white text-xs flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-900 truncate">
                    {ex.label} · {ex.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className="text-[10px] font-mono py-0 px-1.5">
                      {ex.admissibility}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectExhibit(ex)}
                  className="h-7 px-2 text-xs shrink-0"
                >
                  {isPresented ? "Presented" : "Present"}
                </Button>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent
          value="brief"
          className="flex-1 overflow-y-auto p-3 space-y-3 focus-visible:outline-none min-h-0"
        >
          <div>
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Statutes
            </div>
            <div className="space-y-2">
              {statutes.map((st) => (
                <div key={st.section} className="text-xs">
                  <div className="font-mono font-semibold text-zinc-950">
                    {st.code} {st.section}
                  </div>
                  <div className="font-medium text-zinc-900 text-xs mt-0.5">{st.title}</div>
                  <p className="text-zinc-600 text-xs leading-relaxed mt-0.5">
                    {st.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-100">
            <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Precedents
            </div>
            <div className="space-y-2">
              {precedents.map((p) => (
                <div key={p.id} className="text-xs">
                  <div className="font-semibold text-zinc-900">{p.citation}</div>
                  <div className="text-[10.5px] text-zinc-500 font-mono">
                    {p.court} ({p.year})
                  </div>
                  <p className="text-zinc-700 text-xs leading-relaxed mt-0.5">
                    {p.principle}
                  </p>
                  <p className="text-zinc-600 text-xs mt-0.5">{p.application}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
