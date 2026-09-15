"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { contentWriterService } from "../../../services/content-writer.service";
import { resumesService } from "../../../services/resumes.service";
import { jobsService } from "../../../services/jobs.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Sparkles,
  FileText,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ContentWriterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [resumes, setResumes] = React.useState<any[]>([]);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>(
    searchParams.get("resumeId") || "",
  );
  const [selectedJobId, setSelectedJobId] = React.useState<string>(
    searchParams.get("jobId") || "",
  );

  const [isLoading, setIsLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [resumesRes, jobsRes] = await Promise.all([
          resumesService.list(),
          jobsService.list(),
        ]);
        const resumeList = resumesRes?.items || resumesRes || [];
        const jobList = jobsRes?.items || jobsRes || [];

        setResumes(resumeList);
        setJobs(jobList);

        if (resumeList.length > 0) {
          setSelectedResumeId((prev) => prev || resumeList[0].id);
        }
        if (jobList.length > 0) {
          setSelectedJobId((prev) => prev || jobList[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load resumes or jobs");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (!selectedResumeId || !selectedJobId) {
      setError("Please select both a resume and a job description.");
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      const result = await contentWriterService.generate({
        resumeId: selectedResumeId,
        jobId: selectedJobId,
      });

      router.push(`/content-writer/${result.id || result.proposalId}`);
    } catch (err: any) {
      setError(err.message || "Failed to generate content improvements.");
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading writer environment...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">
            AI Content Writer + Fact Guard
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Generate impactful, job-tailored resume wording grounded strictly in
          your verified evidence. Hallucinations and false metrics are
          guaranteed to be blocked.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border bg-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
            <Sparkles className="h-4 w-4" />
            Impactful Rewriting
          </div>
          <p className="text-xs text-muted-foreground">
            Clear wording, active verbs, and natural keyword alignment with the
            target job.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm mb-1">
            <ShieldCheck className="h-4 w-4" />
            Fact Guard Protected
          </div>
          <p className="text-xs text-muted-foreground">
            AI is strictly prohibited from inventing metrics, technologies,
            dates, or titles.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-1">
            <FileText className="h-4 w-4" />
            Snapshot Versioning
          </div>
          <p className="text-xs text-muted-foreground">
            Automatic resume version snapshot created before any approved
            changes are applied.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selector Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Select Resume and Target Job
          </CardTitle>
          <CardDescription>
            Choose which resume to optimize and the target job description to
            align with.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Resume Picker */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Candidate Resume
            </label>
            {resumes.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No resumes found. Please create or import a resume first.
              </p>
            ) : (
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title || "Untitled Resume"} (ID: {r.id.slice(0, 8)}...)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Job Picker */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              Target Job Description
            </label>
            {jobs.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No job postings found. Please create and analyze a job
                description first.
              </p>
            ) : (
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title || "Untitled Position"}{" "}
                    {j.company ? `— ${j.company}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Generate Button */}
          <div className="pt-2 flex justify-end">
            <Button
              size="md"
              disabled={isGenerating || !selectedResumeId || !selectedJobId}
              onClick={handleGenerate}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing & Formulating Suggestions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Suggestions
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
