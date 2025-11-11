"use client";
import React from "react";

interface Props {
  successRate: number;
  avgDuration: number;
  avgCredits: number;
  efficiencyGain: number;
}

export default function PerformanceStats({
  successRate,
  avgDuration,
  avgCredits,
  efficiencyGain,
}: Props) {
  const stats = [
    {
      label: "Success Rate",
      value: `${successRate.toFixed(1)}%`,
      sublabel: "Passing runs this sprint",
      tone: "text-emerald-600",
      emoji: "✅",
    },
    {
      label: "Avg Duration",
      value: `${avgDuration.toFixed(1)} sec`,
      sublabel: "Per automated workflow",
      tone: "text-indigo-600",
      emoji: "⏱️",
    },
    {
      label: "Avg Credits Used",
      value: avgCredits.toFixed(1),
      sublabel: "Consumption for executions",
      tone: "text-slate-600",
      emoji: "🧮",
    },
    {
      label: "Efficiency Gain",
      value: `${efficiencyGain.toFixed(1)}%`,
      sublabel: "Versus manual baseline",
      tone: efficiencyGain >= 0 ? "text-green-600" : "text-rose-600",
      emoji: "🚀",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-2xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <span className="text-2xl">{stat.emoji}</span>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Metric
            </span>
          </div>
          <h4 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {stat.label}
          </h4>
          <p className={`mt-2 text-3xl font-semibold ${stat.tone}`}>
            {stat.value}
          </p>
          <p className="mt-3 text-sm text-slate-500">{stat.sublabel}</p>
        </div>
      ))}
    </div>
  );
}
