"use client";
import { Card } from "@/components/ui/card";

export default function PullRequestsTable({ data }: { data: any[] }) {
  const statusStyle = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "merged") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    if (normalized === "open") return "bg-amber-50 text-amber-700 border border-amber-200";
    if (normalized === "closed") return "bg-rose-50 text-rose-700 border border-rose-200";
    return "bg-slate-100 text-slate-600 border border-slate-200";
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">All Pull Requests</h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No pull requests available yet.</p>
      ) : (
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
                  <td className="px-4 py-2">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(pr["Status"] ?? "")}`}>
                      {pr["Status"]}
                    </span>
                  </td>
                  <td className="px-4 py-2">{pr["Labels"]}</td>
                  <td className="px-4 py-2">{new Date(pr["Created At"]).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
