"use client";

import * as React from "react";
import { JobDescriptionItem, jobsService } from "../../services/jobs.service";
import { resumesService, ResumeSummary } from "../../services/resumes.service";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Briefcase,
  Upload,
  FileText,
  X,
  AlertCircle,
  Sparkles,
  Link2,
} from "lucide-react";

interface JobIntakeProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (job: JobDescriptionItem) => void;
}

export function JobIntake({ isOpen, onClose, onCreated }: JobIntakeProps) {
  const [tab, setTab] = React.useState<"paste" | "upload">("paste");
  const [rawText, setRawText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [resumeId, setResumeId] = React.useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [resumes, setResumes] = React.useState<ResumeSummary[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      resumesService
        .list(1, 50)
        .then((res) => setResumes(res.items))
        .catch(() => setResumes([]));
    } else {
      // Reset form
      setRawText("");
      setTitle("");
      setCompany("");
      setResumeId("");
      setSelectedFile(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const charCount = rawText.length;
  const isTooShort = charCount > 0 && charCount < 50;
  const isTooLong = charCount > 30000;
  const isValidTextLength = charCount >= 50 && charCount <= 30000;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext || "")) {
      setErrorMessage("Please select a PDF, DOCX, or TXT file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size must be under 10 MB.");
      return;
    }
    setSelectedFile(file);
    setErrorMessage(null);

    // Auto-fill title if empty
    if (!title) {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(baseName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setIsSubmitting(true);
      let job: JobDescriptionItem;

      if (tab === "upload") {
        if (!selectedFile) {
          setErrorMessage(
            "Please select a job description document to upload.",
          );
          setIsSubmitting(false);
          return;
        }

        job = await jobsService.upload(
          selectedFile,
          title.trim() || undefined,
          company.trim() || undefined,
          resumeId || undefined,
        );
      } else {
        if (!isValidTextLength) {
          setErrorMessage(
            charCount < 50
              ? "Job description must be at least 50 characters."
              : "Job description exceeds 30,000 character maximum.",
          );
          setIsSubmitting(false);
          return;
        }

        job = await jobsService.create({
          title: title.trim() || undefined,
          company: company.trim() || undefined,
          rawText: rawText.trim(),
          resumeId: resumeId || undefined,
          autoAnalyze: true,
        });
      }

      onCreated(job);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to analyze job description");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Add Target Job Description
        </DialogTitle>
        <DialogDescription>
          Paste or upload a job listing. ResumeAI will analyze requirements,
          classify skills, and extract ATS keywords.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 my-2">
        {/* Tab Toggle */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => {
              setTab("paste");
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              tab === "paste"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("upload");
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              tab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload Document (.pdf, .docx, .txt)
          </button>
        </div>

        {/* Tab Content */}
        {tab === "paste" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-foreground">
                Job Description Text <span className="text-destructive">*</span>
              </label>
              <span
                className={`text-[11px] font-mono ${
                  isTooShort
                    ? "text-amber-600"
                    : isTooLong
                      ? "text-destructive font-bold"
                      : "text-muted-foreground"
                }`}
              >
                {charCount.toLocaleString()} / 30,000 chars
              </span>
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste the full job posting here (responsibilities, requirements, qualifications)..."
              className="w-full rounded-md border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono leading-relaxed resize-y"
              required
            />
            {isTooShort && (
              <p className="text-[11px] text-amber-600">
                Minimum 50 characters required for meaningful AI analysis.
              </p>
            )}
            {isTooLong && (
              <p className="text-[11px] text-destructive">
                Text exceeds 30,000 characters limit. Please trim excess
                content.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Upload Document <span className="text-destructive">*</span>
            </label>

            {!selectedFile ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all space-y-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs font-medium text-foreground">
                  Drag and drop a PDF, DOCX, or TXT file here
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Max file size: 10 MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Optional Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Input
            label="Job Title (Optional)"
            placeholder="AI will extract if omitted"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Company (Optional)"
            placeholder="AI will extract if present"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        {/* Optional Resume Link */}
        {resumes.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
              Link to Resume (Optional)
            </label>
            <select
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">None (Don&apos;t link yet)</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-muted-foreground">
              Linking allows referencing this job for future tailoring and match
              analysis without modifying the resume itself.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            disabled={
              isSubmitting ||
              (tab === "paste" && !isValidTextLength) ||
              (tab === "upload" && !selectedFile)
            }
            className="gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            Analyze Job Listing
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
