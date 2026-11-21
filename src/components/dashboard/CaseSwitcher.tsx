"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resolveCaseId } from "@/lib/caseAliases";

type CaseOption = {
  id: string;
  title: string;
  category?: string;
  court?: string;
};

export function CaseSwitcher({
  mode,
  currentCaseId,
  className = "",
}: {
  mode: "courtroom" | "prep";
  currentCaseId?: string;
  className?: string;
}) {
  const router = useRouter();
  const [cases, setCases] = useState<CaseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch("/api/cases", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load cases");
        const json = await res.json();
        const list: unknown = Array.isArray(json) ? json : json?.cases;
        const normalized: CaseOption[] = Array.isArray(list)
          ? list
              .filter(
                (item): item is Record<string, unknown> =>
                  Boolean(item) && typeof item === "object",
              )
              .map((item) => ({
                id: String(item.id ?? ""),
                title: String(item.title ?? item.id ?? "Untitled case"),
                category: typeof item.category === "string" ? item.category : undefined,
                court: typeof item.court === "string" ? item.court : undefined,
              }))
              .filter((item) => item.id)
          : [];
        if (!cancelled) setCases(normalized);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const disabled = loading || error || cases.length === 0;
  const value = currentCaseId ? resolveCaseId(currentCaseId) : "";

  return (
    <label className={`inline-flex items-center gap-1.5 text-xs text-zinc-600 ${className}`}>
      <span className="font-medium text-zinc-700 whitespace-nowrap">Case:</span>
      <select
        aria-label="Switch case"
        className="h-8 max-w-[220px] rounded border border-zinc-300 bg-white px-2 text-xs text-zinc-900 outline-none focus:border-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const nextId = e.target.value;
          if (!nextId) return;
          router.push(`/case/${encodeURIComponent(nextId)}/${mode}`);
        }}
      >
        {loading ? (
          <option value={value}>Loading cases…</option>
        ) : error || cases.length === 0 ? (
          <option value={value}>No cases available</option>
        ) : (
          <>
            {!value && <option value="">Select a case</option>}
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </>
        )}
      </select>
    </label>
  );
}
