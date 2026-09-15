"use client";

import * as React from "react";
import { JobDescriptionItem, jobsService } from "../../services/jobs.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Trash2,
  FileText,
  AlertCircle,
  Quote,
  GraduationCap,
  Award,
  Layers,
  Code2,
  Check,
} from "lucide-react";

interface JobDetailProps {
  job: JobDescriptionItem;
  onBack: () => void;
  onUpdated: (job: JobDescriptionItem) => void;
  onDeleted: (id: string) => void;
}

interface EvidenceModalData {
  title: string;
  category: string;
  evidence: string;
  confidence?: number;
  importance?: string;
  frequency?: number;
}

export function JobDetail({
  job,
  onBack,
  onUpdated,
  onDeleted,
}: JobDetailProps) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showRawText, setShowRawText] = React.useState(false);
  const [evidenceModal, setEvidenceModal] =
    React.useState<EvidenceModalData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const analysis = job.parsedData;

  const handleReanalyze = async () => {
    try {
      setIsAnalyzing(true);
      const updated = await jobsService.analyze(job.id);
      onUpdated(updated);
    } catch (err: any) {
      alert(err.message || "Failed to re-analyze job description");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await jobsService.delete(job.id);
      onDeleted(job.id);
    } catch (err: any) {
      alert(err.message || "Failed to delete job description");
      setIsDeleting(false);
    }
  };

  // Group keywords by category
  const groupedKeywords = React.useMemo(() => {
    if (!analysis?.keywords) return {};
    const groups: Record<string, typeof analysis.keywords> = {};
    for (const kw of analysis.keywords) {
      const cat = kw.category || "TECHNICAL";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(kw);
    }
    return groups;
  }, [analysis]);

  // Separate required vs preferred skills
  const requiredSkills = React.useMemo(() => {
    return (analysis?.skills || []).filter((s) => s.importance === "REQUIRED");
  }, [analysis]);

  const preferredSkills = React.useMemo(() => {
    return (analysis?.skills || []).filter((s) => s.importance !== "REQUIRED");
  }, [analysis]);

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="w-fit gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRawText(true)}
            className="gap-1.5"
          >
            <FileText className="h-4 w-4" />
            View Raw Text
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReanalyze}
            isLoading={isAnalyzing}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            Re-Analyze
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {job.title}
              </h1>
              {analysis?.seniority && analysis.seniority !== "UNKNOWN" && (
                <Badge variant="secondary" className="font-semibold">
                  {analysis.seniority.replace(/_/g, " ")}
                </Badge>
              )}
              <Badge
                variant={
                  job.status === "COMPLETED"
                    ? "success"
                    : job.status === "ANALYZING"
                      ? "default"
                      : "destructive"
                }
              >
                {job.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-muted-foreground/70" />
                <span>{job.company || "Company not specified"}</span>
              </div>
              {analysis?.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-muted-foreground/70" />
                  <span>{analysis.location}</span>
                </div>
              )}
              {analysis?.workArrangement &&
                analysis.workArrangement !== "UNKNOWN" && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-muted-foreground/70" />
                    <span>{analysis.workArrangement}</span>
                  </div>
                )}
              {analysis?.industry && (
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-muted-foreground/70" />
                  <span>{analysis.industry}</span>
                </div>
              )}
            </div>
          </div>

          {job.resume && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3.5 py-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <div>
                <p className="font-medium text-foreground">Linked Resume</p>
                <p className="text-muted-foreground">{job.resume.title}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Role Summary */}
      {analysis?.summary && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3>Role Summary</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {analysis.summary}
          </p>
        </Card>
      )}

      {/* Grid: Required Skills vs Preferred Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Required Skills */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Check className="h-4 w-4 text-emerald-600" />
              <h3>Required Skills</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {requiredSkills.length} required
            </span>
          </div>

          {requiredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {requiredSkills.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setEvidenceModal({
                      title: skill.normalizedName,
                      category: "Required Skill",
                      evidence: skill.evidence || skill.name,
                      confidence: skill.confidence,
                      importance: skill.importance,
                    })
                  }
                  className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <span>{skill.normalizedName}</span>
                  <Quote className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No mandatory skills explicitly required.
            </p>
          )}
        </Card>

        {/* Preferred Skills */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h3>Preferred & Bonus Skills</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {preferredSkills.length} preferred
            </span>
          </div>

          {preferredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preferredSkills.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setEvidenceModal({
                      title: skill.normalizedName,
                      category: "Preferred Skill",
                      evidence: skill.evidence || skill.name,
                      confidence: skill.confidence,
                      importance: skill.importance,
                    })
                  }
                  className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <span>{skill.normalizedName}</span>
                  <Quote className="h-3 w-3 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No preferred or bonus skills stated.
            </p>
          )}
        </Card>
      </div>

      {/* Core Responsibilities */}
      {analysis?.responsibilities && analysis.responsibilities.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Briefcase className="h-4 w-4 text-primary" />
            <h3>Core Responsibilities</h3>
          </div>
          <ul className="space-y-2.5">
            {analysis.responsibilities.map((resp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-muted-foreground group"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="flex-1">{resp.text}</span>
                {resp.evidence && resp.evidence !== resp.text && (
                  <button
                    onClick={() =>
                      setEvidenceModal({
                        title: "Responsibility Evidence",
                        category: "Responsibility",
                        evidence: resp.evidence,
                        confidence: resp.confidence,
                      })
                    }
                    className="opacity-0 group-hover:opacity-100 text-xs text-primary underline ml-2 transition-opacity"
                  >
                    View Source Quote
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Experience, Education & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experience Requirements */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <h3>Experience Requirements</h3>
          </div>
          {analysis?.experience && analysis.experience.length > 0 ? (
            <div className="space-y-3">
              {analysis.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span>
                      {exp.yearsMin !== null
                        ? `${exp.yearsMin}+ Years`
                        : "Experience"}
                      {exp.domain ? ` in ${exp.domain}` : ""}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {exp.importance}
                    </Badge>
                  </div>
                  {exp.management && (
                    <p className="text-xs text-primary font-medium">
                      Includes team leadership / management
                    </p>
                  )}
                  {exp.evidence && (
                    <p className="text-xs text-muted-foreground italic">
                      &quot;{exp.evidence}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No specific minimum years of experience stated.
            </p>
          )}
        </Card>

        {/* Education & Certifications */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h3>Education & Certifications</h3>
          </div>

          <div className="space-y-3">
            {analysis?.education && analysis.education.length > 0 ? (
              analysis.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                    <span>
                      {edu.degree || "Degree"}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {edu.preferred ? "Preferred" : "Required"}
                    </Badge>
                  </div>
                  {edu.evidence && (
                    <p className="text-xs text-muted-foreground italic">
                      &quot;{edu.evidence}&quot;
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No formal degree requirements specified.
              </p>
            )}

            {analysis?.certifications && analysis.certifications.length > 0 && (
              <div className="pt-2 border-t border-border/60">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Certifications:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.certifications.map((cert, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      <Award className="h-3 w-3" />
                      {cert.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Grouped ATS Keywords */}
      {analysis?.keywords && analysis.keywords.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Code2 className="h-4 w-4 text-primary" />
              <h3>ATS Keywords & Terminology</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {analysis.keywords.length} keywords identified
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(groupedKeywords).map(([cat, kws]) => (
              <div key={cat} className="space-y-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat.replace(/_/g, " ")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {kws.map((kw, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setEvidenceModal({
                          title: kw.keyword,
                          category: cat,
                          evidence: kw.evidence || kw.keyword,
                          confidence: kw.confidence,
                          importance: kw.importance,
                          frequency: kw.frequency,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <span className="font-medium text-foreground">
                        {kw.keyword}
                      </span>
                      {kw.frequency > 1 && (
                        <span className="rounded bg-muted px-1 text-[10px] font-semibold text-muted-foreground">
                          ×{kw.frequency}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Evidence Inspection Modal */}
      {evidenceModal && (
        <Dialog
          open={Boolean(evidenceModal)}
          onOpenChange={() => setEvidenceModal(null)}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              Source Evidence: {evidenceModal.title}
            </DialogTitle>
            <DialogDescription>
              Exact verbatim quote and extracted classification from the job
              description.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{evidenceModal.category}</Badge>
              {evidenceModal.importance && (
                <Badge
                  variant={
                    evidenceModal.importance === "REQUIRED"
                      ? "default"
                      : "outline"
                  }
                >
                  {evidenceModal.importance}
                </Badge>
              )}
              {evidenceModal.frequency && (
                <Badge variant="outline">
                  Occurrences: {evidenceModal.frequency}
                </Badge>
              )}
              {evidenceModal.confidence !== undefined && (
                <Badge variant="outline">
                  Confidence: {Math.round(evidenceModal.confidence * 100)}%
                </Badge>
              )}
            </div>

            <div className="rounded-lg bg-muted/50 p-4 border border-border text-sm text-foreground italic">
              &quot;{evidenceModal.evidence}&quot;
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setEvidenceModal(null)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Raw Text Modal */}
      {showRawText && (
        <Dialog open={showRawText} onOpenChange={setShowRawText}>
          <DialogHeader>
            <DialogTitle>Original Job Description Text</DialogTitle>
            <DialogDescription>
              The unedited text provided for this job listing.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 text-xs font-mono whitespace-pre-wrap">
            {job.rawText}
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setShowRawText(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="h-5 w-5" />
              Delete Job Description?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{job.title}&quot;? This
              action cannot be undone. Linked resumes will not be affected.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}
