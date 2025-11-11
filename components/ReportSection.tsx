"use client";
import { Card } from "@/components/ui/card";

export default function ReportSection({ data }: { data: any[] }) {
  const total = data.length;
  const open = data.filter(d => d.Status === "open").length;
  const closed = data.filter(d => d.Status === "closed").length;
  const merged = data.filter(d => d.Status === "merged").length;
  const successRate = ((data.filter(d => d["Lint Status"]?.includes("success")).length / total) * 100).toFixed(1);

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Summary Report</h3>
      <ul className="space-y-2 text-gray-700">
        <li>📦 Total PRs: {total}</li>
        <li>🟢 Open: {open}</li>
        <li>🔴 Closed: {closed}</li>
        <li>🟣 Merged: {merged}</li>
        <li>✅ Lint Success Rate: {successRate}%</li>
      </ul>
      <p className="mt-4 text-gray-500 text-sm">
        This summary aggregates pull request statuses and lint outcomes for tracking code quality over time.
      </p>
    </Card>
  );
}
