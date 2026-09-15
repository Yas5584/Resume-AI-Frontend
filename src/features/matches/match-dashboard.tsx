"use client";

import * as React from "react";
import Link from "next/link";
import {
  MatchDetailResponse,
  matchesService,
} from "../../services/matches.service";
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
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
  Briefcase,
  Search,
  GraduationCap,
  Award,
  Trash2,
  Info,
  Compass,
  Sparkles,
} from "lucide-react";
import { MatchSkillsBreakdown } from "./match-skills-breakdown";
import { MatchGapsCard } from "./match-gaps-card";
import { MatchRecommendations } from "./match-recommendations";
import { MatchEvidenceModal } from "./match-evidence-modal";
import { MatchedSkillItem, MatchedRequirementItem } from "@resumeai/shared";

interface MatchDashboardProps {
  match: MatchDetailResponse;
  onBack: () => void;
  onUpdated: (updated: MatchDetailResponse) => void;
  onDeleted: (id: string) => void;
}

export function MatchDashboard({
  match,
  onBack,
  onUpdated,
  onDeleted,
}: MatchDashboardProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "skills" | "requirements" | "gaps" | "recommendations"
  >("skills");
  const [selectedEvidenceItem, setSelectedEvidenceItem] = React.useState<
    MatchedSkillItem | MatchedRequirementItem | null
  >(null);

  const analysis = match.analysis;
  const score = match.matchScore;

  const scoreBadgeVariant =
    score >= 85 ? "default" : score >= 70 ? "secondary" : "destructive";

  const allSkills: MatchedSkillItem[] = React.useMemo(() => {
    return [
      ...(analysis.matchedSkills || []),
      ...(analysis.partialSkills || []),
      ...(analysis.missingSkills || []),
    ];
  }, [analysis]);

  const allRequirements: MatchedRequirementItem[] = React.useMemo(() => {
    return [
      ...(analysis.matchedRequirements || []),
      ...(analysis.missingRequirements || []),
    ];
  }, [analysis]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await matchesService.create(match.resumeId, match.jobId);
      onUpdated(res);
    } catch (err: any) {
      alert(err.message || "Failed to re-calculate match analysis");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this match analysis?"))
      return;
    try {
      setIsDeleting(true);
      await matchesService.delete(match.id);
      onDeleted(match.id);
    } catch (err: any) {
      alert(err.message || "Failed to delete match analysis");
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Matches
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span>{match.resume?.title || "Resume"}</span>
              <span className="text-muted-foreground font-normal">↔</span>
              <span>{match.job?.title || "Job Description"}</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              {match.job?.company ? `Company: ${match.job.company} • ` : ""}
              Score Version:{" "}
              <span className="font-mono">{match.scoreVersion}</span> •
              Calculated: {new Date(match.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/strategies">
            <Button size="sm" className="flex items-center gap-1">
              <Compass className="w-4 h-4 mr-1" />
              Tailoring Strategy
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Re-run Match
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stale Data Warning Banner */}
      {match.isStale && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-start justify-between gap-3 text-amber-900">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm">
                Match Analysis is Out of Date
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                The resume or job description has been modified since this match
                was computed. Click &quot;Re-run Match&quot; to refresh with the
                latest content.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 bg-white hover:bg-amber-100 text-amber-900 flex-shrink-0"
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            Re-run Match
          </Button>
        </div>
      )}

      {/* Overall Score Header Card */}
      <Card className="border-2 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Score circle / gauge */}
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-4 border-primary/20 bg-primary/5 flex-shrink-0">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    {score}
                  </div>
                  <div className="text-[11px] font-semibold uppercase text-muted-foreground">
                    Out of 100
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={scoreBadgeVariant}
                    className="text-sm font-semibold px-2.5 py-0.5"
                  >
                    {analysis.scoreLabel}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    engine {analysis.scoreVersion}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Resume Match Score
                </h2>
                <p className="text-xs text-muted-foreground max-w-xl">
                  Deterministic component breakdown based on technical skills,
                  experience tenure, core responsibilities, keywords, education,
                  and certifications.
                </p>
              </div>
            </div>

            {/* Strengths highlight card */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="w-full md:w-80 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs space-y-1.5 flex-shrink-0">
                <div className="font-semibold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Match Strengths:
                </div>
                <ul className="space-y-1 text-emerald-800">
                  {analysis.strengths.slice(0, 3).map((st, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{st.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Component Score Progress Bars Grid */}
          {analysis.requiredRequirementsMatch ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t">
              {/* Required Skills (40%) */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Req Skills
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.requiredRequirementsMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{
                      width: `${analysis.requiredRequirementsMatch.score}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight:{" "}
                  {Math.round(analysis.requiredRequirementsMatch.weight)}%
                </div>
              </div>

              {/* Preferred Skills (15%) */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Pref Skills
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.preferredSkillsMatch?.score ?? 0}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{
                      width: `${analysis.preferredSkillsMatch?.score ?? 0}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight:{" "}
                  {Math.round(analysis.preferredSkillsMatch?.weight ?? 15)}%
                </div>
              </div>

              {/* Experience (20%) */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Experience
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.experienceMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.experienceMatch.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.experienceMatch.weight)}%
                </div>
              </div>

              {/* Responsibilities (10%) */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Duties
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.responsibilityAlignment.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{
                      width: `${analysis.responsibilityAlignment.score}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.responsibilityAlignment.weight)}%
                </div>
              </div>

              {/* Keywords (5%) */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Search className="w-3 h-3" /> Keywords
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.keywordCoverage.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.keywordCoverage.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.keywordCoverage.weight)}%
                </div>
              </div>

              {/* Education (5%) */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Education
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.educationMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.educationMatch.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.educationMatch.weight)}%
                </div>
              </div>

              {/* Certifications (5%) */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Award className="w-3 h-3" /> Certs
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.certificationMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.certificationMatch.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.certificationMatch.weight)}%
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t">
              {/* Skills */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Skills
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.skillMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.skillMatch.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.skillMatch.weight)}%
                </div>
              </div>

              {/* Experience */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Experience
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.experienceMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.experienceMatch.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.experienceMatch.weight)}%
                </div>
              </div>

              {/* Responsibilities */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> Duties
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.responsibilityAlignment.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{
                      width: `${analysis.responsibilityAlignment.score}%`,
                    }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.responsibilityAlignment.weight)}%
                </div>
              </div>

              {/* Keywords */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Search className="w-3 h-3" /> Keywords
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.keywordCoverage.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.keywordCoverage.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.keywordCoverage.weight)}%
                </div>
              </div>

              {/* Education */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Education
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.educationMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.educationMatch.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.educationMatch.weight)}%
                </div>
              </div>

              {/* Certifications */}
              <div className="p-3 bg-muted/30 rounded-lg border space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground flex items-center gap-1">
                    <Award className="w-3 h-3" /> Certs
                  </span>
                  <span className="font-bold text-foreground">
                    {analysis.certificationMatch.score}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.certificationMatch.score}%` }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground text-right">
                  Weight: {Math.round(analysis.certificationMatch.weight)}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for detailed sections */}
      <div className="space-y-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("skills")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "skills"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Skills Breakdown ({allSkills.length})
          </button>
          <button
            onClick={() => setActiveTab("requirements")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "requirements"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Requirements ({allRequirements.length})
          </button>
          <button
            onClick={() => setActiveTab("gaps")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "gaps"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Identified Gaps ({(analysis.gaps || []).length})
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "recommendations"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Actionable Recommendations (
            {(analysis.recommendations || []).length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "skills" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Skill Overlap & Evidence
              </CardTitle>
              <CardDescription>
                Click any skill badge to inspect verbatim resume quotes and job
                requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchSkillsBreakdown
                skills={allSkills}
                onSelectItem={(item) => setSelectedEvidenceItem(item)}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "requirements" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Job Requirements Evaluation
              </CardTitle>
              <CardDescription>
                Requirements parsed from the job description and checked against
                your resume.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {allRequirements.map((req, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedEvidenceItem(req)}
                  className="p-3.5 rounded-lg border hover:bg-muted/40 cursor-pointer transition-colors flex items-start justify-between gap-3 text-sm"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="font-semibold text-foreground">
                      {req.requirement}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="capitalize font-medium">
                        {req.importance.toLowerCase()}
                      </span>
                      {req.relationship && req.relationship !== "OPTIONAL" && (
                        <Badge variant="outline" className="text-[10px]">
                          Logic: {req.relationship}
                        </Badge>
                      )}
                    </div>

                    {/* Verbatim Evidence / Status Note */}
                    {req.matchType === "MATCHED" &&
                      req.resumeEvidence &&
                      req.resumeEvidence.length > 0 && (
                        <div className="text-xs text-emerald-700 bg-emerald-50/50 p-2 rounded border border-emerald-200 mt-1">
                          <span className="font-semibold">
                            Candidate evidence:
                          </span>{" "}
                          {req.resumeEvidence[0]}
                        </div>
                      )}
                    {req.matchType === "PARTIAL" && (
                      <div className="text-xs text-amber-800 bg-amber-50/60 p-2 rounded border border-amber-200 mt-1">
                        <span className="font-semibold">Partial match:</span>{" "}
                        {req.reason ||
                          (req.resumeEvidence && req.resumeEvidence.length > 0
                            ? `Candidate evidence: ${req.resumeEvidence[0]}`
                            : "Partially aligns with candidate profile")}
                      </div>
                    )}
                    {req.matchType === "MISSING" && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                        <span className="font-semibold">Missing:</span>{" "}
                        {req.reason || "No supporting resume evidence found."}
                      </div>
                    )}
                    {req.matchType === "UNKNOWN" && (
                      <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded border mt-1">
                        Status unknown based on available resume data.
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant={
                        req.matchType === "MATCHED"
                          ? "default"
                          : req.matchType === "PARTIAL"
                            ? "secondary"
                            : req.matchType === "UNKNOWN"
                              ? "outline"
                              : "destructive"
                      }
                      className="text-xs font-semibold"
                    >
                      {req.matchType === "MATCHED" && "✓ MATCHED"}
                      {req.matchType === "PARTIAL" && "⚠ PARTIAL"}
                      {req.matchType === "MISSING" && "❌ MISSING"}
                      {req.matchType === "UNKNOWN" && "? UNKNOWN"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === "gaps" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prioritized Gaps</CardTitle>
              <CardDescription>
                Items from the job description not detected in your resume,
                organized by importance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchGapsCard gaps={analysis.gaps || []} />
            </CardContent>
          </Card>
        )}

        {activeTab === "recommendations" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Recommendations & Next Steps
              </CardTitle>
              <CardDescription>
                Analytical suggestions to align your resume more closely with
                this role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MatchRecommendations
                recommendations={analysis.recommendations || []}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disclaimers & Ethics */}
      <div className="p-4 bg-muted/40 border rounded-lg text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-foreground">
          <Info className="w-3.5 h-3.5" />
          Transparent Analysis Disclaimer
        </div>
        <p>
          • <strong>Deterministic Scoring:</strong> Match scores reflect keyword
          and requirement overlap calculated mathematically from job and resume
          text, not human hiring decisions or automated ATS screening
          thresholds.
        </p>
        <p>
          • <strong>Absence vs Lack:</strong> Items marked &quot;Not found in
          resume&quot; indicate absent text, not a verified absence of candidate
          competence.
        </p>
      </div>

      {/* Evidence Modal */}
      <MatchEvidenceModal
        item={selectedEvidenceItem}
        onClose={() => setSelectedEvidenceItem(null)}
      />
    </div>
  );
}
