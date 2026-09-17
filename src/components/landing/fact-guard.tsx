import * as React from "react";
import { ShieldCheck, CheckCircle2, XCircle, Info } from "lucide-react";
import { Badge } from "../ui/badge";

export function LandingFactGuard() {
  const supportedClaims = [
    {
      claim: "Python & FastAPI Backend Architecture",
      evidence: "Verified from 3 years building RESTful microservices at CloudScale.",
      status: "Supported",
    },
    {
      claim: "Docker & Automated CI/CD Pipelines",
      evidence: "Grounded in deployment scripts and containerization responsibilities.",
      status: "Supported",
    },
    {
      claim: "PostgreSQL Schema Design & Query Optimization",
      evidence: "Verified from database indexing and query latency reduction bullets.",
      status: "Supported",
    },
  ];

  const blockedClaims = [
    {
      claim: "Senior Director of Enterprise Engineering",
      reason: "Blocked: Unsupported title inflation beyond candidate's senior developer scope.",
      status: "Blocked",
    },
    {
      claim: "Architected Multi-Region Kubernetes Clusters",
      reason: "Blocked: Zero evidence of Kubernetes cluster administration in source resume.",
      status: "Blocked",
    },
    {
      claim: "Achieved 99.999% system uptime single-handedly",
      reason: "Blocked: Specific unverified SLA metric not documented in original experience.",
      status: "Blocked",
    },
  ];

  return (
    <section id="fact-guard" className="py-20 md:py-28 bg-slate-950 border-b border-slate-800 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Fact Guard™ Protection</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AI that works with your experience —{" "}
            <span className="text-emerald-400 block sm:inline">not around it.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            ResumeAI&apos;s Fact Guard continuously validates proposed resume modifications against the
            verified evidence in your source resume. Designed to prevent unsupported claims,
            hallucinations, and exaggerated metrics.
          </p>
        </div>

        {/* Side-by-Side Supported vs Blocked Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Column 1: SUPPORTED CLAIMS */}
          <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/30 p-6 sm:p-7 shadow-xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Supported Claims</h3>
                  <p className="text-xs text-slate-400">Grounded directly in your career facts</p>
                </div>
              </div>
              <Badge className="text-xs font-bold px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                VERIFIED
              </Badge>
            </div>

            <div className="space-y-3">
              {supportedClaims.map((item) => (
                <div
                  key={item.claim}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{item.claim}</span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ✓ Supported
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: BLOCKED CLAIMS */}
          <div className="rounded-2xl bg-slate-900/80 border border-rose-500/30 p-6 sm:p-7 shadow-xl space-y-5 text-left">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Blocked Claims</h3>
                  <p className="text-xs text-slate-400">Intercepted hallucinated claims</p>
                </div>
              </div>
              <Badge className="text-xs font-bold px-2.5 py-0.5 bg-rose-500/10 text-rose-300 border border-rose-500/30">
                INTERCEPTED
              </Badge>
            </div>

            <div className="space-y-3">
              {blockedClaims.map((item) => (
                <div
                  key={item.claim}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 line-through decoration-rose-500/60">
                      {item.claim}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      ✕ Blocked
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-300/90 leading-relaxed">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fact Guard Callout Box */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 text-left space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400 shrink-0" />
            Why Fact Guard Matters in Modern Hiring
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hiring teams verify work history during technical interviews and background checks. Resumes
            filled with fabricated metrics or non-existent responsibilities risk sudden disqualification.
            ResumeAI safeguards your professional reputation by only optimizing what you have actually done.
          </p>
        </div>
      </div>
    </section>
  );
}
