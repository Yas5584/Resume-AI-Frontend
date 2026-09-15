"use client";

import * as React from "react";
import { ContentProposalSummaryStats } from "@resumeai/shared";
import { ShieldCheck, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface ProposalStatsBarProps {
  stats: ContentProposalSummaryStats;
  approvedCount?: number;
}

export function ProposalStatsBar({
  stats,
  approvedCount = 0,
}: ProposalStatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-card border rounded-xl p-4 shadow-sm">
      {/* Total Proposed */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="text-2xl font-bold text-foreground">
            {stats.totalProposed}
          </span>
          <p className="text-xs text-muted-foreground font-medium">
            Proposed Suggestions
          </p>
        </div>
      </div>

      {/* Verified Safe */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <span className="text-2xl font-bold text-emerald-700">
            {stats.verifiedCount}
          </span>
          <p className="text-xs text-muted-foreground font-medium">
            Verified by Fact Guard
          </p>
        </div>
      </div>

      {/* Blocked Hallucinations / Inventions */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <span className="text-2xl font-bold text-rose-700">
            {stats.blockedCount}
          </span>
          <p className="text-xs text-muted-foreground font-medium">
            Blocked by Fact Guard
          </p>
        </div>
      </div>

      {/* Approved by User */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <span className="text-2xl font-bold text-blue-700">
            {approvedCount}
          </span>
          <p className="text-xs text-muted-foreground font-medium">
            Ready to Apply
          </p>
        </div>
      </div>
    </div>
  );
}
