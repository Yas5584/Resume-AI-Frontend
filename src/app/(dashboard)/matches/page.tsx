"use client";

import * as React from "react";
import {
  matchesService,
  MatchListItem,
  MatchDetailResponse,
} from "../../../services/matches.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Sparkles,
  Plus,
  ArrowRight,
  Trash2,
  FileText,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { MatchDashboard } from "../../../features/matches/match-dashboard";
import { MatchCreateModal } from "../../../features/matches/match-create-modal";

export default function MatchesPage() {
  const [matches, setMatches] = React.useState<MatchListItem[]>([]);
  const [selectedMatch, setSelectedMatch] =
    React.useState<MatchDetailResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchMatches = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await matchesService.list();
      setMatches(res.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load match analyses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleSelectMatch = async (id: string) => {
    try {
      setIsLoading(true);
      const detail = await matchesService.getById(id);
      setSelectedMatch(detail);
    } catch (err: any) {
      alert(err.message || "Failed to load match detail");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this match analysis?"))
      return;
    try {
      await matchesService.delete(id);
      setMatches((prev) => prev.filter((m) => m.id !== id));
      if (selectedMatch?.id === id) {
        setSelectedMatch(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete match");
    }
  };

  if (selectedMatch) {
    return (
      <div className="container max-w-6xl mx-auto py-6 px-4">
        <MatchDashboard
          match={selectedMatch}
          onBack={() => setSelectedMatch(null)}
          onUpdated={(updated) => {
            setSelectedMatch(updated);
            fetchMatches();
          }}
          onDeleted={(id) => {
            setSelectedMatch(null);
            setMatches((prev) => prev.filter((m) => m.id !== id));
          }}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Resume ↔ Job Matching
          </h1>
          <p className="text-sm text-muted-foreground">
            Deterministic, transparent match score and evidence breakdown
            between your resumes and target jobs.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Match Analysis
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Loading match analyses...
        </div>
      ) : matches.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No Match Analyses Yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Compare any of your resumes with an analyzed job description to
                see detailed skill overlap, tenure alignment, and prioritized
                recommendations.
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Match Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((item) => {
            const score = item.matchScore;
            const badgeVariant =
              score >= 85
                ? "default"
                : score >= 70
                  ? "secondary"
                  : "destructive";

            return (
              <div
                key={item.id}
                onClick={() => handleSelectMatch(item.id)}
                className="p-5 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground">
                          {item.resumeTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span className="text-foreground">{item.jobTitle}</span>
                        {item.jobCompany && <span>@ {item.jobCompany}</span>}
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-2xl font-bold text-foreground">
                          {score}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /100
                        </span>
                      </div>
                      <Badge
                        variant={badgeVariant}
                        className="text-[11px] py-0 px-2"
                      >
                        {score >= 85
                          ? "Strong Match"
                          : score >= 70
                            ? "Good Match"
                            : score >= 50
                              ? "Moderate"
                              : "Low Match"}
                      </Badge>
                    </div>
                  </div>

                  {item.isStale && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      <span>
                        Resume or job modified since match was calculated
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                  <span>
                    Version {item.scoreVersion} •{" "}
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDeleteItem(e, item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="flex items-center text-primary font-medium hover:underline">
                      View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MatchCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(match) => {
          setSelectedMatch(match);
          fetchMatches();
        }}
      />
    </div>
  );
}
