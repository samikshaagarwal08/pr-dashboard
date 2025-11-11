"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { GitBranch, GitPullRequestClosed, GitMerge } from "lucide-react";

export default function OverviewCharts({ data }: { data: any[] }) {
  const open = data.filter(d => d.Status === "open").length;
  const closed = data.filter(d => d.Status === "closed").length;
  const merged = data.filter(d => d.Status === "merged").length;

  const lintPassed = data.filter(d => d["Lint Status"]?.includes("success")).length;
  const lintFailed = data.filter(d => d["Lint Status"]?.includes("failure")).length;

  const statusData = [
    { name: "Open", value: open },
    { name: "Closed", value: closed },
    { name: "Merged", value: merged },
  ];

  const lintData = [
    { name: "Passed", value: lintPassed },
    { name: "Failed", value: lintFailed },
  ];

  const monthlyCounts: Record<string, number> = {};
  data.forEach(pr => {
    const date = new Date(pr["Created At"]);
    if (isNaN(date.getTime())) return;
    const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthlyCounts[ym] = (monthlyCounts[ym] || 0) + 1;
  });

  const chartData = Object.entries(monthlyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ym, count]) => {
      const [year, m] = ym.split("-");
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return { month: `${monthNames[Number(m) - 1]} '${year.slice(2)}`, count };
    });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 shadow hover:shadow-lg transition rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-600">Open PRs</h3>
            <GitBranch className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{open}</p>
        </Card>

        <Card className="p-6 shadow hover:shadow-lg transition rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-600">Closed PRs</h3>
            <GitPullRequestClosed className="text-red-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{closed}</p>
        </Card>

        <Card className="p-6 shadow hover:shadow-lg transition rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-gray-600">Merged PRs</h3>
            <GitMerge className="text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{merged}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">PR Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={["#facc15", "#ef4444", "#22c55e"][i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">PR Activity by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
