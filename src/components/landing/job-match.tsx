import * as React from "react";
import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function LandingJobMatch() {
  const requirements = [
    { name: "Python Core & Scripting", status: "Supported", badge: "✓ Full Match", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" },
    { name: "Relational SQL Databases", status: "Supported", badge: "✓ Full Match", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" },
    { name: "Machine Learning Concepts", status: "Supported", badge: "✓ Full Match", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" },
    { name: "FastAPI / Asynchronous Web Frameworks", status: "Partial", badge: "◐ Partial Match", color: "text-amber-300 bg-amber-500/10 border-amber-500/30" },
    { name: "Kubernetes Cluster Deployment", status: "Missing", badge: "○ Missing Requirement", color: "text-slate-400 bg-slate-800 border-slate-700" },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-900/40 border-b border-slate-800 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Target className="h-3.5 w-3.5" />
            <span>Target Role Alignment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Know exactly where your resume stands before you hit apply
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            ResumeAI separates supported matches from missing or uncertain requirements, giving you
            an actionable diagnostic of how well your document addresses the role description.
          </p>
        </div>

        {/* Dashboard Diagnostic Layout */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Panel: Score & Category Breakdown (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-900/80 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between space-y-6 text-left">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Match Diagnostic Summary
              </span>
              <div className="mt-4 flex items-baseline space-x-3">
                <span className="text-5xl font-extrabold text-white tracking-tight">86%</span>
                <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25">
                  Strong Match
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Evaluated against key qualification criteria extracted from target backend position.
              </p>
            </div>

            {/* Sub-Category Bars */}
            <div className="space-y-3.5 pt-4 border-t border-slate-800">
              {[
                { label: "Work Experience", val: 92 },
                { label: "Technical Skills", val: 88 },
                { label: "Core Responsibilities", val: 81 },
                { label: "Education & Certifications", val: 100 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{item.label}</span>
                    <span className="font-semibold text-white">{item.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Requirement Extraction Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-slate-950/80 space-y-5 text-left flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Extracted Job Requirements vs. Resume Evidence
                </h4>
                <span className="text-[11px] text-slate-400">5 Key Signals</span>
              </div>

              <div className="space-y-2 pt-1">
                {requirements.map((req) => (
                  <div
                    key={req.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-200">{req.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${req.color}`}
                    >
                      {req.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-400">
                Actionable recommendations update in real time as you edit.
              </p>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md">
                  Run Diagnostic
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
