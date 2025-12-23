"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

type OverviewChartsProps = {
  statusBreakdown: { name: string; value: number }[];
  monthlyActivity: { month: string; count: number; key: string }[];
  onMonthSelect?: (key: string) => void;
};

const STATUS_COLORS = ["#22c55e", "#facc15", "#ef4444"] as const;

export default function OverviewCharts({ statusBreakdown, monthlyActivity, onMonthSelect }: OverviewChartsProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-3 text-lg font-semibold">PR Status Distribution</h3>
          {statusBreakdown.length === 0 ? (
            <p className="text-sm text-slate-500">No pull request data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" label>
                  {statusBreakdown.map((_, i) => (
                    <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-3 text-lg font-semibold">PR Activity by Month</h3>
          {monthlyActivity.length === 0 ? (
            <p className="text-sm text-slate-500">Monthly activity will appear once pull requests are recorded.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyActivity}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  onClick={(_, index) => {
                    const item = monthlyActivity[index];
                    if (item?.key && onMonthSelect) onMonthSelect(item.key);
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
