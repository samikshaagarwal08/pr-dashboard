"use client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ContributorsView({ data }: { data: any[] }) {
  const counts: Record<string, number> = {};
  data.forEach(pr => {
    counts[pr.Author] = (counts[pr.Author] || 0) + 1;
  });

  const chartData = Object.entries(counts).map(([name, count]) => ({ name, count }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
