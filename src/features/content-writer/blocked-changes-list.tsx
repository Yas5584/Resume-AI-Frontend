"use client";

import * as React from "react";
import { ResumeContentChange } from "@resumeai/shared";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { Badge } from "../../components/ui/badge";

interface BlockedChangesListProps {
  blockedChanges: ResumeContentChange[];
}

export function BlockedChangesList({
  blockedChanges,
}: BlockedChangesListProps) {
  if (blockedChanges.length === 0) return null;

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 space-y-4">
      <div className="flex items-center gap-2 text-rose-800">
        <ShieldAlert className="h-5 w-5" />
        <h3 className="font-semibold text-base">
          Blocked Changes ({blockedChanges.length})
        </h3>
      </div>
      <p className="text-xs text-rose-700 leading-relaxed">
        Fact Guard automatically prevented the AI from suggesting the following
        modifications because they could not be verified against your original
        resume evidence. ResumeAI guarantees that false claims or invented
        metrics are never introduced.
      </p>

      <div className="space-y-3 pt-1">
        {blockedChanges.map((change) => (
          <div
            key={change.id}
            className="rounded-lg border border-rose-200 bg-card p-4 text-xs shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize font-mono">
                  {change.section}
                </Badge>
                <span className="font-mono text-muted-foreground">
                  {change.field}
                </span>
              </div>
              <Badge variant="destructive">Blocked</Badge>
            </div>

            <div className="bg-muted/40 p-2.5 rounded border text-muted-foreground">
              <span className="font-semibold block text-[11px] uppercase tracking-wider mb-1">
                Rejected AI Proposal:
              </span>
              <p className="text-foreground/90 font-medium">
                {change.proposedValue}
              </p>
            </div>

            <div className="flex items-start gap-1.5 text-rose-800 bg-rose-100/70 p-2.5 rounded border border-rose-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span className="font-semibold block">Blocking Rationale:</span>
                <p>
                  {change.blockedReason ||
                    "Claim lacks supporting evidence in source resume."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
