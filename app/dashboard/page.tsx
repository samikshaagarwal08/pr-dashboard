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

export default function DashboardPage() {
  const { data, loading } = usePRData();
  const [downloading, setDownloading] = useState(false);

  const headlineMetrics = useMemo(() => {
    const merged = data.filter((d) => d.Status === "merged").length;
    const open = data.filter((d) => d.Status === "open").length;
    const closed = data.filter((d) => d.Status === "closed").length;
    
    return [
      { label: "Merged PRs", value: merged, accent: "text-emerald-600" },
      { label: "Open PRs", value: open, accent: "text-indigo-600" },
      {
        label: "Closed PRs",
        value: closed,
        accent: "text-slate-600",
      },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 via-white to-indigo-50">
        <p className="text-sm font-medium text-slate-500">Loading analytics...</p>
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
            {headlineMetrics.map((metric) => (
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
                <OverviewCharts data={data} />
              </div>
            </TabsContent>

            <TabsContent value="contributors" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <ContributorsView data={data} />
              </div>
            </TabsContent>

            <TabsContent value="pulls" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <PullRequestsTable data={data} />
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <ReportSection data={data} />
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
}
