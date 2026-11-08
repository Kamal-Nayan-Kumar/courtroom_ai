export type CourtroomRole = "defense" | "prosecution";

export type SpeakerId = "judge" | "prosecutor" | "defense" | "witness" | "clerk" | "co-counsel";

export type MessageKind = "standard" | "objection" | "ruling" | "witness" | "whisper";

export interface TranscriptItem {
  id: string;
  speaker: string;
  speakerRole: SpeakerId;
  content: string;
  timestamp: string;
  citation?: string;
  kind: MessageKind;
  isStreaming?: boolean;
  isUser?: boolean;
  reasoning?: string[];
}

export interface CourtroomExhibit {
  id: string;
  code: string; // e.g. "Ex-A"
  label: string; // e.g. "Exhibit A"
  name: string;
  type: string;
  admissibility: "Admitted" | "Contested" | "Pending Verification";
  statuteWarning?: string;
  timestamp: string;
  source: string;
  description: string;
}

export interface ChronologyFact {
  id: string;
  time: string;
  title: string;
  description: string;
  discrepancy?: string;
  isDiscrepancy: boolean;
  sectionRef: string;
}

export interface PinnedStatute {
  code: "BSA" | "BNS" | "BNSS";
  section: string;
  title: string;
  summary: string;
  badgeColor: string;
}

export interface PinnedPrecedent {
  id: string;
  citation: string;
  court: string;
  year: number;
  principle: string;
  application: string;
}

export interface WitnessProfile {
  name: string;
  title: string;
  designation: string;
  oathStatus: string;
  composure: number;
  composureLabel: string;
  keyVulnerability: string;
  boundaryRules: string[];
}

export interface ObjectionGround {
  id: string;
  label: string;
  section: string;
  act: string;
  ruleExplanation: string;
  suggestedSpeech: string;
}

export interface AgentPersona {
  id: SpeakerId;
  name: string;
  roleTitle: string;
  court: string;
  temperament: string;
  liveThought: string;
  audioState: "idle" | "listening" | "speaking";
  memoryTrace: string[];
  legalFocus: string;
  samplePhrase: string;
}

export interface CoCounselHintItem {
  id: string;
  badge: string;
  title: string;
  whisper: string;
  suggestedAction: string;
  statuteRef: string;
  precedentRef?: string;
}
