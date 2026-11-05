export type CaseRole = "defense" | "prosecution";

export type TrialStage =
  | "case-prep"
  | "witness-exam"
  | "final-arguments"
  | "verdict-delivered";

export interface StatuteTag {
  code: "BNS" | "BNSS" | "BSA" | "IPC" | "CrPC" | "IEA" | "Constitution" | "Special";
  section: string;
  name: string;
  description: string;
}

export interface ActiveDocketItem {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  category: "Criminal" | "Cyber & Digital Evidence" | "Constitutional" | "Corporate / PMLA";
  role: CaseRole;
  stage: TrialStage;
  stageLabel: string;
  progressPercent: number;
  judgeScore: number | null;
  lastActive: string;
  statutes: StatuteTag[];
  witnessCount: number;
  exhibitCount: number;
  nextTask: string;
}

export interface PublicPracticeCase {
  id: string;
  title: string;
  citation: string;
  court: string;
  difficulty: "Beginner" | "Medium" | "Hard" | "Moot Level";
  statuteBadges: string[];
  keyTheme: string;
  summary: string;
  factsSnippet: string;
  primaryStatute: string;
  estimatedMinutes: number;
  practiceCount: number;
}

export interface AdvocateKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down" | "neutral";
  detail: string;
  progressValue?: number;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "success" | "warning";
}

export interface PerformanceDataPoint {
  session: string;
  date: string;
  argumentStrength: number;
  citationAccuracy: number;
  crossExamPressure: number;
  benchRating: number;
}

export interface PrepQueueTask {
  id: string;
  title: string;
  subtitle: string;
  status: "done" | "action-needed" | "pending";
  tag: string;
  actionLabel?: string;
  actionType?: "coach-witness" | "review-brief" | "open-fir";
}

export interface StatuteMapping {
  newCode: string;
  newSection: string;
  legacyCode: string;
  legacySection: string;
  title: string;
  summary: string;
  keyChange: string;
}

export interface LandmarkPrecedent {
  id: string;
  caseTitle: string;
  citation: string;
  year: number;
  bench: string;
  subject: string;
  keyRatio: string;
  relevantSections: string[];
}
