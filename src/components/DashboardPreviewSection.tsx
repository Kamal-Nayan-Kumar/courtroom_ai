"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  FlaskConical,
  Settings,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Award,
  ChevronRight,
  Shield,
  Search,
  ArrowRight,
} from "lucide-react";
import { DASHBOARD_METRICS, RECENT_CASES } from "../data/courtroomData";
import { DashboardCaseRow } from "../types/courtroom";

export function DashboardPreviewSection() {
  const [activeSidebarItem, setActiveSidebarItem] = useState("Dashboard");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("c-101");
  const [searchFilter, setSearchFilter] = useState("");

  const sidebarLinks = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Active Cases", icon: <Briefcase className="w-4 h-4" />, count: "4" },
    { label: "Case Library", icon: <BookOpen className="w-4 h-4" />, count: "120+" },
    { label: "Witness Lab", icon: <FlaskConical className="w-4 h-4" /> },
  ];

  const filteredCases = RECENT_CASES.filter((c) =>
    c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.court.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <section id="dashboard" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono-code font-medium mb-3">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Advocate Intelligence Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Track Every Trial Like a Senior Advocate
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
            Measure your trial analytics, bench persuasion ratings, objection hit-rates,
            and keep an organized digital chamber of all your moot memorials and case briefs.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all shadow-xs"
            >
              <span>Launch Full Chamber Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
            </Link>
          </div>
        </div>

        {/* Dashboard Frame Window */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px] divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
            {/* Left Mini-Sidebar (lg:col-span-3) */}
            <div className="lg:col-span-3 bg-zinc-50/70 p-4 flex flex-col justify-between text-xs">
              <div>
                {/* Chamber Title */}
                <div className="flex items-center gap-2.5 px-2 pb-4 mb-3 border-b border-zinc-200">
                  <div className="w-7 h-7 rounded bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                    C
                  </div>
                  <div>
                    <div className="font-bold text-zinc-950 text-xs">Chamber of Adv. Verma</div>
                    <div className="text-[10.5px] text-zinc-500 font-mono-code">Delhi Bar No. D/1042/24</div>
                  </div>
                </div>

                {/* Nav Links */}
                <div className="space-y-1">
                  {sidebarLinks.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveSidebarItem(item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                        activeSidebarItem === item.label
                          ? "bg-zinc-950 text-white shadow-2xs font-semibold"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.count && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            activeSidebarItem === item.label
                              ? "bg-white/20 text-white font-bold"
                              : "bg-zinc-200 text-zinc-800 font-semibold"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Settings & User Avatar */}
              <div className="pt-4 border-t border-zinc-200 space-y-3">
                <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors">
                  <Settings className="w-4 h-4 text-zinc-500" />
                  <span>Chamber Settings</span>
                </button>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-zinc-200 shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-900 to-amber-700 text-white flex items-center justify-center font-bold text-xs">
                    RV
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 truncate">
                      Adv. Rohan Verma
                    </p>
                    <p className="text-[10px] text-emerald-700 font-mono-code">
                      PRO Trial License
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Main Dashboard Area (lg:col-span-9) */}
            <div className="lg:col-span-9 p-5 sm:p-7 flex flex-col justify-between">
              <div>
                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight">
                      Good morning, Counsel
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                      You have 1 pending cross-examination session and 2 upcoming moot trials.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="relative hidden sm:block">
                      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filter cases..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-800 bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:bg-white"
                      />
                    </div>

                    <a
                      href="#simulation"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium shadow-xs transition-all hover:-translate-y-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Start New Case</span>
                    </a>
                  </div>
                </div>

                {/* Performance Stats Row: 4 Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
                  {DASHBOARD_METRICS.map((metric) => (
                    <div
                      key={metric.label}
                      className="p-4 rounded-xl bg-zinc-50/70 border border-zinc-200/90 shadow-2xs hover:bg-white hover:border-zinc-300 transition-all"
                    >
                      <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                        {metric.label}
                      </div>
                      <div className="text-2xl font-bold text-zinc-950 mt-1 font-mono-code tracking-tight">
                        {metric.value}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{metric.trendValue}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Cases Table */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-zinc-950 uppercase tracking-wide">
                      Recent Trial Docket
                    </h4>
                    <span className="text-xs text-zinc-500 font-mono-code">
                      Showing {filteredCases.length} active briefs
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-zinc-50/80 text-zinc-500 font-mono-code uppercase text-[10.5px] border-b border-zinc-200">
                        <tr>
                          <th className="py-3 px-3.5 font-semibold">Case Title &amp; Forum</th>
                          <th className="py-3 px-3 font-semibold">Role</th>
                          <th className="py-3 px-3 font-semibold">Stage</th>
                          <th className="py-3 px-3 font-semibold">Bench Score</th>
                          <th className="py-3 px-3 text-right font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200/80 font-sans">
                        {filteredCases.map((caseItem: DashboardCaseRow) => {
                          const isSelected = caseItem.id === selectedCaseId;
                          return (
                            <tr
                              key={caseItem.id}
                              onClick={() => setSelectedCaseId(caseItem.id)}
                              className={`hover:bg-zinc-50/70 transition-colors cursor-pointer ${
                                isSelected ? "bg-amber-50/30" : ""
                              }`}
                            >
                              <td className="py-3 px-3.5">
                                <div className="font-semibold text-zinc-950 text-xs">
                                  {caseItem.title}
                                </div>
                                <div className="text-[11px] text-zinc-500">
                                  {caseItem.court}
                                </div>
                              </td>

                              <td className="py-3 px-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-medium ${
                                    caseItem.role === "Defense Counsel"
                                      ? "bg-amber-100 text-amber-900"
                                      : "bg-blue-100 text-blue-900"
                                  }`}
                                >
                                  <Shield className="w-2.5 h-2.5" />
                                  <span>{caseItem.role}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="inline-flex items-center gap-1.5 text-zinc-700 font-medium text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>{caseItem.stage}</span>
                                </span>
                              </td>

                              <td className="py-3 px-3 font-mono-code font-bold text-zinc-900 text-xs">
                                {caseItem.judgeScore} / 10
                              </td>

                              <td className="py-3 px-3 text-right">
                                <a
                                  href="#simulation"
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-900 hover:text-blue-900 px-2 py-1 rounded hover:bg-zinc-100 transition-colors"
                                >
                                  <span>Resume Trial</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Callout */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-2">
                <span>All evidence data encrypted under Indian Digital Personal Data Protection Act standards.</span>
                <span className="font-mono-code text-zinc-700">Sync: Real-time Cloud Vault</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
