export type LegalRole = "defense" | "prosecution";

export interface DocumentParagraph {
  id: string;
  paraNumber: number;
  text: string;
  isContradiction?: boolean;
  contradictionType?: "hash-delay" | "timeline-gap" | "custody-defect" | "alibi-match";
  contradictionNote?: string;
  statuteRef?: string;
  isPinned?: boolean;
}

export interface CaseDossierDocument {
  id: string;
  title: string;
  documentType: "fir" | "charge-sheet" | "digital-evidence" | "forensic-report" | "deposition";
  badgeText: string;
  badgeVariant: "default" | "destructive" | "secondary" | "outline";
  filingDate: string;
  officerOrBench: string;
  summary: string;
  paragraphs: DocumentParagraph[];
}

export interface PinnedTrialFact {
  id: string;
  sourceDocId: string;
  sourceDocTitle: string;
  paraNumber: number;
  text: string;
  annotation: string;
  statuteTag: string;
  pinnedAt: string;
}

export type RagSourceType = "statutory" | "landmark-sc" | "firecrawl-web";

export interface RetrievedAuthority {
  id: string;
  title: string;
  citation: string;
  legacyCitation?: string;
  sourceType: RagSourceType;
  matchScore: number;
  latencyMs: number;
  court: string;
  benchOrYear: string;
  statuteCode: string;
  statuteSection: string;
  statutorySnippet: string;
  applicationToCase: string;
  isSavedToBrief: boolean;
  webSourceDomain?: string;
}

export interface TrialBriefState {
  openingHooks: { id: string; text: string; role: LegalRole }[];
  objectionTriggers: { id: string; statute: string; condition: string }[];
  savedPrecedents: RetrievedAuthority[];
  generatedTheory: {
    points: string[];
    title: string;
    generatedAt?: string;
  } | null;
}

export interface WitnessTask {
  id: string;
  text: string;
  completed: boolean;
  isCustom?: boolean;
}

export interface PredictedTrap {
  id: string;
  probability: number;
  trapType: "Credibility Impeachment" | "Timeline Contradiction" | "Section 148 BSA Hostile Pressure" | "Custody Chain Defect";
  opposingQuestion: string;
  vulnerability: string;
  safePivotResponse: string;
  isLocked: boolean;
}

export interface WitnessDryRunMessage {
  id: string;
  sender: "counsel" | "witness";
  speakerName: string;
  message: string;
  timestamp: string;
  resilienceScore?: number;
  guardrailTriggered?: string;
}

export interface WitnessProfile {
  id: string;
  code: "PW-1" | "DW-1" | "PW-2";
  name: string;
  designation: string;
  roleType: "Prosecution / Hostile" | "Friendly Defense Witness" | "Police Investigating Officer";
  riskLevel: "High" | "Medium" | "Low";
  depositionConsistency: number;
  composureLabel: string;
  composurePercent: number;
  memoryScope: string;
  tasks: WitnessTask[];
  responseStyle: "factual" | "narrative" | "defensive";
  predictedTraps: PredictedTrap[];
  dryRunMessages: WitnessDryRunMessage[];
}
