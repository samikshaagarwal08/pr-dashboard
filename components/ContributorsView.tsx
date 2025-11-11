"use client";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ContributorsViewProps = {
  contributors: { name: string; count: number }[];
};

// Define a color palette for contributors
const COLORS = [
  "#6366f1", // indigo
  "#10b981", // emerald
  "#f59e42", // orange
  "#3b82f6", // blue
  "#f43f5e", // rose
  "#14b8a6", // teal
  "#fbbf24", // yellow
  "#a78bfa", // violet
  "#eab308", // amber
  "#ef4444", // red
];

export default function ContributorsView({ contributors }: ContributorsViewProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Top Contributors</h3>
      {contributors.length === 0 ? (
        <p className="text-sm text-slate-500">
          Contributor activity will appear after the first pull request.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={contributors}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={130}
              paddingAngle={2}
              label={({ name, percent = 0 }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              isAnimationActive={false}
            >
              {contributors.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[idx % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value} PR${value === 1 ? "" : "s"}`}
              separator=": "
              contentStyle={{ fontSize: "0.95rem" }}
            />
            <Legend
              align="center"
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
