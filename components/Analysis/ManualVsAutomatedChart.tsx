"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  manualAvg: number;
  automatedAvg: number;
}

export default function ManualVsAutomatedChart({
  manualAvg,
  automatedAvg,
}: Props) {
  const data = [
    {
      name: "Workflow Duration (sec)",
      Manual: manualAvg,
      Automated: automatedAvg,
    },
  ];

  const efficiencyGain =
    manualAvg > 0 ? ((manualAvg - automatedAvg) / manualAvg) * 100 : 0;
  const timeSaved = manualAvg - automatedAvg;
  const formattedTimeSaved =
    timeSaved > 0 ? `${timeSaved.toFixed(0)} sec` : "No gain yet";

  return (
    <div className="mt-12 rounded-2xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-8 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            ⚙️ Manual vs Automated Performance
          </h3>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Quantify the time saved by automation compared to the estimated manual workflow duration.
          </p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-5 py-3 text-emerald-600">
          <p className="text-xs uppercase tracking-wider text-emerald-500">
            Efficiency Gain
          </p>
          <p className="text-2xl font-semibold">
            {efficiencyGain.toFixed(1)}%
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barGap={60}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
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
          />
          <Legend />
          <Bar dataKey="Manual" fill="#f97316" radius={[12, 12, 0, 0]} />
          <Bar dataKey="Automated" fill="#22c55e" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:grid-cols-3">
        <div className="rounded-xl bg-slate-100 px-4 py-3">
          <p className="font-semibold text-slate-600">Manual Baseline</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {manualAvg.toFixed(0)} sec
          </p>
        </div>
        <div className="rounded-xl bg-slate-100 px-4 py-3">
          <p className="font-semibold text-slate-600">Automated Average</p>
          <p className="mt-1 text-lg font-semibold text-slate-800">
            {automatedAvg.toFixed(0)} sec
          </p>
        </div>
        <div className="rounded-xl bg-slate-100 px-4 py-3">
          <p className="font-semibold text-slate-600">Time Saved</p>
          <p
            className={`mt-1 text-lg font-semibold ${
              timeSaved > 0 ? "text-emerald-600" : "text-slate-600"
            }`}
          >
            {formattedTimeSaved}
          </p>
        </div>
      </div>
    </div>
  );
}
