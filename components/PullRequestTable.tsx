"use client";
import { Card } from "@/components/ui/card";

export default function PullRequestsTable({ data }: { data: any[] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">All Pull Requests</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {["PR Number", "Title", "Author", "Status", "Labels", "Created At"].map(h => (
                <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((pr, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="px-4 py-2">{pr["PR Number"]}</td>
                <td className="px-4 py-2">{pr["Title"]}</td>
                <td className="px-4 py-2">{pr["Author"]}</td>
                <td className="px-4 py-2">{pr["Status"]}</td>
                <td className="px-4 py-2">{pr["Labels"]}</td>
                <td className="px-4 py-2">{new Date(pr["Created At"]).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
