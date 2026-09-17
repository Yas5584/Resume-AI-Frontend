"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/use-auth";

export function LandingHero() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background Subtle Radial Glow & Dot Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[480px] bg-radial-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold mb-6 hover:bg-blue-500/20 transition-colors">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
          <span>AI Resume Builder • Job Tailoring • Fact Guard</span>
          <span className="inline-block w-1 h-1 rounded-full bg-blue-400" />
          <span className="text-blue-300 font-medium">Evidence-Backed</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          Build a resume that matches the job —{" "}
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent underline decoration-blue-500/40 decoration-wavy decoration-2 underline-offset-8">
            without inventing your experience.
          </span>
        </h1>

        {/* Supporting Paragraph */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          ResumeAI analyzes your resume and target job description, identifies the strongest
          evidence, and tailors your content for ATS readiness while strictly protecting your verified
          background.
        </p>

        {/* Dual Call-to-Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          {isLoading ? (
            <div className="h-12 w-48 bg-slate-800 animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            <>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-7 py-3 text-base shadow-lg shadow-blue-600/30 font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/resumes" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-7 py-3 text-base font-semibold border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Build a Resume
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-7 py-3 text-base shadow-lg shadow-blue-600/30 font-semibold bg-blue-600 hover:bg-blue-500 text-white cursor-pointer">
                  Build My Resume
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-7 py-3 text-base font-semibold border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-600 cursor-pointer"
                >
                  See How It Works
                </Button>
              </a>
            </>
          )}
        </div>

        {/* Micro-guarantee trust badge */}
        <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>No credit card required • Free document import • Zero fabricated claims</span>
        </div>
      </div>
    </section>
  );
}
