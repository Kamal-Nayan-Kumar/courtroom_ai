"use client";

import React, { useState } from "react";
import {
  Gavel,
  Shield,
  UserCheck,
  Sparkles,
  BookMarked,
  Cpu,
  Radio,
  CheckCircle2,
  Code2,
  MessageSquare,
} from "lucide-react";
import { COURTROOM_AGENTS } from "../data/courtroomData";

export function AutonomousAgentsSection() {
  const [activeAgentId, setActiveAgentId] = useState<string>("judge");

  const agentIcons: Record<string, React.ReactNode> = {
    judge: <Gavel className="w-5 h-5 text-amber-600" />,
    opposing: <Shield className="w-5 h-5 text-red-600" />,
    witness: <UserCheck className="w-5 h-5 text-blue-600" />,
    "co-counsel": <Sparkles className="w-5 h-5 text-amber-500" />,
    clerk: <BookMarked className="w-5 h-5 text-emerald-600" />,
  };

  const activeAgent =
    COURTROOM_AGENTS.find((a) => a.id === activeAgentId) || COURTROOM_AGENTS[0];

  return (
    <section id="agents" className="py-16 sm:py-24 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono-code font-medium mb-3">
            <Cpu className="w-3.5 h-3.5 text-zinc-900" />
            <span>Multi-Agent Orchestration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Meet the Autonomous Courtroom Agents
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Not scripted chatbots. Five specialized autonomous agents that listen concurrently,
            hold stateful legal memory, and challenge your arguments under authentic Indian procedural rules.
          </p>
        </div>

        {/* Interactive Agent Tabs / Cards Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {COURTROOM_AGENTS.map((agent) => {
            const isSelected = agent.id === activeAgentId;
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgentId(agent.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-50/90 text-zinc-950 border-amber-400 shadow-xs ring-2 ring-amber-400/25"
                    : "bg-[#FAFAFA] hover:bg-zinc-100 text-zinc-900 border-zinc-200/90"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-amber-100/90 border border-amber-300"
                        : "bg-white border border-zinc-200"
                    }`}
                  >
                    {agentIcons[agent.id]}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>
                <div>
                  <div
                    className={`text-[11px] font-mono-code ${
                      isSelected ? "text-amber-800 font-semibold" : "text-zinc-500"
                    }`}
                  >
                    {agent.role.replace("The ", "")}
                  </div>
                  <div className="font-bold text-xs sm:text-sm mt-0.5 leading-snug line-clamp-1">
                    {agent.id === "judge" && "Justice Vikramaditya"}
                    {agent.id === "opposing" && "Adv. Mihir Salve"}
                    {agent.id === "witness" && "PW / DW Personas"}
                    {agent.id === "co-counsel" && "Adv. Saathi"}
                    {agent.id === "clerk" && "Munshi AI"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Inspector Card for Active Agent */}
        <div className="rounded-2xl border border-zinc-200/90 bg-[#FAFAFA] p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Overview Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-xs font-semibold text-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Agent Architecture Spec</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-zinc-950">{activeAgent.name}</h3>
                <p className="text-sm font-semibold text-zinc-600 mt-0.5">{activeAgent.role}</p>
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed">
                {activeAgent.tagline}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-950 block">Core Specialty</span>
                    <span className="text-xs text-zinc-600">{activeAgent.specialization}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Radio className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-950 block">Listening Trigger</span>
                    <span className="text-xs text-zinc-600">{activeAgent.listeningTrigger}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <BookMarked className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-zinc-950 block">Statutory Focus</span>
                    <span className="text-xs text-zinc-600 font-mono-code">{activeAgent.statuteFocus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Execution & Reasoning Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Dialogue Quote Box */}
              <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-800">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Real-Time Trial Utterance</span>
                  </div>
                  <span className="font-mono-code text-[11px] text-zinc-400">Audio Synth: Active</span>
                </div>
                <blockquote className="text-sm sm:text-base font-serif italic text-zinc-900 leading-relaxed border-l-2 border-amber-500 pl-3.5 my-1">
                  {activeAgent.sampleDialogue}
                </blockquote>
              </div>

              {/* Autonomous Decision / Logic Hook */}
              <div className="p-5 rounded-xl bg-zinc-900 text-white shadow-md font-mono text-xs border border-zinc-800">
                <div className="flex items-center justify-between text-xs text-zinc-300 pb-2.5 border-b border-zinc-700/80 mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span className="text-zinc-100 font-semibold">Autonomous Agent Policy Node</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Live Evaluation
                  </span>
                </div>
                <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed text-xs font-mono">
                  {activeAgent.reasoningSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
