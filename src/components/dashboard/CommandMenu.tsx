"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Briefcase,
  Scale,
  BookOpen,
  Plus,
  ArrowRightLeft,
  Users,
  Search,
  Gavel,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import {
  ACTIVE_DOCKET,
  LANDMARK_PRECEDENTS,
  PUBLIC_CASE_LIBRARY,
  STATUTE_MAPPINGS,
} from "@/data/dashboardData";

export function CommandMenu() {
  const router = useRouter();
  const {
    isCommandMenuOpen,
    setIsCommandMenuOpen,
    openNewCaseModal,
    setIsStatuteMapperOpen,
    setIsWitnessModalOpen,
    showNotification,
  } = useDashboard();

  const handleSelectCase = (title: string) => {
    setIsCommandMenuOpen(false);
    showNotification(`Selected ${title}. Loading courtroom brief.`);
    router.push("/#simulation");
  };

  const handleSelectStatute = (section: string) => {
    setIsCommandMenuOpen(false);
    setIsStatuteMapperOpen(true);
  };

  const handleSelectPrecedent = (precedent: string) => {
    setIsCommandMenuOpen(false);
    showNotification(`Loaded citation: ${precedent}`);
  };

  return (
    <CommandDialog
      open={isCommandMenuOpen}
      onOpenChange={setIsCommandMenuOpen}
      title="Courtroom AI Quick Command"
      description="Search cases, BNS/IPC sections, or Supreme Court precedents"
    >
      <CommandInput placeholder="Type a section (e.g. BNS 103, BSA 63), case, or legal precedent..." />
      <CommandList className="max-h-[360px]">
        <CommandEmpty>No legal results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => {
              setIsCommandMenuOpen(false);
              openNewCaseModal();
            }}
            className="cursor-pointer"
          >
            <Plus className="mr-2 size-4 text-zinc-950" />
            <span className="font-medium">Start New Case / Trial Simulation</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setIsCommandMenuOpen(false);
              setIsStatuteMapperOpen(true);
            }}
            className="cursor-pointer"
          >
            <ArrowRightLeft className="mr-2 size-4 text-blue-700" />
            <span className="font-medium">Open BNS ↔ IPC Full Transition Mapper</span>
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setIsCommandMenuOpen(false);
              setIsWitnessModalOpen(true);
            }}
            className="cursor-pointer"
          >
            <Users className="mr-2 size-4 text-amber-600" />
            <span className="font-medium">Open Witness Prep Lab (Dr. Kulkarni)</span>
            <CommandShortcut>⌘W</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Active Docket Cases */}
        <CommandGroup heading="Active Docket Cases">
          {ACTIVE_DOCKET.map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.caseNumber} ${c.title} ${c.category}`}
              onSelect={() => handleSelectCase(c.title)}
              className="cursor-pointer"
            >
              <Briefcase className="mr-2 size-4 text-zinc-600" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900">{c.title}</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {c.caseNumber} · {c.stageLabel}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Statute Sections (BNS / BSA / BNSS / IPC) */}
        <CommandGroup heading="Statutes (BNS 2023 ↔ IPC 1860 / BSA ↔ IEA)">
          {STATUTE_MAPPINGS.map((m) => (
            <CommandItem
              key={m.newSection}
              value={`${m.newCode} ${m.newSection} ${m.legacyCode} ${m.legacySection} ${m.title}`}
              onSelect={() => handleSelectStatute(m.newSection)}
              className="cursor-pointer"
            >
              <Scale className="mr-2 size-4 text-blue-800" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="font-bold text-zinc-950">{m.newCode} {m.newSection}</span>
                  <span className="text-zinc-400 text-[10px]">⇄</span>
                  <span className="text-zinc-600">{m.legacyCode} {m.legacySection}</span>
                </div>
                <span className="text-[11px] text-zinc-500 truncate">{m.title}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Supreme Court Landmark Precedents */}
        <CommandGroup heading="Landmark Precedents (Supreme Court RAG)">
          {LANDMARK_PRECEDENTS.map((p) => (
            <CommandItem
              key={p.id}
              value={`${p.caseTitle} ${p.citation} ${p.subject}`}
              onSelect={() => handleSelectPrecedent(p.caseTitle)}
              className="cursor-pointer"
            >
              <Gavel className="mr-2 size-4 text-amber-700" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-900">{p.caseTitle}</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {p.citation} · {p.subject}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
