"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStreamTurn } from "@/hooks/useStreamTurn";
import { CourtroomTopBar } from "@/components/courtroom/CourtroomTopBar";
import { CaseDossierDrawer } from "@/components/courtroom/CaseDossierDrawer";
import { CourtroomArena2D } from "@/components/courtroom/CourtroomArena2D";
import { TranscriptPanel } from "@/components/courtroom/TranscriptPanel";
import { AdvocateConsole } from "@/components/courtroom/AdvocateConsole";
import { AgentPersonaModal } from "@/components/courtroom/AgentPersonaModal";
import { VerdictSummaryModal } from "@/components/courtroom/VerdictSummaryModal";
import { OBJECTION_GROUNDS } from "@/data/courtroomArenaData";
import {
  AgentPersona,
  ChronologyFact,
  CourtroomExhibit,
  CourtroomRole,
  ObjectionGround,
  SpeakerId,
  TranscriptItem,
  WitnessProfile,
} from "@/types/courtroomArena";
import { useDashboard } from "@/context/DashboardContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CaseDetail {
  case: { id: string; title: string; category: string; court: string; charges: string; summary: string };
  parties: Array<{ side: string; name: string; role: string; persona_prompt: string; is_witness: boolean; personality: string }>;
  evidence: Array<{ id: string; exhibit_label: string; title: string; description: string; content: string }>;
  chunks: Array<{ id: string; section_label: string; text: string; token_count: number }>;
}

interface TurnRow {
  id: string;
  seq: number;
  actor: string;
  speaker_name: string;
  kind: string;
  text: string;
  citation: string;
  created_at: string;
}

const seatToSpeaker = (seat: string): SpeakerId => {
  if (seat === "judge") return "judge";
  if (seat === "prosecution") return "prosecutor";
  if (seat === "defense") return "defense";
  if (seat === "witness") return "witness";
  return "clerk";
};

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return "";
  }
};

const turnToItem = (row: TurnRow, studentRole: CourtroomRole): TranscriptItem => {
  const roleMap: Record<string, SpeakerId> = {
    judge: "judge",
    prosecutor: "prosecutor",
    defense: "defense",
    witness: "witness",
    student: studentRole === "defense" ? "defense" : "prosecutor",
  };
  return {
    id: row.id,
    speaker: row.speaker_name,
    speakerRole: roleMap[row.actor] ?? "clerk",
    content: row.text,
    timestamp: fmt(row.created_at),
    citation: row.citation || undefined,
    kind: (row.kind as TranscriptItem["kind"]) || "standard",
  };
};

export default function CourtroomArenaPage() {
  const params = useParams();
  const caseId = String(params.id ?? "");
  const { showNotification } = useDashboard();

  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [studentRole, setStudentRole] = useState<CourtroomRole>("defense");
  const [durationSec, setDurationSec] = useState(180);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [ended, setEnded] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [activeSpeaker, setActiveSpeaker] = useState<SpeakerId | null>("judge");
  const [activeExhibit, setActiveExhibit] = useState<CourtroomExhibit | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<SpeakerId | null>(null);
  const [score, setScore] = useState<null | {
    argument_score: number | null;
    objection_score: number | null;
    composure_score: number | null;
    legal_accuracy_score: number | null;
    overall: number | null;
    judge_summary: string;
    strengths: string[];
    weaknesses: string[];
  }>(null);
  const [verdictLoading, setVerdictLoading] = useState(false);

  const {
    streaming,
    streamingItem,
    push: pushStream,
    error: streamError,
  } = useStreamTurn(sessionId ?? "");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/cases/${encodeURIComponent(caseId)}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Case not found");
        if (!cancelled) setDetail(json);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Failed to load case");
      }
    })();
    return () => { cancelled = true; };
  }, [caseId]);

  useEffect(() => {
    if (!sessionId || ended) return;
    const t = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [sessionId, ended]);

  const startSession = useCallback(async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, studentRole, durationSec }),
      });
      const sess = await res.json();
      if (!res.ok) throw new Error(sess.error ?? "Could not start session");
      setSessionId(sess.id);
      setEnded(false);
      setElapsed(0);
      setTranscript([]);
      setScore(null);

      const introRes = await fetch(`/api/sessions/${sess.id}/intro`, { method: "POST" });
      const intro = await introRes.json();
      if (introRes.ok && intro.turn) {
        setTranscript([turnToItem(intro.turn, studentRole)]);
        if (intro.reasoning?.length) {
          showNotification(intro.reasoning[0]);
        }
      }
      showNotification("Courtroom session started. You are on the record now.");
    } catch (e) {
      showNotification(e instanceof Error ? e.message : "Could not start session");
    } finally {
      setStarting(false);
    }
  }, [caseId, studentRole, durationSec, showNotification]);

  const handleSubmitInput = async (target: "judge" | "witness") => {
    const text = inputValue.trim();
    if (!text || !sessionId) return;
    setInputValue("");
    const finalItem = await pushStream(text, target);
    if (finalItem) {
      setTranscript((prev) => [...prev, finalItem]);
      setActiveSpeaker(finalItem.speakerRole ?? target);
    } else if (streamError) {
      showNotification(streamError);
    }
  };

  const handleRaiseObjection = async (ground: ObjectionGround) => {
    if (!sessionId) return;
    const finalItem = await pushStream(ground.suggestedSpeech, "objection");
    if (finalItem) {
      setTranscript((prev) => [...prev, finalItem]);
    } else if (streamError) {
      showNotification(streamError);
    }
  };

  const requestVerdict = useCallback(async () => {
    if (!sessionId) return;
    setVerdictLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}/verdict`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Verdict failed");
      setScore(json);
      setEnded(true);
    } catch (e) {
      showNotification(e instanceof Error ? e.message : "Verdict failed");
    } finally {
      setVerdictLoading(false);
    }
  }, [sessionId, showNotification]);

  const exhibits: CourtroomExhibit[] = (detail?.evidence ?? []).map((e, i) => ({
    id: e.id,
    code: `Ex-${String.fromCharCode(65 + i)}`,
    label: e.exhibit_label,
    name: e.title,
    type: "Document",
    admissibility: "Pending Verification",
    timestamp: "",
    source: "Case file",
    description: e.description,
  }));

  const facts: ChronologyFact[] = (detail?.chunks ?? []).map((c, i) => ({
    id: c.id || `chunk-${i}`,
    time: c.section_label || "",
    title: c.section_label || "Case fact",
    description: c.text,
    isDiscrepancy: false,
    sectionRef: c.section_label || "",
  }));

  const personas: Record<string, AgentPersona> = {};
  for (const p of detail?.parties ?? []) {
    const id = seatToSpeaker(p.side);
    personas[id] = {
      id,
      name: p.name,
      roleTitle: p.role,
      court: detail?.case.court ?? "",
      temperament: p.personality || p.persona_prompt || "",
      liveThought: p.persona_prompt || "",
      audioState: "idle",
      memoryTrace: [p.persona_prompt || p.role],
      legalFocus: "BNS / BNSS / BSA",
      samplePhrase: `I appear in the matter of ${detail?.case.title ?? "this case"}.`,
    };
  }

  const witnessParty = (detail?.parties ?? []).find((p) => p.is_witness);
  const witnessProfile: WitnessProfile = {
    name: witnessParty?.name ?? "PW-1",
    title: witnessParty?.role ?? "Witness",
    designation: witnessParty?.role ?? "Prosecution witness",
    oathStatus: "Under oath",
    composure: 74,
    composureLabel: "Steady",
    keyVulnerability: witnessParty?.personality ?? "To be tested in cross-examination",
    boundaryRules: ["Answer only from personal knowledge", "Stay within the case facts"],
  };

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="max-w-md text-center space-y-3 p-6">
          <p className="text-sm font-bold text-zinc-950">{loadError}</p>
          <p className="text-xs text-zinc-500">Check the case id in the URL.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="text-xs h-8">Retry</Button>
        </div>
      </div>
    );
  }

  if (!detail) return <div className="h-screen bg-white" />;

  if (!sessionId) {
    return (
      <div className="h-screen w-screen overflow-y-auto bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="space-y-1">
            <Badge variant="outline" className="font-mono text-[10px] uppercase">{detail.case.category}</Badge>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">{detail.case.title}</h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{detail.case.summary}</p>
            <p className="text-xs text-zinc-500 font-mono">{detail.case.court}</p>
            <p className="text-xs text-zinc-700"><span className="font-semibold">Charges:</span> {detail.case.charges}</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-900">Your role</label>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => setStudentRole("defense")} variant={studentRole === "defense" ? "default" : "outline"} className="text-xs h-10">Defense Counsel</Button>
              <Button onClick={() => setStudentRole("prosecution")} variant={studentRole === "prosecution" ? "default" : "outline"} className="text-xs h-10">Public Prosecutor</Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-900">Session length</label>
            <div className="grid grid-cols-4 gap-2">
              {[120, 180, 300, 600].map((s) => (
                <Button key={s} onClick={() => setDurationSec(s)} variant={durationSec === s ? "default" : "outline"} className="text-xs h-9">{s / 60} min</Button>
              ))}
            </div>
          </div>
          <Button disabled={starting} onClick={() => void startSession()} className="w-full h-11 text-sm bg-zinc-950 text-white hover:bg-zinc-800">
            {starting ? "Starting session..." : "Enter the courtroom"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-white select-none">
      <CourtroomTopBar
        currentRole={studentRole}
        onRoleToggle={() => setStudentRole((r) => (r === "defense" ? "prosecution" : "defense"))}
        coCounselEnabled={true}
        onCoCounselToggle={() => showNotification("Role changed. Applies to the next session you start.")}
        isLeftPanelOpen={isLeftPanelOpen}
        onToggleLeftPanel={() => setIsLeftPanelOpen((prev) => !prev)}
        onRequestVerdict={() => void requestVerdict()}
        caseId={detail.case.id}
        caseTitle={detail.case.title}
        secondsElapsed={elapsed}
      />
      <div className="flex-1 flex overflow-hidden min-h-0">
        <CaseDossierDrawer
          isOpen={isLeftPanelOpen}
          onToggle={() => setIsLeftPanelOpen((prev) => !prev)}
          facts={facts}
          exhibits={exhibits}
          activeExhibitId={activeExhibit?.id ?? ""}
          onSelectExhibit={(ex) => { setActiveExhibit(ex); showNotification(`Presented ${ex.label} to Hon'ble Bench.`); }}
          statutes={[]}
          precedents={[]}
          witnessProfile={witnessProfile}
          currentWitnessComposure={74}
          onCiteFact={(t) => setInputValue(t)}
        />
        <CourtroomArena2D
          activeSpeaker={activeSpeaker}
          onSelectSpeaker={(s) => { setActiveSpeaker(s); setSelectedPersonaId(s); }}
          activeExhibit={activeExhibit}
          onClearExhibit={() => setActiveExhibit(null)}
          witnessProfile={witnessProfile}
          witnessComposure={74}
          personas={personas}
          coCounselHints={[]}
          coCounselEnabled={false}
          onInsertQuestion={(t) => setInputValue(t)}
          onCitePrecedent={(t) => setInputValue((prev) => (prev ? `${prev} ${t}` : t))}
        />
        <section className="w-96 shrink-0 border-l border-zinc-200 bg-white flex flex-col h-full overflow-hidden">
          <TranscriptPanel transcript={streamingItem ? [...transcript, streamingItem] : transcript} />
          <AdvocateConsole
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={(target) => void handleSubmitInput(target)}
            onRaiseObjection={(g) => void handleRaiseObjection(g)}
            objectionGrounds={OBJECTION_GROUNDS}
            exhibits={exhibits}
            onPresentExhibit={(ex) => { setActiveExhibit(ex); showNotification(`Presented ${ex.label} to Hon'ble Bench.`); }}
            isStreaming={streaming}
          />
        </section>
      </div>
      <AgentPersonaModal speakerId={selectedPersonaId} isOpen={Boolean(selectedPersonaId)} onClose={() => setSelectedPersonaId(null)} personas={personas} />
      <VerdictSummaryModal isOpen={Boolean(score)} onClose={() => setScore(null)} witnessComposure={74} score={score ?? undefined} />
      {verdictLoading && <div className="fixed bottom-4 right-4 z-50 bg-zinc-950 text-white text-xs px-3 py-2 rounded-lg">Bench is writing the verdict...</div>}
    </div>
  );
}
