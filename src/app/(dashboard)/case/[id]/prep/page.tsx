"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FileText, Scale, Users, Send, Loader2, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useDashboard } from "@/context/DashboardContext";

interface CaseDetail {
  case: { id: string; title: string; category: string; court: string; charges: string; summary: string };
  parties: Array<{ side: string; name: string; role: string; persona_prompt: string; is_witness: boolean; personality: string }>;
  evidence: Array<{ id: string; exhibit_label: string; title: string; description: string; content: string }>;
  chunks: Array<{ id: string; section_label: string; text: string; token_count: number }>;
}

interface ChatMsg {
  role: "user" | "assistant";
  text: string;
}

export default function CasePrepStudioPage() {
  const params = useParams();
  const caseId = String(params.id ?? "");
  let showNotification: ((msg: string) => void) | null = null;
  try {
    showNotification = useDashboard().showNotification;
  } catch {
    showNotification = null;
  }
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("case-file");

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [asking, setAsking] = useState(false);
  const [useWeb, setUseWeb] = useState(false);

  const [theory, setTheory] = useState<string | null>(null);
  const [theoryLoading, setTheoryLoading] = useState(false);

  const [witnessThreads, setWitnessThreads] = useState<Record<string, ChatMsg[]>>({});
  const [witnessDrafts, setWitnessDrafts] = useState<Record<string, string>>({});
  const [witnessLoading, setWitnessLoading] = useState<Record<string, boolean>>({});
  const [witnessErrors, setWitnessErrors] = useState<Record<string, string>>({});
  const [trapNotes, setTrapNotes] = useState<Record<string, string>>({});

  const sendWitnessMessage = async (witnessName: string) => {
    const msg = (witnessDrafts[witnessName] ?? "").trim();
    if (!msg || witnessLoading[witnessName]) return;
    const prevThread = witnessThreads[witnessName] ?? [];
    const nextThread = [...prevThread, { role: "user" as const, text: msg }];
    setWitnessThreads((prev) => ({ ...prev, [witnessName]: nextThread }));
    setWitnessDrafts((prev) => ({ ...prev, [witnessName]: "" }));
    setWitnessErrors((prev) => ({ ...prev, [witnessName]: "" }));
    setWitnessLoading((prev) => ({ ...prev, [witnessName]: true }));
    try {
      const res = await fetch("/api/witness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, witnessName, message: msg, history: prevThread }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Witness coaching failed");
      const replyText = json.reply ?? "No reply from witness.";
      setWitnessThreads((prev) => ({
        ...prev,
        [witnessName]: [...(prev[witnessName] ?? []), { role: "assistant", text: replyText }],
      }));
      if (json.trapNote) {
        setTrapNotes((prev) => ({ ...prev, [witnessName]: json.trapNote }));
        if (showNotification) showNotification(`Trap flagged for ${witnessName}: ${json.trap?.label ?? "check question"}`);
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Witness coaching failed";
      setWitnessErrors((prev) => ({ ...prev, [witnessName]: errMsg }));
      if (showNotification) showNotification(errMsg);
    } finally {
      setWitnessLoading((prev) => ({ ...prev, [witnessName]: false }));
    }
  };

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

  const ask = async () => {
    const q = question.trim();
    if (!q || asking) return;
    setQuestion("");
    setChat((prev) => [...prev, { role: "user", text: q }]);
    setAsking(true);
    try {
      const res = await fetch("/api/rag/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, caseId, web: useWeb }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Research failed");
      setChat((prev) => [...prev, { role: "assistant", text: json.answer }]);
    } catch (e) {
      setChat((prev) => [...prev, { role: "assistant", text: e instanceof Error ? e.message : "Research failed." }]);
    } finally {
      setAsking(false);
    }
  };

  const generateTheory = async () => {
    setTheoryLoading(true);
    try {
      const res = await fetch("/api/rag/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Draft a trial theory and cross-examination plan for this case as ${detail?.case.title}. Use the case file facts and statutes. Structure as 3 numbered lines.`,
          caseId,
        }),
      });
      const json = await res.json();
      setTheory(res.ok ? json.answer : "Theory generation failed.");
    } catch (e) {
      setTheory(e instanceof Error ? e.message : "Theory generation failed.");
    } finally {
      setTheoryLoading(false);
    }
  };

  if (loadError) {
    return (
      <div className="p-10 text-center text-sm text-zinc-600">{loadError}</div>
    );
  }
  if (!detail) return <div className="p-10 text-sm text-zinc-500">Loading case file...</div>;

  const witnesses = detail.parties.filter((p) => p.is_witness);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="font-mono text-[10px] uppercase">{detail.case.category}</Badge>
          <span className="text-xs font-mono text-zinc-500">{detail.case.id}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">{detail.case.title}</h1>
        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">{detail.case.summary}</p>
        <p className="text-xs text-zinc-500 font-mono">{detail.case.court}</p>
        <p className="text-xs text-zinc-700"><span className="font-semibold">Charges:</span> {detail.case.charges}</p>
        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" className="text-xs h-8 bg-zinc-950 text-white hover:bg-zinc-800">
            <Link href={`/case/${detail.case.id}/courtroom`}>Enter courtroom <ExternalLink className="size-3 ml-1" /></Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-5">
        <div className="overflow-x-auto max-w-full pb-1 border-b border-zinc-200/80">
          <TabsList className="bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 h-auto flex flex-nowrap shrink-0">
            <TabsTrigger value="case-file" className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white shrink-0 flex items-center gap-1.5">
              <FileText className="size-3.5" /> 1. Case File
            </TabsTrigger>
            <TabsTrigger value="rag-research" className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white shrink-0 flex items-center gap-1.5">
              <Scale className="size-3.5" /> 2. RAG Research
            </TabsTrigger>
            <TabsTrigger value="witness-lab" className="text-xs font-semibold px-3.5 py-1.5 rounded-lg data-[state=active]:bg-white shrink-0 flex items-center gap-1.5">
              <Users className="size-3.5" /> 3. Witness Lab
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="case-file" className="focus-visible:outline-none space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
              <h2 className="text-sm font-bold text-zinc-950">Exhibits</h2>
              {detail.evidence.map((e) => (
                <div key={e.id} className="text-xs border-b border-zinc-100 pb-2 last:border-0">
                  <div className="font-semibold text-zinc-900">{e.exhibit_label} · {e.title}</div>
                  <p className="text-zinc-600 mt-0.5">{e.description}</p>
                  <p className="text-zinc-500 mt-0.5 text-[11px]">{e.content}</p>
                </div>
              ))}
              {detail.evidence.length === 0 && <p className="text-xs text-zinc-500">No exhibits on record.</p>}
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
              <h2 className="text-sm font-bold text-zinc-950">Case facts (indexed corpus)</h2>
              {detail.chunks.map((c) => (
                <div key={c.id} className="text-xs border-b border-zinc-100 pb-2 last:border-0">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase">{c.section_label}</div>
                  <p className="text-zinc-700 mt-0.5 leading-relaxed">{c.text}</p>
                </div>
              ))}
              {detail.chunks.length === 0 && <p className="text-xs text-zinc-500">No facts indexed yet.</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rag-research" className="focus-visible:outline-none space-y-3">
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-bold text-zinc-950">Research assistant</h2>
              <label className="text-xs text-zinc-600 flex items-center gap-1.5">
                <input type="checkbox" checked={useWeb} onChange={(e) => setUseWeb(e.target.checked)} /> Include web search (Firecrawl)
              </label>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {chat.length === 0 && <p className="text-xs text-zinc-500">Ask about statutes, case facts, or strategy. Answers cite the indexed corpus.</p>}
              {chat.map((m, i) => (
                <div key={i} className={`text-xs p-2.5 rounded-lg ${m.role === "user" ? "bg-zinc-950 text-white" : "bg-zinc-50 border border-zinc-200 text-zinc-800"}`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about BNS §61(2), bail, or your theory..."
                className="text-xs h-16"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void ask();
                  }
                }}
              />
              <Button onClick={() => void ask()} disabled={asking || !question.trim()} className="h-16 px-3 bg-zinc-950 text-white hover:bg-zinc-800" size="sm">
                {asking ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-2">
            <h2 className="text-sm font-bold text-zinc-950">Trial theory</h2>
            <Button onClick={() => void generateTheory()} disabled={theoryLoading} variant="outline" size="sm" className="text-xs h-8">
              {theoryLoading ? "Synthesizing..." : "Generate theory from case file"}
            </Button>
            {theory && <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">{theory}</p>}
          </div>
        </TabsContent>

        <TabsContent value="witness-lab" className="focus-visible:outline-none space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            {witnesses.map((w) => {
              const thread = witnessThreads[w.name] ?? [];
              const loading = Boolean(witnessLoading[w.name]);
              const err = witnessErrors[w.name];
              const trap = trapNotes[w.name];
              const draft = witnessDrafts[w.name] ?? "";
              return (
                <div key={w.name} className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3 flex flex-col">
                  <div className="space-y-1.5">
                    <h2 className="text-sm font-bold text-zinc-950">{w.name}</h2>
                    <p className="text-xs text-zinc-600">{w.role}</p>
                    <p className="text-xs text-zinc-700"><span className="font-semibold">Personality:</span> {w.personality}</p>
                    <p className="text-xs text-zinc-600">{w.persona_prompt}</p>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto border-t border-zinc-100 pt-3">
                    {thread.length === 0 && (
                      <p className="text-xs text-zinc-500">Ask a question to coach {w.name}. Replies come from the persona via /api/witness.</p>
                    )}
                    {thread.map((m, i) => (
                      <div key={i} className={`text-xs p-2.5 rounded-lg ${m.role === "user" ? "bg-zinc-950 text-white" : "bg-zinc-50 border border-zinc-200 text-zinc-800"}`}>
                        <p className="font-semibold text-[10px] uppercase tracking-wide opacity-70">{m.role === "user" ? "Counsel" : w.name.split("·")[0].trim()}</p>
                        <p className="leading-relaxed whitespace-pre-wrap mt-0.5">{m.text}</p>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Loader2 className="size-3.5 animate-spin" /> Witness is replying...
                      </div>
                    )}
                  </div>
                  {trap && (
                    <div className="text-xs p-2.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 leading-relaxed">{trap}</div>
                  )}
                  {err && !showNotification && (
                    <div className="text-xs p-2.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700">{err}</div>
                  )}
                  {err && showNotification && (
                    <div className="text-xs text-rose-600">{err}</div>
                  )}
                  <div className="mt-auto flex gap-2">
                    <Textarea
                      value={draft}
                      onChange={(e) => setWitnessDrafts((prev) => ({ ...prev, [w.name]: e.target.value }))}
                      placeholder={`Ask ${w.name} a question...`}
                      className="text-xs h-14"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void sendWitnessMessage(w.name);
                        }
                      }}
                    />
                    <Button
                      onClick={() => void sendWitnessMessage(w.name)}
                      disabled={loading || !draft.trim()}
                      className="h-14 px-3 bg-zinc-950 text-white hover:bg-zinc-800"
                      size="sm"
                    >
                      {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </Button>
                  </div>
                </div>
              );
            })}
            {witnesses.length === 0 && <p className="text-xs text-zinc-500">No witness personas seeded for this case.</p>}
          </div>
          <p className="text-xs text-zinc-500">Witness personas are exercised live here and in the courtroom simulator. Coaching history is kept per witness in this session only.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
