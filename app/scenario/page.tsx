import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  BookOpenCheck,
  GitPullRequest,
  PlugZap,
  ListChecks,
  Search,
  Sheet,
  Sparkles,
} from "lucide-react";

const overviewCards = [
  {
    title: "Trigger",
    description:
      "GitHub custom webhook pushes PR lifecycle events (open, close, merge) into Make.com in real time.",
    icon: PlugZap,
  },
  {
    title: "Automation Brain",
    description:
      "A router-driven Make.com scenario branches logic by PR state and orchestrates GitHub + AI + Sheets modules.",
    icon: ListChecks,
  },
  {
    title: "Data Backbone",
    description:
      "Google Sheets acts as the audit log feeding the PR Dashboard, Project Analysis charts, and evaluation reports.",
    icon: Sheet,
  },
];

const routerBranches = [
  {
    name: "PR Open",
    color: "border-emerald-200 bg-emerald-50/70",
    highlight: "Runs lint + AI review, comments back on GitHub, logs PASS/FAIL.",
    modules: [
      "GitHub – Search Pull Requests",
      "HTTP – Make a Request (Gemini / lint API)",
      "Router – PASS vs FAIL",
      "GitHub – Create Comment",
      "Google Sheets – Add Row",
    ],
  },
  {
    name: "PR Close",
    color: "border-purple-200 bg-purple-50/70",
    highlight:
      "Captures context for PRs closed without merge to understand abandonment patterns.",
    modules: [
      "GitHub – Search Pull Requests",
      "Google Sheets – Add Row (Closed PR Logs)",
    ],
  },
  {
    name: "PR Merge",
    color: "border-blue-200 bg-blue-50/70",
    highlight:
      "Logs merged artifacts, updates CHANGELOG.md automatically with PR title, date, changed files, and AI-generated summary using Gemini API.",
    modules: [
      "GitHub – Search Pull Requests",
      "HTTP – Make a Request (Gemini API for changelog generation)",
      "GitHub – Update CHANGELOG.md",
      "Google Sheets – Add Row (Merged PR Logs)",
    ],
  },
];

const loggingSheets = [
  {
    sheet: "Open PR Logs",
    fields:
      "PR Title, PR ID, Author, AI Pass/Fail result, Timestamp, AI findings",
    usage: "Feeds manual vs automated quality stats and contributor scorecards.",
  },
  {
    sheet: "Closed PR Logs",
    fields: "PR Title, PR ID, Author, Status, Close timestamp, Notes",
    usage: "Highlights drop-offs and reviewer follow-up requirements.",
  },
  {
    sheet: "Merged PR Logs",
    fields: "PR Title, PR ID, Author, Merge timestamp, Summary, Status",
    usage:
      "Used for dashboard merge trends and powers automatic CHANGELOG.md updates.",
  },
];

const futureRoadmap = [
  {
    title: "README AI Updates",
    description:
      "Use AI to craft feature narratives post-merge and commit README updates automatically.",
  },
  {
    title: "Evaluation Metrics Automation",
    description:
      "Compare manual vs automated review time, surface before/after metrics in the dashboard.",
  },
  {
    title: "Contributor Scorecard",
    description:
      "Aggregate total PRs, success rate, merge frequency, and AI quality scores per contributor.",
  },
  {
    title: "Alerting & Reliability",
    description:
      "Push Slack/Discord alerts when AI validation fails or a scenario run errors out.",
  },
];

const systemSummary = [
  {
    module: "Webhook",
    purpose: "Receives GitHub PR events for open, close, merge.",
  },
  {
    module: "Router",
    purpose: "Splits workflow paths for dedicated handling per PR state.",
  },
  {
    module: "GitHub Search PR",
    purpose: "Fetches complete PR metadata (title, author, diff references).",
  },
  {
    module: "HTTP AI Call",
    purpose: "Executes lint/Gemini analysis to determine PASS or FAIL, and generates changelog summaries.",
  },
  {
    module: "Comment PR",
    purpose: "Posts automated review outcome back onto the pull request.",
  },
  {
    module: "GitHub Personal Access Token & Gemini API Key",
    purpose: "Updates CHANGELOG.md automatically on PR merge with title, date, changed files, and AI summary.",
  },
  {
    module: "Google Sheets",
    purpose: "Persists structured logs for analytics and audits.",
  },
  {
    module: "Dashboard",
    purpose: "Visualizes PR trends, contributor activity, status summaries.",
  },
];

export const metadata = {
  title: "GitHub Automation Scenario",
  description: "Documentation for the Make.com PR & issue workflow.",
};

export default function ScenarioDocumentationPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <main className="mx-auto max-w-screen px-6 py-16">
        <section className="rounded-3xl border border-slate-200/70 bg-white/90 p-10 shadow-xl backdrop-blur">
          <header className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                Automation Scenario
                <BookOpenCheck size={14} />
              </span>
              <h1 className="text-4xl font-semibold text-slate-900">
                GitHub Automated PR & Issue Management Workflow
              </h1>
              <p className="text-base text-slate-600">
                Documentation that mirrors the Make.com scenario snapshot,
                covering triggers, routers, module stacks, data logging, and
                roadmap for next release milestones.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-linear-to-br from-indigo-600 via-indigo-500 to-blue-500 p-6 text-white shadow-lg">
              <p className="text-sm uppercase tracking-[0.25em] text-indigo-100">
                Live Scenario
              </p>
              <Link
                href="https://eu2.make.com/public/shared-scenario/7Nf9tf9mlZg/integration-git-hub"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25"
              >
                View on Make.com
                <ExternalLink size={16} className="ml-2" />
              </Link>
              <p className="text-xs text-indigo-100">
                Shared, read-only version to audit the full module graph.
              </p>
            </div>
          </header>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <article className="space-y-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                1. Overview of the System
              </h2>
              <p className="text-slate-600">
                Automated Pull Request (PR) & Issue Management flows run across
                GitHub, Make.com, and Google Sheets. They handle PR reviews,
                AI-based linting, automated commenting, lifecycle tracking, and
                analytics logging for the PR Dashboard experience.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {overviewCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <card.icon className="mb-3 text-indigo-500" size={24} />
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <figure className="rounded-3xl border border-slate-200 bg-slate-100/70 p-3 shadow-inner">
              <Image
                src="/scenario.png"
                alt="Visual overview of the Make.com scenario for GitHub integration"
                width={900}
                height={600}
                className="h-auto w-full rounded-2xl border border-white/70 object-cover"
                priority
              />
              <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
                Shared scenario snapshot
              </figcaption>
            </figure>
            <figure className="rounded-3xl border border-slate-200 bg-slate-100/70 p-3 shadow-inner">
              <Image
                src="/scenario2.png"
                alt="Visual overview of the Make.com scenario for GitHub integration including the CHANGELOG.md updation using Gemini API Key"
                width={900}
                height={600}
                className="h-auto w-full rounded-2xl border border-white/70 object-cover"
                priority
              />
              <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
                Shared scenario snapshot including the CHANGELOG.md updation using Gemini API Key on merge
              </figcaption>
            </figure>
          </div>

          <section className="mt-12 space-y-10">
            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                2. Trigger Module
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Webhooks (Custom Webhook) receives GitHub PR events instantly.
                It captures open, close, and merge actions and hands them off
                to the scenario router, making this module the official entry
                point for every automation run.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                3. Main Router
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                A router block splits the payload into specialized branches
                for PR open, close, and merge workflows. Each branch runs its
                own module stack and outcomes.
              </p>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {routerBranches.map((branch) => (
                  <div
                    key={branch.name}
                    className={`rounded-2xl border ${branch.color} p-5`}
                  >
                    <h3 className="text-lg font-semibold text-slate-800">
                      {branch.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {branch.highlight}
                    </p>
                    <ul className="mt-4 space-y-1 text-xs text-slate-500">
                      {branch.modules.map((module) => (
                        <li key={module} className="flex items-center gap-2">
                          <GitPullRequest size={14} className="text-indigo-500" />
                          <span>{module}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                4–6. Branch Walkthroughs
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <article className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Branch 1: PR Open
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">
                    GitHub fetches PR metadata, the HTTP module submits diffs to
                    an AI linting endpoint, and a PASS/FAIL router sends targeted
                    comments plus Google Sheets logs.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Search size={14} className="text-emerald-600" />
                      Detailed PR lookup
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles size={14} className="text-emerald-600" />
                      AI returns pass/fail + remediation
                    </li>
                    <li className="flex items-center gap-2">
                      <GitPullRequest size={14} className="text-emerald-600" />
                      GitHub comment posts outcome
                    </li>
                    <li className="flex items-center gap-2">
                      <Sheet size={14} className="text-emerald-600" />
                      Sheets log: PR, result, timestamp, author
                    </li>
                  </ul>
                </article>

                <article className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Branch 2: PR Close
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">
                    Tracks PRs closed without merge to understand abandoned work
                    and maintain reviewer notes.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Search size={14} className="text-purple-600" />
                      Fetch PR details
                    </li>
                    <li className="flex items-center gap-2">
                      <Sheet size={14} className="text-purple-600" />
                      Log status = Closed (Not merged)
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks size={14} className="text-purple-600" />
                      Support analytics on contributor behavior
                    </li>
                  </ul>
                </article>

                <article className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Branch 3: PR Merge
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">
                    Logs merged PRs with metadata and automatically updates CHANGELOG.md
                    with PR title, date, changed files, and AI-generated summary.
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Search size={14} className="text-blue-600" />
                      Gather PR title + merge info + changed files
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkles size={14} className="text-blue-600" />
                      Generate AI summary using Gemini API
                    </li>
                    <li className="flex items-center gap-2">
                      <GitPullRequest size={14} className="text-blue-600" />
                      Automatically update CHANGELOG.md via GitHub API
                    </li>
                    <li className="flex items-center gap-2">
                      <Sheet size={14} className="text-blue-600" />
                      Sheets log: status = Merged, timestamps, author
                    </li>
                  </ul>
                </article>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                7. Data Logging in Google Sheets
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Every branch writes structured data into dedicated sheets. This
                dataset powers the Next.js dashboard, Project Analysis charts,
                and performance evaluation artifacts.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {loggingSheets.map((sheetInfo) => (
                  <div
                    key={sheetInfo.sheet}
                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                      {sheetInfo.sheet}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-semibold text-slate-700">
                        Fields:
                      </span>{" "}
                      {sheetInfo.fields}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {sheetInfo.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                8. Key Automation Achievements
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-600">
                <li>PR open automation completes linting, AI review, and logging.</li>
                <li>PR close automation captures non-merged outcomes for analytics.</li>
                <li>Merged PR automation automatically updates CHANGELOG.md with title, date, changed files, and AI-generated summary using Gemini API.</li>
                <li>Next.js dashboard surfaces PR trends, contributor activity, and status summaries.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                9. Future Scope
              </h2>
              <p className="mt-4 text-sm text-slate-600">
                Enhancements to pursue for the final viva and report. These
                increase automation depth and research-grade rigor.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {futureRoadmap.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/85 p-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                10. Final Summary of Current System
              </h2>
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full border-collapse text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Module</th>
                      <th className="px-4 py-3">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {systemSummary.map((entry) => (
                      <tr
                        key={entry.module}
                        className="border-t border-slate-100 bg-white/95"
                      >
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {entry.module}
                        </td>
                        <td className="px-4 py-3">{entry.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Coverage sits at roughly 70% of the total automation vision —
                the foundation is live, proven, and ready for expansion.
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}