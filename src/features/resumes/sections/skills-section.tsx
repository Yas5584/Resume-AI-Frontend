import * as React from "react";
import { SkillCategory, ResumeData } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { InlineImproveModal } from "../../content-writer/inline-improve-modal";

interface SkillsSectionProps {
  value: SkillCategory[];
  onChange: (value: SkillCategory[]) => void;
  resumeId?: string;
  onApplied?: (data: ResumeData) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function SkillsSection({
  value,
  onChange,
  resumeId,
  onApplied,
}: SkillsSectionProps) {
  const [activeModal, setActiveModal] = React.useState<{
    itemId: string;
    field: string;
    currentValue: string;
    itemTitle: string;
  } | null>(null);
  const addCategory = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        category: "",
        skills: [],
      },
    ]);
  };

  const updateCategory = (index: number, updates: Partial<SkillCategory>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeCategory = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveCategory = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.map((cat, index) => (
        <Card
          key={cat.id || index}
          className="p-4 space-y-3 border border-border"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                #{index + 1}
              </span>
              <span className="font-medium text-sm text-foreground">
                {cat.category || "New Skill Group"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {resumeId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-primary hover:bg-primary/5 px-2"
                  title="Improve & normalize skills with AI"
                  onClick={() =>
                    setActiveModal({
                      itemId: cat.id,
                      field: "skills",
                      currentValue: (cat.skills || []).join(", "),
                      itemTitle: `Skill Group: ${cat.category || "General"}`,
                    })
                  }
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Improve with AI
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === 0}
                onClick={() => moveCategory(index, index - 1)}
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === value.length - 1}
                onClick={() => moveCategory(index, index + 1)}
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeCategory(index)}
                title="Delete skill group"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <Input
                label="Category Name *"
                placeholder="e.g. Languages / Tools"
                value={cat.category || ""}
                onChange={(e) =>
                  updateCategory(index, { category: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Skills (Comma-separated) *"
                placeholder="e.g. TypeScript, React, Next.js, Node.js"
                value={(cat.skills || []).join(", ")}
                onChange={(e) =>
                  updateCategory(index, {
                    skills: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-4 text-sm"
        onClick={addCategory}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Skill Category
      </Button>

      {resumeId && activeModal && (
        <InlineImproveModal
          open={Boolean(activeModal)}
          onOpenChange={(open) => {
            if (!open) setActiveModal(null);
          }}
          resumeId={resumeId}
          section="skills"
          itemId={activeModal.itemId}
          field={activeModal.field}
          currentValue={activeModal.currentValue}
          itemTitle={activeModal.itemTitle}
          onApplied={(newData) => {
            if (onApplied) onApplied(newData);
            if (newData.skills) onChange(newData.skills);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}
