"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FileUpload } from "../../components/resumes/file-upload";
import { resumesService } from "../../services/resumes.service";
import { Loader2, CheckCircle, AlertCircle, Upload } from "lucide-react";

interface ImportResumeProps {
  onCancel: () => void;
}

export function ImportResume({ onCancel }: ImportResumeProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");

  const [status, setStatus] = useState<
    | "idle"
    | "uploading"
    | "extracting"
    | "parsing"
    | "creating"
    | "success"
    | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const [importResult, setImportResult] = useState<any>(null);

  const isProcessing = [
    "uploading",
    "extracting",
    "parsing",
    "creating",
  ].includes(status);

  // Fake progress sequence for better UX since API does it all at once
  useEffect(() => {
    if (status === "uploading") {
      const timers = [
        setTimeout(() => setStatus("extracting"), 1500),
        setTimeout(() => setStatus("parsing"), 3500),
        setTimeout(() => setStatus("creating"), 6000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [status]);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
    // Auto-fill title from filename if empty
    if (!title) {
      const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileNameWithoutExt);
    }
    setError(null);
  };

  const handleFileRemoved = () => {
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim() || isProcessing) return;

    setStatus("uploading");
    setError(null);

    try {
      const result = await resumesService.importResume(
        file,
        title.trim(),
        targetRole.trim() || undefined,
      );

      setImportResult(result);
      setStatus("success");

      // Give user time to see detected summary, then navigate
      setTimeout(() => {
        router.push(`/resumes/${result.resume.id}`);
      }, 3500);
    } catch (err: any) {
      console.error("Failed to import resume", err);
      setStatus("error");
      setError(err?.message || "Failed to process resume. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload Existing Resume</CardTitle>
          <CardDescription>
            We will automatically extract your information and structure it into
            a new resume.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Import Failed</p>
                <p className="text-xs mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Resume File *
            </label>
            <FileUpload
              selectedFile={file}
              onFileSelected={handleFileSelected}
              onFileRemoved={handleFileRemoved}
              disabled={isProcessing || status === "success"}
            />
          </div>

          <Input
            label="Resume Title *"
            placeholder="e.g. Software Engineer 2024"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isProcessing || status === "success"}
            required
          />
          <Input
            label="Target Job Role (Optional)"
            placeholder="e.g. Senior Frontend Engineer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            disabled={isProcessing || status === "success"}
          />

          {isProcessing && (
            <div className="pt-4 pb-2">
              <div className="space-y-3">
                <ProgressStep
                  label="Uploading document..."
                  isActive={status === "uploading"}
                  isCompleted={[
                    "extracting",
                    "parsing",
                    "creating",
                    "success",
                  ].includes(status)}
                />
                <ProgressStep
                  label="Extracting text..."
                  isActive={status === "extracting"}
                  isCompleted={["parsing", "creating", "success"].includes(
                    status,
                  )}
                />
                <ProgressStep
                  label="AI parsing & structuring..."
                  isActive={status === "parsing"}
                  isCompleted={["creating", "success"].includes(status)}
                />
                <ProgressStep
                  label="Creating resume..."
                  isActive={status === "creating"}
                  isCompleted={["success"].includes(status)}
                />
              </div>
            </div>
          )}

          {status === "success" && importResult && (
            <div className="pt-2 space-y-4">
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                <div className="flex items-center space-x-2 text-primary font-semibold">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>Resume Detected & Imported Successfully</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center pt-2">
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Pages</p>
                    <p className="text-base font-bold text-foreground">
                      {importResult.importMetadata?.actualPageCount ||
                        importResult.importMetadata?.pageCount ||
                        1}
                    </p>
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Experience</p>
                    <p className="text-base font-bold text-foreground">
                      {importResult.importMetadata?.detectedCounts
                        ?.experience ??
                        (importResult.resume?.resumeData?.experience?.length ||
                          0)}
                    </p>
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Projects</p>
                    <p className="text-base font-bold text-foreground">
                      {importResult.importMetadata?.detectedCounts?.projects ??
                        (importResult.resume?.resumeData?.projects?.length ||
                          0)}
                    </p>
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Skills</p>
                    <p className="text-base font-bold text-foreground">
                      {importResult.importMetadata?.detectedCounts?.skills ?? 0}
                    </p>
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Education</p>
                    <p className="text-base font-bold text-foreground">
                      {importResult.importMetadata?.detectedCounts?.education ??
                        (importResult.resume?.resumeData?.education?.length ||
                          0)}
                    </p>
                  </div>
                  <div className="p-2 bg-background rounded border">
                    <p className="text-xs text-muted-foreground">Certs</p>
                    <p className="text-base font-bold text-foreground">
                      {importResult.importMetadata?.detectedCounts
                        ?.certifications ??
                        (importResult.resume?.resumeData?.certifications
                          ?.length ||
                          0)}
                    </p>
                  </div>
                </div>

                {importResult.importMetadata?.warnings &&
                  importResult.importMetadata.warnings.length > 0 && (
                    <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">
                          Some content may require review in the editor:
                        </p>
                        <ul className="list-disc pl-4 mt-1 space-y-0.5">
                          {importResult.importMetadata.warnings
                            .slice(0, 3)
                            .map((w: string, idx: number) => (
                              <li key={idx}>{w}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isProcessing}
          >
            {status === "success" ? "Back" : "Cancel"}
          </Button>
          {status === "success" && importResult ? (
            <Button
              type="button"
              onClick={() => router.push(`/resumes/${importResult.resume.id}`)}
            >
              Open in Editor
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!file || !title.trim() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Resume
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}

function ProgressStep({
  label,
  isActive,
  isCompleted,
}: {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  return (
    <div
      className={`flex items-center space-x-3 text-sm ${isActive ? "text-foreground font-medium" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/50"}`}
    >
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {isCompleted ? (
          <CheckCircle className="h-4 w-4 text-primary" />
        ) : isActive ? (
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
        )}
      </div>
      <span>{label}</span>
    </div>
  );
}
