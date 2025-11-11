import Link from "next/link";
import { Gauge, Sparkle, BarChart3 } from "lucide-react";

const studentInfo = {
  name: "Samiksha Agarwal",
  project: "UTU Final Year Project",
  rollNo: "220060101139",
  course: "B.Tech Computer Science and Engineering",
};

const featureHighlights = [
  {
    title: "Workflow Analytics",
    description:
      "Visualize pull request volume, velocity, and lint quality in one glance.",
  },
  {
    title: "Contributor Spotlight",
    description:
      "Celebrate high-impact collaborators with contribution trends and charts.",
  },
  {
    title: "Exportable Insights",
    description:
      "Share audit-ready snapshots with a single click PDF download.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <main className="mx-auto max-w-6xl px-6 py-20">
        <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-12 shadow-xl backdrop-blur-md">
          <div className="flex flex-col gap-12 lg:flex-row">
            <div className="lg:w-3/5">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                PR Dashboard
                <Sparkle size={14} />
              </span>
              <h1 className="mt-6 text-5xl font-semibold leading-tight text-slate-900">
                Monitor pull requests with clarity and confidence.
              </h1>
              <p className="mt-4 text-lg text-slate-500">
                A modern analytics suite crafted for the UTU Final Year Project,
                turning GitHub data into actionable intelligence for maintainers
                and reviewers.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/60 transition-all duration-200 hover:translate-y-0.5 hover:shadow-indigo-300/70"
                >
                  Launch Dashboard
                </Link>
                <Link
                  href="/project-analysis"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/70"
                >
                  View Project Analysis
                </Link>
              </div>

              <ul className="mt-12 grid gap-6 text-sm text-slate-500 sm:grid-cols-2">
                {featureHighlights.map((feature) => (
                  <li
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-linear-to-br from-white via-white to-slate-50 p-5 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                      {feature.title}
                    </p>
                    <p className="mt-2 leading-relaxed text-slate-600">
                      {feature.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="relative isolate overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-600 via-indigo-500 to-blue-500 p-10 text-white shadow-xl">
                <div className="absolute -top-12 right-6 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute -bottom-16 left-6 h-40 w-40 rounded-full bg-indigo-900/30 blur-3xl" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <Gauge size={36} strokeWidth={2.2} />
                  </div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-100">
                    Final Year Project
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    {studentInfo.project}
                  </h2>
                </div>
                <div className="mt-8 flex-1 space-y-4 rounded-2xl bg-white/10 p-6 text-sm backdrop-blur">
                  <div className="flex justify-start gap-3">
                    <span className="text-indigo-100">Student Name</span>
                    <span className="font-semibold text-white">
                      {studentInfo.name}
                    </span>
                  </div>
                  <div className="flex justify-start gap-3">
                    <span className="text-indigo-100">Roll No.</span>
                    <span className="font-semibold text-white">
                      {studentInfo.rollNo}
                    </span>
                  </div>
                  <div className="flex justify-start gap-3">
                    <span className="text-indigo-100">Course</span>
                    <span className="font-semibold text-white">
                      {studentInfo.course}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <BarChart3 size={22} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Why this dashboard?
                    </p>
                    <p className="text-sm text-slate-500">
                      Align engineering progress with academic evaluation
                      through transparent, exportable insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}