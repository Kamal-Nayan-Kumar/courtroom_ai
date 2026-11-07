import type { LucideIcon } from "lucide-react";
import { FileText, Gavel, Scale, Shield, Sparkles, User } from "lucide-react";
import type { SpeakerId } from "@/types/courtroomArena";

export const SPEAKER_META: Record<SpeakerId, { label: string; icon: LucideIcon }> = {
  judge: { label: "Judge", icon: Gavel },
  prosecutor: { label: "Prosecutor", icon: Scale },
  defense: { label: "Defense", icon: Shield },
  witness: { label: "Witness", icon: User },
  clerk: { label: "Clerk", icon: FileText },
  "co-counsel": { label: "Co-counsel", icon: Sparkles },
};
