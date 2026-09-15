"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { resumesService } from "../../../../services/resumes.service";
import { ArrowLeft, Sparkles, Upload, FileEdit, Loader2 } from "lucide-react";

import { ImportResume } from "../../../../features/resumes/import-resume";

export default function NewResumePage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"scratch" | "upload" | null>(null);

  const [title, setTitle] = React.useState("");
  const [targetRole, setTargetRole] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || creating) return;

    setCreating(true);
    setError(null);

    try {
      const newResume = await resumesService.create({
        title: title.trim(),
        targetRole: targetRole.trim() || undefined,
        templateId: "modern-standard",
      });

      router.push(`/resumes/${newResume.id}`);
    } catch (err: any) {
      console.error("Failed to create resume", err);
      setError(err?.message || "Failed to create resume. Please try again.");
      setCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/resumes"
        className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5 mr-1" />
        Back to resumes
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Create New Resume
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose whether to build from scratch or upload an existing resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className={`p-6 cursor-pointer space-y-3 transition-colors ${
            mode === "scratch"
              ? "border-2 border-primary bg-primary/5"
              : "border border-border hover:border-primary/50"
          }`}
          onClick={() => setMode("scratch")}
        >
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FileEdit className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">
              Build from Scratch
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary text-white">
              Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Start with our guided ATS-optimized builder, structured sections,
            and live preview.
          </p>
        </Card>

        <Card
          className={`p-6 cursor-pointer space-y-3 transition-colors ${
            mode === "upload"
              ? "border-2 border-primary bg-primary/5"
              : "border border-border hover:border-primary/50"
          }`}
          onClick={() => setMode("upload")}
        >
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
            <Upload className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Upload PDF / DOCX</h3>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary text-white">
              Ready
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Extract and parse your existing resume directly into structured
            data.
          </p>
        </Card>
      </div>

      {mode === "scratch" && (
        <form onSubmit={handleCreate}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resume Details</CardTitle>
              <CardDescription>
                Name your resume to keep your versions and job applications
                organized.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-xs">
                  {error}
                </div>
              )}
              <Input
                label="Resume Title *"
                placeholder="e.g. Senior Frontend Engineer — Fintech"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={creating}
                required
                autoFocus
              />
              <Input
                label="Target Job Role (Optional)"
                placeholder="e.g. Senior Staff Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={creating}
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                disabled={creating}
                onClick={() => setMode(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!title.trim() || creating}>
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Continue to Editor
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

      {mode === "upload" && <ImportResume onCancel={() => setMode(null)} />}
    </div>
  );
}
