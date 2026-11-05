"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseHeaderSticky } from "@/components/prep/CaseHeaderSticky";
import { CaseFileChronologyTab } from "@/components/prep/CaseFileChronologyTab";
import { RagLegalResearchTab } from "@/components/prep/RagLegalResearchTab";
import { WitnessCoachingSimulatorTab } from "@/components/prep/WitnessCoachingSimulatorTab";
import {
  INITIAL_PINNED_FACTS,
  INITIAL_TRIAL_BRIEF,
} from "@/data/prepStudioData";
import {
  LegalRole,
  PinnedTrialFact,
  RetrievedAuthority,
  TrialBriefState,
} from "@/types/prepStudio";
import { useDashboard } from "@/context/DashboardContext";

export default function CasePrepStudioPage() {
  const { showNotification } = useDashboard();
  const [activeTab, setActiveTab] = useState<string>("witness-lab");
  const [currentRole, setCurrentRole] = useState<LegalRole>("defense");

  const [pinnedFacts, setPinnedFacts] = useState<PinnedTrialFact[]>(INITIAL_PINNED_FACTS);
  const [trialBrief, setTrialBrief] = useState<TrialBriefState>(INITIAL_TRIAL_BRIEF);
  const [isGeneratingTheory, setIsGeneratingTheory] = useState<boolean>(false);

  const handleRoleToggle = () => {
    setCurrentRole((prev) => {
      const nextRole = prev === "defense" ? "prosecution" : "defense";
      showNotification(
        `Switched perspective to ${nextRole === "defense" ? "Defense Counsel" : "Public Prosecutor"}. Strategies updated.`
      );
      return nextRole;
    });
  };

  const handlePinFact = (fact: PinnedTrialFact) => {
    setPinnedFacts((prev) => [fact, ...prev]);
  };

  const handleUnpinFact = (id: string) => {
    setPinnedFacts((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSaveAuthorityToBrief = (auth: RetrievedAuthority) => {
    setTrialBrief((prev) => ({
      ...prev,
      savedPrecedents: [...prev.savedPrecedents, auth],
    }));
  };

  const handleRemoveAuthorityFromBrief = (id: string) => {
    setTrialBrief((prev) => ({
      ...prev,
      savedPrecedents: prev.savedPrecedents.filter((p) => p.id !== id),
    }));
  };

  const handleGenerateTheory = () => {
    setIsGeneratingTheory(true);
    setTimeout(() => {
      setIsGeneratingTheory(false);
      setTrialBrief((prev) => ({
        ...prev,
        generatedTheory: {
          title: "Three-Pronged Strategic Synthesis (Groq Llama-3.3 70B)",
          points: [
            "1. Move upfront preliminary objection under BSA Sec 63(4) citing Arjun Panditrao (2020) to prevent marking of Exhibit A into evidence.",
            "2. Cross-examine PW-1 Dr. Kulkarni strictly on the 105-minute gap between seizure and inward log book entry #89.",
            "3. Anchor alibi through DW-1 Meera Nair's authenticated UPI digital transaction receipt timed at 23:52 HRS under BSA Sec 11.",
          ],
          generatedAt: "Synthesized in 340ms via Groq RAG Engine",
        },
      }));
      showNotification("Groq Llama-3.3 synthesized 3-point trial theory from pinned facts & precedents.");
    }, 500);
  };

  const completedTasksCount = (pinnedFacts.length > 0 ? 1 : 0) + (trialBrief.savedPrecedents.length > 0 ? 1 : 0) + 1;
  const totalTasksCount = 3;
  const readinessPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* 1. TOP CASE CONTEXT HEADER & READINESS BAR */}
      <CaseHeaderSticky
        currentRole={currentRole}
        onRoleToggle={handleRoleToggle}
        readinessPercent={readinessPercent}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasksCount}
      />

      {/* 2. MAIN WORKSPACE TABS */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col gap-5"
      >
        {/* Tab Navigation List */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-1">
          <div className="overflow-x-auto max-w-full pb-1">
            <TabsList className="bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 h-auto flex flex-nowrap shrink-0">
              <TabsTrigger
                value="case-file"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs shrink-0"
              >
                <span>🗂️ 1. Case File, FIR & Chronology</span>
              </TabsTrigger>

              <TabsTrigger
                value="rag-research"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs shrink-0"
              >
                <span>⚖️ 2. RAG Legal Research & Precedent Builder</span>
              </TabsTrigger>

              <TabsTrigger
                value="witness-lab"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-2xs shrink-0"
              >
                <span>🎯 3. Witness AI Coaching & Trap Simulator</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <span className="text-xs font-mono text-zinc-500 shrink-0">
            Case ID: #402 · Active Pre-Trial Chamber
          </span>
        </div>

        {/* Tab 1: Case File, FIR & Evidence Chronology */}
        <TabsContent value="case-file" className="focus-visible:outline-none">
          <CaseFileChronologyTab
            pinnedFacts={pinnedFacts}
            onPinFact={handlePinFact}
            onUnpinFact={handleUnpinFact}
            onNotify={showNotification}
          />
        </TabsContent>

        {/* Tab 2: RAG Legal Research & Precedent Builder */}
        <TabsContent value="rag-research" className="focus-visible:outline-none">
          <RagLegalResearchTab
            currentRole={currentRole}
            trialBrief={trialBrief}
            onSaveAuthorityToBrief={handleSaveAuthorityToBrief}
            onRemoveAuthorityFromBrief={handleRemoveAuthorityFromBrief}
            onGenerateTheory={handleGenerateTheory}
            isGeneratingTheory={isGeneratingTheory}
            onNotify={showNotification}
          />
        </TabsContent>

        {/* Tab 3: Witness AI Coaching & Adversarial Trap Simulator (Hero Feature) */}
        <TabsContent value="witness-lab" className="focus-visible:outline-none">
          <WitnessCoachingSimulatorTab onNotify={showNotification} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
