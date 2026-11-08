import type { LucideIcon } from "lucide-react";
import { FileText, Gavel, Scale, Shield, Sparkles, User } from "lucide-react";
import type { SpeakerId } from "@/types/courtroomArena";

export interface SpeakerTheme {
  card: string;
  icon: string;
  label: string;
  badge: string;
  chip: string;
}

export interface SpeakerMeta {
  label: string;
  icon: LucideIcon;
  theme: SpeakerTheme;
}

export const SPEAKER_META: Record<SpeakerId, SpeakerMeta> = {
  judge: {
    label: "Judge",
    icon: Gavel,
    theme: {
      card: "border-zinc-200 bg-white",
      icon: "text-amber-700",
      label: "text-amber-950",
      badge: "border-amber-400/70 bg-amber-100 text-amber-900",
      chip: "bg-amber-100 text-amber-900",
    },
  },
  prosecutor: {
    label: "Prosecutor",
    icon: Scale,
    theme: {
      card: "border-zinc-200 bg-white",
      icon: "text-blue-800",
      label: "text-blue-950",
      badge: "border-blue-400/70 bg-blue-100 text-blue-900",
      chip: "bg-blue-100 text-blue-900",
    },
  },
  defense: {
    label: "Defense",
    icon: Shield,
    theme: {
      card: "border-zinc-200 bg-white",
      icon: "text-violet-700",
      label: "text-violet-950",
      badge: "border-violet-400/70 bg-violet-100 text-violet-900",
      chip: "bg-violet-100 text-violet-900",
    },
  },
  witness: {
    label: "Witness",
    icon: User,
    theme: {
      card: "border-zinc-200 bg-white",
      icon: "text-rose-700",
      label: "text-rose-950",
      badge: "border-rose-400/70 bg-rose-100 text-rose-900",
      chip: "bg-rose-100 text-rose-900",
    },
  },
  clerk: {
    label: "Clerk",
    icon: FileText,
    theme: {
      card: "border-zinc-200 bg-white",
      icon: "text-zinc-600",
      label: "text-zinc-900",
      badge: "border-zinc-400/70 bg-zinc-200 text-zinc-800",
      chip: "bg-zinc-200 text-zinc-800",
    },
  },
  "co-counsel": {
    label: "Co-counsel",
    icon: Sparkles,
    theme: {
      card: "border-zinc-200 bg-white",
      icon: "text-emerald-700",
      label: "text-emerald-950",
      badge: "border-emerald-400/70 bg-emerald-100 text-emerald-900",
      chip: "bg-emerald-100 text-emerald-900",
    },
  },
};
