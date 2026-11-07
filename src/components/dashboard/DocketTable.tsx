"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowRight,
  Shield,
  Scale,
  Award,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/context/DashboardContext";
import { ActiveDocketItem } from "@/types/dashboard";

export function DocketTable() {
  const { activeDocket, showNotification, openNewCaseModal } = useDashboard();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const filteredDocket = activeDocket.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.statutes.some((s) => s.section.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "defense" && item.role === "defense") ||
      (roleFilter === "prosecution" && item.role === "prosecution");

    const matchesStage =
      stageFilter === "all" || item.stage === stageFilter;

    return matchesSearch && matchesRole && matchesStage;
  });

  const getStatuteBadgeStyle = (code: string) => {
    switch (code) {
      case "BNS":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "BSA":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "BNSS":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Constitution":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const getActionButtonText = (stage: string) => {
    switch (stage) {
      case "case-prep":
        return "Prepare Case";
      case "witness-exam":
        return "Enter Courtroom";
      case "final-arguments":
        return "Deliver Rebuttal";
      case "verdict-delivered":
        return "View Judgment";
      default:
        return "Open Docket";
    }
  };

  return (
    <div id="cases-table" className="flex flex-col gap-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-zinc-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-400" />
          <Input
            placeholder="Filter by case title, FIR/CRL.A, or BNS section..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-zinc-50/60 border-zinc-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs bg-zinc-50/60 border-zinc-200">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="defense">Defense Counsel</SelectItem>
              <SelectItem value="prosecution">Public Prosecutor</SelectItem>
            </SelectContent>
          </Select>

          {/* Stage Filter */}
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[160px] h-9 text-xs bg-zinc-50/60 border-zinc-200">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="case-prep">Case Prep</SelectItem>
              <SelectItem value="witness-exam">Witness Exam</SelectItem>
              <SelectItem value="final-arguments">Final Arguments</SelectItem>
              <SelectItem value="verdict-delivered">Verdict Delivered</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || roleFilter !== "all" || stageFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStageFilter("all");
              }}
              className="h-9 px-2 text-xs text-zinc-500 hover:text-zinc-900"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Docket Table Container */}
      <div className="rounded-xl border border-zinc-200/90 bg-white overflow-hidden shadow-2xs">
        <Table>
          <TableHeader className="bg-zinc-50/80">
            <TableRow className="border-b border-zinc-200 hover:bg-transparent">
              <TableHead className="w-[320px] text-xs font-semibold text-zinc-700">Docket & Case Title</TableHead>
              <TableHead className="w-[220px] text-xs font-semibold text-zinc-700">Statutes Involved</TableHead>
              <TableHead className="w-[150px] text-xs font-semibold text-zinc-700">Your Role</TableHead>
              <TableHead className="w-[200px] text-xs font-semibold text-zinc-700">Trial Stage & Progress</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold text-zinc-700 text-center">Judge AI Score</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold text-zinc-700 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredDocket.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-1.5 text-zinc-500">
                    <Scale className="size-6 text-zinc-400" />
                    <p className="text-sm font-medium">No active cases match your filters.</p>
                    <p className="text-xs text-zinc-400">Try clearing your filters or create a new trial session.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredDocket.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-zinc-50/70 transition-colors border-b border-zinc-100 group"
                >
                  {/* Column 1: Docket & Case Title */}
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          {item.caseNumber}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs py-0.5 px-2 text-zinc-600 bg-zinc-50 border-zinc-200"
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <span className="font-semibold text-sm text-zinc-950 group-hover:text-blue-900 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-xs text-zinc-500 truncate">
                        {item.court}
                      </span>
                    </div>
                  </TableCell>

                  {/* Column 2: Statutes Involved */}
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.statutes.map((s) => (
                        <Badge
                          key={s.section}
                          variant="outline"
                          className={`text-xs font-mono py-0.5 px-2 ${getStatuteBadgeStyle(s.code)}`}
                          title={`${s.code} ${s.section}: ${s.name}`}
                        >
                          {s.code} {s.section}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Column 3: Your Role */}
                  <TableCell className="py-4">
                    {item.role === "defense" ? (
                      <Badge
                        variant="outline"
                        className="text-xs font-medium bg-amber-50/80 text-amber-900 border-amber-200 flex items-center gap-1.5 w-fit py-1 px-2.5"
                      >
                        <Shield className="size-3.5 text-amber-700" />
                        <span>Defense Counsel</span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs font-medium bg-blue-50/80 text-blue-900 border-blue-200 flex items-center gap-1.5 w-fit py-1 px-2.5"
                      >
                        <Scale className="size-3.5 text-blue-700" />
                        <span>Public Prosecutor</span>
                      </Badge>
                    )}
                  </TableCell>

                  {/* Column 4: Trial Stage & Progress */}
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-800 truncate">
                          {item.stageLabel}
                        </span>
                        <span className="font-mono text-xs text-zinc-500">
                          {item.progressPercent}%
                        </span>
                      </div>
                      <Progress
                        value={item.progressPercent}
                        className="h-2 bg-zinc-100"
                      />
                    </div>
                  </TableCell>

                  {/* Column 5: Judge AI Score */}
                  <TableCell className="py-4 text-center">
                    {item.judgeScore !== null ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-950 font-mono font-bold text-xs">
                        <Award className="size-3.5 text-amber-600" />
                        {item.judgeScore} / 10
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-zinc-400 font-mono">
                        <Clock className="size-3.5" />
                        In Progress
                      </span>
                    )}
                  </TableCell>

                  {/* Column 6: Action */}
                  <TableCell className="py-4 text-right">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs font-semibold border-zinc-300 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white transition-all shadow-2xs px-3"
                    >
                      <Link href={item.id === "case-402" ? "/case/402/prep" : "/#simulation"}>
                        <span>{getActionButtonText(item.stage)}</span>
                        <ArrowRight className="size-3.5 ml-1" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table Footer Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>Showing {filteredDocket.length} of {activeDocket.length} cases</span>
        <button
          type="button"
          onClick={() => openNewCaseModal()}
          className="text-zinc-800 hover:text-zinc-950 font-medium hover:underline inline-flex items-center gap-1"
        >
          <span>Need to simulate a new FIR?</span>
          <span className="font-semibold">+ Add Case</span>
        </button>
      </div>
    </div>
  );
}
