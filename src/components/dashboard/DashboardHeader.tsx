"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Plus,
  ArrowRightLeft,
  ChevronRight,
  Gavel,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDashboard } from "@/context/DashboardContext";
import { STATUTE_MAPPINGS } from "@/data/dashboardData";

export function DashboardHeader() {
  const { openNewCaseModal, setIsCommandMenuOpen, setIsStatuteMapperOpen } = useDashboard();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-zinc-200/80 bg-white/95 px-4 backdrop-blur-md transition-all">
      {/* Left: Sidebar trigger, separator, breadcrumbs */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100" />
        <Separator orientation="vertical" className="h-4 bg-zinc-200" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="text-zinc-500 hover:text-zinc-900 font-medium">
                Chamber
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="size-3 text-zinc-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-zinc-900">
                Overview & Docket
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Center: Global Search Bar trigger (Cmd+K) */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <Button
          variant="outline"
          onClick={() => setIsCommandMenuOpen(true)}
          className="w-full justify-between h-9 px-3 text-xs text-zinc-500 hover:text-zinc-900 border-zinc-200/90 bg-zinc-50/70 hover:bg-zinc-100/80 shadow-2xs font-normal"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="size-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">Search cases, BNS/IPC sections, or SC precedents...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 font-mono text-[10px] font-medium text-zinc-500 shadow-2xs">
            ⌘K
          </kbd>
        </Button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile search trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCommandMenuOpen(true)}
          className="md:hidden size-8 p-0"
        >
          <Search className="size-4 text-zinc-600" />
        </Button>

        {/* BNS <-> IPC Quick Reference Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium border-zinc-200 hover:bg-zinc-50 text-zinc-700 shadow-2xs"
            >
              <ArrowRightLeft className="size-3.5 text-blue-700" />
              <span className="hidden sm:inline">BNS↔IPC</span>
              <span className="sm:hidden">Mapper</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 sm:w-96 p-3 shadow-lg border-zinc-200 bg-white"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <div className="flex items-center gap-1.5">
                <Gavel className="size-3.5 text-zinc-950" />
                <span className="text-xs font-semibold text-zinc-900">BNS ↔ IPC Transition Quick Map</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStatuteMapperOpen(true)}
                className="text-[11px] h-6 px-1.5 text-blue-700 hover:text-blue-900"
              >
                Full Explorer →
              </Button>
            </div>

            <div className="mt-2.5 flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {STATUTE_MAPPINGS.slice(0, 4).map((m) => (
                <div
                  key={m.newSection}
                  className="p-2 rounded-md bg-zinc-50/80 border border-zinc-100 flex flex-col gap-1 text-[11px]"
                >
                  <div className="flex items-center justify-between font-mono font-medium">
                    <span className="text-zinc-950 font-semibold">{m.newCode} {m.newSection}</span>
                    <span className="text-zinc-400 text-[10px]">formerly</span>
                    <span className="text-zinc-600">{m.legacyCode} {m.legacySection}</span>
                  </div>
                  <div className="text-zinc-800 font-medium truncate">{m.title}</div>
                  <div className="text-[10px] text-zinc-500 line-clamp-1">{m.keyChange}</div>
                </div>
              ))}
            </div>

            <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[10.5px] text-zinc-500 font-mono">11 Common Mappings</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsStatuteMapperOpen(true)}
                className="h-7 text-xs"
              >
                Open Full Statute Table
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Primary Start New Case Button */}
        <Button
          onClick={() => openNewCaseModal()}
          size="sm"
          className="h-8 gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium shadow-xs"
        >
          <Plus className="size-3.5" />
          <span>Start New Case</span>
        </Button>
      </div>
    </header>
  );
}
