"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Gavel,
  Copy,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { LANDMARK_PRECEDENTS } from "@/data/dashboardData";

export function PrecedentViewerModal() {
  const { isBriefModalOpen, setIsBriefModalOpen, showNotification } = useDashboard();

  const handleCopyCitation = (citation: string) => {
    navigator.clipboard?.writeText(citation);
    showNotification(`Copied citation: ${citation}`);
  };

  return (
    <Dialog open={isBriefModalOpen} onOpenChange={setIsBriefModalOpen}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-zinc-200 shadow-xl">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold">
              <BookOpen className="size-4 text-blue-100" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-950 font-serif">
                Co-Counsel Precedent Brief & Case Law RAG
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Indexed Supreme Court Precedents on Digital Evidence, Remand, and Admissibility.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[64vh] overflow-y-auto flex flex-col gap-3.5">
          {LANDMARK_PRECEDENTS.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-colors flex flex-col gap-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-zinc-950 font-serif leading-snug">
                    {p.caseTitle}
                  </h4>
                  <div className="text-[11px] font-mono text-zinc-600 mt-0.5">
                    {p.citation} · {p.year}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyCitation(p.citation)}
                  className="h-7 px-2 text-[11px] border-zinc-200 hover:bg-zinc-100 shrink-0"
                >
                  <Copy className="size-3 mr-1 text-zinc-500" />
                  Copy Citation
                </Button>
              </div>

              <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 leading-relaxed">
                <span className="font-semibold text-zinc-900">Ratio Decidendi: </span>
                {p.keyRatio}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[10.5px] text-zinc-500 italic">{p.bench}</span>
                <div className="flex items-center gap-1">
                  {p.relevantSections.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="text-[10px] font-mono py-0 px-1.5 bg-blue-50 text-blue-900 border-blue-200"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Coram Precedents auto-injected into Co-Counsel Prompter</span>
          <Button
            size="sm"
            onClick={() => setIsBriefModalOpen(false)}
            className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800"
          >
            Close Brief
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
