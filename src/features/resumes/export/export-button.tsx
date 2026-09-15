"use client";

import * as React from "react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import { resumesService } from "../../../services/resumes.service";
import {
  Download,
  FileText,
  FileCode,
  Loader2,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

interface ExportButtonProps {
  resumeId: string;
  resumeTitle: string;
  onBeforeExport?: () => Promise<void>;
  className?: string;
}

export function ExportButton({
  resumeId,
  resumeTitle,
  onBeforeExport,
  className,
}: ExportButtonProps) {
  const [exportingFormat, setExportingFormat] = React.useState<
    "pdf" | "docx" | null
  >(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleExport = async (format: "pdf" | "docx") => {
    if (exportingFormat) return;

    setExportingFormat(format);
    setErrorMessage(null);

    try {
      // Flush any pending unsaved changes before initiating backend export
      if (onBeforeExport) {
        await onBeforeExport();
      }

      const safeTitle = resumeTitle.trim() || "resume";
      if (format === "pdf") {
        await resumesService.exportPdf(resumeId, `${safeTitle}.pdf`);
      } else {
        await resumesService.exportDocx(resumeId, `${safeTitle}.docx`);
      }
    } catch (err: unknown) {
      console.error(`Export to ${format.toUpperCase()} failed:`, err);
      const msg =
        err instanceof Error
          ? err.message
          : `Failed to export ${format.toUpperCase()}`;
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <DropdownMenu
        align="right"
        trigger={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={exportingFormat !== null}
            className={`h-8 text-xs font-medium border-border shadow-xs hover:bg-muted ${className || ""}`}
            title="Export resume as PDF or Word document"
          >
            {exportingFormat !== null ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin text-primary" />
                <span>
                  {exportingFormat === "pdf"
                    ? "Exporting PDF..."
                    : "Exporting DOCX..."}
                </span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 mr-1.5 text-primary" />
                <span>Export</span>
                <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
              </>
            )}
          </Button>
        }
      >
        <div className="px-2 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Download Document
        </div>

        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          className="flex items-start gap-2.5 p-2 rounded-md cursor-pointer hover:bg-muted/70 transition-colors"
        >
          <div className="p-1.5 rounded-md bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 mt-0.5">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                PDF Document (.pdf)
              </span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded font-medium">
                Vector
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
              Print-ready vector PDF with selectable text & ATS layout
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport("docx")}
          className="flex items-start gap-2.5 p-2 rounded-md cursor-pointer hover:bg-muted/70 transition-colors"
        >
          <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 mt-0.5">
            <FileCode className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Word Document (.docx)
              </span>
              <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.2 rounded font-medium">
                Editable
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
              Editable Microsoft Word format with structured headings
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenu>

      {errorMessage && (
        <div className="absolute right-0 top-full mt-2 w-72 p-2.5 bg-destructive/10 border border-destructive/20 rounded-md text-xs text-destructive flex items-start gap-2 shadow-md z-50 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
