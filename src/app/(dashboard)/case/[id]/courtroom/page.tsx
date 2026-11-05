"use client";

import React, { useState } from "react";
import { CourtroomTopBar } from "@/components/courtroom/CourtroomTopBar";
import { CaseDossierDrawer } from "@/components/courtroom/CaseDossierDrawer";
import { CourtroomArena2D } from "@/components/courtroom/CourtroomArena2D";
import { TranscriptPanel } from "@/components/courtroom/TranscriptPanel";
import { AdvocateConsole } from "@/components/courtroom/AdvocateConsole";
import { AgentPersonaModal } from "@/components/courtroom/AgentPersonaModal";
import { VerdictSummaryModal } from "@/components/courtroom/VerdictSummaryModal";
import {
  AGENT_PERSONAS,
  CHRONOLOGY_FACTS,
  INITIAL_CO_COUNSEL_HINTS,
  INITIAL_EXHIBITS,
  INITIAL_TRANSCRIPT,
  OBJECTION_GROUNDS,
  PINNED_PRECEDENTS,
  PINNED_STATUTES,
  WITNESS_ACTIVE_PROFILE,
} from "@/data/courtroomArenaData";
import {
  CourtroomExhibit,
  CourtroomRole,
  ObjectionGround,
  SpeakerId,
  TranscriptItem,
} from "@/types/courtroomArena";
import { useDashboard } from "@/context/DashboardContext";

export default function CourtroomArenaPage() {
  const { showNotification } = useDashboard();

  // Layout State
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [currentRole, setCurrentRole] = useState<CourtroomRole>("defense");
  const [coCounselEnabled, setCoCounselEnabled] = useState(true);

  // Active Simulation State
  const [activeSpeaker, setActiveSpeaker] = useState<SpeakerId | null>("witness");
  const [activeExhibit, setActiveExhibit] = useState<CourtroomExhibit | null>(
    INITIAL_EXHIBITS[0] // Exhibit A
  );
  const [witnessComposure, setWitnessComposure] = useState(74);
  const [transcript, setTranscript] = useState<TranscriptItem[]>(INITIAL_TRANSCRIPT);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Modals
  const [selectedPersonaId, setSelectedPersonaId] = useState<SpeakerId | null>(null);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isVerdictModalOpen, setIsVerdictModalOpen] = useState(false);

  // Co-Counsel hints state
  const [coCounselHints, setCoCounselHints] = useState(INITIAL_CO_COUNSEL_HINTS);

  // Switch counsel perspective
  const handleRoleToggle = () => {
    setCurrentRole((prev) => {
      const nextRole = prev === "defense" ? "prosecution" : "defense";
      showNotification(
        `Switched perspective to ${
          nextRole === "defense" ? "Defense Counsel" : "Public Prosecutor"
        }. Multi-agent bus updated.`
      );
      return nextRole;
    });
  };

  // Co-Counsel AI toggle
  const handleCoCounselToggle = () => {
    setCoCounselEnabled((prev) => {
      const next = !prev;
      showNotification(
        next
          ? "Co-Counsel AI whispers set to Proactive."
          : "Co-Counsel AI muted for Strict Trial Mode."
      );
      return next;
    });
  };

  // Select desk in 2D courtroom -> Highlight & Inspect
  const handleSelectSpeaker = (speakerId: SpeakerId) => {
    setActiveSpeaker(speakerId);
    setSelectedPersonaId(speakerId);
    setIsPersonaModalOpen(true);
  };

  // Exhibit selection from Left Drawer
  const handleSelectExhibit = (exhibit: CourtroomExhibit) => {
    setActiveExhibit(exhibit);
    showNotification(`Presented ${exhibit.label} to Hon'ble Bench.`);
    // Add transcript notice
    const newEntry: TranscriptItem = {
      id: `notice-${Date.now()}`,
      speaker: "Court Stenographer",
      speakerRole: "clerk",
      content: `[ Exhibit on Record: ${exhibit.label} (${exhibit.name}) presented before Hon'ble Justice V. Gopalan ]`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      kind: "standard",
    };
    setTranscript((prev) => [...prev, newEntry]);
  };

  // Insert question text from Co-Counsel or Fact citing
  const handleInsertQuestion = (text: string) => {
    setInputValue(text);
    showNotification("Transferred question into advocate mic console.");
  };

  // Cite precedent from Co-Counsel
  const handleCitePrecedent = (text: string) => {
    setInputValue((prev) => (prev ? `${prev} ${text}` : text));
    showNotification("Appended Supreme Court authority into argument.");
  };

  // Raise Objection Action
  const handleRaiseObjection = (ground: ObjectionGround) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const objectionItem: TranscriptItem = {
      id: `obj-${Date.now()}`,
      speaker:
        currentRole === "defense"
          ? "YOU (Defense Counsel)"
          : "YOU (Public Prosecutor)",
      speakerRole: currentRole === "defense" ? "defense" : "prosecutor",
      content: ground.suggestedSpeech,
      timestamp,
      citation: `Objection raised under ${ground.act} ${ground.section} · ${ground.label}`,
      kind: "objection",
    };

    setTranscript((prev) => [...prev, objectionItem]);
    setActiveSpeaker("defense");
    setIsStreaming(true);

    // Simulated Judge ruling after 800ms
    setTimeout(() => {
      const isSustained = ground.section.includes("63") || ground.section.includes("146");
      const judgeItem: TranscriptItem = {
        id: `ruling-${Date.now()}`,
        speaker: "Hon'ble Justice V. Gopalan (Judge AI)",
        speakerRole: "judge",
        content: isSustained
          ? `🔨 OBJECTION SUSTAINED. The ${ground.label} is well-taken under ${ground.act} ${ground.section}. The record is struck from the active deposition.`
          : `🔨 OBJECTION OVERRULED. The question is relevant to test the witness's credit under Section 148 BSA. Witness shall answer.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        citation: isSustained ? "Rule: Sustained" : "Rule: Overruled",
        kind: "ruling",
      };

      setTranscript((prev) => [...prev, judgeItem]);
      setActiveSpeaker("judge");
      setIsStreaming(false);

      if (isSustained) {
        setWitnessComposure((prev) => Math.max(35, prev - 12));
      }
    }, 850);
  };

  // Submit Text/Speech Input
  const handleSubmitInput = (target: "judge" | "witness") => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const userMessage: TranscriptItem = {
      id: `user-${Date.now()}`,
      speaker:
        currentRole === "defense"
          ? "YOU (Defense Counsel)"
          : "YOU (Public Prosecutor)",
      speakerRole: currentRole === "defense" ? "defense" : "prosecutor",
      content: userText,
      timestamp,
      citation: target === "judge" ? "Submission to Bench" : "Cross-Examination of PW-1",
      kind: "standard",
    };

    setTranscript((prev) => [...prev, userMessage]);
    setInputValue("");
    setActiveSpeaker("defense");
    setIsStreaming(true);

    // Multi-agent reaction
    setTimeout(() => {
      const responseTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      if (target === "witness") {
        // PW-1 rattles and responds
        const nextComposure = Math.max(38, witnessComposure - 14);
        setWitnessComposure(nextComposure);

        const witnessResponse: TranscriptItem = {
          id: `resp-w-${Date.now()}`,
          speaker: "PW-1 Dr. Rajesh Kulkarni (Witness AI)",
          speakerRole: "witness",
          content:
            "Counsel, as I stated, the police constable delivered the drive without a spot cryptographic seal. While the SHA-256 match confirmed the file was not altered in our lab vault, I cannot scientifically vouch for the 105-minute transit window...",
          timestamp: responseTime,
          citation: "Deposition Vol. II, Para 16 · Chain of Custody Conceded",
          kind: "witness",
        };

        setTranscript((prev) => [...prev, witnessResponse]);
        setActiveSpeaker("witness");
        setIsStreaming(false);

        // Update co-counsel hint with finishing move
        setCoCounselHints((prev) => [
          {
            id: `hint-win-${Date.now()}`,
            badge: "Decisive Impeachment",
            title: "Exhibit A Excluded under BSA Sec 63(4)",
            whisper:
              "PW-1 has formally conceded the custody gap! Now address Justice Gopalan to move a formal oral motion excluding Exhibit A under Arjun Panditrao.",
            suggestedAction:
              "My Lord, in view of PW-1's unequivocal admission of the 105-minute unsealed gap, Exhibit A must be excluded under Section 63(4) BSA as held in Arjun Panditrao Khotkar (2020) 7 SCC 1.",
            statuteRef: "BSA Sec 63(4)",
            precedentRef: "Arjun Panditrao Khotkar (2020) 7 SCC 1",
          },
          ...prev,
        ]);
      } else {
        // Bench responds
        const judgeResponse: TranscriptItem = {
          id: `resp-j-${Date.now()}`,
          speaker: "Hon'ble Justice V. Gopalan (Judge AI)",
          speakerRole: "judge",
          content:
            "Counsel, the Bench has noted your submission on the custodial gap. Public Prosecutor, you have 2 minutes to produce the contemporaneous spot hash receipt under Section 63(4) BSA, failing which Exhibit A shall stand excluded.",
          timestamp: responseTime,
          citation: "Bench Directive · Interlocutory Order",
          kind: "ruling",
        };

        setTranscript((prev) => [...prev, judgeResponse]);
        setActiveSpeaker("judge");
        setIsStreaming(false);
      }
    }, 850);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#F7F7F5] select-none">
      {/* 1. TOP COURTROOM SESSION BAR */}
      <CourtroomTopBar
        currentRole={currentRole}
        onRoleToggle={handleRoleToggle}
        coCounselEnabled={coCounselEnabled}
        onCoCounselToggle={handleCoCounselToggle}
        isLeftPanelOpen={isLeftPanelOpen}
        onToggleLeftPanel={() => setIsLeftPanelOpen((prev) => !prev)}
        onRequestVerdict={() => setIsVerdictModalOpen(true)}
      />

      {/* 2. THE 3-PANE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* PANE 1: Case File & Pinned Prep Drawer (Collapsible) */}
        <CaseDossierDrawer
          isOpen={isLeftPanelOpen}
          onToggle={() => setIsLeftPanelOpen((prev) => !prev)}
          facts={CHRONOLOGY_FACTS}
          exhibits={INITIAL_EXHIBITS}
          activeExhibitId={activeExhibit?.id || ""}
          onSelectExhibit={handleSelectExhibit}
          statutes={PINNED_STATUTES}
          precedents={PINNED_PRECEDENTS}
          witnessProfile={WITNESS_ACTIVE_PROFILE}
          currentWitnessComposure={witnessComposure}
          onCiteFact={handleInsertQuestion}
        />

        {/* PANE 2: Center 2D Indian Courtroom Architectural View */}
        <CourtroomArena2D
          activeSpeaker={activeSpeaker}
          onSelectSpeaker={handleSelectSpeaker}
          activeExhibit={activeExhibit}
          onClearExhibit={() => setActiveExhibit(null)}
          witnessProfile={WITNESS_ACTIVE_PROFILE}
          witnessComposure={witnessComposure}
          personas={AGENT_PERSONAS}
          coCounselHints={coCounselHints}
          coCounselEnabled={coCounselEnabled}
          onInsertQuestion={handleInsertQuestion}
          onCitePrecedent={handleCitePrecedent}
        />

        {/* PANE 3: Live Multi-Agent Streaming Transcript & Advocate Controls */}
        <section className="w-80 md:w-96 xl:w-104 shrink-0 border-l border-zinc-200 bg-white flex flex-col h-full overflow-hidden">
          <TranscriptPanel transcript={transcript} />
          <AdvocateConsole
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmitInput}
            onRaiseObjection={handleRaiseObjection}
            objectionGrounds={OBJECTION_GROUNDS}
            exhibits={INITIAL_EXHIBITS}
            onPresentExhibit={handleSelectExhibit}
            isStreaming={isStreaming}
          />
        </section>
      </div>

      {/* 3. MODALS */}
      <AgentPersonaModal
        speakerId={selectedPersonaId}
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        personas={AGENT_PERSONAS}
      />

      <VerdictSummaryModal
        isOpen={isVerdictModalOpen}
        onClose={() => setIsVerdictModalOpen(false)}
        witnessComposure={witnessComposure}
      />
    </div>
  );
}
