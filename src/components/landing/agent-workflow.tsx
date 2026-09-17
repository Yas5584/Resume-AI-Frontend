import * as React from "react";
import {
  FileText,
  Search,
  Crosshair,
  Compass,
  PenTool,
  ShieldCheck,
  CheckCheck,
  Sparkles,
} from "lucide-react";

export function LandingAgentWorkflow() {
  const agents = [
    {
      role: "01. Intake",
      name: "Resume Parser",
      icon: FileText,
      desc: "Extracts sections, dates, technologies, and achievements into structured data.",
    },
    {
      role: "02. Target Analysis",
      name: "Job Analyzer",
      icon: Search,
      desc: "Identifies required competencies, seniority signals, and critical keywords.",
    },
    {
      role: "03. Alignment",
      name: "Match Engine",
      icon: Crosshair,
      desc: "Calculates requirement coverage and highlights gaps between candidate and role.",
    },
    {
      role: "04. Direction",
      name: "Strategy Agent",
      icon: Compass,
      desc: "Determines optimal section ordering, positioning, and emphasis areas.",
    },
    {
      role: "05. Synthesis",
      name: "Content Writer",
      icon: PenTool,
      desc: "Rewrites bullet points with strong action verbs and role-specific context.",
    },
    {
      role: "06. Verification",
      name: "Fact Guard",
      icon: ShieldCheck,
      desc: "Validates every modified claim against verified evidence in original resume.",
    },
    {
      role: "07. Format Check",
      name: "ATS Compliance",
      icon: CheckCheck,
      desc: "Audits font hierarchies, table safety, and parseability for enterprise screening systems.",
    },
    {
      role: "08. User Control",
      name: "Final Review",
      icon: Sparkles,
      desc: "Presents diff views allowing you to accept, tweak, or reject any suggestion.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Specialized Multi-Agent Pipeline</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Specialized AI components working in concert
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Rather than relying on one generic black-box prompt, ResumeAI coordinates specialized
            agents where each stage verifies and refines the work of the previous step.
          </p>
        </div>

        {/* Visual Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {agents.map((ag) => (
            <div
              key={ag.name}
              className="relative p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-md hover:border-blue-500/40 hover:bg-slate-900/90 transition-all space-y-2.5 text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                  {ag.role}
                </span>
                <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ag.icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                {ag.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{ag.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
