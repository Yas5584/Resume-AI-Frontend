import * as React from "react";
import { ResumeData } from "@resumeai/shared";
import { Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { InlineImproveModal } from "../../content-writer/inline-improve-modal";

interface SummarySectionProps {
  value: string;
  onChange: (value: string) => void;
  resumeId?: string;
  onApplied?: (data: ResumeData) => void;
}

export function SummarySection({
  value,
  onChange,
  resumeId,
  onApplied,
}: SummarySectionProps) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const maxLength = 2000;
  const currentLength = (value || "").length;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium text-foreground">
          Professional Summary
        </label>
        <div className="flex items-center space-x-3">
          {resumeId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/5"
              onClick={() => setModalOpen(true)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Improve with AI
            </Button>
          )}
          <span
            className={`text-[11px] font-mono ${
              currentLength > maxLength
                ? "text-destructive font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {currentLength} / {maxLength}
          </span>
        </div>
      </div>

      <textarea
        rows={6}
        className="w-full rounded-md border border-input bg-white p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
        placeholder="Briefly introduce your career background, core strengths, and key achievements. Keep it impactful, concise, and focused on value delivered."
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className="text-xs text-muted-foreground">
        Pro tip: 2 to 4 sentences highlighting your years of experience, core
        technical stack, and strongest measurable impact works best for ATS.
      </p>

      {resumeId && modalOpen && (
        <InlineImproveModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          resumeId={resumeId}
          section="summary"
          field="summary"
          currentValue={value || ""}
          itemTitle="Professional Summary"
          onApplied={(newData) => {
            if (onApplied) onApplied(newData);
            if (newData.summary) onChange(newData.summary);
          }}
        />
      )}
    </div>
  );
}
