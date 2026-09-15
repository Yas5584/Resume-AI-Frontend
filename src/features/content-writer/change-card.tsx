"use client";

import * as React from "react";
import { ResumeContentChange } from "@resumeai/shared";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface ChangeCardProps {
  change: ResumeContentChange;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  isUpdating?: boolean;
}

export function ChangeCard({
  change,
  onAccept,
  onReject,
  isUpdating = false,
}: ChangeCardProps) {
  const isBlocked =
    change.status === "BLOCKED" ||
    change.factCheckStatus === "UNSUPPORTED" ||
    change.factCheckStatus === "CONTRADICTED";
  const isApproved = change.status === "APPROVED";
  const isRejected = change.status === "REJECTED";

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 shadow-sm transition-all",
        isBlocked
          ? "border-rose-200 bg-rose-50/20"
          : isApproved
            ? "border-emerald-200 bg-emerald-50/20"
            : "border-border hover:border-muted-foreground/30",
      )}
    >
      {/* Header: Section, Change Type, and Fact Guard Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize font-medium">
            {change.section}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {change.changeType.replace("_", " ")}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            {change.field}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isBlocked ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" />
              Blocked by Fact Guard
            </Badge>
          ) : (
            <Badge variant="success" className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Verified by Fact Guard
            </Badge>
          )}

          {isApproved && (
            <Badge variant="success" className="bg-emerald-600 text-white">
              Accepted
            </Badge>
          )}
          {isRejected && (
            <Badge variant="outline" className="text-muted-foreground">
              Rejected
            </Badge>
          )}
        </div>
      </div>

      {/* Comparison: BEFORE vs AFTER */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BEFORE */}
        <div className="rounded-lg border bg-muted/30 p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Before
            </span>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
              {change.originalValue}
            </p>
          </div>
        </div>

        {/* AFTER */}
        <div
          className={cn(
            "rounded-lg border p-3.5 flex flex-col justify-between",
            isBlocked
              ? "bg-rose-100/40 border-rose-200 text-rose-950"
              : "bg-emerald-50/50 border-emerald-200 text-emerald-950",
          )}
        >
          <div>
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider block mb-1.5 flex items-center gap-1",
                isBlocked ? "text-rose-700" : "text-emerald-700",
              )}
            >
              After
              <ArrowRight className="h-3 w-3 inline" />
            </span>
            <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">
              {change.proposedValue}
            </p>
          </div>
        </div>
      </div>

      {/* Blocked Alert Banner */}
      {isBlocked && change.blockedReason && (
        <div className="mt-3.5 rounded-lg border border-rose-200 bg-rose-100/60 p-3 text-xs text-rose-800 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <span className="font-semibold block">Fact Guard Protection:</span>
            {change.blockedReason}
          </div>
        </div>
      )}

      {/* Footer / Context Details */}
      <div className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1 text-xs text-muted-foreground max-w-xl">
          <p>
            <span className="font-medium text-foreground">Rationale: </span>
            {change.rationale}
          </p>
          <p className="font-mono text-[11px]">
            <span className="font-medium text-foreground font-sans">
              Evidence:{" "}
            </span>
            {change.evidenceIds.join(", ")}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isBlocked ? (
            <span className="text-xs text-rose-600 font-medium italic">
              Cannot apply unverified change
            </span>
          ) : (
            <>
              <Button
                variant={isApproved ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-1.5",
                  isApproved &&
                    "bg-emerald-600 hover:bg-emerald-700 text-white",
                )}
                disabled={isUpdating}
                onClick={() => onAccept?.(change.id)}
              >
                <CheckCircle2 className="h-4 w-4" />
                {isApproved ? "Accepted" : "Accept"}
              </Button>

              <Button
                variant={isRejected ? "secondary" : "outline"}
                size="sm"
                className={cn("gap-1.5", isRejected && "opacity-70")}
                disabled={isUpdating}
                onClick={() => onReject?.(change.id)}
              >
                <XCircle className="h-4 w-4" />
                {isRejected ? "Rejected" : "Reject"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
