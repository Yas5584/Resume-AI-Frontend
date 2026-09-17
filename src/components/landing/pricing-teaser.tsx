"use client";

import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function LandingPricingTeaser() {
  const { isAuthenticated } = useAuth();
  const ctaHref = isAuthenticated ? "/dashboard" : "/register";

  return (
    <section id="pricing" className="py-24 bg-slate-950 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest & Transparent</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Start Building Free. Upgrade as You Grow.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            No credit card required. No misleading paywalls when downloading your resume. Full access to our AI builder, Fact Guard, and ATS engine.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card 1: Free Starter / Public Preview Tier */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/60 border-2 border-blue-500/60 p-8 flex flex-col justify-between shadow-xl shadow-blue-500/10">
            <div className="absolute -top-3.5 left-8 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-md">
              Most Popular · Full Access
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-4 mt-2">
                <div>
                  <h3 className="text-xl font-bold text-white">Community & Free Tier</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Everything you need to craft high-impact, tailored applications
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400 block font-normal">forever free</span>
                </div>
              </div>

              <div className="h-px bg-slate-800 my-6" />

              <div className="space-y-3.5 mb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  What&apos;s included:
                </div>
                {[
                  "Full AI Resume Builder & Studio Editor",
                  "Targeted Job Tailoring & Match Score diagnostic",
                  "Fact Guard hallucination prevention verification",
                  "All 4 ATS-tested typographic templates",
                  "Real-time ATS keyword & formatting compliance checks",
                  "Clean PDF & DOCX export with zero watermarks",
                  "Secure cloud storage & encrypted document history",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={ctaHref}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-150 shadow-lg shadow-blue-600/25"
            >
              <span>{isAuthenticated ? "Open Dashboard" : "Get Started Free"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Professional & Team (Roadmap / Enterprise preview) */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="inline-block text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 mb-2">
                    Coming Soon
                  </div>
                  <h3 className="text-xl font-bold text-white">Pro & Team Workflows</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Advanced pipelines for power job seekers, coaches, and university career offices
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-800 my-6" />

              <div className="space-y-3.5 mb-8">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Planned capabilities:
                </div>
                {[
                  "Unlimited multi-version tailoring portfolios",
                  "AI Mock Interview Simulator generated from tailored bullets",
                  "Team & Career Coach review commenting mode",
                  "Bulk resume ingestion & parsing APIs",
                  "Custom typography & organizational brand theming",
                  "Priority GPU inference queues",
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
              <p className="text-xs text-slate-300 font-medium">
                Want early access to Pro features or campus licensing?
              </p>
              <Link
                href="mailto:contact@resumeai.com"
                className="inline-block mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Contact our product team →
              </Link>
            </div>
          </div>
        </div>

        {/* Reassurance Banner */}
        <div className="mt-12 max-w-3xl mx-auto p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center gap-3 text-xs sm:text-sm text-slate-400 text-center">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white font-medium">Privacy First:</strong> Your resume data is never shared with third-party recruiters or used to train public models without your explicit consent.
          </span>
        </div>
      </div>
    </section>
  );
}
