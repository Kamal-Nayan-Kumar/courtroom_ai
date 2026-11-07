"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourtroomSimulatorMockup } from "@/components/CourtroomSimulatorMockup";

export default function CaseCourtroomPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link
          href="/case/402/prep"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Prep Studio</span>
        </Link>
        <span className="text-xs font-mono text-zinc-500">CRL.A. 402/2026 · Courtroom No. 3</span>
      </div>
      <CourtroomSimulatorMockup />
    </div>
  );
}
