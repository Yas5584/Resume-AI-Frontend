import * as React from "react";
import { Achievement, ResumeData } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { InlineImproveModal } from "../../content-writer/inline-improve-modal";

interface AchievementsSectionProps {
  value: Achievement[];
  onChange: (value: Achievement[]) => void;
  resumeId?: string;
  onApplied?: (data: ResumeData) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function AchievementsSection({
  value,
  onChange,
  resumeId,
  onApplied,
}: AchievementsSectionProps) {
  const [activeModal, setActiveModal] = React.useState<{
    itemId: string;
    field: string;
    currentValue: string;
    itemTitle: string;
  } | null>(null);
  const addAchievement = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        title: "",
        description: "",
        date: "",
      },
    ]);
  };

  const updateAchievement = (index: number, updates: Partial<Achievement>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeAchievement = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveAchievement = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.map((ach, index) => (
        <Card
          key={ach.id || index}
          className="p-4 space-y-3 border border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                #{index + 1}
              </span>
              <span className="font-medium text-sm text-foreground truncate max-w-[200px] sm:max-w-xs">
                {ach.title || "New Achievement"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === 0}
                onClick={() => moveAchievement(index, index - 1)}
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === value.length - 1}
                onClick={() => moveAchievement(index, index + 1)}
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeAchievement(index)}
                title="Delete achievement"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Achievement Title *"
                placeholder="e.g. 1st Place — Global Fintech Hackathon"
                value={ach.title || ""}
                onChange={(e) =>
                  updateAchievement(index, { title: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-1">
              <Input
                label="Date"
                placeholder="e.g. 2023"
                value={ach.date || ""}
                onChange={(e) =>
                  updateAchievement(index, { date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Description / Impact
              </label>
              {resumeId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] gap-1 text-primary hover:bg-primary/5 px-2"
                  onClick={() =>
                    setActiveModal({
                      itemId: ach.id,
                      field: "description",
                      currentValue: ach.description || "",
                      itemTitle: `Achievement: ${ach.title || "Impact"}`,
                    })
                  }
                >
                  <Sparkles className="h-3 w-3" />
                  Improve with AI
                </Button>
              )}
            </div>
            <textarea
              rows={2}
              className="w-full rounded-md border border-input bg-white p-2.5 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
              placeholder="Awarded top engineering prize out of 400+ international developer teams."
              value={ach.description || ""}
              onChange={(e) =>
                updateAchievement(index, { description: e.target.value })
              }
            />
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-4 text-sm"
        onClick={addAchievement}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Achievement / Honor
      </Button>

      {resumeId && activeModal && (
        <InlineImproveModal
          open={Boolean(activeModal)}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null);
          }}
          resumeId={resumeId}
          section="achievements"
          itemId={activeModal.itemId}
          field={activeModal.field}
          currentValue={activeModal.currentValue}
          itemTitle={activeModal.itemTitle}
          onApplied={(newData) => {
            if (onApplied) onApplied(newData);
            if (newData.achievements) onChange(newData.achievements);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}
