import * as React from "react";
import {
  FileText,
  Target,
  BarChart3,
  ShieldCheck,
  LayoutTemplate,
  DownloadCloud,
  History,
  Lightbulb,
} from "lucide-react";

export function LandingFeaturesGrid() {
  const features = [
    {
      icon: FileText,
      title: "AI Resume Builder",
      desc: "Create structured, publication-grade resumes with guided section validation and clean formatting.",
    },
    {
      icon: Target,
      title: "Job-Specific Tailoring",
      desc: "Adapt bullet points, summaries, and skill priorities around the exact requirements of a target posting.",
    },
    {
      icon: BarChart3,
      title: "Resume Match Analysis",
      desc: "Examine detailed coverage scores and keyword mapping before submitting your application.",
    },
    {
      icon: ShieldCheck,
      title: "Fact Guard Protection",
      desc: "Automatically intercept hallucinated achievements, invented metrics, and unverified titles.",
    },
    {
      icon: LayoutTemplate,
      title: "Professional Templates",
      desc: "Four clean, recruiter-approved designs built with standard typography for 100% ATS readability.",
    },
    {
      icon: DownloadCloud,
      title: "PDF & DOCX Export",
      desc: "Download high-resolution vector PDFs and fully editable Microsoft Word .docx files at any time.",
    },
    {
      icon: History,
      title: "Version Management",
      desc: "Organize tailored versions by company and role without overwriting your master career resume.",
    },
    {
      icon: Lightbulb,
      title: "Evidence-Based Suggestions",
      desc: "Inspect the exact source background and rationale behind every AI-suggested revision.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-slate-900/40 border-b border-slate-800 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <span>Comprehensive Platform Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Everything you need to apply with confidence
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            ResumeAI combines deep parsing technology, strict evidence validation, and clean design
            into a single workspace.
          </p>
        </div>

        {/* 8-Card Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-md hover:border-blue-500/40 hover:bg-slate-900/70 transition-all space-y-3 text-left group"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-105 transition-transform">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
