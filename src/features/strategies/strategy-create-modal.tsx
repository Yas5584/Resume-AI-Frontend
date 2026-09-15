"use client";

import * as React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { resumesService } from "../../services/resumes.service";
import { jobsService } from "../../services/jobs.service";
import {
  strategiesService,
  StrategyListItem,
} from "../../services/strategies.service";
import { Loader2, Compass } from "lucide-react";

interface StrategyCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (strategy: StrategyListItem) => void;
  preselectedResumeId?: string;
  preselectedJobId?: string;
}

export function StrategyCreateModal({
  open,
  onOpenChange,
  onCreated,
  preselectedResumeId,
  preselectedJobId,
}: StrategyCreateModalProps) {
  const [resumes, setResumes] = React.useState<any[]>([]);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>(
    preselectedResumeId || "",
  );
  const [selectedJobId, setSelectedJobId] = React.useState<string>(
    preselectedJobId || "",
  );
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      loadOptions();
      if (preselectedResumeId) setSelectedResumeId(preselectedResumeId);
      if (preselectedJobId) setSelectedJobId(preselectedJobId);
    }
  }, [open, preselectedResumeId, preselectedJobId]);

  const loadOptions = async () => {
    try {
      setIsLoadingData(true);
      setError(null);
      const [resumesRes, jobsRes] = await Promise.all([
        resumesService.list(1, 50),
        jobsService.list(),
      ]);
      setResumes(resumesRes.items || []);
      setJobs(
        (jobsRes.items || []).filter((j: any) => j.status === "COMPLETED"),
      );
    } catch (err: any) {
      setError(err.message || "Failed to load resumes or job descriptions");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedResumeId || !selectedJobId) {
      setError("Please select both a resume and an analyzed job description.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const created = await strategiesService.create(
        selectedResumeId,
        selectedJobId,
      );
      onCreated(created);
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Failed to create resume strategy");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            <DialogTitle>Formulate Tailoring Strategy</DialogTitle>
          </div>
          <DialogDescription>
            Select a candidate resume and an analyzed job description to
            generate a structured, fact-preserving tailoring strategy.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            {error}
          </div>
        )}

        {isLoadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Select Resume
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Choose Resume --</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Select Target Job Description
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full p-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Choose Analyzed Job --</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} {j.company ? `(${j.company})` : ""}
                  </option>
                ))}
              </select>
              {jobs.length === 0 && (
                <p className="text-xs text-amber-600">
                  No analyzed job descriptions found. Please analyze a job in
                  the Job Tracker first.
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isSubmitting || isLoadingData}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Plan...
              </>
            ) : (
              "Generate Strategy"
            )}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
