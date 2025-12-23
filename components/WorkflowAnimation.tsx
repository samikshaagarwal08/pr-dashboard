"use client";

import { useEffect, useState } from "react";
import { ChevronDown, PlayCircle, RefreshCw } from "lucide-react";

type Step = {
  title: string;
  detail: string;
  accent: string;
};

const steps: Step[] = [
  {
    title: "GitHub (PR Events)",
    detail: "Open / Close / Merge payloads fired via webhook.",
    accent: "from-emerald-100 to-emerald-50 text-emerald-700",
  },
  {
    title: "GitHub Webhook",
    detail: "Custom webhook receiver captures the event body.",
    accent: "from-teal-100 to-teal-50 text-teal-700",
  },
  {
    title: "Make.com Automation Engine",
    detail: "Scenario orchestrator runs the router and modules.",
    accent: "from-indigo-100 to-indigo-50 text-indigo-700",
  },
  {
    title: "Router (PR Open | Close | Merge)",
    detail: "Splits into dedicated paths per lifecycle state.",
    accent: "from-violet-100 to-violet-50 text-violet-700",
  },
  {
    title: "PR Open / Close / Merge branches",
    detail: "AI lint, status logging, AI insights, changelog updates.",
    accent: "from-amber-100 to-amber-50 text-amber-700",
  },
  {
    title: "Google Sheets + Dashboard",
    detail: "Data lake + analytics visualization for stakeholders.",
    accent: "from-blue-100 to-blue-50 text-blue-700",
  },
];

const connector = "hidden md:block h-[2px] w-8 bg-gradient-to-r from-slate-200 via-indigo-200 to-indigo-400 rounded-full";

export default function WorkflowAnimation() {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    setActiveIndex(0);
    let idx = 0;
    const timer = setInterval(() => {
      idx += 1;
      if (idx >= steps.length) {
        setActiveIndex(steps.length - 1);
        setIsPlaying(false);
        clearInterval(timer);
        return;
      }
      setActiveIndex(idx);
    }, 900);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const startAnimation = () => {
    if (!visible) setVisible(true);
    setIsPlaying(true);
  };

  return (
    <div className="rounded-3xl border border-indigo-100 bg-white/90 p-6 shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-500">
            Animated Workflow
          </p>
          <p className="text-sm text-slate-600">
            Click to see the GitHub → Make.com → Sheets → Dashboard pipeline animate step by step.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVisible((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <ChevronDown
              size={16}
              className={`transition ${visible ? "rotate-180 text-indigo-500" : "text-slate-400"}`}
            />
            {visible ? "Hide flow" : "Show animated flow"}
          </button>
          <button
            onClick={startAnimation}
            disabled={isPlaying}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          >
            {isPlaying ? (
              <>
                <PlayCircle size={16} className="animate-pulse" /> Playing
              </>
            ) : (
              <>
                <RefreshCw size={16} /> Play animation
              </>
            )}
          </button>
        </div>
      </div>

      {visible && (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            {steps.map((step, idx) => {
              const isActive = activeIndex === idx;
              const isVisited = activeIndex >= idx;
              return (
                <div key={step.title} className="flex items-center gap-3">
                  <div
                    className={`flex h-full min-w-[180px] flex-col gap-1 rounded-2xl bg-gradient-to-br ${step.accent} px-4 py-3 shadow-sm transition duration-200 ${
                      isActive
                        ? "ring-2 ring-indigo-300 shadow-md translate-y-[-2px]"
                        : isVisited
                          ? "opacity-100"
                          : "opacity-70"
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                      Step {idx + 1}
                    </span>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs text-slate-600">{step.detail}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <>
                      <div className={connector} />
                      <div className="md:hidden text-slate-400">↓</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="rounded-2xl border border-indigo-50 bg-indigo-50/70 p-4 text-xs text-indigo-700">
            {activeIndex === -1
              ? "Press play to see the flow animate."
              : `Currently highlighting: Step ${activeIndex + 1} — ${steps[activeIndex].title}`}
          </div>
        </div>
      )}
    </div>
  );
}

