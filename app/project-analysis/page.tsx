"use client";

import ManualVsAutomatedChart from "@/components/Analysis/ManualVsAutomatedChart";
import PerformanceStats from "@/components/Analysis/PerformanceStats";
import ProjectAnalysisCharts from "@/components/Analysis/ProjectAnalysisCharts";
import { Button } from "@/components/ui/button";
import { useMakeData } from "@/hooks/useMakeData";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function ProjectAnalysisPage() {
  const { data, loading } = useMakeData();

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading project metrics...
      </p>
    );

  // Metrics Calculation
  const successRuns = data.filter((d) => d.statusLabel === "success");
  const avgDuration =
    successRuns.length > 0
      ? successRuns.reduce((a, b) => a + Number(b.duration), 0) /
        (successRuns.length * 1000) // in seconds
      : 0;
  const avgCredits =
    successRuns.length > 0
      ? successRuns.reduce((a, b) => a + Number(b.credits || 0), 0) /
        successRuns.length
      : 0;
  const successRate = data.length > 0 ? (successRuns.length / data.length) * 100 : 0;

  // Manual vs Automated comparison (assume manual = 1500 sec)
  const manualAvg = 1500;
  const efficiencyGain =
    manualAvg > 0 ? ((manualAvg - avgDuration) / manualAvg) * 100 : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <main className="mx-auto max-w-7xl px-6 py-14">
        <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-10 shadow-xl backdrop-blur-sm">
          <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
                Project Insights
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900">
                Project Performance Analysis
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-500">
                Monitor test workflow health, uncover trends, and communicate progress at a glance.
              </p>
            </div>
            <div>
              <Button variant="outline">
                <Link href="/ai-insights" className="flex items-center gap-2">
                  <Sparkles size={16} />
                  View AI Insights
                </Link>  
              </Button>
            </div>
          </header>

          <PerformanceStats
            successRate={successRate}
            avgDuration={avgDuration}
            avgCredits={avgCredits}
            efficiencyGain={efficiencyGain}
          />

          <ProjectAnalysisCharts data={data} />

          <ManualVsAutomatedChart
            manualAvg={manualAvg}
            automatedAvg={avgDuration}
          />
        </section>
      </main>
    </div>
  );
}
