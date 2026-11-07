"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Scale,
  Clock,
  Users,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PUBLIC_CASE_LIBRARY } from "@/data/dashboardData";
import { PublicPracticeCase } from "@/types/dashboard";

export function PublicCaseLibraryGrid() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredCases = PUBLIC_CASE_LIBRARY.filter((item) => {
    if (selectedDifficulty === "all") return true;
    return item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
  });

  const getDifficultyBadge = (diff: PublicPracticeCase["difficulty"]) => {
    switch (diff) {
      case "Beginner":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Medium":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Hard":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Moot Level":
        return "bg-rose-50 text-rose-800 border-rose-200 font-bold";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div id="library-grid" className="flex flex-col gap-5">
      {/* Header and Filter Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200/90 shadow-2xs">
        <div>
          <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
            <BookOpen className="size-4 text-zinc-900" />
            <span>Pre-Configured Indian Benchmark & Moot Cases</span>
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Calibrated with complete witness personas, forensic exhibits, and simulated Judge corams.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-100/90 p-1 rounded-lg border border-zinc-200/60 self-stretch sm:self-auto justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDifficulty("all")}
            className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
              selectedDifficulty === "all"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            All Difficulties
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDifficulty("medium")}
            className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
              selectedDifficulty === "medium"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Medium
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDifficulty("hard")}
            className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
              selectedDifficulty === "hard"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Hard
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDifficulty("moot level")}
            className={`h-7 px-2.5 text-xs font-medium rounded-md transition-all ${
              selectedDifficulty === "moot level"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Moot Level
          </Button>
        </div>
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((item) => (
          <Card
            key={item.id}
            className="bg-white border-zinc-200/90 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group hover:border-zinc-300"
          >
            <CardHeader className="p-4 sm:p-5 pb-2">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  {item.citation}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs font-mono py-0.5 px-2.5 ${getDifficultyBadge(item.difficulty)}`}
                >
                  {item.difficulty}
                </Badge>
              </div>

              <CardTitle className="text-base font-bold text-zinc-950 group-hover:text-blue-900 transition-colors leading-snug">
                {item.title}
              </CardTitle>

              <div className="text-xs font-medium text-zinc-500 mt-1 flex items-center gap-1.5">
                <Scale className="size-3.5 text-zinc-400 shrink-0" />
                <span className="truncate">{item.court}</span>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 pt-1 pb-3 flex-1 flex flex-col justify-between gap-3.5">
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-3">
                {item.summary}
              </p>

              {/* Theme & Statutes */}
              <div className="flex flex-col gap-2 pt-2.5 border-t border-zinc-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">Core Issue:</span>
                  <span className="text-zinc-600 text-right truncate max-w-[200px]">
                    {item.keyTheme}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.statuteBadges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className="text-xs font-mono py-0.5 px-2 bg-zinc-50 text-zinc-700 border-zinc-200"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 sm:p-5 pt-2.5 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/40 rounded-b-xl">
              <div className="flex items-center gap-2.5 text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {item.estimatedMinutes}m
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="size-3.5" />
                  {item.practiceCount} runs
                </span>
              </div>

              <Button
                asChild
                size="sm"
                className="h-8 text-xs bg-zinc-950 text-white hover:bg-zinc-800 shadow-2xs font-medium"
              >
                <a href="/case/402/courtroom">
                  <span>Practice This Case</span>
                  <ArrowRight className="size-3 ml-1" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
