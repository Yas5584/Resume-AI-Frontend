import * as React from "react";
import { CustomLink } from "@resumeai/shared";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface LinksSectionProps {
  value: CustomLink[];
  onChange: (value: CustomLink[]) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function LinksSection({ value, onChange }: LinksSectionProps) {
  const addLink = () => {
    onChange([
      ...value,
      {
        id: generateId(),
        label: "",
        url: "",
      },
    ]);
  };

  const updateLink = (index: number, updates: Partial<CustomLink>) => {
    const updated = [...value];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const removeLink = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {value.map((link, index) => (
        <Card
          key={link.id || index}
          className="p-3 sm:p-4 border border-border"
        >
          <div className="flex items-center space-x-3">
            <div className="w-1/3">
              <Input
                label="Link Label *"
                placeholder="e.g. Substack / Blog"
                value={link.label || ""}
                onChange={(e) => updateLink(index, { label: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Destination URL *"
                placeholder="e.g. https://newsletter.domain.com"
                value={link.url || ""}
                onChange={(e) => updateLink(index, { url: e.target.value })}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 mt-6 text-destructive hover:bg-destructive/10"
              onClick={() => removeLink(index)}
              title="Delete link"
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
        onClick={addLink}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Custom Link
      </Button>
    </div>
  );
}
