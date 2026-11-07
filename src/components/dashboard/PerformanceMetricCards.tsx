"use client";

import React from "react";
import {
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ADVOCATE_KPIS } from "@/data/dashboardData";

export function PerformanceMetricCards() {
  const getIcon = (id: string) => {
    switch (id) {
      case "win-rate":
        return <TrendingUp className="size-4 text-emerald-600" />;
      case "objection-accuracy":
        return <ShieldCheck className="size-4 text-blue-700" />;
      case "persuasion-index":
        return <Award className="size-4 text-amber-600" />;
      case "witness-resilience":
        return <Users className="size-4 text-purple-600" />;
      default:
        return <TrendingUp className="size-4 text-zinc-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {ADVOCATE_KPIS.map((kpi) => (
        <Card
          key={kpi.id}
          className="bg-white border-zinc-200/90 shadow-2xs hover:shadow-xs transition-shadow"
        >
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-3.5">
            {/* Header: Label + Icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-semibold text-zinc-700 leading-snug">
                {kpi.label}
              </span>
              <div className="size-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                {getIcon(kpi.id)}
              </div>
            </div>

            {/* Middle: Big Metric Value & Trend/Badge */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 font-sans">
                {kpi.value}
              </span>
              {kpi.badgeText ? (
                <Badge
                  variant="outline"
                  className="text-xs font-medium bg-emerald-50 text-emerald-800 border-emerald-200"
                >
                  {kpi.badgeText}
                </Badge>
              ) : (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                  {kpi.change}
                </span>
              )}
            </div>

            {/* Bottom: Progress Bar or Subtext */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-100">
              {kpi.progressValue !== undefined && (
                <Progress
                  value={kpi.progressValue}
                  className="h-2 bg-zinc-100"
                />
              )}
              <div className="flex items-center justify-between text-xs text-zinc-500 leading-normal">
                <span className="truncate">{kpi.detail}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
