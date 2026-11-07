"use client";

import React, { useState } from "react";
import {
  Search,
  Zap,
  Building2,
  Globe,
  Database,
  Plus,
  Check,
  Sparkles,
  Gavel,
  BookOpen,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  INITIAL_TRIAL_BRIEF,
  RETRIEVED_AUTHORITIES,
} from "@/data/prepStudioData";
import { LegalRole, RetrievedAuthority, TrialBriefState } from "@/types/prepStudio";

interface RagLegalResearchTabProps {
  currentRole: LegalRole;
  trialBrief: TrialBriefState;
  onSaveAuthorityToBrief: (auth: RetrievedAuthority) => void;
  onRemoveAuthorityFromBrief: (id: string) => void;
  onGenerateTheory: () => void;
  isGeneratingTheory: boolean;
  onNotify: (msg: string) => void;
}

export function RagLegalResearchTab({
  currentRole,
  trialBrief,
  onSaveAuthorityToBrief,
  onRemoveAuthorityFromBrief,
  onGenerateTheory,
  isGeneratingTheory,
  onNotify,
}: RagLegalResearchTabProps) {
  const [searchQuery, setSearchQuery] = useState(
    "Admissibility of CCTV footage when BSA Section 63(4) certificate is delayed or defective"
  );
  const [statutoryRagActive, setStatutoryRagActive] = useState(true);
  const [scRagActive, setScRagActive] = useState(true);
  const [firecrawlActive, setFirecrawlActive] = useState(true);

  const [authorities, setAuthorities] = useState<RetrievedAuthority[]>(RETRIEVED_AUTHORITIES);

  const handleToggleSave = (auth: RetrievedAuthority) => {
    const isSaved = trialBrief.savedPrecedents.some((p) => p.id === auth.id);
    if (isSaved) {
      onRemoveAuthorityFromBrief(auth.id);
      onNotify(`Removed ${auth.title} from Courtroom Brief.`);
    } else {
      onSaveAuthorityToBrief(auth);
      onNotify(`Saved ${auth.citation} to Courtroom Brief.`);
    }
  };

  const handleCopy = (citation: string) => {
    navigator.clipboard?.writeText(citation);
    onNotify(`Copied citation: ${citation}`);
  };

  const activeOpeningHooks = trialBrief.openingHooks.filter(
    (h) => h.role === currentRole
  );

  return (
    <div className="flex flex-col gap-6">
      {/* TOP SEARCH & SOURCE ROUTER BAR */}
      <Card className="bg-white border-zinc-200/90 shadow-2xs">
        <CardContent className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-zinc-400" />
              <Input
                placeholder="Ask legal RAG or query BNS/BNSS/BSA provisions & Supreme Court precedent..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm bg-zinc-50/70 border-zinc-200"
              />
            </div>
            <Button
              size="sm"
              onClick={() => onNotify("Synthesized RAG query across Neon pgvector & Firecrawl index.")}
              className="h-10 px-5 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shrink-0"
            >
              <Sparkles className="size-3.5 mr-1.5" />
              <span>Query Hybrid RAG</span>
            </Button>
          </div>

          {/* Source Scope Toggles with Latency Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100">
            <div className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Database className="size-3.5 text-zinc-500" />
              <span>Active Index Sources:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Toggle 1: Local Statutory RAG */}
              <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 text-xs">
                <Zap className="size-3.5 text-amber-600" />
                <span className="font-medium text-zinc-800">Bare Acts RAG (BNS/BSA)</span>
                <Badge variant="outline" className="text-xs font-mono bg-white text-emerald-700 border-emerald-200">
                  12ms
                </Badge>
                <Switch
                  checked={statutoryRagActive}
                  onCheckedChange={setStatutoryRagActive}
                  className="scale-75"
                />
              </div>

              {/* Toggle 2: SC / High Court Landmark RAG */}
              <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 text-xs">
                <Building2 className="size-3.5 text-blue-800" />
                <span className="font-medium text-zinc-800">SC Landmark RAG (pgvector)</span>
                <Badge variant="outline" className="text-xs font-mono bg-white text-emerald-700 border-emerald-200">
                  38ms
                </Badge>
                <Switch
                  checked={scRagActive}
                  onCheckedChange={setScRagActive}
                  className="scale-75"
                />
              </div>

              {/* Toggle 3: Live Web Search (Firecrawl) */}
              <div className="flex items-center gap-2 p-1.5 px-2.5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 text-xs">
                <Globe className="size-3.5 text-purple-700" />
                <span className="font-medium text-zinc-800">Live Web Search (Firecrawl)</span>
                <Badge variant="outline" className="text-xs font-mono bg-white text-purple-800 border-purple-200">
                  Write-Through Cache
                </Badge>
                <Switch
                  checked={firecrawlActive}
                  onCheckedChange={setFirecrawlActive}
                  className="scale-75"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN SPLIT VIEW: Left 7 Cols (Authorities) vs Right 5 Cols (Trial Brief) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT (7 COLS): Retrieved Authorities & Precedent Cards */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <BookOpen className="size-4 text-zinc-900" />
              <span>Retrieved Authorities & Precedents (3 Matched)</span>
            </h3>
            <span className="text-xs text-zinc-500 font-mono">
              Re-ranked by Hybrid BM25 + Cosine Similarity
            </span>
          </div>

          {authorities.map((auth) => {
            const isSaved = trialBrief.savedPrecedents.some((p) => p.id === auth.id);

            return (
              <Card
                key={auth.id}
                className="bg-white border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all flex flex-col gap-3"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono bg-zinc-100 text-zinc-900 border-zinc-200"
                        >
                          {auth.matchScore}% Match
                        </Badge>
                        {auth.sourceType === "statutory" && (
                          <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 text-amber-900 border-amber-200">
                            Statutory Bare Act · {auth.latencyMs}ms
                          </Badge>
                        )}
                        {auth.sourceType === "landmark-sc" && (
                          <Badge variant="outline" className="text-[10px] font-mono bg-blue-50 text-blue-900 border-blue-200">
                            Supreme Court RAG (pgvector)
                          </Badge>
                        )}
                        {auth.sourceType === "firecrawl-web" && (
                          <Badge variant="outline" className="text-xs font-mono bg-purple-50 text-purple-900 border-purple-200 flex items-center gap-1">
                            <Globe className="size-3 text-purple-700" />
                            <span>Fetched via Firecrawl &amp; Auto-Indexed</span>
                          </Badge>
                        )}
                      </div>

                      <CardTitle className="text-base font-bold text-zinc-950 font-sans mt-1">
                        {auth.title}
                      </CardTitle>

                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <span>{auth.citation}</span>
                        {auth.legacyCitation && (
                          <>
                            <span>·</span>
                            <span className="text-zinc-400">({auth.legacyCitation})</span>
                          </>
                        )}
                      </div>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant={isSaved ? "default" : "outline"}
                      onClick={() => handleToggleSave(auth)}
                      className={`h-8 px-2.5 text-xs font-medium shrink-0 ${
                        isSaved
                          ? "bg-zinc-950 text-white hover:bg-zinc-800"
                          : "border-zinc-200 hover:bg-zinc-100 text-zinc-900"
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="size-3.5 mr-1" />
                          <span>Saved in Brief</span>
                        </>
                      ) : (
                        <>
                          <Plus className="size-3.5 mr-1 text-zinc-500" />
                          <span>+ Save to Courtroom Brief</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-1 flex flex-col gap-3">
                  {/* Statutory / Precedent Snippet */}
                  <div className="p-3 rounded-lg bg-zinc-50/80 border border-zinc-100 font-serif text-xs leading-relaxed text-zinc-800 italic">
                    &quot;{auth.statutorySnippet}&quot;
                  </div>

                  {/* Case Relevance Anchor */}
                  <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-200/60 text-xs text-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-blue-900">Application to State v. Sharma: </span>
                      <span>{auth.applicationToCase}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(auth.citation)}
                      className="h-6 px-2 text-[10px] text-blue-800 hover:text-blue-950 hover:bg-blue-100/70 shrink-0 font-mono"
                    >
                      <Copy className="size-3 mr-1" />
                      Copy Citation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* RIGHT (5 COLS): Your Trial Arguments & Moot Memorial Builder */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="bg-white border-zinc-200/90 shadow-2xs">
            <CardHeader className="p-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Gavel className="size-3.5 text-zinc-900" />
                  <span>Your Courtroom Trial Brief</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  {currentRole === "defense" ? "Defense Brief" : "Prosecution Brief"}
                </Badge>
              </div>
              <CardDescription className="text-xs text-zinc-500">
                Synchronized live to your advocate prompter bench during trial.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 flex flex-col gap-4">
              {/* 1. Opening Statement Hooks */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-zinc-900">
                  1. Opening Statement Hooks ({activeOpeningHooks.length})
                </span>
                {activeOpeningHooks.map((hook) => (
                  <div
                    key={hook.id}
                    className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 font-serif text-xs leading-relaxed text-zinc-900"
                  >
                    {hook.text}
                  </div>
                ))}
              </div>

              {/* 2. Objection Triggers */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-zinc-900">
                  2. Objection Triggers (Pre-Armed for Adv. Saathi)
                </span>
                {trialBrief.objectionTriggers.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-2.5 rounded-lg border border-amber-200/70 bg-amber-50/30 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-mono bg-white text-amber-900 border-amber-300">
                        {obj.statute}
                      </Badge>
                      <span className="text-[10px] font-mono text-zinc-500">Auto-Armed</span>
                    </div>
                    <p className="text-[11px] text-zinc-700 leading-snug">
                      {obj.condition}
                    </p>
                  </div>
                ))}
              </div>

              {/* 3. Pinned Case Laws */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">
                    3. Saved Precedents ({trialBrief.savedPrecedents.length})
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {trialBrief.savedPrecedents.map((prec) => (
                    <div
                      key={prec.id}
                      className="p-2 rounded-md border border-zinc-200 bg-white text-xs flex items-center justify-between"
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="font-semibold text-zinc-900 truncate text-[11px]">
                          {prec.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {prec.citation}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveAuthorityFromBrief(prec.id)}
                        className="h-6 px-1.5 text-[10px] text-zinc-400 hover:text-rose-600"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-Generate Defense Theory with Groq Llama-3.3 */}
              <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={onGenerateTheory}
                  disabled={isGeneratingTheory}
                  className="w-full h-9 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs"
                >
                  <Sparkles className="size-3.5 mr-1.5 text-zinc-300" />
                  <span>
                    {isGeneratingTheory
                      ? "Synthesizing Strategy via Groq Llama-3.3..."
                      : "Auto-Generate Defense Theory (Groq Llama-3.3)"}
                  </span>
                </Button>

                {trialBrief.generatedTheory && (
                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 text-xs flex flex-col gap-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 text-[11px]">
                        {trialBrief.generatedTheory.title}
                      </span>
                      <Badge className="bg-emerald-700 text-white text-xs font-mono">
                        RAG Synthesized
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1.5 text-emerald-900 text-[11px] leading-relaxed">
                      {trialBrief.generatedTheory.points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
