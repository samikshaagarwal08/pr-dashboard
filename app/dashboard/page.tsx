"use client";

import { usePRData } from "@/hooks/usePRData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, GitMerge, GitPullRequest, Sparkle, SquareStack } from "lucide-react";
import { handleDownloadPDF } from "@/utils/handleDownloadPdf";
import OverviewCharts from "@/components/OverviewCharts";
import ContributorsView from "@/components/ContributorsView";
import PullRequestsTable from "@/components/PullRequestTable";
import ReportSection from "@/components/ReportSection";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useMemo, useState } from "react";

type DashboardHeadlineMetric = {
  label: string;
  value: number;
  accent: string;
  icon: React.ReactNode;
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
  monthlyActivity: { month: string; count: number; key: string }[];
  contributors: { name: string; count: number }[];
  summary: DashboardSummary;
};

export default function DashboardPage() {
  const { data, loading, error } = usePRData();
  const [downloading, setDownloading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const monthOptions = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthSet = new Set<string>();

    data.forEach((pr) => {
      const createdAt = pr["Created At"];
      const date = createdAt ? new Date(createdAt) : undefined;
      if (date && !Number.isNaN(date.getTime())) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthSet.add(key);
      }
    });

    return Array.from(monthSet)
      .sort((a, b) => b.localeCompare(a))
      .map((ym) => {
        const [year, month] = ym.split("-");
        const monthIndex = Number(month) - 1;
        const monthLabel = monthIndex >= 0 && monthIndex < monthNames.length ? monthNames[monthIndex] : month;
        return { value: `month:${ym}`, label: `${monthLabel} '${year.slice(-2)}` };
      });
  }, [data]);

  const timeOptions = useMemo(
    () => [
      { value: "all", label: "All time" },
      { value: "last30", label: "Last 30 days" },
      { value: "last7", label: "Last 7 days" },
      ...monthOptions,
      { value: "custom", label: "Custom range" },
    ],
    [monthOptions],
  );

  const filteredData = useMemo(() => {
    const now = Date.now();

    return data.filter((pr) => {
      const createdAt = pr["Created At"];
      const date = createdAt ? new Date(createdAt) : undefined;
      if (!date || Number.isNaN(date.getTime())) return false;

      if (timeFilter === "all") return true;

      if (timeFilter === "last7" || timeFilter === "last30") {
        const days = timeFilter === "last7" ? 7 : 30;
        const cutoff = now - days * 24 * 60 * 60 * 1000;
        return date.getTime() >= cutoff;
      }

      if (timeFilter.startsWith("month:")) {
        const ym = timeFilter.replace("month:", "");
        const [year, month] = ym.split("-");
        return date.getFullYear() === Number(year) && date.getMonth() + 1 === Number(month);
      }

      if (timeFilter === "custom" && startDate && endDate) {
        const dateTime = date.getTime();
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();
        // Set end date to end of day
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        return dateTime >= startTime && dateTime <= endOfDay.getTime();
      }

      return true;
    });
  }, [data, timeFilter, startDate, endDate]);

  const selectedFilterLabel = useMemo(
    () => {
      if (timeFilter === "custom" && startDate && endDate) {
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      }
      return timeOptions.find((opt) => opt.value === timeFilter)?.label ?? "All time";
    },
    [timeOptions, timeFilter, startDate, endDate],
  );

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setTimeFilter("custom");
    }
  };

  const handleDateFilterChange = (value: string) => {
    setTimeFilter(value);
    if (value !== "custom") {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const analytics = useMemo<DashboardAnalytics>(() => {
    const statusCounts = { open: 0, closed: 0, merged: 0 };
    const contributorCounts = new Map<string, number>();
    const monthlyCounts = new Map<string, number>();
    let lintSuccess = 0;

    filteredData.forEach((pr) => {
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

    const total = filteredData.length;
    const lintSuccessRate = total === 0 ? 0 : Number(((lintSuccess / total) * 100).toFixed(1));

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyActivity = Array.from(monthlyCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ym, count]) => {
        const [year, month] = ym.split("-");
        const monthIndex = Number(month) - 1;
        const monthLabel = monthIndex >= 0 && monthIndex < monthNames.length ? monthNames[monthIndex] : month;
        return { month: `${monthLabel} '${year.slice(-2)}`, count, key: ym };
      });

    const headlineMetrics: DashboardHeadlineMetric[] = [
      { label: "Merged PRs", value: statusCounts.merged, accent: "text-emerald-600", icon: <GitMerge size={18} /> },
      { label: "Open PRs", value: statusCounts.open, accent: "text-indigo-600", icon: <GitPullRequest size={18} /> },
      { label: "Closed PRs", value: statusCounts.closed, accent: "text-slate-600", icon: <SquareStack size={18} /> },
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
  }, [filteredData]);

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
            <div className="w-full rounded-2xl border border-indigo-100 bg-white/80 px-4 py-3 shadow-sm sm:w-64">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                Time Filter
              </p>
              <select
                value={timeFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className="mt-2 w-full cursor-pointer rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {timeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {timeFilter === "custom" && (
                <div className="mt-3">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    onDateRangeChange={handleDateRangeChange}
                  />
                </div>
              )}
              <p className="mt-2 text-[11px] text-slate-500">
                Showing {filteredData.length} PR{filteredData.length === 1 ? "" : "s"} · {selectedFilterLabel}
              </p>
            </div>
             <div className="flex flex-col justify-between items-center gap-2">
             <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-indigo-600 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                  Last Sync
                </p>
                <p className="text-xs font-medium">
                  {new Date().toLocaleString()}
                </p>
              </div>
              <Button
                onClick={async () => {
                  setDownloading(true);
                  await handleDownloadPDF("dashboard-content");
                  setDownloading(false);
                }}
                className="rounded-lg w-full border cursor-pointer border-indigo-200 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 transition-all duration-200 hover:translate-y-0.5 hover:shadow-indigo-300/70 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
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
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-3">
            {analytics.headlineMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-5 shadow-sm"
              >
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 shadow-sm">
                  {metric.icon}
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {metric.label}
                  </p>
                  <p className={`mt-1 text-2xl font-semibold ${metric.accent}`}>
                    {metric.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-1 gap-2 rounded-sm bg-indigo-50/70 px-2 sm:grid-cols-2 lg:grid-cols-4">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="contributors"
                className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Contributors
              </TabsTrigger>
              <TabsTrigger
                value="pulls"
                className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Pull Requests
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-white cursor-pointer data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm text-slate-500"
              >
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <OverviewCharts
                  statusBreakdown={analytics.statusBreakdown}
                  monthlyActivity={analytics.monthlyActivity}
                  onMonthSelect={(key) => setTimeFilter(`month:${key}`)}
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
                <PullRequestsTable data={filteredData} />
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
