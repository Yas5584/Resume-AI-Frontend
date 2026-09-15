import * as React from "react";
import { Education } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface EducationSectionProps {
  value: Education[];
  onChange: (value: Education[]) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function EducationSection({ value, onChange }: EducationSectionProps) {
  const addEducation = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        institution: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
        description: "",
        honors: [],
      },
    ]);
  };

  const updateEducation = (index: number, updates: Partial<Education>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveEducation = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const updated = [...value];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {value.map((edu, index) => (
        <Card
          key={edu.id || index}
          className="p-4 sm:p-5 space-y-4 border border-border"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                #{index + 1}
              </span>
              <span className="font-medium text-sm text-foreground truncate max-w-[200px] sm:max-w-xs">
                {edu.degree || "New Degree"}{" "}
                {edu.institution ? `@ ${edu.institution}` : ""}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === 0}
                onClick={() => moveEducation(index, index - 1)}
                title="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                disabled={index === value.length - 1}
                onClick={() => moveEducation(index, index + 1)}
                title="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => removeEducation(index)}
                title="Delete education"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Institution / University *"
              placeholder="e.g. Stanford University"
              value={edu.institution || ""}
              onChange={(e) =>
                updateEducation(index, { institution: e.target.value })
              }
            />
            <Input
              label="Degree / Qualification *"
              placeholder="e.g. Bachelor of Science"
              value={edu.degree || ""}
              onChange={(e) =>
                updateEducation(index, { degree: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Field of Study / Major"
              placeholder="e.g. Computer Science"
              value={edu.fieldOfStudy || ""}
              onChange={(e) =>
                updateEducation(index, { fieldOfStudy: e.target.value })
              }
            />
            <Input
              label="Location"
              placeholder="e.g. Stanford, CA"
              value={edu.location || ""}
              onChange={(e) =>
                updateEducation(index, { location: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <Input
              label="Start Date"
              placeholder="e.g. 2018"
              value={edu.startDate || ""}
              onChange={(e) =>
                updateEducation(index, { startDate: e.target.value })
              }
            />
            <Input
              label="End Date / Expected"
              placeholder={edu.current ? "Present" : "e.g. 2022"}
              disabled={edu.current}
              value={edu.current ? "" : edu.endDate || ""}
              onChange={(e) =>
                updateEducation(index, { endDate: e.target.value })
              }
            />
            <Input
              label="GPA (Optional)"
              placeholder="e.g. 3.9 / 4.0"
              value={edu.gpa || ""}
              onChange={(e) => updateEducation(index, { gpa: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                checked={edu.current || false}
                onChange={(e) =>
                  updateEducation(index, {
                    current: e.target.checked,
                    endDate: e.target.checked ? "" : edu.endDate,
                  })
                }
              />
              <span>Currently enrolled</span>
            </label>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-5 text-sm"
        onClick={addEducation}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
}
