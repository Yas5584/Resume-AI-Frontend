"use client";

import * as React from "react";
import {
  ResumeQualityFinding,
  FindingSeverityType,
  FindingSeverity,
  CATEGORY_DISPLAY_NAMES,
  ResumeQualityCategoryType,
} from "@resumeai/shared";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Filter,
  Layers,
  FileSearch,
} from "lucide-react";

export interface FindingsListProps {
  findings: ResumeQualityFinding[];
  strengths: string[];
  selectedCategory: string | null;
  onClearCategoryFilter: () => void;
  onImprove: (finding: ResumeQualityFinding) => void;
}

const SEVERITY_ORDER: Record<string, number> = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  INFO: 5,
};

function getSeverityBadge(severity: FindingSeverityType): {
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
} {
  switch (severity) {
    case FindingSeverity.CRITICAL:
      return {
        bg: "bg-red-50 text-red-700",
        border: "border-red-200",
        text: "text-red-700",
        icon: <AlertCircle className="h-3.5 w-3.5 text-red-600" />,
      };
    case FindingSeverity.HIGH:
      return {
        bg: "bg-orange-50 text-orange-700",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />,
      };
    case FindingSeverity.MEDIUM:
      return {
        bg: "bg-amber-50 text-amber-800",
        border: "border-amber-200",
        text: "text-amber-800",
        icon: <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />,
      };
    case FindingSeverity.LOW:
      return {
        bg: "bg-blue-50 text-blue-700",
        border: "border-blue-200",
        text: "text-blue-700",
        icon: <Info className="h-3.5 w-3.5 text-blue-600" />,
      };
    default:
      return {
        bg: "bg-slate-50 text-slate-700",
        border: "border-slate-200",
        text: "text-slate-700",
        icon: <Info className="h-3.5 w-3.5 text-slate-500" />,
      };
  }
}

export function FindingsList({
  findings,
  strengths,
  selectedCategory,
  onClearCategoryFilter,
  onImprove,
}: FindingsListProps) {
  const [severityFilter, setSeverityFilter] = React.useState<string>("ALL");
  const safeFindings = Array.isArray(findings) ? findings : [];
  const safeStrengths = Array.isArray(strengths) ? strengths : [];

  // Filter findings
  const filteredFindings = safeFindings
    .filter((f) => {
      if (selectedCategory && f.category !== selectedCategory) return false;
      if (severityFilter !== "ALL" && f.severity !== severityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const orderA = SEVERITY_ORDER[a.severity] || 99;
      const orderB = SEVERITY_ORDER[b.severity] || 99;
      return orderA - orderB;
    });

  const criticalCount = safeFindings.filter(
    (f) => f.severity === FindingSeverity.CRITICAL,
  ).length;
  const highCount = safeFindings.filter(
    (f) => f.severity === FindingSeverity.HIGH,
  ).length;
  const mediumCount = safeFindings.filter(
    (f) => f.severity === FindingSeverity.MEDIUM,
  ).length;

  return (
    <div className="space-y-6">
      {/* Key Strengths Banner */}
      {safeStrengths && safeStrengths.length > 0 && (
        <Card className="border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-950">
                Identified Strengths & ATS Highlights
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {safeStrengths.map((str, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-emerald-900 bg-white/80 border border-emerald-100 p-2.5 rounded-lg"
                >
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Severity:
          </span>
          <button
            onClick={() => setSeverityFilter("ALL")}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
              severityFilter === "ALL"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({safeFindings.length})
          </button>
          {criticalCount > 0 && (
            <button
              onClick={() => setSeverityFilter(FindingSeverity.CRITICAL)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                severityFilter === FindingSeverity.CRITICAL
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Critical ({criticalCount})
            </button>
          )}
          {highCount > 0 && (
            <button
              onClick={() => setSeverityFilter(FindingSeverity.HIGH)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                severityFilter === FindingSeverity.HIGH
                  ? "bg-orange-600 text-white"
                  : "bg-orange-50 text-orange-700 hover:bg-orange-100"
              }`}
            >
              High ({highCount})
            </button>
          )}
          {mediumCount > 0 && (
            <button
              onClick={() => setSeverityFilter(FindingSeverity.MEDIUM)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                severityFilter === FindingSeverity.MEDIUM
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Medium ({mediumCount})
            </button>
          )}
        </div>

        {selectedCategory && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Category:</span>
            <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              {CATEGORY_DISPLAY_NAMES[
                selectedCategory as ResumeQualityCategoryType
              ] || selectedCategory}
              <button
                onClick={onClearCategoryFilter}
                className="text-primary hover:text-primary/70 font-bold ml-1"
              >
                &times;
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Findings Count & Cards */}
      <div className="space-y-3.5">
        {filteredFindings.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-xl bg-muted/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-semibold text-foreground">
              No findings matching the selected filters
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Your resume meets all criteria for this view. Choose a different
              severity or clear category filters to view other suggestions.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const badge = getSeverityBadge(finding.severity);
            const categoryName =
              CATEGORY_DISPLAY_NAMES[finding.category] || finding.category;

            return (
              <Card
                key={finding.id}
                className="border border-border hover:border-border/80 shadow-sm transition-all bg-white overflow-hidden"
              >
                <CardContent className="p-5 space-y-3">
                  {/* Finding Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${badge.bg} ${badge.border}`}
                      >
                        {badge.icon}
                        {finding.severity}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {categoryName}
                      </span>
                      {finding.section && (
                        <span className="text-[11px] text-muted-foreground capitalize font-medium">
                          Section: {finding.section}
                        </span>
                      )}
                    </div>

                    {/* Improve with AI CTA */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onImprove(finding)}
                      className="text-xs h-8 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 hover:text-indigo-800 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                      Improve with AI
                    </Button>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {finding.title}
                    </h4>
                    <p className="text-xs text-foreground/80 mt-1 leading-relaxed">
                      {finding.description}
                    </p>
                  </div>

                  {/* Why It Matters Callout */}
                  {finding.whyItMatters && (
                    <div className="p-2.5 rounded-md bg-muted/40 border-l-2 border-primary/50 text-xs text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground mr-1">
                        Why it matters:
                      </span>
                      {finding.whyItMatters}
                    </div>
                  )}

                  {/* Evidence Snippet */}
                  {finding.evidence && (
                    <div className="text-xs bg-slate-50 border border-slate-200 rounded p-2.5 font-mono text-slate-700">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Evidence from resume:
                      </span>
                      <span className="italic">&ldquo;{finding.evidence}&rdquo;</span>
                    </div>
                  )}

                  {/* Concrete Recommendation */}
                  <div className="pt-2 border-t border-border/40 flex items-start gap-2 text-xs">
                    <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">
                        Actionable Fix:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {finding.recommendation}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
