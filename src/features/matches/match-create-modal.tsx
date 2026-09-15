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
import { resumesService, ResumeSummary } from "../../services/resumes.service";
import { jobsService, JobDescriptionItem } from "../../services/jobs.service";
import {
  matchesService,
  MatchDetailResponse,
} from "../../services/matches.service";
import { Sparkles, FileText, Briefcase } from "lucide-react";

interface MatchCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (match: MatchDetailResponse) => void;
}

export function MatchCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: MatchCreateModalProps) {
  const [resumes, setResumes] = React.useState<ResumeSummary[]>([]);
  const [jobs, setJobs] = React.useState<JobDescriptionItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>("");
  const [selectedJobId, setSelectedJobId] = React.useState<string>("");
  const [isLoadingData, setIsLoadingData] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      try {
        setIsLoadingData(true);
        setError(null);
        const [resList, jobList] = await Promise.all([
          resumesService.list(1, 50),
          jobsService.list(1, 50),
        ]);

        setResumes(resList.items || []);
        // Only jobs that have completed parsing
        const parsedJobs = (jobList.items || []).filter(
          (j) => j.status === "COMPLETED",
        );
        setJobs(parsedJobs);

        if (resList.items?.length > 0) {
          setSelectedResumeId(resList.items[0].id);
        }
        if (parsedJobs.length > 0) {
          setSelectedJobId(parsedJobs[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load resumes or jobs");
      } finally {
        setIsLoadingData(false);
      }
    }

    loadData();
  }, [isOpen]);

  const handleRun = async () => {
    if (!selectedResumeId || !selectedJobId) {
      setError("Please select both a resume and a job description.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const res = await matchesService.create(selectedResumeId, selectedJobId);
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to run match analysis");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Run Match Analysis
        </DialogTitle>
        <DialogDescription>
          Select an existing resume and an analyzed job description to compute a
          transparent, deterministic match score.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
            {error}
          </div>
        )}

        {isLoadingData ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Loading resumes and jobs...
          </div>
        ) : (
          <>
            {/* Select Resume */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Select Resume
              </label>
              {resumes.length === 0 ? (
                <div className="text-xs text-amber-600 p-2 bg-amber-50 rounded border">
                  No resumes found. Please create or import a resume first.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full text-sm border rounded-lg p-2.5 bg-background text-foreground"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.targetRole || "General"})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Select Job */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Select Job Description
              </label>
              {jobs.length === 0 ? (
                <div className="text-xs text-amber-600 p-2 bg-amber-50 rounded border">
                  No analyzed jobs found. Please add and analyze a job
                  description in Job Tracker first.
                </div>
              ) : (
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full text-sm border rounded-lg p-2.5 bg-background text-foreground"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} {j.company ? `@ ${j.company}` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleRun}
          isLoading={isSubmitting}
          disabled={isLoadingData || !selectedResumeId || !selectedJobId}
        >
          Compute Match
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
