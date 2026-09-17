import * as React from "react";
import { FileX, Hash, AlertOctagon, CheckCircle } from "lucide-react";

export function LandingProblemSection() {
  const problems = [
    {
      num: "01",
      icon: FileX,
      title: "Generic Resumes",
      subtitle: "One resume rarely fits every job",
      desc: "Submitting the same broad resume causes applicant tracking systems and recruiters to miss your exact qualifications for specialized roles.",
    },
    {
      num: "02",
      icon: Hash,
      title: "Keyword Stuffing",
      subtitle: "Adding unsupported keywords hurts credibility",
      desc: "Blindly dumping buzzwords from job postings onto your document creates awkward bullet points and leaves you vulnerable in technical interviews.",
    },
    {
      num: "03",
      icon: AlertOctagon,
      title: "AI Hallucinations",
      subtitle: "Generated claims should not become invented experience",
      desc: "Standard AI chatbots often fabricate metrics, invent company responsibilities, and create claims that you cannot defend to hiring managers.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
            <span>The Reality of Modern Job Applications</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Most resume tools optimize for keywords.{" "}
            <span className="text-blue-400 block sm:inline">
              ResumeAI optimizes around your actual experience.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Hiring managers don&apos;t just want keywords—they want evidence. ResumeAI aligns your
            resume with target roles by highlighting relevant, verified achievements.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((p) => (
            <div
              key={p.num}
              className="relative p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg hover:border-slate-700 hover:bg-slate-900/90 transition-all space-y-4 text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                  {p.num}
                </span>
                <div className="h-10 w-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
                  <p.icon className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="text-xs font-semibold text-blue-400">{p.subtitle}</p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Solution Bridge Statement */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 p-6 sm:p-8 text-center sm:flex sm:items-center sm:justify-between shadow-lg">
          <div className="text-left space-y-1 sm:max-w-2xl mb-4 sm:mb-0">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              The ResumeAI Evidence-First Approach
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              We extract verified evidence from your existing resume, analyze job requirements,
              and rewrite bullets that accurately demonstrate your fit without guessing.
            </p>
          </div>
          <a
            href="#how-it-works"
            className="inline-flex items-center text-xs font-bold text-blue-400 hover:text-white px-4 py-2.5 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
          >
            Explore Workflow →
          </a>
        </div>
      </div>
    </section>
  );
}
