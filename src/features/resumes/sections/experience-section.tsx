import * as React from "react";
import { WorkExperience, ResumeData } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { InlineImproveModal } from "../../content-writer/inline-improve-modal";

interface ExperienceSectionProps {
  value: WorkExperience[];
  onChange: (value: WorkExperience[]) => void;
  resumeId?: string;
  onApplied?: (data: ResumeData) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function ExperienceSection({
  value,
  onChange,
  resumeId,
  onApplied,
}: ExperienceSectionProps) {
  const [activeModal, setActiveModal] = React.useState<{
    itemId: string;
    field: string;
    currentValue: string;
    itemTitle: string;
  } | null>(null);
  const addExperience = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        jobTitle: "",
        position: "",
        company: "",
        location: "",
        employmentType: "Full-time",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        bullets: [""],
        technologiesUsed: [],
      },
    ]);
  };

  const updateExperience = (
    index: number,
    updates: Partial<WorkExperience>,
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveExperience = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  const addBullet = (expIndex: number) => {
    const exp = value[expIndex];
    updateExperience(expIndex, {
      bullets: [...(exp.bullets || []), ""],
    });
  };

  const updateBullet = (
    expIndex: number,
    bulletIndex: number,
    text: string,
  ) => {
    const exp = value[expIndex];
    const updatedBullets = [...(exp.bullets || [])];
    updatedBullets[bulletIndex] = text;
    updateExperience(expIndex, { bullets: updatedBullets });
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const exp = value[expIndex];
    updateExperience(expIndex, {
      bullets: (exp.bullets || []).filter((_, i) => i !== bulletIndex),
    });
  };

  return (
    <div className="space-y-4">
      {value.map((exp, index) => (
        <Card
          key={exp.id || index}
          className="p-4 sm:p-5 space-y-4 border border-border"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                #{index + 1}
              </span>
              <span className="font-medium text-sm text-foreground truncate max-w-[200px] sm:max-w-xs">
                {exp.jobTitle || exp.position || "New Position"}{" "}
                {exp.company ? `@ ${exp.company}` : ""}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === 0}
                onClick={() => moveExperience(index, index - 1)}
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === value.length - 1}
                onClick={() => moveExperience(index, index + 1)}
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeExperience(index)}
                title="Delete position"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Title *"
              placeholder="e.g. Senior Software Engineer"
              value={exp.jobTitle || exp.position || ""}
              onChange={(e) =>
                updateExperience(index, {
                  jobTitle: e.target.value,
                  position: e.target.value,
                })
              }
            />
            <Input
              label="Company Name *"
              placeholder="e.g. Acme Corporation"
              value={exp.company || ""}
              onChange={(e) =>
                updateExperience(index, { company: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g. New York, NY (or Remote)"
              value={exp.location || ""}
              onChange={(e) =>
                updateExperience(index, { location: e.target.value })
              }
            />
            <div className="w-full space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Employment Type
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={exp.employmentType || "Full-time"}
                onChange={(e) =>
                  updateExperience(index, { employmentType: e.target.value })
                }
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Input
              label="Start Date"
              placeholder="e.g. 2021-03 or Mar 2021"
              value={exp.startDate || ""}
              onChange={(e) =>
                updateExperience(index, { startDate: e.target.value })
              }
            />
            <div className="space-y-2">
              <Input
                label="End Date"
                placeholder={exp.current ? "Present" : "e.g. 2024-01"}
                disabled={exp.current}
                value={exp.current ? "" : exp.endDate || ""}
                onChange={(e) =>
                  updateExperience(index, { endDate: e.target.value })
                }
              />
              <label className="flex items-center space-x-2 text-xs text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                  checked={exp.current || false}
                  onChange={(e) =>
                    updateExperience(index, {
                      current: e.target.checked,
                      endDate: e.target.checked ? "" : exp.endDate,
                    })
                  }
                />
                <span>I currently work here</span>
              </label>
            </div>
          </div>

          {/* Bullet Points Management */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Bullet Points / Key Contributions
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
              {(exp.bullets || []).map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start space-x-2">
                  <span className="text-muted-foreground text-sm pt-2 select-none">
                    •
                  </span>
                  <textarea
                    rows={2}
                    className="flex-1 rounded-md border border-input bg-white p-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    placeholder="e.g. Spearheaded redesign of core checkout flow, boosting conversion rate by 18%."
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
                          itemId: exp.id,
                          field: `bullets.${bIdx}`,
                          currentValue: bullet,
                          itemTitle: `${exp.jobTitle || exp.position || "Experience"} (Bullet #${bIdx + 1})`,
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
              {(!exp.bullets || exp.bullets.length === 0) && (
                <p className="text-xs text-muted-foreground italic">
                  No bullet points added. Click &quot;Add Bullet&quot; to
                  highlight your responsibilities and achievements.
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-5 text-sm"
        onClick={addExperience}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Work Experience
      </Button>

      {resumeId && activeModal && (
        <InlineImproveModal
          open={Boolean(activeModal)}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null);
          }}
          resumeId={resumeId}
          section="experience"
          itemId={activeModal.itemId}
          field={activeModal.field}
          currentValue={activeModal.currentValue}
          itemTitle={activeModal.itemTitle}
          onApplied={(newData) => {
            if (onApplied) onApplied(newData);
            if (newData.experience) onChange(newData.experience);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}
