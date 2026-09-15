"use client";

import * as React from "react";
import { MatchGap } from "@resumeai/shared";
import { Badge } from "../../components/ui/badge";
import { AlertCircle, HelpCircle, ArrowRight } from "lucide-react";

interface MatchGapsCardProps {
  gaps: MatchGap[];
}

export function MatchGapsCard({ gaps }: MatchGapsCardProps) {
  const [filter, setFilter] = React.useState<
    "ALL" | "CRITICAL" | "REQUIRED" | "PREFERRED"
  >("ALL");

  const filtered = React.useMemo(() => {
    if (filter === "ALL") return gaps;
    if (filter === "CRITICAL") return gaps.filter((g) => g.critical);
    return gaps.filter((g) => g.importance === filter);
  }, [gaps, filter]);

  if (!gaps || gaps.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground bg-emerald-50/50 border border-emerald-200 rounded-lg">
        🎉 No significant requirement gaps identified! Your resume covers the
        job description requirements comprehensively.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted-foreground font-medium mr-1">Filter:</span>
        {(["ALL", "CRITICAL", "REQUIRED", "PREFERRED"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((gap, idx) => {
          const isCritical = gap.critical;
          const isRequired = gap.importance === "REQUIRED";

          return (
            <div
              key={idx}
              className={`p-4 rounded-lg border text-sm space-y-2 ${
                isCritical
                  ? "bg-rose-50/40 border-rose-200"
                  : isRequired
                    ? "bg-amber-50/40 border-amber-200"
                    : "bg-slate-50/60 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      isCritical
                        ? "destructive"
                        : isRequired
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {isCritical ? "CRITICAL" : gap.importance}
                  </Badge>
                  <span className="font-semibold text-foreground">
                    {gap.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground uppercase">
                  {gap.missingType}
                </span>
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed">
                {gap.detail}
              </p>

              {gap.remedyHint && (
                <div className="flex items-start gap-1.5 text-xs text-primary font-medium pt-1">
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{gap.remedyHint}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
