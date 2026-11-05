"use client";

import React, { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PERFORMANCE_TIMELINE } from "@/data/dashboardData";

const chartConfig = {
  argumentStrength: {
    label: "Argument Strength",
    color: "#18181b", // Advocate Charcoal
  },
  citationAccuracy: {
    label: "Citation Accuracy (BNS/BSA)",
    color: "#1e3a8a", // Ashoka Navy
  },
  crossExamPressure: {
    label: "Cross-Exam Pressure",
    color: "#b45309", // Judicial Amber
  },
} satisfies ChartConfig;

export function PerformanceChart() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "all">("7d");
  const data = PERFORMANCE_TIMELINE[timeframe];

  return (
    <Card className="bg-white border-zinc-200/90 shadow-2xs h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-zinc-100 flex flex-row items-start justify-between space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Courtroom Performance Trajectory
            </CardTitle>
            <Badge
              variant="outline"
              className="text-[10px] font-mono bg-blue-50 text-blue-800 border-blue-200"
            >
              8 Practiced Sessions
            </Badge>
          </div>
          <CardDescription className="text-xs text-zinc-500 mt-0.5">
            Argument cohesion, statutory citation rigor, and adversarial cross-exam endurance.
          </CardDescription>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/60">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTimeframe("7d")}
            className={`h-6 px-2 text-[11px] font-medium rounded-md transition-all ${
              timeframe === "7d"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            Last 7 Days
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTimeframe("30d")}
            className={`h-6 px-2 text-[11px] font-medium rounded-md transition-all ${
              timeframe === "30d"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            30 Days
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setTimeframe("all")}
            className={`h-6 px-2 text-[11px] font-medium rounded-md transition-all ${
              timeframe === "all"
                ? "bg-white text-zinc-950 shadow-2xs font-semibold"
                : "text-zinc-600 hover:text-zinc-950"
            }`}
          >
            All Moot Sessions
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-2 px-3 flex-1 flex flex-col justify-between">
        <ChartContainer config={chartConfig} className="w-full h-[260px] aspect-auto">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillArgument" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#18181b" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillCitation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillCrossExam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b45309" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#b45309" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f2" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "#71717a" }}
            />
            <YAxis
              domain={[50, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "#71717a" }}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              type="monotone"
              dataKey="argumentStrength"
              stroke="#18181b"
              strokeWidth={2}
              fill="url(#fillArgument)"
              dot={{ r: 3, fill: "#18181b" }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="citationAccuracy"
              stroke="#1e3a8a"
              strokeWidth={2}
              fill="url(#fillCitation)"
              dot={{ r: 3, fill: "#1e3a8a" }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="monotone"
              dataKey="crossExamPressure"
              stroke="#b45309"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#fillCrossExam)"
              dot={{ r: 3, fill: "#b45309" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>

        {/* Legend bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-zinc-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-zinc-950" />
            <span className="text-zinc-600 font-medium">Argument Strength</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-blue-900" />
            <span className="text-zinc-600 font-medium">Citation Accuracy (BNS/BSA)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-600" />
            <span className="text-zinc-600 font-medium">Cross-Exam Pressure</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
