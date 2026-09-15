"use client";

import * as React from "react";
import {
  StrategyListItem,
  strategiesService,
} from "../../services/strategies.service";
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
  ArrowLeft,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Ban,
  Compass,
  FileText,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  Clock,
  Target,
} from "lucide-react";
import { StrategyApprovalStatus } from "@resumeai/shared";

interface StrategyDashboardProps {
  strategy: StrategyListItem;
  onBack: () => void;
  onUpdated: (updated: StrategyListItem) => void;
  onDeleted: (id: string) => void;
}

export function StrategyDashboard({
  strategy,
  onBack,
  onUpdated,
  onDeleted,
}: StrategyDashboardProps) {
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "sections" | "skills" | "experience" | "gaps" | "governance"
  >("sections");

  const data = strategy.strategyData;
  const status = strategy.status;

  const handleStatusChange = async (newStatus: StrategyApprovalStatus) => {
    try {
      setIsUpdatingStatus(true);
      const res = await strategiesService.updateStatus(strategy.id, newStatus);
      onUpdated(res);
    } catch (err: any) {
      alert(err.message || "Failed to update strategy approval status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      const res = await strategiesService.regenerate(strategy.id);
      onUpdated(res);
    } catch (err: any) {
      alert(err.message || "Failed to regenerate strategy");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tailoring strategy?"))
      return;
    try {
      setIsDeleting(true);
      await strategiesService.delete(strategy.id);
      onDeleted(strategy.id);
    } catch (err: any) {
      alert(err.message || "Failed to delete strategy");
    } finally {
      setIsDeleting(false);
    }
  };

  // Action badge color helper
  const getActionBadge = (action?: string) => {
    if (!action) return null;
    switch (action) {
      case "EMPHASIZE":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            EMPHASIZE
          </Badge>
        );
      case "MAINTAIN":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            MAINTAIN
          </Badge>
        );
      case "CONDENSE":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            CONDENSE
          </Badge>
        );
      case "REORDER":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">
            REORDER
          </Badge>
        );
      case "OPTIONAL":
        return (
          <Badge className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20">
            OPTIONAL
          </Badge>
        );
      case "OMIT_IF_EMPTY":
        return (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            OMIT IF EMPTY
          </Badge>
        );
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Strategies
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
              v{data.strategyVersion || "1"}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(strategy.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Approval Status Selector */}
          <div className="flex items-center rounded-lg border bg-card p-1 shadow-sm">
            {(
              ["DRAFT", "REVIEWED", "APPROVED"] as StrategyApprovalStatus[]
            ).map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={isUpdatingStatus}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  status === s
                    ? s === "APPROVED"
                      ? "bg-emerald-600 text-white shadow"
                      : s === "REVIEWED"
                        ? "bg-blue-600 text-white shadow"
                        : "bg-muted-foreground text-white shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            title="Regenerate strategy plan"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`}
            />
            Regenerate
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete strategy"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stale Warning Banner */}
      {strategy.isStale && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Strategy Out of Date
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                The candidate resume, job description, or match analysis has
                been updated since this strategy was formulated.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-500/40 text-amber-900 dark:text-amber-100 hover:bg-amber-500/20"
            onClick={handleRegenerate}
            disabled={isRegenerating}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-2 ${isRegenerating ? "animate-spin" : ""}`}
            />
            Refresh Strategy
          </Button>
        </div>
      )}

      {/* Hero Overview Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">
                Strategic Positioning & Tailoring Approach
              </CardTitle>
            </div>
            {status === "APPROVED" && (
              <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Human Approved
              </Badge>
            )}
          </div>
          <CardDescription>
            Targeted alignment plan between candidate background and job
            requirements. Strictly planning only (no copy generation).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-background/80 border text-sm font-medium leading-relaxed space-y-2">
            {data.overview?.objective && (
              <div className="pb-2 border-b border-border/50">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-0.5">
                  Strategic Objective
                </span>
                <p className="text-sm font-medium text-foreground">
                  {data.overview.objective}
                </p>
              </div>
            )}
            <div>
              {data.overview?.objective && (
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-0.5">
                  Tailoring Approach
                </span>
              )}
              <p className="text-foreground">{data.overallApproach}</p>
            </div>
            {data.overview?.prioritySummary && (
              <div className="pt-2 border-t border-border/50">
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-0.5">
                  Priority Focus
                </span>
                <p className="text-xs text-muted-foreground">
                  {data.overview.prioritySummary}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-3 rounded-lg border bg-card/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5" />
                Target Resume
              </span>
              <p className="font-semibold text-sm truncate">
                {strategy.resume?.title || "Untitled Resume"}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-card/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                Target Position
              </span>
              <p className="font-semibold text-sm truncate">
                {strategy.job?.title || "Untitled Role"}
                {strategy.job?.company ? ` • ${strategy.job.company}` : ""}
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-card/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Target className="w-3.5 h-3.5" />
                Match Alignment Score
              </span>
              <p className="font-semibold text-sm">
                {strategy.match?.matchScore
                  ? `${Math.round(strategy.match.matchScore)}% Matched`
                  : "Pre-computed"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("sections")}
          className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "sections"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Section Priorities ({data.sectionStrategies?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "skills"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Skills Strategy
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "experience"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Experience & Projects
        </button>
        <button
          onClick={() => setActiveTab("gaps")}
          className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "gaps"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Gap Advisory ({data.gapStrategy?.gaps?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("governance")}
          className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "governance"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Fact Protection & Guardrails
        </button>
      </div>

      {/* TAB 1: SECTION PRIORITIES */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Recommended visual weight, order, and density for each resume
            section based on job alignment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.sectionStrategies || [])
              .slice()
              .sort((a, b) => {
                const getPriorityNum = (p: any): number => {
                  if (typeof p === "number") return p;
                  const map: Record<string, number> = {
                    HIGH: 1,
                    MEDIUM: 2,
                    LOW: 3,
                    OPTIONAL: 4,
                    NONE: 5,
                  };
                  return map[p] ?? 99;
                };
                return getPriorityNum(a.priority) - getPriorityNum(b.priority);
              })
              .map((sec, idx) => (
                <Card key={sec.section + idx} className="border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          Priority {sec.priority}
                        </Badge>
                        <span className="font-semibold text-base capitalize">
                          {sec.section}
                        </span>
                      </div>
                      {getActionBadge(sec.action)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {sec.reason}
                    </p>
                    {sec.evidence && sec.evidence.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {sec.evidence.map((ev, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded bg-muted/80 text-muted-foreground"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: SKILLS STRATEGY */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          {/* Missing Skills Warning Card (Invariant: DO NOT CLAIM) */}
          {data.skillStrategy?.missing &&
            data.skillStrategy.missing.length > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Ban className="w-5 h-5 text-amber-600" />
                    <CardTitle className="text-base text-amber-900 dark:text-amber-200">
                      Missing Job Skills — Strict &quot;Do Not Claim&quot;
                      Invariant
                    </CardTitle>
                  </div>
                  <CardDescription className="text-amber-800 dark:text-amber-300 text-xs">
                    These skills are required or preferred by the job but are
                    not evidenced in the candidate&apos;s resume. Under no
                    circumstances should these skills be fabricated or added
                    without genuine verification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.skillStrategy.missing.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-amber-500/20 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {item.skill}
                            </span>
                            <Badge
                              variant="destructive"
                              className="text-[10px] px-1.5 py-0 uppercase"
                            >
                              DO NOT CLAIM
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.reason}
                          </p>
                          {item.advisoryNote && (
                            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 italic">
                              Advisory: {item.advisoryNote}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Emphasize Skills */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-emerald-600">
              <Sparkles className="w-4 h-4" />
              Skills to Emphasize (Verified in Resume & Job)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(data.skillStrategy?.emphasize || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border bg-card text-sm space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {item.skill}
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 text-xs">
                      EMPHASIZE
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Maintain Skills */}
          {data.skillStrategy?.maintain &&
            data.skillStrategy.maintain.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-600">
                  <Layers className="w-4 h-4" />
                  Skills to Maintain (Technical Breadth)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.skillStrategy.maintain.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-card text-sm space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">
                          {item.skill}
                        </span>
                        <Badge className="bg-blue-500/10 text-blue-600 text-xs">
                          MAINTAIN
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* TAB 3: EXPERIENCE & PROJECTS */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Experience Strategic Positioning
            </h3>
            <div className="space-y-3">
              {(data.experienceStrategy?.items || []).map((exp, idx) => (
                <Card key={idx} className="border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">
                          {exp.jobTitle || "Role"}{" "}
                          {exp.company ? `@ ${exp.company}` : ""}
                        </CardTitle>
                        <CardDescription className="text-xs font-mono">
                          ID: {exp.experienceId} • Priority {exp.priority}
                        </CardDescription>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {exp.actions.map((act, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {act.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {exp.reason}
                    </p>
                    {exp.evidence && exp.evidence.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {exp.evidence.map((ev, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {ev}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {data.projectStrategy?.items &&
            data.projectStrategy.items.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Project Strategic Positioning
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.projectStrategy.items.map((proj, idx) => (
                    <Card key={idx} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold">
                            {proj.projectName || "Project"}
                          </CardTitle>
                          {getActionBadge(proj.action)}
                        </div>
                        <CardDescription className="text-xs">
                          Priority {proj.priority}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {proj.reason}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* TAB 4: GAPS */}
      {activeTab === "gaps" && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Target requirements where candidate resume currently lacks evidence.
            Action recommendations adhere strictly to ethical, fact-preserving
            standards.
          </p>
          <div className="space-y-3">
            {(data.gapStrategy?.gaps || []).map((gap, idx) => (
              <Card key={idx} className="border border-border/80">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {gap.requirement}
                    </CardTitle>
                    <Badge variant="destructive" className="text-xs">
                      {gap.recommendation}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs capitalize font-mono">
                    {gap.classification.replace(/_/g, " ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">{gap.reason}</p>
                  {gap.advisoryTip && (
                    <div className="p-2.5 rounded bg-muted/60 text-xs text-foreground/90 border flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{gap.advisoryTip}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GOVERNANCE & FACT PROTECTION */}
      {activeTab === "governance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preservation Rules */}
          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base">
                  Active Preservation Rules
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Inviolable candidate facts that must never be altered,
                fabricated, or omitted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(data.preservationRules || []).map((rule, idx) => (
                  <li
                    key={idx}
                    className="text-xs p-2.5 rounded-lg border bg-muted/30 space-y-0.5"
                  >
                    <span className="font-mono font-semibold text-foreground block">
                      {rule.rule}
                    </span>
                    <span className="text-muted-foreground">
                      {rule.description}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Changes */}
          <Card className="border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-destructive" />
                <CardTitle className="text-base">Prohibited Changes</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Hard anti-hallucination barriers preventing AI exaggeration or
                fabrication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(data.prohibitedChanges || []).map((rule, idx) => (
                  <li
                    key={idx}
                    className="text-xs p-2.5 rounded-lg border bg-muted/30 space-y-0.5"
                  >
                    <span className="font-mono font-semibold text-destructive block">
                      {rule.rule}
                    </span>
                    <span className="text-muted-foreground">{rule.reason}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Risk Flags Card */}
          {(data.riskFlags?.length || 0) > 0 && (
            <Card className="border md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-base">
                    Identified Risk Flags
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Pre-writing risk alerts identifying potential overclaim or
                  missing evidence boundaries.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.riskFlags?.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-amber-500/5 border-amber-500/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
                          {risk.type.replace(/_/g, " ")}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase"
                        >
                          {risk.severity} Severity
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {risk.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Protected Facts Card */}
          {(data.protectedFacts?.length || 0) > 0 && (
            <Card className="border md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">
                    Immutable Protected Facts
                  </CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Verified source information passed forward to Phase 9 that the
                  writing agent is prohibited from altering.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.protectedFacts?.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-muted/20 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {fact.field}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-primary">
                        {fact.value}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {fact.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Separation of Concerns Callout */}
      <div className="p-3 rounded-lg border bg-muted/40 text-xs text-muted-foreground flex items-center gap-2">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong>Phase 8 Policy Notice:</strong> This strategy engine
          formulates tailoring angles and section priorities. Final resume
          bullet rewriting, summary generation, and copy synthesis occur
          strictly in Phase 9.
        </span>
      </div>
    </div>
  );
}
