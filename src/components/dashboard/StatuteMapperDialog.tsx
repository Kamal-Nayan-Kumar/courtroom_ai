"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRightLeft,
  Search,
  Scale,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { STATUTE_MAPPINGS } from "@/data/dashboardData";

export function StatuteMapperDialog() {
  const { isStatuteMapperOpen, setIsStatuteMapperOpen } = useDashboard();
  const [filterCode, setFilterCode] = useState<"ALL" | "BNS" | "BSA" | "BNSS">("ALL");
  const [search, setSearch] = useState("");

  const filtered = STATUTE_MAPPINGS.filter((m) => {
    const matchesCode =
      filterCode === "ALL" ||
      (filterCode === "BNS" && m.newCode.includes("BNS")) ||
      (filterCode === "BSA" && m.newCode.includes("BSA")) ||
      (filterCode === "BNSS" && m.newCode.includes("BNSS"));

    const matchesSearch =
      m.newSection.toLowerCase().includes(search.toLowerCase()) ||
      m.legacySection.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.summary.toLowerCase().includes(search.toLowerCase()) ||
      m.keyChange.toLowerCase().includes(search.toLowerCase());

    return matchesCode && matchesSearch;
  });

  return (
    <Dialog open={isStatuteMapperOpen} onOpenChange={setIsStatuteMapperOpen}>
      <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden bg-white border-zinc-200 shadow-xl">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-zinc-100 bg-zinc-50/60">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <ArrowRightLeft className="size-4 text-blue-100" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-950 font-serif">
                BNS ↔ IPC & Criminal Law Transition Navigator
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Instant statutory cross-walk between BNS 2023, BNSS 2023, BSA 2023 and legacy IPC, CrPC, IEA.
              </DialogDescription>
            </div>
          </div>

          {/* Search & Code Filters */}
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-400" />
              <Input
                placeholder="Search section number (e.g. 103, 302, 63, 65B) or offence title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs bg-white border-zinc-200"
              />
            </div>

            <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/60 shrink-0">
              {(["ALL", "BNS", "BSA", "BNSS"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setFilterCode(code)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    filterCode === code
                      ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 max-h-[60vh] overflow-y-auto flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              No matching sections found for &quot;{search}&quot;.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.newSection}
                className="p-3.5 rounded-xl border border-zinc-200/90 bg-white hover:border-zinc-300 transition-colors flex flex-col gap-2 shadow-2xs"
              >
                {/* Top: Section numbers */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-950 text-white">
                      {item.newCode} {item.newSection}
                    </span>
                    <span className="text-zinc-400 text-xs">← formerly →</span>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {item.legacyCode} {item.legacySection}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono text-blue-900 bg-blue-50 border-blue-200">
                    Active Law
                  </Badge>
                </div>

                {/* Title & Summary */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-950">{item.title}</h4>
                  <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Key Structural Transition Note */}
                <div className="p-2 rounded-md bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">Key Change:</span>
                  <span>{item.keyChange}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Showing {filtered.length} statutory mappings</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsStatuteMapperOpen(false)}
            className="h-8 text-xs"
          >
            Close Navigator
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
