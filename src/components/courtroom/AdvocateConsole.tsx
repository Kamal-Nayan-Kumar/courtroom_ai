"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Hand,
  FolderOpen,
  Scale,
  Mic,
  Send,
  ChevronDown,
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
import { useSpeech } from "@/hooks/useSpeech";

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
  const [isObjectionPopoverOpen, setIsObjectionPopoverOpen] = useState(false);
  const [isExhibitPopoverOpen, setIsExhibitPopoverOpen] = useState(false);
  const [isStatutePopoverOpen, setIsStatutePopoverOpen] = useState(false);
  const [interim, setInterim] = useState("");

  const inputRef = useRef(inputValue);
  useEffect(() => {
    inputRef.current = inputValue;
  }, [inputValue]);

  const { isListening, isRecognitionSupported, startListening, stopListening } =
    useSpeech();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSubmit(target);
      }
    }
  };

  const handleToggleMic = () => {
    if (isListening) {
      stopListening();
      setInterim("");
      return;
    }
    startListening({
      onFinal: (text) => {
        const base = inputRef.current;
        const needsSpace =
          base.length > 0 && !/\s$/.test(base) && !text.startsWith(" ");
        onInputChange(needsSpace ? `${base} ${text}` : `${base}${text}`);
      },
      onInterim: (text) => setInterim(text),
    });
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
    <div className="border-t border-zinc-200 p-3 bg-white flex flex-col gap-2.5 shrink-0 select-none min-w-0">
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg text-[11px] font-medium shrink-0">
          <button
            type="button"
            onClick={() => setTarget("witness")}
            className={`px-2 py-0.5 rounded transition-all whitespace-nowrap ${
              target === "witness"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            To Witness
          </button>
          <button
            type="button"
            onClick={() => setTarget("judge")}
            className={`px-2 py-0.5 rounded transition-all whitespace-nowrap ${
              target === "judge"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            To Judge
          </button>
        </div>

        <Popover
          open={isObjectionPopoverOpen}
          onOpenChange={setIsObjectionPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-1.5 text-[11px] gap-1 shrink-0 whitespace-nowrap"
            >
              <Hand className="size-3 shrink-0" />
              <span>Objection</span>
              <ChevronDown className="size-2.5 text-zinc-400 shrink-0" />
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
                    <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 px-1 rounded">
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

        <Popover
          open={isExhibitPopoverOpen}
          onOpenChange={setIsExhibitPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-1.5 text-[11px] gap-1 shrink-0 whitespace-nowrap"
            >
              <FolderOpen className="size-3 shrink-0" />
              <span>Exhibit</span>
              <ChevronDown className="size-2.5 text-zinc-400 shrink-0" />
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

        <Popover
          open={isStatutePopoverOpen}
          onOpenChange={setIsStatutePopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-1.5 text-[11px] gap-1 shrink-0 whitespace-nowrap"
            >
              <Scale className="size-3 shrink-0" />
              <span>Statute</span>
              <ChevronDown className="size-2.5 text-zinc-400 shrink-0" />
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
                    {st.insert}
                  </div>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Textarea
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            interim
              ? interim
              : target === "witness"
                ? "Put cross-examination question to PW-1..."
                : "Address Hon'ble Bench..."
          }
          className="resize-none text-xs bg-white border-zinc-300 focus-visible:ring-1 focus-visible:ring-zinc-400/60 focus-visible:border-zinc-400 placeholder:text-zinc-400 h-20 w-full min-w-0"
        />
        <div className="flex items-center justify-between gap-2 mt-2 min-w-0">
          <span className="text-[11px] text-zinc-400 truncate">
            Enter to send
            {isListening ? " · Recording..." : ""}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToggleMic}
              disabled={!isRecognitionSupported}
              title={
                !isRecognitionSupported
                  ? "Speech recognition not supported in this browser"
                  : isListening
                    ? "Stop"
                    : "Mic"
              }
              className={`h-8 w-8 p-0 ${isListening ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"}`}
            >
              <Mic className="size-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!inputValue.trim() || isStreaming}
              onClick={() => onSubmit(target)}
              className="h-8 px-3 text-xs bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 font-medium"
            >
              <span>Send</span>
              <Send className="size-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
