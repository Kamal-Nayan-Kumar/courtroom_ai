"use client";

import React, { useState } from "react";
import {
  Users,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Lock,
  Plus,
  Send,
  Sparkles,
  Bot,
  User,
  MessageSquare,
  Flame,
  Check,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WITNESS_PROFILES } from "@/data/prepStudioData";
import { PredictedTrap, WitnessDryRunMessage, WitnessProfile } from "@/types/prepStudio";

interface WitnessCoachingSimulatorTabProps {
  onNotify: (msg: string) => void;
}

export function WitnessCoachingSimulatorTab({
  onNotify,
}: WitnessCoachingSimulatorTabProps) {
  const [selectedWitnessId, setSelectedWitnessId] = useState<string>("pw-1");
  const [witnessProfiles, setWitnessProfiles] = useState<Record<string, WitnessProfile>>(WITNESS_PROFILES);

  const [newTaskInput, setNewTaskInput] = useState("");
  const [customQuestionInput, setCustomQuestionInput] = useState("");
  const [isSimulatingStress, setIsSimulatingStress] = useState(false);

  const activeWitness = witnessProfiles[selectedWitnessId] || witnessProfiles["pw-1"];

  const handleToggleTask = (taskId: string) => {
    setWitnessProfiles((prev) => {
      const current = prev[selectedWitnessId];
      const updatedTasks = current.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      return {
        ...prev,
        [selectedWitnessId]: { ...current, tasks: updatedTasks },
      };
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask = {
      id: `task-custom-${Date.now()}`,
      text: newTaskInput.trim(),
      completed: true,
      isCustom: true,
    };

    setWitnessProfiles((prev) => {
      const current = prev[selectedWitnessId];
      return {
        ...prev,
        [selectedWitnessId]: {
          ...current,
          tasks: [...current.tasks, newTask],
        },
      };
    });

    onNotify(`Added boundary instruction to ${activeWitness.name}.`);
    setNewTaskInput("");
  };

  const handleResponseStyleChange = (style: "factual" | "narrative" | "defensive") => {
    setWitnessProfiles((prev) => {
      const current = prev[selectedWitnessId];
      return {
        ...prev,
        [selectedWitnessId]: { ...current, responseStyle: style },
      };
    });
    onNotify(`Set ${activeWitness.name} response style to ${style}.`);
  };

  const handleComposureChange = (val: number[]) => {
    const newPercent = val[0];
    setWitnessProfiles((prev) => {
      const current = prev[selectedWitnessId];
      return {
        ...prev,
        [selectedWitnessId]: { ...current, composurePercent: newPercent },
      };
    });
  };

  const handleToggleLockTrap = (trapId: string) => {
    setWitnessProfiles((prev) => {
      const current = prev[selectedWitnessId];
      const updated = current.predictedTraps.map((tr) =>
        tr.id === trapId ? { ...tr, isLocked: !tr.isLocked } : tr
      );
      return {
        ...prev,
        [selectedWitnessId]: { ...current, predictedTraps: updated },
      };
    });
    onNotify("Locked safe pivot response into Witness AI behavioral policy.");
  };

  const handleTestTrapInDryRun = (trap: PredictedTrap) => {
    const counselMsg: WitnessDryRunMessage = {
      id: `dry-${Date.now()}-c`,
      sender: "counsel",
      speakerName: "Opposing Counsel AI (Simulated)",
      message: trap.opposingQuestion,
      timestamp: "Just now",
    };

    const witnessMsg: WitnessDryRunMessage = {
      id: `dry-${Date.now()}-w`,
      sender: "witness",
      speakerName: `${activeWitness.name} (${activeWitness.code} AI)`,
      message: trap.safePivotResponse,
      timestamp: "Just now",
      resilienceScore: 94,
      guardrailTriggered: `Rule: Deflect ${trap.trapType}`,
    };

    setWitnessProfiles((prev) => {
      const current = prev[selectedWitnessId];
      return {
        ...prev,
        [selectedWitnessId]: {
          ...current,
          dryRunMessages: [...current.dryRunMessages, counselMsg, witnessMsg],
        },
      };
    });

    onNotify(`Simulated trap test: ${trap.trapType} handled successfully.`);
  };

  const handleSendCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestionInput.trim()) return;

    const userQ = customQuestionInput.trim();
    setCustomQuestionInput("");

    const counselMsg: WitnessDryRunMessage = {
      id: `dry-${Date.now()}-c`,
      sender: "counsel",
      speakerName: "Adv. Kamal Nayan (You)",
      message: userQ,
      timestamp: "Just now",
    };

    let aiResponse = "";
    if (selectedWitnessId === "pw-1") {
      aiResponse = `“Counsel, my deposition is anchored strictly to Exhibit B. Regarding the transit custody and the 105-minute window, the station diary entry was recorded by the police IO, not the forensics lab.”`;
    } else if (selectedWitnessId === "dw-1") {
      aiResponse = `“My Lord, the UPI merchant receipt was digitally logged at 23:52 HRS. Mr. Sharma remained in my direct field of view throughout that entire contract discussion.”`;
    } else {
      aiResponse = `“The panchnama was conducted under challenging conditions, but the seal integrity on the physical seizure bag was confirmed by both independent panch witnesses.”`;
    }

    const witnessMsg: WitnessDryRunMessage = {
      id: `dry-${Date.now()}-w`,
      sender: "witness",
      speakerName: `${activeWitness.name} (${activeWitness.code} AI)`,
      message: aiResponse,
      timestamp: "Just now",
      resilienceScore: activeWitness.composurePercent >= 80 ? 92 : 79,
      guardrailTriggered: "Guardrail #1: Strict Deposition Scope",
    };

    setWitnessProfiles((prev) => {
      const current = prev[selectedWitnessId];
      return {
        ...prev,
        [selectedWitnessId]: {
          ...current,
          dryRunMessages: [...current.dryRunMessages, counselMsg, witnessMsg],
        },
      };
    });
  };

  const handleRunAutomatedStressTest = () => {
    setIsSimulatingStress(true);
    setTimeout(() => {
      setIsSimulatingStress(false);

      const stressQ: WitnessDryRunMessage = {
        id: `stress-q-${Date.now()}`,
        sender: "counsel",
        speakerName: "Opposing Counsel AI (Hostile Stress-Test)",
        message:
          "“Doctor, are you telling this Court that an unsealed secondary storage device kept in police custody over 48 hours has the exact same cryptographic integrity as the original server?”",
        timestamp: "Just now",
      };

      const stressA: WitnessDryRunMessage = {
        id: `stress-a-${Date.now()}`,
        sender: "witness",
        speakerName: `${activeWitness.name} (${activeWitness.code} AI)`,
        message:
          "“I testify strictly to the SHA-256 hash computed upon formal lab accession. Whether secondary storage satisfies Section 63(4) BSA threshold is a question of law for the Hon'ble Bench, not a matter of laboratory conjecture.”",
        timestamp: "Just now",
        resilienceScore: 96,
        guardrailTriggered: "High Stress Resilience Active · Deflected Perjury Trap",
      };

      setWitnessProfiles((prev) => {
        const current = prev[selectedWitnessId];
        return {
          ...prev,
          [selectedWitnessId]: {
            ...current,
            dryRunMessages: [...current.dryRunMessages, stressQ, stressA],
          },
        };
      });

      onNotify("Automated stress test completed: Witness AI scored 96/100 Resilience.");
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* COLUMN 1 (3 COLS): Witness Roster & Persona Selector */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="p-4 pb-3 border-b border-zinc-100">
            <CardTitle className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center justify-between">
              <span>Witness Roster</span>
              <span className="font-mono text-[10px] text-zinc-500 font-normal">
                3 Key Witnesses
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Select persona to assign tasks & dry-run cross-examination.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-2 flex flex-col gap-2">
            {Object.values(witnessProfiles).map((w) => {
              const isSelected = selectedWitnessId === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWitnessId(w.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-zinc-100/90 border-zinc-950 ring-1 ring-zinc-950 shadow-xs"
                      : "bg-white hover:bg-zinc-50 border-zinc-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-950 text-white">
                      {w.code}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono py-0.5 px-2 ${
                        w.riskLevel === "High"
                          ? "bg-rose-50 text-rose-800 border-rose-300 font-semibold"
                          : w.riskLevel === "Medium"
                          ? "bg-amber-50 text-amber-900 border-amber-300 font-semibold"
                          : "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
                      }`}
                    >
                      Risk: {w.riskLevel}
                    </Badge>
                  </div>

                  <div className="font-bold text-xs truncate mt-0.5 text-zinc-950">{w.name}</div>
                  <div className="text-[11px] line-clamp-1 text-zinc-600 font-medium">
                    {w.designation}
                  </div>

                  <div className="mt-1 pt-1.5 border-t border-zinc-200 flex items-center justify-between text-[10.5px] font-mono">
                    <span className="text-zinc-500 font-medium">Deposition Consistency:</span>
                    <span className="font-bold text-emerald-700">
                      {w.depositionConsistency}%
                    </span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Selected Witness Metadata Card */}
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="p-3.5 pb-2 border-b border-zinc-100">
            <CardTitle className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
              <Shield className="size-3.5 text-blue-800" />
              <span>Persona Isolation Guardrails</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3.5 flex flex-col gap-2.5 text-xs text-zinc-600">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-zinc-900 text-[11px]">Memory Scope:</span>
              <span className="font-mono text-[10.5px] text-zinc-500 leading-relaxed bg-zinc-50 p-2 rounded-md border border-zinc-100">
                {activeWitness.memoryScope}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2 text-[11px] font-medium">
              <Lock className="size-3.5 text-emerald-700 shrink-0" />
              <span>🔒 Strict Case-RAG Isolation (Cannot hallucinate external facts)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* COLUMN 2 (5 COLS): Witness Task Assignment & Demeanor Sliders */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="p-4 pb-3 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-zinc-950 text-white">
                  {activeWitness.code}
                </span>
                <CardTitle className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                  Witness AI Instructions & Boundaries
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                {activeWitness.roleType}
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500">
              Coached rules prevent perjury and anchor witness answers during trial.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 flex flex-col gap-5">
            {/* 1. Assigned Witness Tasks */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">
                  1. Assigned Witness Tasks ({activeWitness.tasks.filter((t) => t.completed).length}/{activeWitness.tasks.length} Active)
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {activeWitness.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                      task.completed
                        ? "bg-zinc-50/80 border-zinc-300 text-zinc-950 shadow-2xs"
                        : "bg-white border-zinc-200 text-zinc-400 line-through"
                    }`}
                  >
                    <div
                      className={`size-4 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                        task.completed
                          ? "bg-zinc-950 border-zinc-950 text-white"
                          : "border-zinc-300 bg-white"
                      }`}
                    >
                      {task.completed && <Check className="size-3" />}
                    </div>
                    <span className="leading-snug">{task.text}</span>
                  </div>
                ))}
              </div>

              {/* Add Custom Task Input */}
              <form onSubmit={handleAddTask} className="flex items-center gap-2 mt-1">
                <Input
                  placeholder="+ Add custom instruction or boundary for Witness AI..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="h-8 text-xs bg-zinc-50/70 border-zinc-200"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 px-3 text-xs bg-zinc-950 text-white hover:bg-zinc-800 shrink-0 font-medium"
                >
                  <Plus className="size-3 mr-1" />
                  Add
                </Button>
              </form>
            </div>

            {/* 2. Demeanor & Stress Sliders */}
            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-4">
              <span className="text-xs font-bold text-zinc-900">
                2. Witness Demeanor & Response Policy
              </span>

              {/* Response Style Radio Buttons */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-zinc-600">Response Style:</span>
                <div className="grid grid-cols-3 gap-2">
                  {(["factual", "narrative", "defensive"] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => handleResponseStyleChange(style)}
                      className={`p-2 rounded-lg border text-center text-xs font-medium capitalize transition-all ${
                        activeWitness.responseStyle === style
                          ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs font-semibold"
                          : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Composure Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">Composure Under Hostile Cross:</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {activeWitness.composurePercent}% Resilience
                  </span>
                </div>
                <Slider
                  value={[activeWitness.composurePercent]}
                  onValueChange={handleComposureChange}
                  max={100}
                  step={1}
                  className="py-1"
                />
                <span className="text-[10px] text-zinc-500 font-mono">
                  {activeWitness.composureLabel}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* COLUMN 3 (4 COLS): Devil's Advocate Trap Predictor & Dry-Run Chat */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="p-4 pb-2 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="size-3.5 text-amber-600" />
                <span>Predicted Opposing Traps</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 text-amber-900 border-amber-200">
                {activeWitness.predictedTraps.length} Identified
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500">
              Anticipated questions opposing counsel is mathematically likely to ask.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-3.5 flex flex-col gap-3">
            {activeWitness.predictedTraps.map((trap) => (
              <div
                key={trap.id}
                className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white transition-all flex flex-col gap-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[9.5px] font-mono bg-white text-zinc-800 border-zinc-200">
                    {trap.probability}% Probability
                  </Badge>
                  <span className="text-[10px] font-semibold text-amber-900">
                    {trap.trapType}
                  </span>
                </div>

                <p className="font-serif italic text-xs text-zinc-950 leading-relaxed font-medium">
                  {trap.opposingQuestion}
                </p>

                <div className="p-2 rounded bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-950">
                  <span className="font-bold text-amber-900">Vulnerability: </span>
                  <span>{trap.vulnerability}</span>
                </div>

                <div className="p-2 rounded bg-emerald-50/60 border border-emerald-200/70 text-[11px] text-emerald-950">
                  <span className="font-bold text-emerald-900">Coached Safe Pivot: </span>
                  <span className="font-serif italic">{trap.safePivotResponse}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleLockTrap(trap.id)}
                    className="h-7 px-2 text-[10px] border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                  >
                    {trap.isLocked ? (
                      <>
                        <Lock className="size-3 mr-1 text-emerald-700" />
                        <span>Locked Safe</span>
                      </>
                    ) : (
                      <>
                        <span>Lock Safe Response</span>
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleTestTrapInDryRun(trap)}
                    className="h-7 px-2.5 text-[10px] bg-zinc-950 text-white hover:bg-zinc-800"
                  >
                    <span>Test in Dry-Run →</span>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* INTERACTIVE MINI DRY-RUN SIMULATOR (Bottom) */}
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="p-3.5 pb-2 border-b border-zinc-100 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xs font-bold text-zinc-950 flex items-center gap-1.5">
                <MessageSquare className="size-3.5 text-zinc-900" />
                <span>Live Adversarial Dry-Run</span>
              </CardTitle>
              <CardDescription className="text-[10px] text-zinc-500">
                Stress-test witness responses against your configured rules.
              </CardDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRunAutomatedStressTest}
              disabled={isSimulatingStress}
              className="h-7 px-2 text-[10.5px] border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 shrink-0 font-medium"
            >
              <Flame className="size-3 mr-1 text-amber-600" />
              <span>{isSimulatingStress ? "Running Stress..." : "⚡ Stress-Test"}</span>
            </Button>
          </CardHeader>

          <CardContent className="p-3 flex flex-col gap-2.5">
            {/* Chat Thread Container */}
            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
              {activeWitness.dryRunMessages.map((msg) => {
                const isCounsel = msg.sender === "counsel";
                return (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col gap-1 ${
                      isCounsel
                        ? "bg-zinc-50 border-zinc-200/90 ml-2"
                        : "bg-blue-50/40 border-blue-200/80 mr-2"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-zinc-800">{msg.speakerName}</span>
                      <span className="text-zinc-400">{msg.timestamp}</span>
                    </div>

                    <p className={`text-[11.5px] leading-relaxed ${isCounsel ? "text-zinc-800 font-sans" : "text-zinc-950 font-serif italic"}`}>
                      {msg.message}
                    </p>

                    {msg.resilienceScore && (
                      <div className="mt-1 pt-1 border-t border-blue-200/60 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-emerald-700 font-bold">
                          Resilience Score: {msg.resilienceScore}/100
                        </span>
                        <span className="text-blue-900 truncate max-w-[150px]">
                          {msg.guardrailTriggered}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Counsel Question Input Box */}
            <form onSubmit={handleSendCustomQuestion} className="flex items-center gap-2 pt-1 border-t border-zinc-100">
              <Input
                placeholder="Type a tough cross-examination question..."
                value={customQuestionInput}
                onChange={(e) => setCustomQuestionInput(e.target.value)}
                className="h-8 text-xs bg-zinc-50 border-zinc-200"
              />
              <Button
                type="submit"
                size="sm"
                className="h-8 px-2.5 bg-zinc-950 text-white hover:bg-zinc-800 shrink-0"
              >
                <Send className="size-3" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
