"use client";

import * as React from "react";
import Link from "next/link";
import {
  ResumeSummary,
  resumesService,
} from "../../../services/resumes.service";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { EmptyState } from "../../../components/common/empty-state";
import {
  Plus,
  FileText,
  Copy,
  Trash2,
  Calendar,
  Briefcase,
  Loader2,
  ExternalLink,
} from "lucide-react";

export default function ResumesPage() {
  const [resumes, setResumes] = React.useState<ResumeSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [duplicatingId, setDuplicatingId] = React.useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ResumeSummary | null>(
    null,
  );
  const [deleting, setDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchResumes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resumesService.list();
      setResumes(res.items || []);
    } catch (err) {
      console.error("Failed to load resumes", err);
      setError("Failed to load resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDuplicate = async (id: string, currentTitle: string) => {
    setDuplicatingId(id);
    try {
      await resumesService.duplicate(id, `${currentTitle} (Copy)`);
      await fetchResumes();
    } catch (err) {
      console.error("Failed to duplicate resume", err);
      alert("Failed to duplicate resume. Please try again.");
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await resumesService.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchResumes();
    } catch (err) {
      console.error("Failed to delete resume", err);
      alert("Failed to delete resume. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            My Resumes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your master resumes and job-tailored variations.
          </p>
        </div>
        <Link href="/resumes/new">
          <Button size="md">
            <Plus className="h-4 w-4 mr-2" />
            Create Resume
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your resumes...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={fetchResumes}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && resumes.length === 0 && (
        <EmptyState
          title="No resumes found"
          description="Create your first master resume using our ATS-optimized builder."
          actionLabel="Create Resume"
          actionHref="/resumes/new"
        />
      )}

      {!loading && resumes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="p-5 sm:p-6 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between border border-border"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">
                    {resume.currentTemplateId || "Modern Standard"}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground text-base line-clamp-1">
                    {resume.title}
                  </h3>
                  {resume.targetRole ? (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Briefcase className="h-3 w-3 mr-1 text-muted-foreground/70" />
                      <span>{resume.targetRole}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      General Resume
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    Updated{" "}
                    {new Date(resume.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      title="Duplicate resume"
                      disabled={duplicatingId === resume.id}
                      onClick={() => handleDuplicate(resume.id, resume.title)}
                    >
                      {duplicatingId === resume.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      title="Delete resume"
                      onClick={() => setDeleteTarget(resume)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Link href={`/resumes/${resume.id}`}>
                    <Button size="sm" className="text-xs">
                      Open Editor
                      <ExternalLink className="h-3 w-3 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete Resume?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{deleteTarget?.title}&quot;?
            This action cannot be undone and will delete all saved versions and
            history for this resume.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Yes, Delete Resume"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
