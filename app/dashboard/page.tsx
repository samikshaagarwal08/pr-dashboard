"use client";

import { usePRData } from "@/hooks/usePRData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Sparkle } from "lucide-react";
import { handleDownloadPDF } from "@/utils/handleDownloadPdf";
import OverviewCharts from "@/components/OverviewCharts";
import ContributorsView from "@/components/ContributorsView";
import PullRequestsTable from "@/components/PullRequestTable";
import ReportSection from "@/components/ReportSection";
import { useMemo, useState } from "react";

type DashboardHeadlineMetric = {
  label: string;
  value: number;
  accent: string;
};

type DashboardSummary = {
  total: number;
  open: number;
  closed: number;
  merged: number;
  lintSuccessRate: number;
};

type DashboardAnalytics = {
  headlineMetrics: DashboardHeadlineMetric[];
  statusBreakdown: { name: string; value: number }[];
  monthlyActivity: { month: string; count: number }[];
  contributors: { name: string; count: number }[];
  summary: DashboardSummary;
};

export default function DashboardPage() {
  const { data, loading, error } = usePRData();
  const [downloading, setDownloading] = useState(false);

  const analytics = useMemo<DashboardAnalytics>(() => {
    const statusCounts = { open: 0, closed: 0, merged: 0 };
    const contributorCounts = new Map<string, number>();
    const monthlyCounts = new Map<string, number>();
    let lintSuccess = 0;

    data.forEach((pr) => {
      const status = String(pr.Status ?? "").toLowerCase();
      if (statusCounts.open !== undefined && status === "open") {
        statusCounts.open += 1;
      } else if (statusCounts.closed !== undefined && status === "closed") {
        statusCounts.closed += 1;
      } else if (statusCounts.merged !== undefined && status === "merged") {
        statusCounts.merged += 1;
      }

      const author = String(pr.Author ?? "Unknown");
      contributorCounts.set(author, (contributorCounts.get(author) ?? 0) + 1);

      const createdAt = pr["Created At"];
      const date = createdAt ? new Date(createdAt) : undefined;
      if (date && !Number.isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthlyCounts.set(key, (monthlyCounts.get(key) ?? 0) + 1);
      }

      const lintStatus = String(pr["Lint Status"] ?? "").toLowerCase();
      if (lintStatus.includes("success")) {
        lintSuccess += 1;
      }
    });

    const total = data.length;
    const lintSuccessRate = total === 0 ? 0 : Number(((lintSuccess / total) * 100).toFixed(1));

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyActivity = Array.from(monthlyCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ym, count]) => {
        const [year, month] = ym.split("-");
        const monthIndex = Number(month) - 1;
        const monthLabel = monthIndex >= 0 && monthIndex < monthNames.length ? monthNames[monthIndex] : month;
        return { month: `${monthLabel} '${year.slice(-2)}`, count };
      });

    const headlineMetrics: DashboardHeadlineMetric[] = [
      { label: "Merged PRs", value: statusCounts.merged, accent: "text-emerald-600" },
      { label: "Open PRs", value: statusCounts.open, accent: "text-indigo-600" },
      { label: "Closed PRs", value: statusCounts.closed, accent: "text-slate-600" },
    ];

    return {
      headlineMetrics,
      statusBreakdown: [
        { name: "Open", value: statusCounts.open },
        { name: "Closed", value: statusCounts.closed },
        { name: "Merged", value: statusCounts.merged },
      ],
      monthlyActivity,
      contributors: Array.from(contributorCounts.entries())
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count })),
      summary: {
        total,
        open: statusCounts.open,
        closed: statusCounts.closed,
        merged: statusCounts.merged,
        lintSuccessRate,
      },
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-indigo-50">
        <p className="text-sm font-medium text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-indigo-50">
        <div className="rounded-2xl border border-rose-200 bg-white/80 px-6 py-5 shadow-lg shadow-rose-100/60">
          <p className="text-sm font-semibold text-rose-600">We couldn&apos;t load the dashboard data.</p>
          <p className="mt-2 text-xs text-rose-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <main className="mx-auto max-w-7xl px-6 py-14">
        <section
          id="dashboard-content"
          className="space-y-10 rounded-3xl border border-slate-200/60 bg-white/80 p-10 shadow-xl backdrop-blur-md"
        >
          <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                Live Insights
                <Sparkle size={14} />
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">
                PR Analytics Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-500">
                Stay on top of repository health with real-time metrics, contributor trends, and actionable reporting snapshots.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-indigo-600 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                  Last Sync
                </p>
                <p className="text-sm font-medium">
                  {new Date().toLocaleString()}
                </p>
              </div>
              <Button
                onClick={async () => {
                  setDownloading(true);
                  await handleDownloadPDF("dashboard-content");
                  setDownloading(false);
                }}
                className="rounded-xl border border-indigo-200 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:translate-y-0.5 hover:shadow-indigo-300/70 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={downloading}
              >
                {downloading ? (
                  "Preparing..."
                ) : (
                  <>
                    <Download size={16} /> Export Snapshot
                  </>
                )}
              </Button>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-3">
            {analytics.headlineMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {metric.label}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${metric.accent}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-1 gap-2 rounded-2xl bg-indigo-50/70 p-2 sm:grid-cols-2 lg:grid-cols-4">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="contributors"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Contributors
              </TabsTrigger>
              <TabsTrigger
                value="pulls"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Pull Requests
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <OverviewCharts
                  statusBreakdown={analytics.statusBreakdown}
                  monthlyActivity={analytics.monthlyActivity}
                />
              </div>
            </TabsContent>

            <TabsContent value="contributors" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <ContributorsView contributors={analytics.contributors} />
              </div>
            </TabsContent>

            <TabsContent value="pulls" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <PullRequestsTable data={data} />
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <ReportSection summary={analytics.summary} />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
