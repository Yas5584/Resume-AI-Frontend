import * as React from "react";
import { SectionVisibility, DEFAULT_SECTION_ORDER } from "@resumeai/shared";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { ArrowUp, ArrowDown, Eye, EyeOff, RotateCcw } from "lucide-react";

interface SectionSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visibility: SectionVisibility;
  onVisibilityChange: (visibility: SectionVisibility) => void;
  order: string[];
  onOrderChange: (order: string[]) => void;
}

const SECTION_LABELS: Record<
  string,
  { label: string; visibilityKey: keyof SectionVisibility }
> = {
  summary: { label: "Professional Summary", visibilityKey: "showSummary" },
  experience: { label: "Work Experience", visibilityKey: "showExperience" },
  education: { label: "Education", visibilityKey: "showEducation" },
  projects: { label: "Key Projects", visibilityKey: "showProjects" },
  skills: { label: "Skills & Expertise", visibilityKey: "showSkills" },
  certifications: {
    label: "Certifications",
    visibilityKey: "showCertifications",
  },
  achievements: {
    label: "Honors & Achievements",
    visibilityKey: "showAchievements",
  },
  languages: { label: "Languages", visibilityKey: "showLanguages" },
  links: { label: "Additional Links", visibilityKey: "showLinks" },
};

export function SectionSettingsModal({
  open,
  onOpenChange,
  visibility,
  onVisibilityChange,
  order,
  onOrderChange,
}: SectionSettingsModalProps) {
  const toggleVisibility = (key: keyof SectionVisibility) => {
    onVisibilityChange({
      ...visibility,
      [key]: !visibility[key],
    });
  };

  const moveSection = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const newOrder = [...order];
    const [moved] = newOrder.splice(from, 1);
    newOrder.splice(to, 0, moved);
    onOrderChange(newOrder);
  };

  const resetToDefault = () => {
    onOrderChange([...DEFAULT_SECTION_ORDER]);
    onVisibilityChange({
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showProjects: true,
      showSkills: true,
      showCertifications: true,
      showAchievements: true,
      showLanguages: true,
      showLinks: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Section Order & Visibility</DialogTitle>
        <DialogDescription>
          Customize which sections appear on your resume and adjust their
          display order.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 py-1">
        {order.map((sectionKey, index) => {
          const config = SECTION_LABELS[sectionKey];
          if (!config) return null;
          const isVisible = visibility[config.visibilityKey] ?? true;

          return (
            <div
              key={sectionKey}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                isVisible
                  ? "bg-card border-border"
                  : "bg-muted/40 border-dashed border-border/70 opacity-60"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-semibold text-muted-foreground w-4 text-center">
                  {index + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isVisible
                      ? "text-foreground"
                      : "text-muted-foreground line-through"
                  }`}
                >
                  {config.label}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  disabled={index === 0}
                  onClick={() => moveSection(index, index - 1)}
                  title="Move section up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  disabled={index === order.length - 1}
                  onClick={() => moveSection(index, index + 1)}
                  title="Move section down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant={isVisible ? "secondary" : "outline"}
                  size="sm"
                  className="h-7 text-xs px-2.5 ml-2"
                  onClick={() => toggleVisibility(config.visibilityKey)}
                >
                  {isVisible ? (
                    <>
                      <Eye className="h-3 w-3 mr-1 text-primary" />
                      Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1 text-muted-foreground" />
                      Hidden
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <DialogFooter className="flex items-center justify-between sm:justify-between w-full pt-4 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={resetToDefault}
        >
          <RotateCcw className="h-3 w-3 mr-1.5" />
          Reset to default
        </Button>
        <Button type="button" size="sm" onClick={() => onOpenChange(false)}>
          Done
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
