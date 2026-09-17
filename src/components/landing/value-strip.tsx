import * as React from "react";
import { ShieldCheck, Target, BarChart2, FileDown } from "lucide-react";

export function LandingValueStrip() {
  const values = [
    {
      icon: ShieldCheck,
      title: "Evidence-Backed Rewriting",
      desc: "Changes strictly grounded in your authentic career experience.",
    },
    {
      icon: Target,
      title: "Job-Specific Tailoring",
      desc: "Adapts phrasing around the target role's core requirements.",
    },
    {
      icon: BarChart2,
      title: "ATS-Oriented Analysis",
      desc: "Comprehensive readability checks built for modern parse engines.",
    },
    {
      icon: FileDown,
      title: "PDF & DOCX Export",
      desc: "Direct export to publication-ready PDF and editable Microsoft Word.",
    },
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900/50 py-8 sm:py-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            Built around the parts of resume tailoring that matter
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex items-start space-x-3.5 text-left p-3 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/20">
                <v.icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white">{v.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
