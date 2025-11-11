"use client";
import { Card } from "@/components/ui/card";

type ReportSectionProps = {
  summary: {
    total: number;
    open: number;
    closed: number;
    merged: number;
    lintSuccessRate: number;
  };
};

export default function ReportSection({ summary }: ReportSectionProps) {
  return (
    <Card className="space-y-4 p-6">
      <h3 className="text-lg font-semibold">Summary Report</h3>
      <ul className="space-y-2 text-gray-700">
        <li>📦 Total PRs: {summary.total}</li>
        <li>🟢 Open: {summary.open}</li>
        <li>🔴 Closed: {summary.closed}</li>
        <li>🟣 Merged: {summary.merged}</li>
        <li>✅ Lint Success Rate: {summary.lintSuccessRate}%</li>
      </ul>
      <p className="mt-4 text-sm text-gray-500">
        This summary aggregates pull request statuses and lint outcomes for tracking code quality over time.
      </p>
    </Card>
  );
}
