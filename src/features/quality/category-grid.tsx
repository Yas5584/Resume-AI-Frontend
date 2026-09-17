"use client";

import * as React from "react";
import {
  CategoryScore,
  ResumeQualityCategoryType,
  ResumeQualityCategory,
} from "@resumeai/shared";
import { Card, CardContent } from "../../components/ui/card";
import {
  Layers,
  FileText,
  Briefcase,
  Cpu,
  GraduationCap,
  Mail,
  Palette,
  CheckCheck,
} from "lucide-react";

export interface CategoryGridProps {
  categories: Record<string, CategoryScore>;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  ATS_STRUCTURE: <Layers className="h-4 w-4" />,
  CONTENT_QUALITY: <FileText className="h-4 w-4" />,
  EXPERIENCE_QUALITY: <Briefcase className="h-4 w-4" />,
  SKILLS_KEYWORDS: <Cpu className="h-4 w-4" />,
  EDUCATION_CERTIFICATIONS: <GraduationCap className="h-4 w-4" />,
  CONTACT_LINKS: <Mail className="h-4 w-4" />,
  FORMATTING_PARSEABILITY: <Palette className="h-4 w-4" />,
  CONSISTENCY: <CheckCheck className="h-4 w-4" />,
};

function getScoreBarColor(score: number): string {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 75) return "bg-blue-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function getStatusBadge(status: string): { bg: string; text: string } {
  switch (status) {
    case "Excellent":
      return { bg: "bg-emerald-100 text-emerald-800", text: "text-emerald-700" };
    case "Good":
      return { bg: "bg-blue-100 text-blue-800", text: "text-blue-700" };
    case "Needs Improvement":
      return { bg: "bg-amber-100 text-amber-800", text: "text-amber-700" };
    default:
      return { bg: "bg-red-100 text-red-800", text: "text-red-700" };
  }
}

export function CategoryGrid({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryGridProps) {
  const categoryKeys = categories ? Object.keys(categories) : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">
            Category Breakdown
          </h3>
          <p className="text-xs text-muted-foreground">
            Click any category to filter actionable findings below.
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-primary hover:underline font-semibold"
          >
            Show All Categories
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {categoryKeys.map((key) => {
          const cat = categories[key];
          if (!cat) return null;

          const isSelected = selectedCategory === key;
          const statusStyle = getStatusBadge(cat.status);
          const icon = CATEGORY_ICONS[key] || <FileText className="h-4 w-4" />;
          const catFindings = Array.isArray(cat.findings) ? cat.findings : [];
          const criticalCount = catFindings.filter(
            (f) => f.severity === "CRITICAL",
          ).length;

          return (
            <Card
              key={key}
              onClick={() => onSelectCategory(isSelected ? null : key)}
              className={`cursor-pointer transition-all hover:shadow-md border ${
                isSelected
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                  : "border-border hover:border-border/80 bg-white"
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {icon}
                    </div>
                    <span className="text-xs font-bold text-foreground leading-tight">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {Math.round(cat.weight * 100)}%
                  </span>
                </div>

                {/* Score & Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-foreground">
                        {cat.score}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        / 100
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyle.bg}`}
                    >
                      {cat.status}
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(
                        cat.score,
                      )}`}
                      style={{ width: `${Math.max(cat.score, 4)}%` }}
                    />
                  </div>
                </div>

                {/* Findings summary pill */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40">
                  <span>
                    {catFindings.length === 0 ? (
                      <span className="text-emerald-600 font-medium">
                        No issues detected
                      </span>
                    ) : (
                      <span>
                        {catFindings.length}{" "}
                        {catFindings.length === 1 ? "finding" : "findings"}
                      </span>
                    )}
                  </span>

                  {criticalCount > 0 && (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                      {criticalCount} critical
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
