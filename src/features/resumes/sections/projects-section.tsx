import * as React from "react";
import { Project, ResumeData } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { TagInput } from "../../../components/ui/tag-input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { InlineImproveModal } from "../../content-writer/inline-improve-modal";

interface ProjectsSectionProps {
  value: Project[];
  onChange: (value: Project[]) => void;
  resumeId?: string;
  onApplied?: (data: ResumeData) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function ProjectsSection({
  value,
  onChange,
  resumeId,
  onApplied,
}: ProjectsSectionProps) {
  const [activeModal, setActiveModal] = React.useState<{
    itemId: string;
    field: string;
    currentValue: string;
    itemTitle: string;
  } | null>(null);
  const addProject = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        name: "",
        role: "",
        technologies: [],
        startDate: "",
        endDate: "",
        url: "",
        repoUrl: "",
        description: "",
        bullets: [""],
        highlights: [],
      },
    ]);
  };

  const updateProject = (index: number, updates: Partial<Project>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveProject = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  const addBullet = (projIndex: number) => {
    const proj = value[projIndex];
    updateProject(projIndex, {
      bullets: [...(proj.bullets || []), ""],
    });
  };

  const updateBullet = (
    projIndex: number,
    bulletIndex: number,
    text: string,
  ) => {
    const proj = value[projIndex];
    const updatedBullets = [...(proj.bullets || [])];
    updatedBullets[bulletIndex] = text;
    updateProject(projIndex, { bullets: updatedBullets });
  };

  const removeBullet = (projIndex: number, bulletIndex: number) => {
    const proj = value[projIndex];
    updateProject(projIndex, {
      bullets: (proj.bullets || []).filter((_, i) => i !== bulletIndex),
    });
  };

  return (
    <div className="space-y-4">
      {value.map((proj, index) => (
        <Card
          key={proj.id || index}
          className="p-4 sm:p-5 space-y-4 border border-border"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                #{index + 1}
              </span>
              <span className="font-medium text-sm text-foreground truncate max-w-[200px] sm:max-w-xs">
                {proj.name || "New Project"} {proj.role ? `(${proj.role})` : ""}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === 0}
                onClick={() => moveProject(index, index - 1)}
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === value.length - 1}
                onClick={() => moveProject(index, index + 1)}
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeProject(index)}
                title="Delete project"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Name *"
              placeholder="e.g. Distributed Task Engine"
              value={proj.name || ""}
              onChange={(e) => updateProject(index, { name: e.target.value })}
            />
            <Input
              label="Your Role / Title"
              placeholder="e.g. Lead Author / Architect"
              value={proj.role || ""}
              onChange={(e) => updateProject(index, { role: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <TagInput
              label="Technologies Used"
              placeholder="e.g. TypeScript, Redis, Node.js, Docker"
              value={proj.technologies || []}
              onChange={(technologies) =>
                updateProject(index, { technologies })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Live Demo URL"
              placeholder="e.g. https://project.demo.com"
              value={proj.url || ""}
              onChange={(e) => updateProject(index, { url: e.target.value })}
            />
            <Input
              label="Repository URL"
              placeholder="e.g. https://github.com/username/project"
              value={proj.repoUrl || ""}
              onChange={(e) =>
                updateProject(index, { repoUrl: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              placeholder="e.g. Jan 2023"
              value={proj.startDate || ""}
              onChange={(e) =>
                updateProject(index, { startDate: e.target.value })
              }
            />
            <Input
              label="End Date"
              placeholder="e.g. Jun 2023"
              value={proj.endDate || ""}
              onChange={(e) =>
                updateProject(index, { endDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Project Overview / Summary{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional — leave blank if using bullets only)
                </span>
              </label>
              {resumeId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] gap-1 text-primary hover:bg-primary/5 px-2"
                  onClick={() =>
                    setActiveModal({
                      itemId: proj.id,
                      field: "description",
                      currentValue:
                        proj.description ||
                        (proj.bullets && proj.bullets.length > 0
                          ? proj.bullets.join(". ")
                          : ""),
                      itemTitle: `${proj.name || "Project"} Overview`,
                    })
                  }
                >
                  <Sparkles className="h-3 w-3" />
                  {proj.description
                    ? "Improve with AI"
                    : "Generate Overview with AI"}
                </Button>
              )}
            </div>
            <textarea
              rows={2}
              className="w-full rounded-md border border-input bg-white p-2.5 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              placeholder="Brief overview of project goals, problems solved, and architecture."
              value={proj.description || ""}
              onChange={(e) =>
                updateProject(index, { description: e.target.value })
              }
            />
          </div>

          {/* Bullet Points */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Key Accomplishments / Metrics
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => addBullet(index)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Bullet
              </Button>
            </div>

            <div className="space-y-2">
              {(proj.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start space-x-2">
                  <span className="text-muted-foreground text-sm pt-2 select-none">
                    •
                  </span>
                  <textarea
                    rows={2}
                    className="flex-1 rounded-md border border-input bg-white p-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    placeholder="e.g. Achieved 99.99% uptime with Redis pub/sub fault-tolerant architecture."
                    value={bullet}
                    onChange={(e) => updateBullet(index, bIdx, e.target.value)}
                  />
                  {resumeId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 mt-1 text-primary/80 hover:text-primary hover:bg-primary/10"
                      title="Improve bullet with AI"
                      onClick={() =>
                        setActiveModal({
                          itemId: proj.id,
                          field: `bullets.${bIdx}`,
                          currentValue: bullet,
                          itemTitle: `${proj.name || "Project"} (Bullet #${bIdx + 1})`,
                        })
                      }
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 mt-1 text-muted-foreground hover:text-destructive"
                    onClick={() => removeBullet(index, bIdx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-5 text-sm"
        onClick={addProject}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>

      {resumeId && activeModal && (
        <InlineImproveModal
          open={Boolean(activeModal)}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null);
          }}
          resumeId={resumeId}
          section="projects"
          itemId={activeModal.itemId}
          field={activeModal.field}
          currentValue={activeModal.currentValue}
          itemTitle={activeModal.itemTitle}
          onApplied={(newData) => {
            if (onApplied) onApplied(newData);
            if (newData.projects) onChange(newData.projects);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}
