"use client";

import * as React from "react";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { EmptyState } from "../../../components/common/empty-state";
import { JobDetail } from "../../../features/jobs/job-detail";
import { JobIntake } from "../../../features/jobs/job-intake";
import {
  JobDescriptionItem,
  jobsService,
} from "../../../services/jobs.service";
import {
  Briefcase,
  Plus,
  Search,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<JobDescriptionItem[]>([]);
  const [selectedJob, setSelectedJob] =
    React.useState<JobDescriptionItem | null>(null);
  const [isIntakeOpen, setIsIntakeOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const fetchJobs = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await jobsService.list(1, 100);
      setJobs(res.items);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDeleteJob = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this job description?")) {
      try {
        await jobsService.delete(id);
        setJobs((prev) => prev.filter((j) => j.id !== id));
        if (selectedJob?.id === id) {
          setSelectedJob(null);
        }
      } catch (err: any) {
        alert(err.message || "Failed to delete job");
      }
    }
  };

  const filteredJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        (job.company && job.company.toLowerCase().includes(query)) ||
        (job.parsedData?.skills &&
          job.parsedData.skills.some((s) =>
            s.normalizedName.toLowerCase().includes(query),
          ));

      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  // If viewing a specific job analysis detail
  if (selectedJob) {
    return (
      <JobDetail
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
        onUpdated={(updated) => {
          setSelectedJob(updated);
          setJobs((prev) =>
            prev.map((j) => (j.id === updated.id ? updated : j)),
          );
        }}
        onDeleted={(id) => {
          setSelectedJob(null);
          setJobs((prev) => prev.filter((j) => j.id !== id));
        }}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Job Descriptions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze target job descriptions, extract verified requirements, and
            uncover ATS keywords.
          </p>
        </div>
        <Button
          size="md"
          onClick={() => setIsIntakeOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Job Description
        </Button>
      </div>

      {/* Filter and Search Bar */}
      {jobs.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border bg-background pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="ANALYZING">Analyzing</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-16 bg-muted/60 rounded" />
            </Card>
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        /* Job Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const analysis = job.parsedData;
            const skillCount = analysis?.skills?.length || 0;
            const keywordCount = analysis?.keywords?.length || 0;

            return (
              <Card
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="group relative cursor-pointer p-5 transition-all hover:border-primary hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </h2>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground/70" />
                        {job.company || "Company not specified"}
                      </p>
                    </div>

                    <Badge
                      variant={
                        job.status === "COMPLETED"
                          ? "success"
                          : job.status === "ANALYZING"
                            ? "default"
                            : "destructive"
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {job.status}
                    </Badge>
                  </div>

                  {/* Badges / Metrics */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {analysis?.seniority &&
                      analysis.seniority !== "UNKNOWN" && (
                        <Badge variant="outline" className="text-[10px]">
                          {analysis.seniority.replace(/_/g, " ")}
                        </Badge>
                      )}
                    {analysis?.workArrangement &&
                      analysis.workArrangement !== "UNKNOWN" && (
                        <Badge variant="secondary" className="text-[10px]">
                          {analysis.workArrangement}
                        </Badge>
                      )}
                    {skillCount > 0 && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                        {skillCount} skills
                      </span>
                    )}
                    {keywordCount > 0 && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Layers className="h-3 w-3 text-muted-foreground/70" />
                        {keywordCount} keywords
                      </span>
                    )}
                  </div>

                  {/* Summary preview */}
                  {analysis?.summary && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {analysis.summary}
                    </p>
                  )}
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between pt-4 mt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteJob(e, job.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Delete job"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-medium text-primary flex items-center group-hover:translate-x-0.5 transition-transform">
                      View Analysis
                      <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-8">
          <EmptyState
            icon={<Briefcase className="h-8 w-8" />}
            title={
              searchQuery
                ? "No matching job descriptions"
                : "No job descriptions tracked yet"
            }
            description={
              searchQuery
                ? "Try adjusting your search query or status filter."
                : "Paste or upload a target job listing to unlock ATS keyword extraction and requirement classification."
            }
            actionLabel="Add Target Job"
            onAction={() => setIsIntakeOpen(true)}
          />
        </Card>
      )}

      {/* Intake Modal */}
      <JobIntake
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onCreated={(newJob) => {
          setJobs((prev) => [newJob, ...prev]);
          setSelectedJob(newJob);
        }}
      />
    </div>
  );
}
