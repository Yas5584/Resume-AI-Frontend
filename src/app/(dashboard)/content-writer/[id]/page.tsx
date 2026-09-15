"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  contentWriterService,
  ProposalDetailResponse,
} from "../../../../services/content-writer.service";
import { ProposalStatsBar } from "../../../../features/content-writer/proposal-stats-bar";
import { ChangeCard } from "../../../../features/content-writer/change-card";
import { BlockedChangesList } from "../../../../features/content-writer/blocked-changes-list";
import { StaleWarningBanner } from "../../../../features/content-writer/stale-warning-banner";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck2,
} from "lucide-react";

export default function ProposalReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [proposal, setProposal] = React.useState<ProposalDetailResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [isApplying, setIsApplying] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [updatingChangeId, setUpdatingChangeId] = React.useState<string | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [successNotice, setSuccessNotice] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    "ALL" | "VERIFIED" | "BLOCKED"
  >("ALL");

  const fetchProposal = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contentWriterService.getProposal(id);
      setProposal(data);
    } catch (err: any) {
      setError(err.message || "Failed to load content proposal");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  const handleAcceptChange = async (changeId: string) => {
    if (!proposal) return;
    try {
      setUpdatingChangeId(changeId);
      await contentWriterService.updateChangeStatus(
        proposal.id,
        changeId,
        "APPROVED",
      );

      // Update local state
      setProposal((prev) => {
        if (!prev) return prev;
        const updatedChanges = prev.changes.map((c) =>
          c.id === changeId ? { ...c, status: "APPROVED" as const } : c,
        );
        return { ...prev, changes: updatedChanges };
      });
    } catch (err: any) {
      setError(err.message || "Failed to accept change");
    } finally {
      setUpdatingChangeId(null);
    }
  };

  const handleRejectChange = async (changeId: string) => {
    if (!proposal) return;
    try {
      setUpdatingChangeId(changeId);
      await contentWriterService.updateChangeStatus(
        proposal.id,
        changeId,
        "REJECTED",
      );

      setProposal((prev) => {
        if (!prev) return prev;
        const updatedChanges = prev.changes.map((c) =>
          c.id === changeId ? { ...c, status: "REJECTED" as const } : c,
        );
        return { ...prev, changes: updatedChanges };
      });
    } catch (err: any) {
      setError(err.message || "Failed to reject change");
    } finally {
      setUpdatingChangeId(null);
    }
  };

  const handleRegenerate = async () => {
    if (!proposal) return;
    try {
      setIsRegenerating(true);
      setError(null);
      const res = await contentWriterService.generate({
        resumeId: proposal.resumeId,
        jobId: proposal.jobId,
        matchId: proposal.matchId || undefined,
        strategyId: proposal.strategyId || undefined,
      });
      router.push(`/content-writer/${res.id || res.proposalId}`);
    } catch (err: any) {
      setError(err.message || "Failed to regenerate suggestions");
      setIsRegenerating(false);
    }
  };

  const handleApplySelected = async () => {
    if (!proposal) return;

    // Changes to apply: approved changes (or all verified if none explicitly approved)
    const approvedChanges = proposal.changes.filter(
      (c) => c.status === "APPROVED",
    );
    const selectedIds =
      approvedChanges.length > 0
        ? approvedChanges.map((c) => c.id)
        : proposal.changes
            .filter((c) => c.status === "PENDING")
            .map((c) => c.id);

    if (selectedIds.length === 0) {
      setError("Please accept at least one verified change to apply.");
      return;
    }

    try {
      setIsApplying(true);
      setError(null);
      const result = await contentWriterService.apply(proposal.id, selectedIds);
      setSuccessNotice(
        `Applied ${result.appliedChangesCount} change(s). Version ${result.versionNumber} snapshot created before updates.`,
      );

      // Refresh proposal
      await fetchProposal();
    } catch (err: any) {
      setError(err.message || "Failed to apply changes");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading proposal review...
        </p>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Proposal not found.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => router.push("/content-writer")}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Content Writer
        </Button>
      </div>
    );
  }

  const approvedCount = proposal.changes.filter(
    (c) => c.status === "APPROVED",
  ).length;
  const verifiedChanges = proposal.changes.filter(
    (c) => c.status !== "BLOCKED",
  );
  const blockedChanges = proposal.changes.filter((c) => c.status === "BLOCKED");

  const displayedChanges =
    activeTab === "VERIFIED"
      ? verifiedChanges
      : activeTab === "BLOCKED"
        ? blockedChanges
        : proposal.changes;

  const isApplied = proposal.status === "APPLIED";

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Navigation & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => router.push("/content-writer")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Writer
        </Button>

        <div className="flex items-center gap-2">
          {isApplied ? (
            <Badge
              variant="success"
              className="bg-emerald-600 text-white gap-1 py-1"
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              Applied to Resume (Version{" "}
              {proposal.appliedVersion?.versionNumber || ""})
            </Badge>
          ) : (
            <Badge variant="outline" className="py-1">
              Proposal Status: {proposal.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Target Role & Candidate Info */}
      <div className="bg-card border rounded-xl p-5 shadow-sm space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            {proposal.jobTitle || "Job Tailoring Suggestions"}
          </h1>
          {proposal.jobCompany && (
            <span className="text-sm font-medium text-muted-foreground">
              at {proposal.jobCompany}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          Optimizing: {proposal.resumeTitle || "Resume"}
        </p>
      </div>

      {/* Stale Proposal Alert */}
      {proposal.isStale && !isApplied && (
        <StaleWarningBanner
          onRegenerate={handleRegenerate}
          isRegenerating={isRegenerating}
        />
      )}

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white border-emerald-300 text-emerald-800"
            onClick={() => router.push(`/resumes/${proposal.resumeId}`)}
          >
            View Resume
          </Button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Transparent Fact Guard Score / Statistics */}
      <ProposalStatsBar
        stats={proposal.summaryStats}
        approvedCount={approvedCount}
      />

      {/* Filter Tabs & Apply Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border">
          <button
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "ALL"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("ALL")}
          >
            All Suggestions ({proposal.changes.length})
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "VERIFIED"
                ? "bg-card text-emerald-700 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("VERIFIED")}
          >
            Verified Safe ({verifiedChanges.length})
          </button>
          <button
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === "BLOCKED"
                ? "bg-card text-rose-700 shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("BLOCKED")}
          >
            Blocked ({blockedChanges.length})
          </button>
        </div>

        {!isApplied && (
          <Button
            size="md"
            className="gap-2 bg-primary hover:bg-primary/90"
            disabled={
              isApplying ||
              (approvedCount === 0 && verifiedChanges.length === 0)
            }
            onClick={handleApplySelected}
          >
            {isApplying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Applying & Saving Version...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Apply Selected Changes (
                {approvedCount > 0 ? approvedCount : verifiedChanges.length})
              </>
            )}
          </Button>
        )}
      </div>

      {/* Change Cards List */}
      <div className="space-y-4">
        {displayedChanges.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No suggestions match the selected filter.
          </div>
        ) : (
          displayedChanges.map((change) => (
            <ChangeCard
              key={change.id}
              change={change}
              onAccept={handleAcceptChange}
              onReject={handleRejectChange}
              isUpdating={updatingChangeId === change.id}
            />
          ))
        )}
      </div>

      {/* Dedicated Blocked Changes View */}
      {blockedChanges.length > 0 && activeTab !== "BLOCKED" && (
        <div className="pt-4">
          <BlockedChangesList blockedChanges={blockedChanges} />
        </div>
      )}
    </div>
  );
}
