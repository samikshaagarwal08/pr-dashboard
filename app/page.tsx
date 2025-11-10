"use client";
import { usePRData } from "@/hooks/usePRData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const { data, loading } = usePRData();
  if (loading) return <p className="text-center mt-10">Loading data...</p>;

  // Expected keys: PR Number, Title, Author, Status, Labels, Created At

  const merged = data.filter(d => d.Status === "merged").length;
  const open = data.filter(d => d.Status === "open").length;
  const closed = data.filter(d => d.Status === "closed").length;

  const statusData = [
    { name: "Merged", value: merged },
    { name: "Open", value: open },
    { name: "Closed", value: closed },
  ];

  return (
    <main className="max-w-6xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-bold text-center">📊 PR Analytics Dashboard</h1>

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">PR Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="value" data={statusData} fill="#8884d8" label>
                {statusData.map((_, i) => (
                  <Cell key={i} fill={["#22c55e", "#facc15", "#ef4444"][i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4">PR Activity by Date</h2>
          {/*
            Group PRs by month and count number of PRs per month
          */}
          {(() => {
            // Aggregate: { "2024-05": count, ... }
            const monthlyCounts: Record<string, number> = {};
            data.forEach(pr => {
              // Standardize month string as "YYYY-MM"
              const date = new Date(pr["Created At"]);
              if (isNaN(date.getTime())) return;
              const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
              monthlyCounts[ym] = (monthlyCounts[ym] || 0) + 1;
            });

            // Convert to recharts-friendly data
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const chartData = Object.entries(monthlyCounts)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([ym, count]) => {
                const [year, m] = ym.split("-");
                return {
                  month: `${monthNames[Number(m) - 1]} '${year.slice(2)}`,
                  count,
                };
              });

            return (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </section>

      {/* Table of PRs */}
      <section className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">PR List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">PR Number</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Labels</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.map((pr, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-2">{pr["PR Number"]}</td>
                  <td className="px-4 py-2">{pr["Title"]}</td>
                  <td className="px-4 py-2">{pr["Author"]}</td>
                  <td className="px-4 py-2">{pr["Status"]}</td>
                  <td className="px-4 py-2">{pr["Labels"]}</td>
                  <td className="px-4 py-2">{pr["Created At"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
