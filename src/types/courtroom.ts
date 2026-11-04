export type UserRole = "defense" | "prosecution";

export interface ActSection {
  code: string;
  section: string;
  description: string;
  badgeColor?: string;
}

export interface ExhibitItem {
  id: string;
  name: string;
  type: string;
  admissibility: "Admitted" | "Contested" | "Pending Verification";
  bnaCitation: string;
}

export interface CaseFileState {
  caseNumber: string;
  title: string;
  bench: string;
  firSnippet: string;
  sections: ActSection[];
  exhibits: ExhibitItem[];
  witnessBrief: {
    witnessName: string;
    designation: string;
    keyTestimony: string;
    prepRiskScore: string;
  };
  prepChecklist: {
    id: string;
    label: string;
    done: boolean;
  }[];
}

export interface TranscriptMessage {
  id: string;
  speaker: "Judge AI" | "Prosecutor AI" | "Defense Counsel (You)" | "Witness AI (PW-1)" | "Co-Counsel AI";
  speakerRole: "judge" | "prosecutor" | "defense" | "witness" | "co-counsel";
  content: string;
  timestamp: string;
  citation?: string;
  isObjectionable?: boolean;
}

export interface CoCounselHint {
  id: string;
  badge: string;
  title: string;
  hint: string;
  suggestedArgument: string;
  statuteCitation: string;
}

export interface CourtroomAgentInfo {
  id: string;
  role: string;
  name: string;
  tagline: string;
  specialization: string;
  listeningTrigger: string;
  reasoningSnippet: string;
  sampleDialogue: string;
  statuteFocus: string;
}

export interface MetricCardData {
  label: string;
  value: string;
  subtext: string;
  trend: "up" | "neutral" | "down";
  trendValue: string;
}

export interface DashboardCaseRow {
  id: string;
  title: string;
  court: string;
  role: "Defense Counsel" | "Public Prosecutor";
  stage: "Pre-Trial Briefing" | "Cross-Examination" | "Final Arguments" | "Reserved Verdict";
  judgeScore: number;
  lastActive: string;
  statutes: string[];
}
