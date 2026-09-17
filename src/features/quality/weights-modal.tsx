"use client";

import * as React from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from "lucide-react";

export interface WeightsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORY_WEIGHTS = [
  {
    name: "ATS Structure",
    weight: "20%",
    description:
      "Standard section headings, logical hierarchy, and header parseability for ATS parsers like Workday and Greenhouse.",
  },
  {
    name: "Content Quality",
    weight: "20%",
    description:
      "Action-verb prevalence, quantifiable metrics/outcomes, conciseness, and absence of generic filler buzzwords.",
  },
  {
    name: "Experience Quality",
    weight: "20%",
    description:
      "Bullet point depth, role descriptions, achievement framing, and complete employer & title data.",
  },
  {
    name: "Skills & Keywords",
    weight: "15%",
    description:
      "Skill variety, deduplication, clean categorization, and cross-referencing against experience bullets.",
  },
  {
    name: "Education & Certifications",
    weight: "10%",
    description:
      "Institution clarity, degree level formatting, graduation date patterns, and credential validity.",
  },
  {
    name: "Contact & Links",
    weight: "5%",
    description:
      "Valid email, phone, location, and parseable professional URLs (LinkedIn, GitHub, Portfolio).",
  },
  {
    name: "Formatting / Parseability",
    weight: "5%",
    description:
      "Detection of invisible text, problematic unicode, emoji overload, and margin/spacing density.",
  },
  {
    name: "Consistency",
    weight: "5%",
    description:
      "Uniform date formatting across all entries, strict reverse chronology, and duplicate detection.",
  },
];

export function WeightsModal({ open, onOpenChange }: WeightsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <DialogTitle className="text-xl font-bold">
              How Resume Quality & ATS Readiness is Calculated
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Our scoring engine is 100% deterministic and evidence-grounded. The
            score reflects parseability, structural integrity, and content
            strength.
          </DialogDescription>
        </DialogHeader>

        {/* Product Principle Disclaimer */}
        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold">Important ATS Transparency:</span>{" "}
            No software vendor can claim to mirror every proprietary ATS
            algorithm (e.g. Workday, Lever, iCIMS, Taleo) because each company
            configures screening differently. ResumeAI measures industry
            benchmarks: parseability, information architecture, action-driven
            outcomes, and keyword density.
          </div>
        </div>

        {/* Weights Table */}
        <div className="mt-6 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Weight</th>
                <th className="py-2.5 px-3">What We Evaluate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CATEGORY_WEIGHTS.map((item) => (
                <tr key={item.name} className="hover:bg-muted/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-indigo-600">
                    {item.weight}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">
                    {item.description}
                  </td>
                </tr>
              ))}
              <tr className="bg-muted/60 font-semibold">
                <td className="py-2.5 px-3">Total Weights</td>
                <td className="py-2.5 px-3 text-right text-indigo-700">100%</td>
                <td className="py-2.5 px-3 text-xs text-muted-foreground">
                  Sum of all weighted categories
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Safety Caps */}
        <div className="mt-6 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Deterministic Safety Caps
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To protect job seekers from false confidence, strict guardrails cap
            scores if fundamental resume essentials are missing:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
            <li className="p-2.5 bg-red-50 border border-red-100 rounded-md text-xs text-red-900">
              <span className="font-semibold block">Missing Contact</span>
              Capped at 40 max if email or phone is missing.
            </li>
            <li className="p-2.5 bg-amber-50 border border-amber-100 rounded-md text-xs text-amber-900">
              <span className="font-semibold block">No Experience / Projects</span>
              Capped at 20 max if work history is empty.
            </li>
            <li className="p-2.5 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-900">
              <span className="font-semibold block">Structure Breakdown</span>
              Capped at 50 max if standard sections are absent.
            </li>
          </ul>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
