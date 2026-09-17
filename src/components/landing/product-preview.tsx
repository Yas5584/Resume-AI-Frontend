"use client";

import * as React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  FileCheck,
  Briefcase,
  GraduationCap,
  Layers,
  ChevronRight,
} from "lucide-react";

export function LandingProductPreview() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto -mt-4 pb-16">
      {/* Decorative Glow Container */}
      <div className="relative rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-blue-500/20 via-slate-800/40 to-slate-900/60 border border-slate-700/80 shadow-2xl shadow-blue-500/10">
        {/* Mock Application Window Frame */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Studio Window Header Bar */}
          <div className="h-11 bg-slate-900 px-4 flex items-center justify-between border-b border-slate-800 text-xs text-slate-300 select-none">
            {/* Window controls & Breadcrumb */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5" aria-hidden="true">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="hidden sm:inline-block text-slate-600">|</span>
              <div className="hidden sm:flex items-center space-x-2 text-slate-400 font-mono text-[11px]">
                <span className="text-slate-200 font-semibold">ResumeAI Studio</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                <span>Alex_Morgan_Resume.pdf</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                <span className="text-blue-400 font-medium">Target: Staff Backend Engineer</span>
              </div>
            </div>

            {/* Studio Action Buttons */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 rounded bg-emerald-500/10 text-[11px] text-emerald-400 font-medium border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fact Guard Active</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-600 text-[11px] text-white font-medium hover:bg-blue-500 transition-colors cursor-default shadow-xs">
                <Download className="h-3 w-3" />
                <span>Export Ready</span>
              </div>
            </div>
          </div>

          {/* Main Studio Body: 2-Column Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            {/* LEFT COLUMN: Resume Document Preview (7 cols) */}
            <div className="lg:col-span-7 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/40">
              <div className="max-w-xl mx-auto rounded-lg border border-slate-200/90 p-5 sm:p-6 bg-white shadow-xl font-sans text-left space-y-4">
                {/* Resume Header */}
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        Alex Morgan
                      </h3>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-0.5">
                        Staff Backend & Distributed Systems Engineer
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Tailored Draft v2
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <span>alex.morgan@example.com</span>
                    <span>•</span>
                    <span>San Francisco, CA</span>
                    <span>•</span>
                    <span>github.com/alex-morgan</span>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Professional Summary
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Senior software developer with 6+ years specializing in distributed backend APIs,
                    event-driven pipelines, and LLM inference services. Experienced in{" "}
                    <span className="bg-emerald-50 text-emerald-900 font-semibold px-1 rounded border border-emerald-200">
                      Python, FastAPI, SQL
                    </span>
                    , and high-concurrency microservice architectures with verified production impact.
                  </p>
                </div>

                {/* Experience Section Snippet */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Relevant Experience
                    </h4>
                    <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      100% Evidence Verified
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                      <span>Staff Software Engineer • CloudScale Infrastructure</span>
                      <span className="text-[11px] text-slate-500 font-normal">2022 – Present</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 pl-3 list-disc">
                      <li>
                        Architected high-throughput RESTful ingestion service in{" "}
                        <span className="font-semibold text-slate-800">FastAPI & Python</span>, reducing p99 latency by 38% under 15k RPS.
                      </li>
                      <li>
                        Integrated vector indexing and RAG pipeline using{" "}
                        <span className="font-semibold text-slate-800">LangChain & PostgreSQL</span>, improving internal document recall accuracy.
                      </li>
                      <li>
                        Containerized mission-critical microservices with{" "}
                        <span className="font-semibold text-slate-800">Docker</span> and established automated CI/CD deployment pipelines.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Skills tags preview */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-500 py-0.5">Top Skills:</span>
                  {["Python", "FastAPI", "SQL", "LangChain", "Docker", "REST APIs"].map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Real-Time Match & Fact Guard Panel (5 cols) */}
            <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between space-y-4 bg-slate-950/80 text-left">
              {/* Overall Job Match Card */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-7 w-7 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Job Match Analysis</h4>
                      <p className="text-[10px] text-slate-400">Target: Staff Backend Role</p>
                    </div>
                  </div>
                  {/* Score Indicator */}
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-blue-400 leading-none">86%</span>
                    <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Match Score
                    </span>
                  </div>
                </div>

                {/* Sub-Score Breakdown Progress Bars */}
                <div className="space-y-2 pt-1">
                  {[
                    { label: "Experience Alignment", score: 92, icon: Briefcase },
                    { label: "Required Skills", score: 88, icon: Layers },
                    { label: "Responsibilities", score: 81, icon: FileCheck },
                    { label: "Education & Degree", score: 100, icon: GraduationCap },
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 font-medium flex items-center gap-1.5">
                          <cat.icon className="h-3 w-3 text-slate-400" />
                          {cat.label}
                        </span>
                        <span className="font-semibold text-white">{cat.score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword Alignment Card */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-sm space-y-2.5">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Target Role Keyword Mapping
                </h5>

                {/* Matched Keywords */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Matched & Grounded in Experience (5)
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {["Python", "SQL", "Machine Learning", "LangChain", "FastAPI"].map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 px-2 py-0.5 rounded-md"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Attention Needed */}
                <div className="space-y-1 pt-1.5 border-t border-slate-800">
                  <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Needs Coverage Attention (2)
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {["PostgreSQL (highlight DB index)", "Cloud deployment (add AWS note)"].map(
                      (item) => (
                        <span
                          key={item}
                          className="inline-flex items-center text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25 px-2 py-0.5 rounded-md"
                        >
                          △ {item}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Fact Guard Verification Box */}
              <div className="rounded-xl bg-emerald-950/30 border border-emerald-800/50 p-3.5 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Fact Guard Verification</span>
                </div>
                <div className="space-y-1 text-[11px] text-emerald-200/90">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>Every bullet traceable to source document</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span>0 unsupported metrics or exaggerated titles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
