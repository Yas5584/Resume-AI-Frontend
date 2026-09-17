"use client";

import * as React from "react";
import Link from "next/link";
import {
  ResumeDetail,
  resumesService,
} from "../../../../services/resumes.service";
import { ResumeEditor } from "../../../../features/resumes/resume-editor";
import { Button } from "../../../../components/ui/button";
import { useAppShell } from "../../../../components/layout/app-shell";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function ResumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  const { setFullWidth } = useAppShell();

  // Enable full-width layout for the editor; restore on unmount
  React.useEffect(() => {
    setFullWidth(true);
    return () => setFullWidth(false);
  }, [setFullWidth]);

  const [resume, setResume] = React.useState<ResumeDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchResume = React.useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await resumesService.getById(id);
      setResume(data);
    } catch (err: any) {
      console.error("Failed to fetch resume", err);
      setError(
        err?.statusCode === 404
          ? "Resume not found or you don't have permission to access it."
          : "An unexpected error occurred while loading the resume.",
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="h-9 w-9 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading your resume editor...
        </p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 rounded-lg border border-border bg-card shadow-sm">
        <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Unable to Open Resume
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error || "The requested resume could not be retrieved."}
        </p>
        <div className="pt-2 flex justify-center space-x-3">
          <Link href="/resumes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back to Resumes
            </Button>
          </Link>
          <Button size="sm" onClick={fetchResume}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <ResumeEditor initialResume={resume} />;
}
