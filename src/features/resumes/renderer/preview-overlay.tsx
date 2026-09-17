"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ResumeData, TemplateConfig } from "@resumeai/shared";
import { ResumeRenderer } from "./resume-renderer";
import { ExportButton } from "../export/export-button";
import {
  ArrowLeft,
  Maximize2,
  X,
  Keyboard,
} from "lucide-react";
import { Button } from "../../../components/ui/button";

interface PreviewOverlayProps {
  open: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateConfig: TemplateConfig;
  resumeId: string;
  resumeTitle: string;
  templateName: string;
  onBeforeExport?: () => Promise<void>;
}

export function PreviewOverlay({
  open,
  onClose,
  resumeData,
  templateConfig,
  resumeId,
  resumeTitle,
  templateName,
  onBeforeExport,
}: PreviewOverlayProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  // Handle open/close animations
  React.useEffect(() => {
    if (open) {
      // Lock body scroll
      document.body.style.overflow = "hidden";
      // Trigger enter animation
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape key handler
  React.useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  const overlay = (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-neutral-100 transition-opacity duration-200 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-neutral-200 shadow-sm shrink-0">
        {/* Left: Back button + title */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-9 px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Editor
          </Button>

          <div className="hidden sm:flex items-center gap-2 text-sm min-w-0">
            <div className="w-[1px] h-5 bg-neutral-200" />
            <Maximize2 className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-semibold text-foreground truncate max-w-64">
              {resumeTitle || "Untitled Resume"}
            </span>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border shrink-0">
              {templateName}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Keyboard shortcuts hint */}
          <button
            type="button"
            onClick={() => setShowShortcuts((p) => !p)}
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground rounded transition-colors"
            title="Keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span>Shortcuts</span>
          </button>

          <ExportButton
            resumeId={resumeId}
            resumeTitle={resumeTitle}
            onBeforeExport={onBeforeExport}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            title="Close preview (Escape)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Shortcuts tooltip */}
      {showShortcuts && (
        <div className="absolute top-14 right-4 z-[60] bg-white border border-neutral-200 rounded-lg shadow-lg p-3 text-xs space-y-1.5 w-56">
          <div className="font-semibold text-foreground mb-2">
            Keyboard Shortcuts
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Toggle Preview</span>
            <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
              Ctrl+P
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Close Preview</span>
            <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
              Esc
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Save</span>
            <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
              Ctrl+S
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Edit Mode</span>
            <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
              Ctrl+E
            </kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Split Mode</span>
            <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border">
              Ctrl+\
            </kbd>
          </div>
        </div>
      )}

      {/* Resume Preview Canvas */}
      <div className="flex-1 overflow-hidden">
        <ResumeRenderer
          data={resumeData}
          config={templateConfig}
          variant="full"
        />
      </div>
    </div>
  );

  // Render via portal to escape AppShell constraints
  return createPortal(overlay, document.body);
}
