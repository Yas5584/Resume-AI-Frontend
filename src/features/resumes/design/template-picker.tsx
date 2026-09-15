import * as React from "react";
import { Check } from "lucide-react";
import { TEMPLATES } from "../templates/registry";
import { CanonicalTemplateId } from "@resumeai/shared";

interface TemplatePickerProps {
  currentTemplateId: string;
  onSelect: (templateId: CanonicalTemplateId) => void;
}

export function TemplatePicker({
  currentTemplateId,
  onSelect,
}: TemplatePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">
          Choose Template
        </h3>
        <p className="text-xs text-neutral-500">
          Select a professionally designed, ATS-friendly structure for your
          resume.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected =
            currentTemplateId === tmpl.id ||
            (tmpl.id === "modern" && currentTemplateId === "modern-standard");

          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onSelect(tmpl.id as CanonicalTemplateId)}
              className={`text-left p-4 rounded-xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "border-neutral-900 bg-neutral-50/70 shadow-sm ring-1 ring-neutral-900"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/40"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1.5 pr-6">
                  <h4 className="text-sm font-bold text-neutral-900">
                    {tmpl.name}
                  </h4>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  {tmpl.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] text-neutral-500">
                <span className="font-medium text-neutral-700">Best for:</span>
                <span>{tmpl.recommendedFor}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
