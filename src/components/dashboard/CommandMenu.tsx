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
      className="sm:max-w-2xl md:max-w-3xl shadow-2xl border-zinc-200"
    >
      <CommandInput placeholder="Type a section (e.g. BNS 103, BSA 63), case, or legal precedent..." className="text-sm h-12" />
      <CommandList className="max-h-[460px] p-2">
        <CommandEmpty>No legal results found.</CommandEmpty>

        {/* Quick Actions */}
        <CommandGroup heading="Quick Actions" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <CommandItem
            onSelect={() => {
              setIsCommandMenuOpen(false);
              openNewCaseModal();
            }}
            className="cursor-pointer py-2.5 px-3 rounded-lg"
          >
            <Plus className="mr-2.5 size-4 text-zinc-950" />
            <span className="font-medium text-sm text-zinc-900">Start New Case / Trial Simulation</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setIsCommandMenuOpen(false);
              setIsStatuteMapperOpen(true);
            }}
            className="cursor-pointer py-2.5 px-3 rounded-lg"
          >
            <ArrowRightLeft className="mr-2.5 size-4 text-blue-700" />
            <span className="font-medium text-sm text-zinc-900">Open BNS ↔ IPC Full Transition Mapper</span>
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => {
              setIsCommandMenuOpen(false);
              setIsWitnessModalOpen(true);
            }}
            className="cursor-pointer py-2.5 px-3 rounded-lg"
          >
            <Users className="mr-2.5 size-4 text-amber-600" />
            <span className="font-medium text-sm text-zinc-900">Open Witness Prep Lab (Dr. Kulkarni)</span>
            <CommandShortcut>⌘W</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-2" />

        {/* Active Docket Cases */}
        <CommandGroup heading="Active Docket Cases" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {ACTIVE_DOCKET.map((c) => (
            <CommandItem
              key={c.id}
              value={`${c.caseNumber} ${c.title} ${c.category}`}
              onSelect={() => handleSelectCase(c.title)}
              className="cursor-pointer py-2.5 px-3 rounded-lg"
            >
              <Briefcase className="mr-2.5 size-4 text-zinc-600 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-zinc-900">{c.title}</span>
                <span className="text-xs text-zinc-500 font-mono">
                  {c.caseNumber} · {c.stageLabel}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        {/* Statute Sections (BNS / BSA / BNSS / IPC) */}
        <CommandGroup heading="Statutes (BNS 2023 ↔ IPC 1860 / BSA ↔ IEA)" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {STATUTE_MAPPINGS.map((m) => (
            <CommandItem
              key={m.newSection}
              value={`${m.newCode} ${m.newSection} ${m.legacyCode} ${m.legacySection} ${m.title}`}
              onSelect={() => handleSelectStatute(m.newSection)}
              className="cursor-pointer py-2.5 px-3 rounded-lg"
            >
              <Scale className="mr-2.5 size-4 text-blue-800 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-zinc-950">{m.newCode} {m.newSection}</span>
                  <span className="text-zinc-400">⇄</span>
                  <span className="text-zinc-600">{m.legacyCode} {m.legacySection}</span>
                </div>
                <span className="text-xs text-zinc-600 truncate">{m.title}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="my-2" />

        {/* Supreme Court Landmark Precedents */}
        <CommandGroup heading="Landmark Precedents (Supreme Court RAG)" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {LANDMARK_PRECEDENTS.map((p) => (
            <CommandItem
              key={p.id}
              value={`${p.caseTitle} ${p.citation} ${p.subject}`}
              onSelect={() => handleSelectPrecedent(p.caseTitle)}
              className="cursor-pointer py-2.5 px-3 rounded-lg"
            >
              <Gavel className="mr-2.5 size-4 text-amber-700 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-zinc-900">{p.caseTitle}</span>
                <span className="text-xs text-zinc-500 font-mono">
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
