"use client";

import * as React from "react";
import { MatchedSkillItem } from "@resumeai/shared";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, AlertCircle, HelpCircle, Filter } from "lucide-react";

interface MatchSkillsBreakdownProps {
  skills: MatchedSkillItem[];
  onSelectItem: (item: MatchedSkillItem) => void;
}

export function MatchSkillsBreakdown({
  skills,
  onSelectItem,
}: MatchSkillsBreakdownProps) {
  const [statusFilter, setStatusFilter] = React.useState<
    "ALL" | "MATCHED" | "PARTIAL" | "MISSING" | "UNKNOWN"
  >("ALL");
  const [typeFilter, setTypeFilter] = React.useState<
    "ALL" | "REQUIRED" | "PREFERRED"
  >("ALL");

  const filtered = React.useMemo(() => {
    return skills.filter((item) => {
      if (statusFilter !== "ALL" && item.matchType !== statusFilter)
        return false;
      if (typeFilter !== "ALL" && item.importance !== typeFilter) return false;
      return true;
    });
  }, [skills, statusFilter, typeFilter]);

  const counts = React.useMemo(() => {
    const res = { MATCHED: 0, PARTIAL: 0, MISSING: 0, UNKNOWN: 0 };
    for (const s of skills) {
      if (s.matchType in res) res[s.matchType as keyof typeof res]++;
    }
    return res;
  }, [skills]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-lg border">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground mr-1 flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              statusFilter === "ALL"
                ? "bg-primary text-primary-foreground font-medium"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            All ({skills.length})
          </button>
          <button
            onClick={() => setStatusFilter("MATCHED")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              statusFilter === "MATCHED"
                ? "bg-emerald-600 text-white font-medium"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            Matched ({counts.MATCHED})
          </button>
          <button
            onClick={() => setStatusFilter("PARTIAL")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              statusFilter === "PARTIAL"
                ? "bg-amber-600 text-white font-medium"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            Partial ({counts.PARTIAL})
          </button>
          <button
            onClick={() => setStatusFilter("MISSING")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              statusFilter === "MISSING"
                ? "bg-slate-700 text-white font-medium"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            Not in Resume ({counts.MISSING})
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground mr-1 font-medium">
            Importance:
          </span>
          {(["ALL", "REQUIRED", "PREFERRED"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-1 rounded-md capitalize transition-colors ${
                typeFilter === t
                  ? "bg-secondary text-secondary-foreground font-semibold border"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {t.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No skills match the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {filtered.map((item, idx) => {
            const isMatched = item.matchType === "MATCHED";
            const isPartial = item.matchType === "PARTIAL";
            const isMissing = item.matchType === "MISSING";

            return (
              <div
                key={idx}
                onClick={() => onSelectItem(item)}
                className={`p-3 rounded-lg border transition-all cursor-pointer text-left flex flex-col justify-between gap-2 hover:shadow-sm ${
                  isMatched
                    ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                    : isPartial
                      ? "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                      : "bg-slate-50/60 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm text-foreground leading-tight">
                    {item.skill}
                  </span>
                  <span className="flex-shrink-0">
                    {isMatched && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {isPartial && (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    {isMissing && (
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-1.5 uppercase font-mono"
                  >
                    {item.importance}
                  </Badge>
                  <span
                    className={`text-[11px] font-medium ${
                      isMatched
                        ? "text-emerald-700"
                        : isPartial
                          ? "text-amber-700"
                          : "text-slate-500"
                    }`}
                  >
                    {isMissing
                      ? "Not found in resume"
                      : item.matchType.toLowerCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
