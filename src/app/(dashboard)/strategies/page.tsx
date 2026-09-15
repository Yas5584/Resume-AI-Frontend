"use client";

import * as React from "react";
import {
  strategiesService,
  StrategyListItem,
} from "../../../services/strategies.service";
import { StrategyDashboard } from "../../../features/strategies/strategy-dashboard";
import { StrategyCreateModal } from "../../../features/strategies/strategy-create-modal";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Compass,
  Plus,
  Loader2,
  Clock,
  Briefcase,
  FileText,
  AlertTriangle,
  ChevronRight,
  Target,
} from "lucide-react";

export default function StrategiesPage() {
  const [strategies, setStrategies] = React.useState<StrategyListItem[]>([]);
  const [selectedStrategy, setSelectedStrategy] =
    React.useState<StrategyListItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await strategiesService.list();
      setStrategies(res.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to load tailoring strategies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStrategy = async (item: StrategyListItem) => {
    try {
      setIsLoading(true);
      const detailed = await strategiesService.getById(item.id);
      setSelectedStrategy(detailed);
    } catch (err: any) {
      alert(err.message || "Failed to load strategy details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrategyCreated = (newStrategy: StrategyListItem) => {
    setStrategies((prev) => [newStrategy, ...prev]);
    setSelectedStrategy(newStrategy);
  };

  const handleStrategyUpdated = (updated: StrategyListItem) => {
    setSelectedStrategy(updated);
    setStrategies((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
  };

  const handleStrategyDeleted = (id: string) => {
    setSelectedStrategy(null);
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {selectedStrategy ? (
        <StrategyDashboard
          strategy={selectedStrategy}
          onBack={() => setSelectedStrategy(null)}
          onUpdated={handleStrategyUpdated}
          onDeleted={handleStrategyDeleted}
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Compass className="w-6 h-6 text-primary" />
                Resume Strategy & Tailoring Engine
              </h1>
              <p className="text-sm text-muted-foreground">
                Structured positioning plans that prioritize candidate strengths
                and protect factual integrity without inventing claims.
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Strategy Plan
            </Button>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading tailoring strategies...
              </p>
            </div>
          ) : strategies.length === 0 ? (
            <Card className="border-dashed py-12 text-center">
              <CardContent className="space-y-3">
                <Compass className="w-12 h-12 mx-auto text-muted-foreground/60" />
                <CardTitle className="text-lg">No Strategy Plans Yet</CardTitle>
                <CardDescription className="max-w-md mx-auto text-xs">
                  Generate your first resume tailoring plan to align your
                  authentic experience with target job description requirements.
                </CardDescription>
                <Button onClick={() => setIsModalOpen(true)} className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Strategy
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategies.map((strat) => (
                <Card
                  key={strat.id}
                  onClick={() => handleSelectStrategy(strat)}
                  className="cursor-pointer hover:border-primary/50 transition-all shadow-sm hover:shadow group"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            strat.status === "APPROVED"
                              ? "default"
                              : strat.status === "REVIEWED"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {strat.status}
                        </Badge>
                        {strat.isStale && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            Stale
                          </Badge>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-base font-semibold pt-1 line-clamp-1">
                      {strat.job?.title || "Target Role"}
                      {strat.job?.company ? ` • ${strat.job.company}` : ""}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {strat.resume?.title || "Resume"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-1">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {strat.strategyData?.overallApproach ||
                        "Tailoring strategy plan formulated."}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                      <span className="flex items-center gap-1 font-mono">
                        v{strat.strategyVersion}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(strat.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <StrategyCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreated={handleStrategyCreated}
      />
    </div>
  );
}
