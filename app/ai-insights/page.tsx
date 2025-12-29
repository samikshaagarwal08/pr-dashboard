"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import Papa, { type ParseResult } from "papaparse";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileUp, Loader2, Sparkles } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

type CsvRow = Record<string, string | number | null | undefined>;

type ComparisonRow = {
  task: string;
  Manual: number;
  Automated: number;
};

const parseNumber = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  const num = Number.parseFloat(String(value));
  return Number.isFinite(num) ? num : 0;
};

const manualKeys = ["ManualTime", "Manual Hours", "Manual", "Manual_Hours"];
const automatedKeys = ["AutomatedTime", "Automated Hours", "Automated", "Automated_Hours"];

export default function AIInsightsPage() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setInsights("");

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result: ParseResult<CsvRow>) => {
        const sanitized = result.data.filter((row) =>
          Object.values(row).some((value) => value !== undefined && value !== null && String(value).trim() !== ""),
        );

        if (!sanitized.length) {
          setError("We couldn't find any rows in that file. Please verify the CSV content.");
        }

        setCsvData(sanitized);
      },
      error: (parseError) => {
        console.error(parseError);
        setError("We ran into an issue reading that CSV. Please try again.");
        setCsvData([]);
      },
    });
  };

  const handleAnalyze = async () => {
    if (!csvData.length) {
      setError("Upload a CSV before requesting AI insights.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setInsights(String(data.text ?? ""));
    } catch (requestError) {
      console.error(requestError);
      setError("We couldn't generate insights right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const comparisonData = useMemo<ComparisonRow[]>(() => {
    if (!csvData.length) {
      return [];
    }

    return csvData.map((row, index) => {
      const manualValue =
        manualKeys.reduce<string | number | null | undefined>(
          (acc, key) => acc ?? row[key],
          null
        ) ?? row["Manual (sec)"];
      const automatedValue =
        automatedKeys.reduce<string | number | null | undefined>(
          (acc, key) => acc ?? row[key],
          null
        ) ?? row["Automated (sec)"];

      const task =
        String(row.Task ?? row.Name ?? row.Title ?? `Row ${index + 1}`) || `Row ${index + 1}`;

      return {
        task,
        Manual: parseNumber(manualValue),
        Automated: parseNumber(automatedValue),
      };
    });
  }, [csvData]);

  const metrics = useMemo(() => {
    if (!comparisonData.length) {
      return {
        manualAverage: 0,
        automatedAverage: 0,
        delta: 0,
        deltaPercent: 0,
      };
    }

    const manualAverage =
      comparisonData.reduce((acc, row) => acc + row.Manual, 0) / comparisonData.length;
    const automatedAverage =
      comparisonData.reduce((acc, row) => acc + row.Automated, 0) / comparisonData.length;
    const delta = manualAverage - automatedAverage;
    const deltaPercent = manualAverage > 0 ? (delta / manualAverage) * 100 : 0;

    return {
      manualAverage,
      automatedAverage,
      delta,
      deltaPercent,
    };
  }, [comparisonData]);

  const topOpportunities = useMemo(() => {
    if (!comparisonData.length) {
      return [];
    }

    return [...comparisonData]
      .map((row) => ({
        ...row,
        saved: row.Manual - row.Automated,
      }))
      .sort((a, b) => b.saved - a.saved)
      .slice(0, 5);
  }, [comparisonData]);

  const dateOptions = useMemo(
    () => [
      { value: "all", label: "All time" },
      { value: "last30", label: "Last 30 days" },
      { value: "last7", label: "Last 7 days" },
      { value: "custom", label: "Custom range" },
    ],
    []
  );

  const handleDateRangeChange = (start: Date | undefined, end: Date | undefined) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setDateFilter("custom");
    }
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    if (value !== "custom") {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-slate-50 px-6 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                AI Insights
                <Sparkles size={14} />
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Workflow Intelligence</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Upload execution logs or time tracking exports to benchmark manual versus automated
                effort. Generate AI-written analysis to spotlight wins and prioritise the next set of
                automations.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:w-80">
              <div className="rounded-2xl border border-indigo-100 bg-white/80 px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400 mb-2">
                  Date Range
                </p>
                <select
                  value={dateFilter}
                  onChange={(e) => handleDateFilterChange(e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {dateOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {dateFilter === "custom" && (
                  <div className="mt-3">
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onDateRangeChange={handleDateRangeChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.75fr_1fr]">
          <Card className="border border-slate-200/80 shadow-lg shadow-indigo-100/40">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-slate-900">
                  Upload CSV data
                </CardTitle>
                <CardDescription>
                  Include task names with manual and automated durations (hours or minutes).
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100">
                  <FileUp size={16} />
                  <span>Choose file</span>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                </label>
                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      Analysing
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles size={16} />
                      Generate Insights
                    </span>
                  )}
                </Button>
              </div>
            </CardHeader>
            {error && (
              <CardContent className="pt-0">
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600">
                  {error}
                </p>
              </CardContent>
            )}
            {!error && !csvData.length && (
              <CardContent className="pt-0 text-sm text-slate-500">
                Drag in a CSV or use the picker above. We auto-detect columns labeled “Manual” and
                “Automated”.
              </CardContent>
            )}
          </Card>

          <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">AI quick tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>• Include consistent headers, for example: Task, Manual (sec), Automated (sec)</p>
              <p>• Normalise units — keep manual and automated values in the same scale</p>
              <p>• AI summaries improve as you add more project history</p>
            </CardContent>
          </Card>
        </section>

        {comparisonData.length > 0 && (
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card className="border border-slate-200/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">
                  Manual vs Automated Time Comparison
                </CardTitle>
                <CardDescription>
                  Track throughput improvements and highlight automation opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart
                    data={comparisonData}
                    margin={{ top: 20, right: 24, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="task" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Manual"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Automated"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-slate-200/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Efficiency summary</CardTitle>
                <CardDescription>Key benchmarks generated from the uploaded dataset.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 text-sm text-slate-600">
                  <div className="rounded-xl border border-slate-200 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Avg manual duration
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {metrics.manualAverage.toFixed(1)} sec
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Avg automated duration
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {metrics.automatedAverage.toFixed(1)} sec
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500">
                      Time saved
                    </p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {metrics.delta.toFixed(1)} sec ({metrics.deltaPercent.toFixed(1)}%)
                    </p>
                  </div>
                </div>

                {topOpportunities.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Largest savings
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {topOpportunities.map((item) => (
                        <li
                          key={item.task}
                          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2"
                        >
                          <span className="font-medium text-slate-700">{item.task}</span>
                          <span className="text-emerald-600">
                            {item.saved.toFixed(1)} sec saved
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {insights && (
          <Card className="border border-slate-200/80 bg-white/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">AI-generated insights</CardTitle>
              <CardDescription>Summaries and recommendations tailored to your data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none whitespace-pre-wrap text-slate-700">
                {insights}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}



// "use client";

// import { useState } from "react";
// import Papa from "papaparse";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// export default function ProjectAnalysisPage() {
//   const [csvData, setCsvData] = useState<any[]>([]);
//   const [insights, setInsights] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     Papa.parse(file, {
//       header: true,
//       complete: (result) => {
//         setCsvData(result.data);
//       },
//     });
//   };

//   const handleAnalyze = async () => {
//     if (!csvData.length) return alert("Please upload a CSV first.");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/insights", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ csvData }),
//       });

//       const data = await res.json();
//       setInsights(data.text);
//     } catch (err) {
//       console.error(err);
//       alert("Error analyzing data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sample chart comparing Manual vs Automated
//   const comparisonData = csvData.length
//     ? csvData.map((row: any) => ({
//         task: row.Task || row.Name,
//         Manual: parseFloat(row.ManualTime || row.Manual || 0),
//         Automated: parseFloat(row.AutomatedTime || row.Automated || 0),
//       }))
//     : [];

//   return (
//     <main className="p-10 bg-gradient-to-br from-indigo-50 to-white min-h-screen space-y-10">
//       <h1 className="text-3xl font-bold text-gray-800">📈 Project Analysis Dashboard</h1>

//       <div className="flex items-center gap-4">
//         <input type="file" accept=".csv" onChange={handleFileUpload} />
//         <Button
//           onClick={handleAnalyze}
//           className="bg-blue-600 hover:bg-blue-700 text-white"
//           disabled={loading}
//         >
//           {loading ? "Analyzing..." : "Generate Insights"}
//         </Button>
//       </div>

//       {comparisonData.length > 0 && (
//         <Card className="shadow-md border-none rounded-2xl">
//           <CardContent>
//             <h2 className="text-xl font-semibold mb-4">Manual vs Automated Time Comparison</h2>
//             <LineChart width={800} height={400} data={comparisonData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="task" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="Manual" stroke="#ef4444" />
//               <Line type="monotone" dataKey="Automated" stroke="#10b981" />
//             </LineChart>
//           </CardContent>
//         </Card>
//       )}

//       {insights && (
//         <Card className="shadow-md border-none rounded-2xl p-6 bg-white">
//           <CardContent>
//             <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
//             <div className="prose max-w-none whitespace-pre-wrap">{insights}</div>
//           </CardContent>
//         </Card>
//       )}
//     </main>
//   );
// }
