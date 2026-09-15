import * as React from "react";
import { Language, LanguageProficiency } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface LanguagesSectionProps {
  value: Language[];
  onChange: (value: Language[]) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const PROFICIENCIES: LanguageProficiency[] = [
  "Native",
  "Fluent",
  "Professional",
  "Conversational",
  "Basic",
];

export function LanguagesSection({ value, onChange }: LanguagesSectionProps) {
  const addLanguage = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        language: "",
        proficiency: "Conversational",
      },
    ]);
  };

  const updateLanguage = (index: number, updates: Partial<Language>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeLanguage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.map((lang, index) => (
        <Card
          key={lang.id || index}
          className="p-3 sm:p-4 border border-border"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Input
                label="Language *"
                placeholder="e.g. English, Spanish, Japanese"
                value={lang.language || ""}
                onChange={(e) =>
                  updateLanguage(index, { language: e.target.value })
                }
              />
            </div>
            <div className="w-40 space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Proficiency
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={lang.proficiency || "Conversational"}
                onChange={(e) =>
                  updateLanguage(index, {
                    proficiency: e.target.value as LanguageProficiency,
                  })
                }
              >
                {PROFICIENCIES.map((prof) => (
                  <option key={prof} value={prof}>
                    {prof}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 mt-6 text-destructive hover:bg-destructive/10"
              onClick={() => removeLanguage(index)}
              title="Delete language"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-4 text-sm"
        onClick={addLanguage}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Language
      </Button>
    </div>
  );
}
