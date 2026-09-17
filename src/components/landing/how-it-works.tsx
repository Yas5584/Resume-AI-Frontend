import * as React from "react";
import { UploadCloud, FileSearch, Sparkles, Download, CheckCircle2 } from "lucide-react";

export function LandingHowItWorks() {
  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: "Upload your resume",
      subtitle: "PDF or DOCX",
      desc: "Our lossless document extractor preserves formatting, section hierarchy, dates, and bullet points without mangling text.",
      highlight: "Instant high-accuracy extraction",
    },
    {
      step: "02",
      icon: FileSearch,
      title: "Add target job description",
      subtitle: "Paste posting or requirements",
      desc: "ResumeAI's Job Analyzer parses required technical skills, domain qualifications, seniority cues, and implicit expectations.",
      highlight: "Deep competency breakdown",
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Review AI recommendations",
      subtitle: "Inspect matches and gaps",
      desc: "Examine your Match Score, see missing keywords, and review evidence-backed bullet improvements verified by Fact Guard.",
      highlight: "100% editable suggestions",
    },
    {
      step: "04",
      icon: Download,
      title: "Export tailored resume",
      subtitle: "Download PDF or editable Word",
      desc: "Export clean, ATS-compliant resumes formatted in professional templates, ready to submit directly to company career portals.",
      highlight: "ATS-optimized vector output",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-slate-900/40 border-b border-slate-800 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <span>Seamless 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            From existing resume to job-ready version
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            A structured, transparent workflow that helps you tailor every job application in minutes,
            not hours.
          </p>
        </div>

        {/* 4-Step Grid with Connecting Pipeline */}
        <div className="relative">
          {/* Subtle horizontal connecting line on desktop */}
          <div
            className="hidden lg:block absolute top-1/2 -translate-y-6 left-12 right-12 h-0.5 bg-slate-800 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl bg-slate-950/80 border border-slate-800 p-6 shadow-md hover:border-blue-500/40 hover:bg-slate-900/70 transition-all flex flex-col justify-between text-left group"
              >
                {/* Step Pill Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                    STEP {s.step}
                  </span>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400">{s.subtitle}</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                    {s.desc}
                  </p>
                </div>

                {/* Footer Highlight */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{s.highlight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
