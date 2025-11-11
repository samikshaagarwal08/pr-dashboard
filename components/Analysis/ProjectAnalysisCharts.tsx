"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Props {
  data: any[];
}

export default function ProjectAnalysisCharts({ data }: Props) {
  const chartData = data.map((d, i) => ({
    index: i + 1,
    duration: Number(d.duration) / 1000, // ms → sec
    status: d.statusLabel,
    timestamp: new Date(d.timestamp).toLocaleDateString(),
  }));

  const successData = data.reduce(
    (acc, curr) => {
      curr.statusLabel === "success"
        ? (acc.success += 1)
        : (acc.error += 1);
      return acc;
    },
    { success: 0, error: 0 }
  );

  return (
    <div className="space-y-8 mt-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-2xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Workflow Duration Trend
            </h3>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Time Series
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Track how execution time evolves for each workflow run.
          </p>

          <ResponsiveContainer width="100%" height="75%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  backgroundColor: "#ffffff",
                }}
                labelStyle={{ color: "#1f2937", fontWeight: 600 }}
                formatter={(value: number) => [
                  `${Number(value).toFixed(1)} sec`,
                  "Duration",
                ]}
                labelFormatter={(_, payload) =>
                  payload && payload[0] ? payload[0].payload.timestamp : ""
                }
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ fill: "#4f46e5", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-80 rounded-2xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Success vs Failure Count
            </h3>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Reliability
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Compare healthy runs to those that need attention.
          </p>

          <ResponsiveContainer width="100%" height="75%">
            <BarChart
              data={[
                { name: "Success", value: successData.success },
                { name: "Failure", value: successData.error },
              ]}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  backgroundColor: "#ffffff",
                }}
                labelStyle={{ color: "#1f2937", fontWeight: 600 }}
              />
              <Bar dataKey="value" fill="#22c55e" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
