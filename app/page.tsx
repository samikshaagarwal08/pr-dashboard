// "use client";
// import { usePRData } from "@/hooks/usePRData";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// export default function Dashboard() {
//   const { data, loading } = usePRData();
//   if (loading) return <p className="text-center mt-10">Loading data...</p>;

//   // Expected keys: PR Number, Title, Author, Status, Labels, Created At

//   const merged = data.filter(d => d.Status === "merged").length;
//   const open = data.filter(d => d.Status === "open").length;
//   const closed = data.filter(d => d.Status === "closed").length;

//   const statusData = [
//     { name: "Merged", value: merged },
//     { name: "Open", value: open },
//     { name: "Closed", value: closed },
//   ];

//   return (
//     <main className="max-w-6xl mx-auto p-8 space-y-10">
//       <h1 className="text-3xl font-bold text-center">📊 PR Analytics Dashboard</h1>

//       <section className="grid md:grid-cols-2 gap-8">
//         <div className="bg-white p-6 rounded-2xl shadow">
//           <h2 className="text-xl font-semibold mb-4">PR Status Distribution</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie dataKey="value" data={statusData} fill="#8884d8" label>
//                 {statusData.map((_, i) => (
//                   <Cell key={i} fill={["#22c55e", "#facc15", "#ef4444"][i]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white p-6 rounded-2xl shadow">
//           <h2 className="text-xl font-semibold mb-4">PR Activity by Date</h2>
//           {/*
//             Group PRs by month and count number of PRs per month
//           */}
//           {(() => {
//             // Aggregate: { "2024-05": count, ... }
//             const monthlyCounts: Record<string, number> = {};
//             data.forEach(pr => {
//               // Standardize month string as "YYYY-MM"
//               const date = new Date(pr["Created At"]);
//               if (isNaN(date.getTime())) return;
//               const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
//               monthlyCounts[ym] = (monthlyCounts[ym] || 0) + 1;
//             });

//             // Convert to recharts-friendly data
//             const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//             const chartData = Object.entries(monthlyCounts)
//               .sort(([a], [b]) => a.localeCompare(b))
//               .map(([ym, count]) => {
//                 const [year, m] = ym.split("-");
//                 return {
//                   month: `${monthNames[Number(m) - 1]} '${year.slice(2)}`,
//                   count,
//                 };
//               });

//             return (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <XAxis dataKey="month" />
//                   <YAxis allowDecimals={false} />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#3b82f6" />
//                 </BarChart>
//               </ResponsiveContainer>
//             );
//           })()}
//         </div>
//       </section>

//       {/* Table of PRs */}
//       <section className="bg-white p-6 rounded-2xl shadow">
//         <h2 className="text-xl font-semibold mb-4">PR List</h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead>
//               <tr>
//                 <th className="px-4 py-2 text-left">PR Number</th>
//                 <th className="px-4 py-2 text-left">Title</th>
//                 <th className="px-4 py-2 text-left">Author</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//                 <th className="px-4 py-2 text-left">Labels</th>
//                 <th className="px-4 py-2 text-left">Created At</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((pr, idx) => (
//                 <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
//                   <td className="px-4 py-2">{pr["PR Number"]}</td>
//                   <td className="px-4 py-2">{pr["Title"]}</td>
//                   <td className="px-4 py-2">{pr["Author"]}</td>
//                   <td className="px-4 py-2">{pr["Status"]}</td>
//                   <td className="px-4 py-2">{pr["Labels"]}</td>
//                   <td className="px-4 py-2">{pr["Created At"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </main>
//   );
// }



import { Gauge } from 'lucide-react';
import React from 'react';

const studentInfo = {
  name: "Samiksha Agarwal",
  project: "UTU Final Year Project",
  rollNo: "220060101139",
  course: "B.Tech Computer Science and Engineering"
};

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-xl rounded-3xl py-10 px-6 max-w-2xl w-full flex flex-col items-center relative border border-blue-100">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 shadow-md">
            
            <Gauge size={40} className="text-blue-600" strokeWidth={2.3} />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-blue-700 mt-14 mb-4 text-center tracking-tight drop-shadow-sm">
          PR-Dashboard
        </h1>
        <div className="w-16 h-1 bg-blue-600 rounded-full mb-6"></div>
        <div className="text-center mb-7">
          <p className="text-lg font-semibold text-gray-800 mb-2 tracking-wide">{studentInfo.project}</p>
          <div className="grid gap-1">
            <div className="flex justify-between gap-3">
              <span className="text-gray-600 font-medium">Student Name:</span>
              <span className="font-semibold text-gray-900">{studentInfo.name}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600 font-medium">Roll No.:</span>
              <span className="font-semibold text-gray-900">{studentInfo.rollNo}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-gray-600 font-medium">Course:</span>
              <span className="font-semibold text-gray-900">{studentInfo.course}</span>
            </div>
          </div>
        </div>
        <a
          href="/dashboard"
          className="w-full mt-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-center"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default page