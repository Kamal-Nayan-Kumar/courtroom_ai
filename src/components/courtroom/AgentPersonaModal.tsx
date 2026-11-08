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
import { AgentPersona, SpeakerId } from "@/types/courtroomArena";
import { CheckCircle2, Cpu, Gavel, Scale, Shield, User } from "lucide-react";

interface AgentPersonaModalProps {
  speakerId: SpeakerId | null;
  isOpen: boolean;
  onClose: () => void;
  personas: Record<string, AgentPersona>;
}

export function AgentPersonaModal({
  speakerId,
  isOpen,
  onClose,
  personas,
}: AgentPersonaModalProps) {
  if (!speakerId) return null;
  const persona = personas[speakerId];
  if (!persona) return null;

  const getIcon = () => {
    switch (speakerId) {
      case "judge":
        return <Gavel className="size-5 text-zinc-900" />;
      case "prosecutor":
        return <Scale className="size-5 text-zinc-900" />;
      case "witness":
        return <User className="size-5 text-zinc-900" />;
      default:
        return <Shield className="size-5 text-zinc-900" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-5 border-zinc-200 shadow-xl select-none">
        <DialogHeader className="pb-3 border-b border-zinc-100 pr-8">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              {getIcon()}
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold text-zinc-950 break-words whitespace-normal">
                {persona.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 font-mono break-words whitespace-normal">
                {persona.roleTitle} · {persona.court}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-xs">
          {/* Temperament & Engine */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Temperament Model
              </span>
              <span className="font-semibold text-zinc-900">
                {persona.temperament}
              </span>
            </div>

            <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                Legal / Statutory Focus
              </span>
              <span className="font-semibold text-zinc-900">
                {persona.legalFocus}
              </span>
            </div>
          </div>

          {/* Live Working Memory Trace */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              <Cpu className="size-3.5 text-zinc-600" />
              <span>Multi-Agent Working Memory & Turn Log</span>
            </div>
            <div className="space-y-1.5 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50">
              {persona.memoryTrace.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-[11px] text-zinc-700"
                >
                  <CheckCircle2 className="size-3 text-zinc-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Live State / Thought */}
          <div className="p-3 rounded-lg border border-zinc-300 bg-white">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
              Active Thought Engine (LangGraph Bus)
            </span>
            <p className="font-mono text-[11px] text-zinc-800 leading-relaxed">
              {persona.liveThought}
            </p>
          </div>

          {/* Signature Dialogue */}
          <div className="p-2.5 rounded-lg bg-zinc-100 text-zinc-800 italic text-[11px] border border-zinc-200">
            {persona.samplePhrase}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
