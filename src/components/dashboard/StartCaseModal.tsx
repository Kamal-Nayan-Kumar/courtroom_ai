"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  Upload,
  Shield,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Sliders,
  Gavel,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { PUBLIC_CASE_LIBRARY } from "@/data/dashboardData";
import { PublicPracticeCase } from "@/types/dashboard";

export function StartCaseModal() {
  const router = useRouter();
  const {
    isNewCaseOpen,
    setIsNewCaseOpen,
    preselectedPracticeCase,
    showNotification,
  } = useDashboard();

  const [currentStep, setCurrentStep] = useState<"source" | "role" | "bench">("source");
  const [sourceType, setSourceType] = useState<"library" | "upload">("library");
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    preselectedPracticeCase?.id || PUBLIC_CASE_LIBRARY[0].id
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const [selectedRole, setSelectedRole] = useState<"defense" | "prosecution">("defense");

  const [judgeTemperament, setJudgeTemperament] = useState<string>("strict");
  const [coCounselMode, setCoCounselMode] = useState<boolean>(true);
  const [targetBench, setTargetBench] = useState<string>("sessions");

  useEffect(() => {
    if (preselectedPracticeCase) {
      setSelectedCaseId(preselectedPracticeCase.id);
      setSourceType("library");
      setCurrentStep("role");
    } else {
      setCurrentStep("source");
    }
  }, [preselectedPracticeCase, isNewCaseOpen]);

  const selectedCaseData =
    PUBLIC_CASE_LIBRARY.find((c) => c.id === selectedCaseId) ||
    PUBLIC_CASE_LIBRARY[0];

  const handleSimulatedFileUpload = () => {
    setUploadedFile("FIR_No_89_2025_ChargeSheet_Colaba.pdf");
    showNotification("Uploaded FIR_No_89_2025_ChargeSheet_Colaba.pdf (3.4 MB). 3 Sections mapped.");
  };

  const handleLaunchCourtroom = () => {
    setIsNewCaseOpen(false);
    showNotification(
      `Launching Courtroom AI with ${selectedRole === "defense" ? "Defense Counsel" : "Public Prosecutor"} role.`
    );
    router.push("/#simulation");
  };

  const handleGoToWitnessPrep = () => {
    setIsNewCaseOpen(false);
    showNotification("Redirecting to Pre-Trial Witness Prep Lab.");
    router.push("/#workflow");
  };

  return (
    <Dialog open={isNewCaseOpen} onOpenChange={setIsNewCaseOpen}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white border-zinc-200 shadow-xl">
        {/* Modal Top Header */}
        <div className="p-6 pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold">
                <Gavel className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-zinc-950 font-sans">
                  Initiate New Trial Session
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  Step {currentStep === "source" ? "1" : currentStep === "role" ? "2" : "3"} of 3:{" "}
                  {currentStep === "source"
                    ? "Choose Case Source"
                    : currentStep === "role"
                    ? "Select Your Side (Role)"
                    : "Configure AI Bench & Co-Counsel"}
                </DialogDescription>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep === "source"
                    ? "bg-zinc-950 text-white"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                1
              </span>
              <div className="w-4 h-0.5 bg-zinc-200" />
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep === "role"
                    ? "bg-zinc-950 text-white"
                    : currentStep === "bench"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                2
              </span>
              <div className="w-4 h-0.5 bg-zinc-200" />
              <span
                className={`size-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  currentStep === "bench"
                    ? "bg-zinc-950 text-white"
                    : "bg-zinc-100 text-zinc-400"
                }`}
              >
                3
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 max-h-[68vh] overflow-y-auto">
          {/* STEP 1: CHOOSE CASE SOURCE */}
          {currentStep === "source" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSourceType("library")}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    sourceType === "library"
                      ? "border-zinc-950 bg-zinc-50 shadow-2xs ring-1 ring-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <BookOpen className="size-5 text-zinc-900 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-zinc-950">Option A: Case Library</div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Select from landmark Indian moot problems and benchmark criminal trials.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSourceType("upload")}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    sourceType === "upload"
                      ? "border-zinc-950 bg-zinc-50 shadow-2xs ring-1 ring-zinc-950"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <Upload className="size-5 text-zinc-900 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-zinc-950">Option B: Upload Custom Case</div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Upload your own FIR, Charge Sheet, or Moot Memorial PDF for instant ingestion.
                    </p>
                  </div>
                </button>
              </div>

              {/* Source Option A: Case Library Selector */}
              {sourceType === "library" && (
                <div className="flex flex-col gap-3 pt-2">
                  <label className="text-xs font-semibold text-zinc-800">
                    Select Benchmark Case:
                  </label>
                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                    {PUBLIC_CASE_LIBRARY.map((item) => {
                      const isSelected = selectedCaseId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedCaseId(item.id)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? "border-zinc-950 bg-zinc-50/90 shadow-2xs"
                              : "border-zinc-200 hover:border-zinc-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-950">{item.title}</span>
                            <div className="flex items-center gap-1.5">
                              <Badge variant="outline" className="text-[10px] font-mono">
                                {item.difficulty}
                              </Badge>
                              {isSelected && (
                                <CheckCircle2 className="size-4 text-zinc-950" />
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-600 mt-1 line-clamp-1">
                            {item.summary}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
                            <span>{item.court}</span>
                            <span>·</span>
                            <span className="font-semibold text-zinc-700">{item.primaryStatute}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Source Option B: Upload Zone */}
              {sourceType === "upload" && (
                <div className="flex flex-col gap-3 pt-2">
                  <div
                    onClick={handleSimulatedFileUpload}
                    className="border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-xl p-8 text-center bg-zinc-50/50 cursor-pointer transition-colors"
                  >
                    <Upload className="size-8 mx-auto text-zinc-400 mb-2" />
                    <p className="text-xs font-semibold text-zinc-900">
                      Drag & Drop FIR Copy, Charge Sheet, or Moot Memorial
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Supports PDF, DOCX up to 25 MB. Ingested by Munshi AI for BNS statutory correlation.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSimulatedFileUpload();
                      }}
                      className="mt-3 text-xs h-7"
                    >
                      Browse Files
                    </Button>
                  </div>

                  {uploadedFile && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-emerald-700" />
                        <span>{uploadedFile}</span>
                      </div>
                      <Badge className="bg-emerald-700 text-white text-[10px]">
                        Ingested
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SELECT YOUR SIDE (ROLE) */}
          {currentStep === "role" && (
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200/70 text-xs">
                <span className="text-zinc-500">Selected Case: </span>
                <span className="font-bold text-zinc-950">{selectedCaseData.title}</span>
                <span className="text-zinc-500 ml-1">({selectedCaseData.primaryStatute})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Public Prosecutor Option */}
                <div
                  onClick={() => setSelectedRole("prosecution")}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedRole === "prosecution"
                      ? "border-amber-600 bg-amber-50/40 shadow-xs ring-1 ring-amber-600"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="size-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                        <Scale className="size-5 text-amber-800" />
                      </div>
                      {selectedRole === "prosecution" && (
                        <CheckCircle2 className="size-5 text-amber-700" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-950">
                      Public Prosecutor (State)
                    </h4>
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      Present state charges, lead examination-in-chief of prosecution witnesses, establish chain of custody, and prove guilt beyond reasonable doubt.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-mono text-amber-900 font-medium">
                    <span>Burden of Proof: Beyond Doubt</span>
                  </div>
                </div>

                {/* Defense Counsel Option */}
                <div
                  onClick={() => setSelectedRole("defense")}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedRole === "defense"
                      ? "border-blue-700 bg-blue-50/40 shadow-xs ring-1 ring-blue-700"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="size-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                        <Shield className="size-5 text-blue-800" />
                      </div>
                      {selectedRole === "defense" && (
                        <CheckCircle2 className="size-5 text-blue-700" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-zinc-950">
                      Defense Counsel (Accused)
                    </h4>
                    <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                      Challenge evidence admissibility, cross-examine hostile and police witnesses, impeach digital hash delays, and protect constitutional rights.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between text-[11px] font-mono text-blue-900 font-medium">
                    <span>Target: Reasonable Doubt</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIGURE AI BENCH & CO-COUNSEL */}
          {currentStep === "bench" && (
            <div className="flex flex-col gap-5">
              <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200/70 text-xs flex items-center justify-between">
                <div>
                  <span className="text-zinc-500">Case: </span>
                  <span className="font-semibold text-zinc-900">{selectedCaseData.title}</span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    selectedRole === "defense"
                      ? "bg-blue-50 text-blue-900 border-blue-200"
                      : "bg-amber-50 text-amber-900 border-amber-200"
                  }
                >
                  {selectedRole === "defense" ? "Defense Counsel" : "Public Prosecutor"}
                </Badge>
              </div>

              {/* 1. Judge AI Temperament */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-900">
                  Presiding Judge AI Temperament:
                </label>
                <Select value={judgeTemperament} onValueChange={setJudgeTemperament}>
                  <SelectTrigger className="w-full h-10 text-xs bg-white border-zinc-200">
                    <SelectValue placeholder="Select judge temperament" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-xs">Judge Engines</SelectLabel>
                      <SelectItem value="strict">
                        Strict Proceduralist (High interrupt frequency on BSA Sec 63 certificate defects)
                      </SelectItem>
                      <SelectItem value="balanced">
                        Balanced High Court Bench (Equitable, weighs substantive law over technical slips)
                      </SelectItem>
                      <SelectItem value="socratic">
                        Socratic Moot Judge (Aggressive questions on precedents & constitutional tests)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* 2. Target Court Bench */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-900">
                  Target Courtroom Jurisdiction:
                </label>
                <Select value={targetBench} onValueChange={setTargetBench}>
                  <SelectTrigger className="w-full h-10 text-xs bg-white border-zinc-200">
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="sessions">
                        Sessions Court (Trial Procedures & Witness Cross-Exam)
                      </SelectItem>
                      <SelectItem value="highcourt">
                        High Court Division Bench (Criminal Appeal & Quashing under BNSS 528)
                      </SelectItem>
                      <SelectItem value="supreme">
                        Supreme Court of India (Moot Competition Coram · 3-Judge Bench)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* 3. Co-Counsel AI Mode Toggle */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${coCounselMode ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-950">
                      Co-Counsel AI Strategist (Adv. Saathi)
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                      {coCounselMode
                        ? "Proactive Live Hints ON: Real-time whisper cards spotting witness contradictions and section citations."
                        : "Silent Moot Exam Mode: Co-counsel remains quiet. You rely entirely on your unassisted preparation."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={coCounselMode}
                    onCheckedChange={setCoCounselMode}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Navigation */}
        <DialogFooter className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          {currentStep !== "source" ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentStep === "bench") setCurrentStep("role");
                else if (currentStep === "role") setCurrentStep("source");
              }}
              className="h-8 text-xs w-full sm:w-auto"
            >
              <ArrowLeft className="size-3.5 mr-1" />
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsNewCaseOpen(false)}
              className="h-8 text-xs text-zinc-500 w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStep !== "bench" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (currentStep === "source") setCurrentStep("role");
                  else if (currentStep === "role") setCurrentStep("bench");
                }}
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800 w-full sm:w-auto"
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5 ml-1" />
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGoToWitnessPrep}
                  className="h-8 text-xs border-zinc-300 hover:bg-zinc-100 w-full sm:w-auto"
                >
                  Witness Prep First →
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleLaunchCourtroom}
                  className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800 font-semibold shadow-xs w-full sm:w-auto"
                >
                  <Gavel className="size-3.5 mr-1 text-zinc-300" />
                  Launch 2D Courtroom Now
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
