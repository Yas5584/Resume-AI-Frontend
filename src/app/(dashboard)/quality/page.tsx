"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ResumeQualityReport,
  ResumeQualityFinding,
  ResumeData,
} from "@resumeai/shared";
import { qualityService } from "../../../services/quality.service";
import {
  resumesService,
  ResumeSummary,
  ResumeDetail,
} from "../../../services/resumes.service";
import { jobsService, JobDescriptionItem } from "../../../services/jobs.service";
import { QualityScoreCard } from "../../../features/quality/quality-score-card";
import { CategoryGrid } from "../../../features/quality/category-grid";
import { FindingsList } from "../../../features/quality/findings-list";
import { InlineImproveModal } from "../../../features/content-writer/inline-improve-modal";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  ShieldCheck,
  Briefcase,
  FileText,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  FileSearch,
} from "lucide-react";

export default function QualityPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlResumeId = searchParams.get("resumeId");
  const urlJobId = searchParams.get("jobId");

  const [resumes, setResumes] = React.useState<ResumeSummary[]>([]);
  const [jobs, setJobs] = React.useState<JobDescriptionItem[]>([]);
  const [selectedResumeId, setSelectedResumeId] = React.useState<string>(
    urlResumeId || "",
  );
  const [selectedJobId, setSelectedJobId] = React.useState<string>(
    urlJobId || "",
  );

  const [activeResumeDetail, setActiveResumeDetail] =
    React.useState<ResumeDetail | null>(null);
  const [report, setReport] = React.useState<ResumeQualityReport | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = React.useState<boolean>(true);
  const [isFetchingReport, setIsFetchingReport] = React.useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  );

  // Phase 9 InlineImproveModal state
  const [improveModalState, setImproveModalState] = React.useState<{
    open: boolean;
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
  }>({
    open: false,
    section: "summary",
    field: "body",
    currentValue: "",
  });

  // 1. Fetch user's resumes and jobs on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        setIsLoadingInitial(true);
        const [resumesRes, jobsRes] = await Promise.all([
          resumesService.list(1, 100),
          jobsService.list(1, 100),
        ]);

        setResumes(resumesRes.items || []);
        setJobs(jobsRes.items || []);

        // If resumeId is not set, select the first available resume
        if (!urlResumeId && resumesRes.items && resumesRes.items.length > 0) {
          setSelectedResumeId(resumesRes.items[0].id);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load resumes and jobs");
      } finally {
        setIsLoadingInitial(false);
      }
    }

    loadData();
  }, [urlResumeId]);

  // 2. Fetch active resume detail when selectedResumeId changes
  React.useEffect(() => {
    if (!selectedResumeId) {
      setActiveResumeDetail(null);
      setReport(null);
      return;
    }

    async function fetchResumeAndReport() {
      try {
        setIsFetchingReport(true);
        setError(null);

        const [resumeDetail, latestReport] = await Promise.all([
          resumesService.getById(selectedResumeId),
          qualityService.getLatest(
            selectedResumeId,
            selectedJobId || undefined,
          ),
        ]);

        setActiveResumeDetail(resumeDetail);
        setReport(latestReport);
      } catch (err: any) {
        setError(err.message || "Failed to fetch quality report");
      } finally {
        setIsFetchingReport(false);
      }
    }

    fetchResumeAndReport();
  }, [selectedResumeId, selectedJobId]);

  // 3. Handler to run or refresh quality analysis
  const handleAnalyze = async (forceRefresh = false) => {
    if (!selectedResumeId) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const result = await qualityService.analyze(selectedResumeId, {
        jobId: selectedJobId || undefined,
        forceRefresh,
      });

      setReport(result);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 4. Handler for "Improve with AI" button on findings
  const handleImproveFinding = (finding: ResumeQualityFinding) => {
    if (!selectedResumeId) return;

    const validSections = [
      "summary",
      "experience",
      "projects",
      "achievements",
      "skills",
      "education",
      "certifications",
    ] as const;

    const targetSection = validSections.find((s) => s === finding.section) || "summary";
    const targetField = finding.field || "description";
    const evidenceText = finding.evidence || finding.description;

    // Try to find the actual value from resumeData if available
    let currentValue = evidenceText;
    let itemTitle = undefined;

    if (activeResumeDetail?.resumeData) {
      const data = activeResumeDetail.resumeData;
      if (targetSection === "summary" && data.summary) {
        currentValue = typeof data.summary === "string" ? data.summary : (data.summary as any).body || evidenceText;
      } else if (targetSection === "experience" && data.experience) {
        const item = data.experience.find((e) => e.id === finding.itemId);
        if (item) {
          const role = (item as any).jobTitle || (item as any).position || (item as any).title || "Role";
          itemTitle = `${role} at ${item.company}`;
          if (finding.field && (item as any)[finding.field]) {
            currentValue = String((item as any)[finding.field]);
          }
        }
      } else if (targetSection === "projects" && data.projects) {
        const item = data.projects.find((p) => p.id === finding.itemId);
        if (item) {
          itemTitle = item.name;
          if (finding.field && (item as any)[finding.field]) {
            currentValue = String((item as any)[finding.field]);
          }
        }
      }
    }

    setImproveModalState({
      open: true,
      section: targetSection,
      itemId: finding.itemId,
      field: targetField,
      currentValue,
      itemTitle,
    });
  };

  // When AI improvement is applied in Phase 9 modal
  const handleAppliedImprovement = async (newResumeData: ResumeData) => {
    if (!selectedResumeId) return;

    try {
      // Update the resume in the backend
      const updatedResume = await resumesService.update(selectedResumeId, {
        resumeData: newResumeData,
      });
      setActiveResumeDetail(updatedResume);

      // Re-analyze immediately with forceRefresh to produce updated score
      await handleAnalyze(true);
    } catch (err: any) {
      setError("Failed to save improved resume content: " + err.message);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Top Header & Context Description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Resume Quality & ATS Readiness
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Deterministic evaluation of parseability, structure, bullet
                quality, and content strength.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Resume Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Resume:
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => {
                setSelectedResumeId(e.target.value);
                router.push(`/quality?resumeId=${e.target.value}${selectedJobId ? `&jobId=${selectedJobId}` : ""}`);
              }}
              className="text-xs border border-border rounded-md px-3 py-1.5 bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              disabled={isLoadingInitial || resumes.length === 0}
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>

          {/* Job Selector (Optional) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Job:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                router.push(`/quality?resumeId=${selectedResumeId}${e.target.value ? `&jobId=${e.target.value}` : ""}`);
              }}
              className="text-xs border border-border rounded-md px-3 py-1.5 bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none max-w-[180px] truncate"
              disabled={isLoadingInitial}
            >
              <option value="">None (General Quality)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} {j.company ? `(${j.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Analyze / Refresh Button */}
          <Button
            onClick={() => handleAnalyze(true)}
            disabled={isAnalyzing || !selectedResumeId}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-8 px-3 shadow-sm"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Analyzing...
              </>
            ) : report ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Re-analyze
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Analyze Quality
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* Initial Loading State */}
      {isLoadingInitial ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading your resume profiles...
          </p>
        </div>
      ) : resumes.length === 0 ? (
        /* Empty State: No Resumes */
        <Card className="p-12 text-center border-dashed border-border bg-muted/10">
          <CardContent className="space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <h3 className="text-base font-bold text-foreground">
              No Resumes Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You need to create or import a resume before running the Resume
              Quality & ATS Readiness analysis.
            </p>
            <Button
              onClick={() => router.push("/resumes")}
              className="mt-2 bg-primary text-white text-xs"
            >
              Go to My Resumes &rarr;
            </Button>
          </CardContent>
        </Card>
      ) : isFetchingReport || isAnalyzing ? (
        /* Analyzing Animation State */
        <Card className="p-12 border border-indigo-100 bg-indigo-50/20 text-center">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <ShieldCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Analyzing Resume Quality & ATS Readiness
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Evaluating section parseability, bullet action-verbs, contact
                syntax, and quantifiable evidence with zero hallucinations...
              </p>
            </div>
            <div className="space-y-1.5 text-[11px] text-muted-foreground pt-2">
              <div className="flex items-center justify-center gap-1.5 text-indigo-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Deterministic checks running
              </div>
            </div>
          </CardContent>
        </Card>
      ) : !report || typeof report.overallScore !== "number" || !report.categories ? (
        /* Prompt to Run First Analysis */
        <Card className="p-12 text-center border-border bg-white shadow-sm">
          <CardContent className="space-y-4 max-w-md mx-auto">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full w-fit mx-auto">
              <FileSearch className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                No Quality Analysis Yet
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Run an instant Resume Quality & ATS Readiness evaluation on{" "}
                <strong>{activeResumeDetail?.title || "this resume"}</strong> to
                inspect parseability, formatting risks, bullet strength, and
                keyword alignment.
              </p>
            </div>
            <Button
              onClick={() => handleAnalyze(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Run Quality Analysis Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Complete Quality Dashboard View */
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Top Score Hero Card */}
          <QualityScoreCard
            report={report}
            onReanalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />

          {/* 8 Category Breakdown Grid */}
          <CategoryGrid
            categories={report.categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Findings List & Strengths */}
          <FindingsList
            findings={report.findings}
            strengths={report.strengths}
            selectedCategory={selectedCategory}
            onClearCategoryFilter={() => setSelectedCategory(null)}
            onImprove={handleImproveFinding}
          />
        </div>
      )}

      {/* Phase 9 InlineImproveModal Integration */}
      {selectedResumeId && (
        <InlineImproveModal
          open={improveModalState.open}
          onOpenChange={(open) =>
            setImproveModalState((prev) => ({ ...prev, open }))
          }
          resumeId={selectedResumeId}
          section={improveModalState.section}
          itemId={improveModalState.itemId}
          field={improveModalState.field}
          currentValue={improveModalState.currentValue}
          itemTitle={improveModalState.itemTitle}
          onApplied={handleAppliedImprovement}
        />
      )}
    </div>
  );
}
