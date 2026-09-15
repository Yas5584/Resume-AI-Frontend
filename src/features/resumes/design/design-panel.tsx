import * as React from "react";
import {
  TemplateConfig,
  FontFamily,
  FontSize,
  AccentColor,
  Spacing,
  Margins,
  PageSize,
  COLOR_PALETTES,
  getDefaultTemplateConfig,
} from "@resumeai/shared";
import { TemplatePicker } from "./template-picker";
import { RotateCcw } from "lucide-react";

interface DesignPanelProps {
  config: TemplateConfig;
  onChange: (updated: TemplateConfig) => void;
}

const FONTS: { id: FontFamily; label: string; style: string }[] = [
  { id: "Inter", label: "Inter (Modern Sans)", style: "font-sans" },
  { id: "Arial", label: "Arial (Standard Sans)", style: "font-sans" },
  { id: "Helvetica", label: "Helvetica (Clean Sans)", style: "font-sans" },
  { id: "Georgia", label: "Georgia (Classic Serif)", style: "font-serif" },
  {
    id: "Times New Roman",
    label: "Times New Roman (Formal)",
    style: "font-serif",
  },
];

const FONT_SIZES: { id: FontSize; label: string }[] = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Large" },
];

const SPACINGS: { id: Spacing; label: string }[] = [
  { id: "compact", label: "Compact" },
  { id: "comfortable", label: "Comfortable" },
  { id: "spacious", label: "Spacious" },
];

const MARGINS: { id: Margins; label: string }[] = [
  { id: "compact", label: "Tight" },
  { id: "normal", label: "Normal" },
  { id: "relaxed", label: "Wide" },
];

const PAGE_SIZES: { id: PageSize; label: string; desc: string }[] = [
  { id: "a4", label: "A4", desc: "210 × 297 mm" },
  { id: "letter", label: "US Letter", desc: "8.5 × 11 in" },
];

export function DesignPanel({ config, onChange }: DesignPanelProps) {
  const updateField = <K extends keyof TemplateConfig>(
    key: K,
    value: TemplateConfig[K],
  ) => {
    onChange({ ...config, [key]: value });
  };

  const handleResetDefaults = () => {
    const defaults = getDefaultTemplateConfig(config.templateId);
    onChange(defaults);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* 1. Template Choice */}
      <TemplatePicker
        currentTemplateId={config.templateId}
        onSelect={(newTemplateId) => {
          const defaults = getDefaultTemplateConfig(newTemplateId);
          onChange({
            ...defaults,
            templateId: newTemplateId,
          });
        }}
      />

      <div className="pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              Styling & Formatting
            </h3>
            <p className="text-xs text-neutral-500">
              Customize typography, palette colors, and spacing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 font-medium px-2.5 py-1 rounded-md border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        </div>

        <div className="space-y-5">
          {/* Accent Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Accent Color
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.values(COLOR_PALETTES).map((colorDef) => {
                const isSelected = config.accentColor === colorDef.id;
                return (
                  <button
                    key={colorDef.id}
                    type="button"
                    onClick={() =>
                      updateField("accentColor", colorDef.id as AccentColor)
                    }
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-all ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 ring-2 ring-neutral-900 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full shadow-inner border border-black/10"
                      style={{ backgroundColor: colorDef.hex }}
                    />
                    <span className="text-[11px] font-medium text-neutral-700">
                      {colorDef.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Font Family
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FONTS.map((f) => {
                const isSelected = config.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateField("fontFamily", f.id)}
                    className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${f.style} ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 font-semibold text-neutral-900 ring-1 ring-neutral-900"
                        : "border-neutral-200 text-neutral-700 hover:bg-neutral-50/50 hover:border-neutral-300"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size & Spacing Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Font Size */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Font Size Scale
              </label>
              <div className="grid grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
                {FONT_SIZES.map((sz) => {
                  const isSelected = config.fontSize === sz.id;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => updateField("fontSize", sz.id)}
                      className={`text-xs py-1.5 rounded-md font-medium transition-all ${
                        isSelected
                          ? "bg-white text-neutral-900 shadow-xs font-semibold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {sz.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Line Spacing */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Content Spacing
              </label>
              <div className="grid grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
                {SPACINGS.map((sp) => {
                  const isSelected = config.spacing === sp.id;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => updateField("spacing", sp.id)}
                      className={`text-xs py-1.5 rounded-md font-medium transition-all ${
                        isSelected
                          ? "bg-white text-neutral-900 shadow-xs font-semibold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {sp.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Margins & Page Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Margins */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Page Margins
              </label>
              <div className="grid grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
                {MARGINS.map((m) => {
                  const isSelected = config.margins === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => updateField("margins", m.id)}
                      className={`text-xs py-1.5 rounded-md font-medium transition-all ${
                        isSelected
                          ? "bg-white text-neutral-900 shadow-xs font-semibold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Page Paper Size */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Page Standard
              </label>
              <div className="grid grid-cols-2 gap-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200">
                {PAGE_SIZES.map((ps) => {
                  const isSelected = config.pageSize === ps.id;
                  return (
                    <button
                      key={ps.id}
                      type="button"
                      onClick={() => updateField("pageSize", ps.id)}
                      className={`text-xs py-1.5 rounded-md font-medium transition-all ${
                        isSelected
                          ? "bg-white text-neutral-900 shadow-xs font-semibold"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {ps.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
