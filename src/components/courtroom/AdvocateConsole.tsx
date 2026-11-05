"use client";

import React, { useState } from "react";
import {
  Hand,
  FolderOpen,
  Scale,
  Mic,
  Send,
  Sparkles,
  ChevronDown,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CourtroomExhibit, ObjectionGround } from "@/types/courtroomArena";

interface AdvocateConsoleProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmit: (target: "judge" | "witness") => void;
  onRaiseObjection: (ground: ObjectionGround) => void;
  objectionGrounds: ObjectionGround[];
  exhibits: CourtroomExhibit[];
  onPresentExhibit: (ex: CourtroomExhibit) => void;
  isStreaming: boolean;
}

export function AdvocateConsole({
  inputValue,
  onInputChange,
  onSubmit,
  onRaiseObjection,
  objectionGrounds,
  exhibits,
  onPresentExhibit,
  isStreaming,
}: AdvocateConsoleProps) {
  const [target, setTarget] = useState<"judge" | "witness">("witness");
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isObjectionPopoverOpen, setIsObjectionPopoverOpen] = useState(false);
  const [isExhibitPopoverOpen, setIsExhibitPopoverOpen] = useState(false);
  const [isStatutePopoverOpen, setIsStatutePopoverOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSubmit(target);
      }
    }
  };

  const handleToggleMic = () => {
    if (!isMicActive) {
      setIsMicActive(true);
      // Simulated voice recognition phrase
      setTimeout(() => {
        onInputChange(
          "Dr. Kulkarni, did you personally inspect the physical optical drive at the police station before it was sent to Kalina?"
        );
        setIsMicActive(false);
      }, 1400);
    } else {
      setIsMicActive(false);
    }
  };

  const commonStatutes = [
    {
      code: "BSA Sec 63(4)",
      label: "Electronic Record Certificate Mandate",
      insert:
        "My Lord, under Section 63(4) BSA, an uncertified electronic extract lacks statutory presumption and is inadmissible.",
    },
    {
      code: "BSA Sec 11",
      label: "Plea of Alibi (UPI GPS Timestamp)",
      insert:
        "We assert an alibi under Section 11 BSA based on authenticated digital UPI logs placing the accused 14km away at 23:52 HRS.",
    },
    {
      code: "BNSS Sec 105",
      label: "Mandatory Videography in Seizure",
      insert:
        "The investigating officer failed to conduct mandatory audio-video recording of the seizure mandated by Section 105 BNSS.",
    },
    {
      code: "BNS Sec 103(1)",
      label: "Threshold of Murder Proof",
      insert:
        "The prosecution cannot sustain a charge under Section 103(1) BNS when the evidentiary chain of circumstantial proof is fractured.",
    },
  ];

  return (
    <div className="border-t border-zinc-200 p-3 bg-[#FAFAFA] flex flex-col gap-2.5 shrink-0 select-none">
      {/* 1. Quick Courtroom Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Raise Objection Popover */}
          <Popover
            open={isObjectionPopoverOpen}
            onOpenChange={setIsObjectionPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs font-semibold border-rose-200 bg-rose-50/70 text-rose-900 hover:bg-rose-100 hover:text-rose-950 shadow-2xs gap-1.5"
              >
                <Hand className="size-3 text-rose-700" />
                <span>✋ Raise Objection</span>
                <ChevronDown className="size-2.5 text-rose-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-88 p-2.5 shadow-lg border-zinc-200 bg-white space-y-1.5"
            >
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider px-1 pb-1 border-b border-zinc-100">
                Grounds of Objection under BSA (Evidence Act)
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-0.5">
                {objectionGrounds.map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => {
                      onRaiseObjection(obj);
                      setIsObjectionPopoverOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-zinc-100/80 transition-colors flex flex-col gap-0.5 border border-transparent hover:border-zinc-200 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-950">
                        {obj.label}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 px-1 py-0.2 rounded">
                        {obj.act} {obj.section}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-zinc-500 line-clamp-1">
                      {obj.ruleExplanation}
                    </p>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Present Exhibit Popover */}
          <Popover
            open={isExhibitPopoverOpen}
            onOpenChange={setIsExhibitPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs font-medium border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 shadow-2xs gap-1.5"
              >
                <FolderOpen className="size-3 text-zinc-600" />
                <span>📄 Present Exhibit</span>
                <ChevronDown className="size-2.5 text-zinc-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-80 p-2 shadow-lg border-zinc-200 bg-white space-y-1"
            >
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider px-1 pb-1 border-b border-zinc-100">
                Push Exhibit to Center Bench Table
              </div>
              <div className="space-y-1">
                {exhibits.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => {
                      onPresentExhibit(ex);
                      setIsExhibitPopoverOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-zinc-100 transition-colors flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-zinc-900 truncate">
                        {ex.label} · {ex.name}
                      </div>
                      <div className="text-[10.5px] text-zinc-500 font-mono">
                        {ex.type}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9.5px] font-mono shrink-0 py-0"
                    >
                      {ex.admissibility}
                    </Badge>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Cite BNS / BSA Statute Popover */}
          <Popover
            open={isStatutePopoverOpen}
            onOpenChange={setIsStatutePopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs font-medium border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 shadow-2xs gap-1.5"
              >
                <Scale className="size-3 text-zinc-600" />
                <span>⚖️ Cite BNS / BSA</span>
                <ChevronDown className="size-2.5 text-zinc-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-88 p-2 shadow-lg border-zinc-200 bg-white space-y-1"
            >
              <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider px-1 pb-1 border-b border-zinc-100">
                1-Click Quick Statutory Submissions
              </div>
              <div className="space-y-1">
                {commonStatutes.map((st) => (
                  <button
                    key={st.code}
                    type="button"
                    onClick={() => {
                      onInputChange(st.insert);
                      setIsStatutePopoverOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-zinc-100 transition-colors flex flex-col gap-0.5 text-xs"
                  >
                    <div className="font-mono font-bold text-zinc-950">
                      {st.code} · {st.label}
                    </div>
                    <div className="text-[10.5px] text-zinc-600 line-clamp-1 italic">
                      “{st.insert}”
                    </div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Target Selector: Judge vs Witness */}
        <div className="flex items-center gap-1 bg-zinc-200/70 p-0.5 rounded-lg text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setTarget("witness")}
            className={`px-2 py-0.5 rounded transition-all ${
              target === "witness"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            🗣️ Question Witness PW-1
          </button>
          <button
            type="button"
            onClick={() => setTarget("judge")}
            className={`px-2 py-0.5 rounded transition-all ${
              target === "judge"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            🎯 Address the Judge
          </button>
        </div>
      </div>

      {/* 2. Prompt / Speech Input Box */}
      <div className="relative">
        <Textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            target === "witness"
              ? "Put cross-examination question to PW-1 Dr. Kulkarni (e.g. hash timeline, custody gap)..."
              : "Address Hon'ble Bench on admissibility, precedent, or procedural law..."
          }
          rows={2}
          className="resize-none text-xs pr-28 pb-7 bg-white border-zinc-300 focus-visible:ring-zinc-900 placeholder:text-zinc-400"
        />

        {/* Bottom controls inside / under textarea */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
          <span>Enter to submit · Shift+Enter for newline</span>
          {isMicActive && (
            <span className="flex items-center gap-1 text-emerald-600 font-semibold animate-pulse">
              <span className="size-1.5 rounded-full bg-emerald-600" />
              Recording voice input...
            </span>
          )}
        </div>

        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleMic}
            title={isMicActive ? "Stop voice listening" : "Hold to speak via mic"}
            className={`h-7 px-2 text-[11px] ${
              isMicActive
                ? "bg-rose-100 text-rose-700 animate-pulse"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <Mic className="size-3.5 mr-1" />
            <span className="hidden sm:inline">
              {isMicActive ? "Listening..." : "Hold to Speak"}
            </span>
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={!inputValue.trim() || isStreaming}
            onClick={() => onSubmit(target)}
            className="h-7 px-3 text-xs bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 font-medium shadow-xs"
          >
            <span>Submit to Court</span>
            <Send className="size-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
