"use client";

import * as React from "react";
import { ResumeQualityReport, QualityStatusLabel } from "@resumeai/shared";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  ShieldCheck,
  HelpCircle,
  Briefcase,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { WeightsModal } from "./weights-modal";

export interface QualityScoreCardProps {
  report: ResumeQualityReport;
  onReanalyze: (forceRefresh: boolean) => void;
  isAnalyzing: boolean;
}

function getScoreColors(score: number): {
  border: string;
  bg: string;
  text: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
} {
  if (score >= 90) {
    return {
      border: "border-emerald-200",
      bg: "bg-emerald-50/50",
      text: "text-emerald-700",
      badgeBg: "bg-emerald-100",
      badgeText: "text-emerald-800",
      ring: "text-emerald-500",
    };
  }
  if (score >= 75) {
    return {
      border: "border-blue-200",
      bg: "bg-blue-50/50",
      text: "text-blue-700",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-800",
      ring: "text-blue-500",
    };
  }
  if (score >= 60) {
    return {
      border: "border-amber-200",
      bg: "bg-amber-50/50",
      text: "text-amber-700",
      badgeBg: "bg-amber-100",
      badgeText: "text-amber-800",
      ring: "text-amber-500",
    };
  }
  return {
    border: "border-red-200",
    bg: "bg-red-50/50",
    text: "text-red-700",
    badgeBg: "bg-red-100",
    badgeText: "text-red-800",
    ring: "text-red-500",
  };
}

export function QualityScoreCard({
  report,
  onReanalyze,
  isAnalyzing,
}: QualityScoreCardProps) {
  const [weightsOpen, setWeightsOpen] = React.useState(false);
  const overallScore = report.overallScore ?? 0;
  const colors = getScoreColors(overallScore);
  const isStale = report.status === "STALE";
  const findingsList = Array.isArray(report.findings) ? report.findings : [];
  const strengthsList = Array.isArray(report.strengths) ? report.strengths : [];
  const criticalCount =
    report.criticalIssuesCount ??
    findingsList.filter(
      (f) => f.severity === "CRITICAL" || f.severity === "HIGH",
    ).length;

  return (
    <div className="space-y-4">
      {/* Stale Warning Banner */}
      {isStale && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                Resume Modified Since Last Analysis
              </p>
              <p className="text-xs text-amber-700">
                Your resume content has changed. Findings and score below may be
                outdated.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onReanalyze(true)}
            disabled={isAnalyzing}
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium whitespace-nowrap"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isAnalyzing ? "animate-spin" : ""}`}
            />
            {isAnalyzing ? "Analyzing..." : "Re-analyze Now"}
          </Button>
        </div>
      )}

      {/* Main Score Layout: Dual Cards if Job is selected, or Full Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Resume Quality Score Card */}
        <div
          className={`${
            report.jobMatch ? "lg:col-span-7" : "lg:col-span-12"
          }`}
        >
          <Card
            className={`border ${colors.border} ${colors.bg} shadow-sm overflow-hidden h-full`}
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">
                      Resume Quality Score
                    </h2>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${colors.badgeBg} ${colors.badgeText}`}
                    >
                      {report.statusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deterministic score measuring ATS parseability, structure,
                    content quality, and formatting.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWeightsOpen(true)}
                    className="text-xs h-8 text-muted-foreground hover:text-foreground"
                  >
                    <HelpCircle className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    How it&apos;s calculated
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
                {/* Score Gauge Circle */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-muted/30"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 52}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          52 *
                          (1 - report.overallScore / 100)
                        }
                        strokeLinecap="round"
                        className={`${colors.ring} transition-all duration-1000 ease-out`}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className={`text-4xl font-extrabold tracking-tight ${colors.text}`}>
                        {report.overallScore}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        out of 100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Narrative & Metrics */}
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                    {report.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>
                        <strong className="text-foreground">
                          {criticalCount}
                        </strong>{" "}
                        Critical Issues
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>
                        <strong className="text-foreground">
                          {findingsList.length}
                        </strong>{" "}
                        Total Findings
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>
                        <strong className="text-foreground">
                          {strengthsList.length}
                        </strong>{" "}
                        Key Strengths
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Job Match Score Card (Only if Job is provided) */}
        {report.jobMatch && (
          <div className="lg:col-span-5">
            <Card className="border border-indigo-200 bg-indigo-50/40 shadow-sm overflow-hidden h-full flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-indigo-600" />
                      <h3 className="text-sm font-bold text-indigo-950">
                        Target Job Match
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                      Role Specific
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {report.jobMatch.jobTitle || "Target Position"}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {report.jobMatch.company || "Target Company"}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white border border-indigo-200 shadow-sm flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-black text-indigo-700">
                        {report.jobMatch.matchScore}%
                      </span>
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">
                        Match
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="leading-snug">
                        Evaluated independently against target job requirements.
                      </p>
                      <p className="text-[11px] text-indigo-800 font-medium">
                        Resume Quality Score & Job Match Score are never combined.
                      </p>
                    </div>
                  </div>

                  {/* Missing Keywords Snippet */}
                  {report.jobMatch.missingKeywords &&
                    report.jobMatch.missingKeywords.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-indigo-100">
                        <p className="text-[11px] font-medium text-indigo-900 mb-1.5">
                          Top Missing Keywords from Job:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {report.jobMatch.missingKeywords
                            .slice(0, 5)
                            .map((keyword, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-white border border-indigo-200 text-indigo-800 px-2 py-0.5 rounded-md font-medium"
                              >
                                {keyword}
                              </span>
                            ))}
                          {report.jobMatch.missingKeywords.length > 5 && (
                            <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                              +{report.jobMatch.missingKeywords.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>

                <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Powered by Phase 7 Match Engine</span>
                  <a
                    href={`/matches?jobId=${report.jobMatch.jobId || ""}`}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    View Match Analysis &rarr;
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <WeightsModal
        open={weightsOpen}
        onOpenChange={setWeightsOpen}
      />
    </div>
  );
}
