"use client";

import * as React from "react";
import { ResumeData, SectionRegenerationResponse } from "@resumeai/shared";
import { contentWriterService } from "../../services/content-writer.service";
import { jobsService, JobDescriptionItem } from "../../services/jobs.service";
import { resumesService } from "../../services/resumes.service";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Check,
  Loader2,
  FileText,
  Zap,
  RefreshCw,
} from "lucide-react";

export interface InlineImproveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  section:
    | "summary"
    | "experience"
    | "projects"
    | "achievements"
    | "skills"
    | "education"
    | "certifications";
  itemId?: string;
  field: string;
  currentValue: string;
  itemTitle?: string;
  onApplied: (newResumeData: ResumeData) => void;
}

export function InlineImproveModal({
  open,
  onOpenChange,
  resumeId,
  section,
  itemId,
  field,
  currentValue,
  itemTitle,
  onApplied,
}: InlineImproveModalProps) {
  const [jobs, setJobs] = React.useState<JobDescriptionItem[]>([]);
  const [selectedJobId, setSelectedJobId] = React.useState<string>("");
  const [instruction, setInstruction] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [isApplying, setIsApplying] = React.useState<boolean>(false);
  const [result, setResult] =
    React.useState<SectionRegenerationResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Load available jobs when modal opens
  React.useEffect(() => {
    if (open) {
      setError(null);
      jobsService
        .list(1, 50)
        .then((res) => {
          setJobs(res.items || []);
        })
        .catch((err) => {
          console.error("Failed to load jobs for selector", err);
        });
    } else {
      setResult(null);
      setError(null);
      setInstruction("");
    }
  }, [open]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await contentWriterService.regenerateSection({
        resumeId,
        section,
        itemId,
        field,
        targetJobId: selectedJobId ? selectedJobId : undefined,
        instruction: instruction.trim() || undefined,
      });
      setResult(response);
    } catch (err: any) {
      console.error("Regeneration failed", err);
      setError(
        err?.message ||
          "AI is temporarily busy or unavailable. Please try again in a few moments.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!result || result.status === "BLOCKED") return;
    setIsApplying(true);
    setError(null);
    try {
      await contentWriterService.apply(result.proposalId, [result.changeId]);
      // Fetch authoritative updated resume data
      const updatedResume = await resumesService.getById(resumeId);
      onApplied(updatedResume.resumeData);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to apply change", err);
      setError(
        err?.message ||
          "Failed to apply proposal. The resume may have changed since generation.",
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleReject = async () => {
    if (result) {
      try {
        await contentWriterService.reject(result.proposalId);
      } catch (err) {
        console.error("Failed to reject proposal", err);
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-3xl">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>AI Section Improvement</DialogTitle>
              <DialogDescription className="text-xs">
                {itemTitle || `Improving ${section} • ${field}`}
              </DialogDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-[11px] gap-1 py-0.5">
            <Zap className="h-3 w-3 text-amber-500" />
            Groq AI • Fast Llama-3
          </Badge>
        </div>
      </DialogHeader>

      <div className="space-y-4 my-2 max-h-[72vh] overflow-y-auto pr-1">
        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
            <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <span className="font-semibold">Error: </span>
              {error}
            </div>
          </div>
        )}

        {/* Tailoring & Prompt Controls */}
        <div className="rounded-lg border border-border/70 bg-muted/30 p-3.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mode / Job Selection */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Target Job Tailoring
              </label>
              <select
                className="w-full rounded-md border border-input bg-white p-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                disabled={isGenerating || isApplying}
              >
                <option value="">General ATS & Impact (Mode 1)</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} {job.company ? `(${job.company})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Instruction */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Custom Instruction (Optional)
              </label>
              <input
                type="text"
                maxLength={500}
                placeholder="e.g. Emphasize backend scalability, keep under 25 words..."
                className="w-full rounded-md border border-input bg-white p-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                disabled={isGenerating || isApplying}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="button"
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating || isApplying}
              className="text-xs h-8"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Generating Rewrite...
                </>
              ) : result ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Regenerate Alternative
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Generate AI Rewrite
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content Comparison View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* BEFORE */}
          <div className="rounded-lg border border-border/80 bg-background p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-border/60">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Current (Before)
              </span>
              <Badge variant="outline" className="text-[10px] py-0">
                Original
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed min-h-[90px] font-sans">
              {currentValue || "(Empty)"}
            </div>
          </div>

          {/* AFTER */}
          <div className="rounded-lg border border-primary/40 bg-primary/[0.02] p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-primary/20">
              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                AI Suggestion (After)
              </span>
              {result && (
                <Badge
                  variant={
                    result.status === "BLOCKED" ? "destructive" : "success"
                  }
                  className="text-[10px] py-0"
                >
                  {result.status === "BLOCKED" ? "Blocked" : "Proposed"}
                </Badge>
              )}
            </div>
            <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed min-h-[90px] font-sans">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs">
                    Analyzing facts & optimizing for ATS...
                  </span>
                </div>
              ) : result ? (
                result.proposedValue
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-xs italic">
                  Click &quot;Generate AI Rewrite&quot; above to see suggested
                  wording.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fact Guard & ATS Validation Insights (When Result Exists) */}
        {result && (
          <div className="space-y-3 pt-1">
            {/* Fact Guard Status */}
            <div
              className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                result.status === "BLOCKED"
                  ? "bg-rose-50 border-rose-200 text-rose-900"
                  : result.factCheckStatus === "SUPPORTED"
                    ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              {result.status === "BLOCKED" ? (
                <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              ) : result.factCheckStatus === "SUPPORTED" ? (
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-1.5">
                <div className="font-semibold flex items-center justify-between">
                  <span>
                    Fact Guard:{" "}
                    {result.status === "BLOCKED"
                      ? "Hallucination Detected — Application Blocked"
                      : result.factCheckStatus === "SUPPORTED"
                        ? "100% Grounded in Evidence"
                        : "Caution — Uncertain Statement"}
                  </span>
                  <Badge
                    variant={
                      result.status === "BLOCKED" ? "destructive" : "outline"
                    }
                    className="text-[10px] ml-2"
                  >
                    Score:{" "}
                    {result.factGuardScore ??
                      (result.status === "BLOCKED" ? 0 : 100)}
                    %
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {result.blockedReason ||
                    (result.factCheckStatus === "SUPPORTED"
                      ? "All metrics, technologies, and statements in this rewrite are strictly verified against your resume history."
                      : "Some details could not be fully substantiated by your resume history.")}
                </p>

                {/* Claims Summary */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-current/10">
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {result.supportedClaimsCount ??
                      result.claims?.filter(
                        (c) => c.factCheckStatus === "SUPPORTED",
                      ).length ??
                      0}{" "}
                    supported claims
                  </span>
                  {(result.unsupportedClaimsCount || 0) > 0 && (
                    <span className="text-[11px] font-medium text-rose-700 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {result.unsupportedClaimsCount} unsupported claims
                    </span>
                  )}
                </div>

                {/* Explicit Unsupported Claims List */}
                {result.claims &&
                  result.claims.some(
                    (c) =>
                      c.factCheckStatus === "UNSUPPORTED" ||
                      c.factCheckStatus === "CONTRADICTED",
                  ) && (
                    <div className="mt-2 space-y-1 pt-1 border-t border-rose-200">
                      <span className="text-[11px] font-semibold text-rose-800 block">
                        Unsupported or Contradicted Items:
                      </span>
                      {result.claims
                        .filter(
                          (c) =>
                            c.factCheckStatus === "UNSUPPORTED" ||
                            c.factCheckStatus === "CONTRADICTED",
                        )
                        .map((c, idx) => (
                          <div
                            key={idx}
                            className="p-1.5 rounded bg-rose-100/60 border border-rose-200 text-[11px] text-rose-900 flex items-start gap-1.5"
                          >
                            <AlertTriangle className="h-3 w-3 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">{c.claim}:</span>{" "}
                              {c.reason ||
                                "Not found in your authoritative resume data."}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
              </div>
            </div>

            {/* ATS Compliance Panel */}
            <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ATS Readiness: {result.atsChecks.score}/100
                </span>
                <Badge
                  variant={
                    result.atsChecks.isAtsFriendly &&
                    result.status !== "BLOCKED"
                      ? "success"
                      : "warning"
                  }
                  className="text-[10px]"
                >
                  {result.atsChecks.isAtsFriendly && result.status !== "BLOCKED"
                    ? "ATS-Optimized"
                    : "Needs Adjustment"}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {result.atsChecks.summary}
              </p>

              {/* Category Scores Breakdown */}
              {result.atsChecks.categoryScores && (
                <div className="flex flex-wrap gap-1.5 py-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                    Formatting: {result.atsChecks.categoryScores.formatting}/15
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                    Readability: {result.atsChecks.categoryScores.readability}
                    /15
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                    Keyword: {result.atsChecks.categoryScores.keyword}/20
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                    Structure: {result.atsChecks.categoryScores.structure}/15
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground border">
                    Evidence: {result.atsChecks.categoryScores.evidence}/25
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {result.atsChecks.checks.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-1.5 text-[11px] text-muted-foreground"
                  >
                    {c.passed ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    )}
                    <span className="truncate">{c.name}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground/75 italic pt-1 border-t border-border/40">
                This score estimates ATS parser compatibility. Actual results
                may vary by ATS vendor.
              </p>
            </div>

            {/* Development Claim Audit (Prompt Section 31) */}
            {result.claims && result.claims.length > 0 && (
              <div className="p-3 rounded-lg border border-border/70 bg-muted/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Claim Audit ({result.claims.length} claims extracted)
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    DEV AUDIT
                  </span>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {result.claims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded text-[11px] border flex items-start justify-between gap-2 bg-background/60"
                    >
                      <div className="flex items-start gap-1.5 min-w-0">
                        {claim.factCheckStatus === "SUPPORTED" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : claim.factCheckStatus === "CONTRADICTED" ? (
                          <XCircle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground">
                            {claim.claim}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-1.5">
                            ({claim.category})
                          </span>
                          <div className="text-[10px] text-muted-foreground">
                            Evidence:{" "}
                            {claim.evidenceIds && claim.evidenceIds.length > 0
                              ? claim.evidenceIds.join(", ")
                              : "NONE"}
                          </div>
                          {claim.reason && (
                            <div className="text-[10px] text-rose-700">
                              {claim.reason}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          claim.factCheckStatus === "SUPPORTED"
                            ? "outline"
                            : claim.factCheckStatus === "CONTRADICTED"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-[9px] uppercase shrink-0 py-0 px-1"
                      >
                        {claim.factCheckStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Rationale */}
            {result.rationale && (
              <div className="text-[11px] text-muted-foreground italic px-1">
                <span className="font-semibold not-italic text-foreground">
                  Rationale:{" "}
                </span>
                {result.rationale}
              </div>
            )}
          </div>
        )}
      </div>

      <DialogFooter className="flex items-center justify-between sm:justify-between border-t border-border/60 pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReject}
          disabled={isApplying}
          className="text-xs"
        >
          Cancel
        </Button>

        <div className="flex items-center space-x-2">
          {result &&
            (result.status === "BLOCKED" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="text-xs border-amber-500 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 mr-1.5 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  Regenerate Grounded Version
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={true}
                  className="text-xs opacity-75 cursor-not-allowed"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                  Blocked — Review Required
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleAccept}
                disabled={isApplying}
                className="text-xs"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Applying & Snapshotting...
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Accept & Update Section
                  </>
                )}
              </Button>
            ))}
        </div>
      </DialogFooter>
    </Dialog>
  );
}
