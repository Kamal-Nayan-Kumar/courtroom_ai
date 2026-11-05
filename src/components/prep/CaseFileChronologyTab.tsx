"use client";

import React, { useState } from "react";
import {
  FileText,
  Video,
  FileSpreadsheet,
  Users,
  AlertTriangle,
  Upload,
  Pin,
  Check,
  Bookmark,
  Sparkles,
  Info,
  Calendar,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  CASE_DOSSIER_DOCUMENTS,
  INITIAL_PINNED_FACTS,
} from "@/data/prepStudioData";
import { CaseDossierDocument, DocumentParagraph, PinnedTrialFact } from "@/types/prepStudio";

interface CaseFileChronologyTabProps {
  pinnedFacts: PinnedTrialFact[];
  onPinFact: (fact: PinnedTrialFact) => void;
  onUnpinFact: (id: string) => void;
  onNotify: (msg: string) => void;
}

export function CaseFileChronologyTab({
  pinnedFacts,
  onPinFact,
  onUnpinFact,
  onNotify,
}: CaseFileChronologyTabProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-fir");
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const selectedDoc =
    CASE_DOSSIER_DOCUMENTS.find((d) => d.id === selectedDocId) ||
    CASE_DOSSIER_DOCUMENTS[0];

  const getDocIcon = (type: CaseDossierDocument["documentType"]) => {
    switch (type) {
      case "fir":
        return <FileText className="size-4 text-zinc-900" />;
      case "charge-sheet":
        return <FileSpreadsheet className="size-4 text-blue-900" />;
      case "digital-evidence":
        return <Video className="size-4 text-rose-700" />;
      case "forensic-report":
        return <AlertTriangle className="size-4 text-amber-700" />;
      case "deposition":
        return <Users className="size-4 text-purple-700" />;
      default:
        return <FileText className="size-4 text-zinc-700" />;
    }
  };

  const handleSimulateUpload = () => {
    const newDocName = "Moot_Problem_Annexure_IV_TollPlaza_Logs.pdf";
    setUploadedDocs((prev) => [...prev, newDocName]);
    onNotify("Uploaded Moot_Problem_Annexure_IV_TollPlaza_Logs.pdf. Ingested into Case RAG in 420ms.");
  };

  const handleTogglePin = (para: DocumentParagraph) => {
    const existing = pinnedFacts.find((f) => f.id === para.id);
    if (existing) {
      onUnpinFact(para.id);
      onNotify(`Unpinned fact from paragraph ${para.paraNumber}.`);
    } else {
      const newFact: PinnedTrialFact = {
        id: para.id,
        sourceDocId: selectedDoc.id,
        sourceDocTitle: selectedDoc.title,
        paraNumber: para.paraNumber,
        text: para.text,
        annotation: para.contradictionNote || "Pinned critical evidentiary submission",
        statuteTag: para.statuteRef || "General Evidence",
        pinnedAt: "Just now",
      };
      onPinFact(newFact);
      onNotify(`📌 Pinned Paragraph ${para.paraNumber} to Courtroom Trial Brief.`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT COLUMN: Case Dossier & Exhibit Tree (4 Cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="p-4 pb-3 border-b border-zinc-100">
            <CardTitle className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center justify-between">
              <span>Case Dossier & Evidence Tree</span>
              <span className="font-mono text-[10px] text-zinc-500 font-normal">
                {CASE_DOSSIER_DOCUMENTS.length + uploadedDocs.length} Documents
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Select any exhibit to analyze chronological contradictions.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-2 flex flex-col gap-1.5">
            {CASE_DOSSIER_DOCUMENTS.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-zinc-100/90 border-zinc-950 ring-1 ring-zinc-950 shadow-xs"
                      : "bg-white hover:bg-zinc-50/80 border-zinc-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <div className={`p-1.5 rounded-lg shrink-0 border ${isSelected ? "bg-white border-zinc-300 text-zinc-950 shadow-2xs" : "bg-zinc-100 border-zinc-200 text-zinc-700"}`}>
                        {getDocIcon(doc.documentType)}
                      </div>
                      <span className="text-xs font-bold truncate text-zinc-950">
                        {doc.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5 text-[11px]">
                    <span className="text-zinc-500 font-mono font-medium">
                      {doc.filingDate}
                    </span>
                    <Badge
                      variant={doc.badgeVariant}
                      className={`text-[10px] font-mono py-0.5 px-2 ${
                        doc.badgeVariant === "destructive"
                          ? "bg-rose-50 text-rose-800 border-rose-300 font-semibold"
                          : doc.badgeVariant === "default"
                          ? "bg-zinc-900 text-white border-zinc-900"
                          : "bg-zinc-100 text-zinc-800 border-zinc-200"
                      }`}
                    >
                      {doc.badgeText}
                    </Badge>
                  </div>
                </button>
              );
            })}

            {/* Render any simulated uploaded docs */}
            {uploadedDocs.map((docName, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-950 flex items-center justify-between text-xs font-medium"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="size-4 text-emerald-700 shrink-0" />
                  <span className="truncate">{docName}</span>
                </div>
                <Badge className="bg-emerald-700 text-white text-[9px] font-mono">
                  RAG Indexed
                </Badge>
              </div>
            ))}
          </CardContent>

          {/* Upload Box at Bottom */}
          <div className="p-3 border-t border-zinc-100 bg-zinc-50/60 rounded-b-xl">
            <button
              type="button"
              onClick={handleSimulateUpload}
              className="w-full border border-dashed border-zinc-300 hover:border-zinc-500 rounded-lg p-2.5 text-center text-xs text-zinc-600 hover:text-zinc-950 bg-white transition-all flex items-center justify-center gap-1.5 font-medium shadow-2xs"
            >
              <Upload className="size-3.5 text-zinc-500" />
              <span>+ Upload PDF / Moot Annexures</span>
            </button>
          </div>
        </Card>

        {/* Pinned Fact Counter Card */}
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          <CardHeader className="p-3.5 pb-2 border-b border-zinc-100">
            <CardTitle className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
              <Bookmark className="size-3.5 text-amber-600" />
              <span>Pinned Trial Submissions ({pinnedFacts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 flex flex-col gap-2">
            {pinnedFacts.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No facts pinned yet. Click pin on any paragraph.</p>
            ) : (
              pinnedFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="p-2.5 rounded-lg border border-amber-200/80 bg-amber-50/40 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 font-mono text-[11px]">
                      {fact.sourceDocTitle} · P{fact.paraNumber}
                    </span>
                    <Badge variant="outline" className="text-[9px] font-mono bg-white border-amber-300 text-amber-900">
                      {fact.statuteTag}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-700 line-clamp-2 leading-relaxed">
                    {fact.text}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: Interactive Document Reader & Loophole Spotter (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <Card className="bg-white border-zinc-200/90 shadow-2xs">
          {/* Document Header */}
          <CardHeader className="p-5 pb-4 border-b border-zinc-200/80 bg-zinc-50/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-zinc-500 uppercase">
                    Authentic Trial Record
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono bg-zinc-100">
                    {selectedDoc.officerOrBench}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-zinc-950 font-serif mt-1">
                  {selectedDoc.title}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-600 mt-1">
                  {selectedDoc.summary}
                </CardDescription>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 text-amber-900 border-amber-200">
                  <Sparkles className="size-3 mr-1 text-amber-600" />
                  Munshi AI Analysis Active
                </Badge>
              </div>
            </div>
          </CardHeader>

          {/* Document Content with Numbered Paragraphs & Contradiction Highlighting */}
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-100">
              <span className="font-mono">RECORD OF PROCEEDINGS · CRL.A. 402/2026</span>
              <span className="font-mono text-rose-700 font-medium">Amber/Rose = Highlighted Contradictions</span>
            </div>

            <div className="flex flex-col gap-4 text-[13.5px] leading-relaxed text-zinc-900">
              {selectedDoc.paragraphs.map((para) => {
                const isPinned = pinnedFacts.some((f) => f.id === para.id);
                const hasContradiction = para.isContradiction;

                return (
                  <div
                    key={para.id}
                    className={`p-4 rounded-xl border transition-all ${
                      hasContradiction
                        ? "bg-amber-50/60 border-amber-300 shadow-2xs"
                        : "bg-white border-zinc-200/80 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-bold text-zinc-500 shrink-0 select-none mt-0.5">
                          § {para.paraNumber}.
                        </span>
                        <div>
                          <p className={`text-[13.5px] leading-relaxed ${hasContradiction ? "text-zinc-950 font-medium" : "text-zinc-800"}`}>
                            {para.text}
                          </p>

                          {/* Contradiction Callout Note */}
                          {hasContradiction && para.contradictionNote && (
                            <div className="mt-3 p-3 rounded-lg bg-white border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="size-4 text-amber-700 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-amber-900">Evidentiary Loophole: </span>
                                  <span className="text-zinc-800 font-medium">{para.contradictionNote}</span>
                                </div>
                              </div>
                              {para.statuteRef && (
                                <Badge variant="outline" className="text-[10.5px] font-mono bg-amber-50 border-amber-300 shrink-0 text-amber-900 font-semibold">
                                  {para.statuteRef}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pin button */}
                      <Button
                        type="button"
                        size="sm"
                        variant={isPinned ? "default" : "outline"}
                        onClick={() => handleTogglePin(para)}
                        className={`h-8 px-2.5 text-xs shrink-0 font-sans ${
                          isPinned
                            ? "bg-zinc-950 text-white hover:bg-zinc-800"
                            : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                        }`}
                        title={isPinned ? "Unpin fact" : "Pin fact to courtroom trial brief"}
                      >
                        {isPinned ? (
                          <>
                            <Check className="size-3.5 mr-1" />
                            <span>Pinned</span>
                          </>
                        ) : (
                          <>
                            <Pin className="size-3.5 mr-1 text-zinc-500" />
                            <span>Pin Fact</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>

          {/* Reader Footer */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50/60 rounded-b-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-500">
            <span className="font-mono">
              Evidence Seal: Panchnama Vol. II · SHA-256 Hash Verified
            </span>
            <span className="text-zinc-600">
              Pinned facts automatically synchronize to your Co-Counsel prompter cards.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
