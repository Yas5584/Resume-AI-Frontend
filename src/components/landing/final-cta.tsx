"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LandingFinalCta() {
  const { isAuthenticated } = useAuth();
  const ctaHref = isAuthenticated ? "/dashboard" : "/register";

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900/40 via-blue-950/20 to-slate-950 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[250px] bg-indigo-500/10 rounded-full blur-2xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transform Your Career Applications</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Ready to Submit Resumes That Actually Pass Screeners?
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Stop getting rejected by automated parsers. Experience evidence-backed bullet point rewriting, target job tailoring, and verified ATS compliance in minutes.
        </p>

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-blue-600/30 hover:scale-[1.02] cursor-pointer"
          >
            <span>{isAuthenticated ? "Open Resume Studio" : "Build Your Resume Free"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#templates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-base transition-all duration-200 cursor-pointer"
          >
            <FileText className="w-5 h-5 text-slate-400" />
            <span>Browse Templates</span>
          </a>
        </div>

        {/* Trust micro-guarantees */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Watermark-free export</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero hallucination guard</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% data privacy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
