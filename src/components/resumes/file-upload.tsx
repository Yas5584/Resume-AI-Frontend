"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onFileRemoved: () => void;
  selectedFile: File | null;
  accept?: string;
  maxSizeBytes?: number;
  disabled?: boolean;
  error?: string | null;
}

export function FileUpload({
  onFileSelected,
  onFileRemoved,
  selectedFile,
  accept = ".pdf,.docx",
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  disabled = false,
  error: externalError = null,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentError = externalError || localError;

  const validateAndProcessFile = (file: File) => {
    setLocalError(null);

    // Size validation
    if (file.size > maxSizeBytes) {
      setLocalError(
        `File size must be less than ${Math.round(maxSizeBytes / (1024 * 1024))}MB`,
      );
      return;
    }

    // Extension validation
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    const acceptedExtensions = accept
      .split(",")
      .map((ext) => ext.trim().toLowerCase());

    if (!acceptedExtensions.includes(fileExtension)) {
      setLocalError(`Invalid file type. Accepted formats: ${accept}`);
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
    // Reset input value so the same file can be selected again if removed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (selectedFile) {
    return (
      <div
        className={`relative flex items-center justify-between p-4 border rounded-lg bg-card ${disabled ? "opacity-50" : ""}`}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onFileRemoved}
          disabled={disabled}
          className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          aria-label="Remove file"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : "cursor-pointer"}
          ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"}
          ${currentError ? "border-destructive bg-destructive/5" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
        />

        <div className="flex flex-col items-center space-y-2 text-center">
          <div
            className={`p-3 rounded-full ${currentError ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
          >
            {currentError ? (
              <AlertCircle className="h-6 w-6" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isDragOver ? "Drop file here" : "Drag & drop your resume here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to browse ({accept.replace(/\./g, "").toUpperCase()})
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Max file size: {Math.round(maxSizeBytes / (1024 * 1024))}MB
          </p>
        </div>
      </div>

      {currentError && (
        <p className="text-xs font-medium text-destructive mt-1 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {currentError}
        </p>
      )}
    </div>
  );
}
