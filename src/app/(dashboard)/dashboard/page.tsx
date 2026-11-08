"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, ArrowRight, Award, Clock, Gavel, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  kpi: { sessions_played: number; avg_overall: number };
  recentCases: Array<{ id: string; title: string; category: string; court: string; summary: string }>;
  recentSessions: Array<{ id: string; case_id: string; student_role: string; started_at: string; status: string; overall: number | null; judge_summary: string | null }>;
  prepOpen: { open_tasks: number };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load dashboard");
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load dashboard");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="p-10 text-center text-sm text-zinc-600">{error}</div>
    );
  }
  if (!data) return <div className="p-10 text-sm text-zinc-500">Loading chamber...</div>;

  const firstCase = data.recentCases[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10.5px] font-mono bg-emerald-50 text-emerald-800 border-emerald-200">
              Chamber Live
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">Good morning, Counsel.</h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            {data.kpi.sessions_played} sessions on record. Average bench score {Number(data.kpi.avg_overall ?? 0).toFixed(1)}/10.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Sessions played", value: String(data.kpi.sessions_played) },
          { label: "Avg verdict score", value: `${Number(data.kpi.avg_overall ?? 0).toFixed(1)} / 10` },
          { label: "Cases in practice", value: String(data.recentCases.length) },
          { label: "Prep tasks open", value: String(data.prepOpen.open_tasks) },
        ].map((k) => (
          <div key={k.label} className="p-4 rounded-2xl bg-white border border-zinc-200">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{k.label}</span>
            <span className="text-lg font-bold text-zinc-950 font-mono block mt-1">{k.value}</span>
          </div>
        ))}
      </section>

      {firstCase && (
        <section className="rounded-2xl border border-blue-900 bg-blue-900 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-white">Continue with {firstCase.title.slice(0, 60)}</p>
            <p className="text-xs text-blue-100">{firstCase.category} · {firstCase.court}</p>
          </div>
          <Button asChild size="sm" className="h-9 px-4 text-xs font-semibold bg-white text-blue-900 hover:bg-zinc-100 shrink-0">
            <Link href={`/case/${firstCase.id}/courtroom`}>Enter courtroom <ArrowRight className="size-3.5 ml-1" /></Link>
          </Button>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="size-4 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-950">Practice cases</h2>
          </div>
          {data.recentCases.map((c) => (
            <div key={c.id} className="border-t border-zinc-100 pt-3 first:border-0 first:pt-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 truncate">{c.title}</p>
                  <p className="text-[11px] text-zinc-500">{c.category}</p>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 shrink-0">{c.id}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{c.summary}</p>
              <div className="flex gap-2 mt-2">
                <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs"><Link href={`/case/${c.id}/prep`}>Prep</Link></Button>
                <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs"><Link href={`/case/${c.id}/courtroom`}>Courtroom</Link></Button>
              </div>
            </div>
          ))}
          {data.recentCases.length === 0 && <p className="text-xs text-zinc-500">No cases yet. Seed the library from the dashboard.</p>}
        </div>

        <div className="p-4 rounded-2xl bg-white border border-zinc-200 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Gavel className="size-4 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-950">Recent verdicts</h2>
          </div>
          {data.recentSessions.map((s) => (
            <div key={s.id} className="border-t border-zinc-100 pt-3 first:border-0 first:pt-0 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-zinc-900 truncate">{s.case_id} · {s.student_role}</span>
                <span className="font-mono text-[11px] text-zinc-500 shrink-0">{s.overall !== null ? `${s.overall}/10` : s.status}</span>
              </div>
              {s.judge_summary && <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{s.judge_summary}</p>}
              <div className="flex items-center gap-1 mt-1 text-[11px] text-zinc-400">
                <Clock className="size-3" />
                <span>{new Date(s.started_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {data.recentSessions.length === 0 && (
            <p className="text-xs text-zinc-500">No verdicts yet. Finish a session and the report lands here.</p>
          )}
        </div>
      </section>

      <section className="flex gap-2 items-center text-xs text-zinc-500">
        <BookOpen className="size-4" />
        <span>Public case library and prep tools live under the sidebar. Start with a practice case above.</span>
      </section>
    </div>
  );
}
