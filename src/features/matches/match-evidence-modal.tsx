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
import { Badge } from "../../components/ui/badge";
import {
  Quote,
  FileText,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { MatchedSkillItem, MatchedRequirementItem } from "@resumeai/shared";

interface MatchEvidenceModalProps {
  item: MatchedSkillItem | MatchedRequirementItem | null;
  onClose: () => void;
}

export function MatchEvidenceModal({ item, onClose }: MatchEvidenceModalProps) {
  if (!item) return null;

  const isSkill = "skill" in item;
  const name = isSkill
    ? (item as MatchedSkillItem).skill
    : (item as MatchedRequirementItem).requirement;
  const status = item.matchType;

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant={
              status === "MATCHED"
                ? "default"
                : status === "PARTIAL"
                  ? "secondary"
                  : "destructive"
            }
          >
            {status === "MATCHED" && (
              <CheckCircle2 className="w-3 h-3 mr-1 inline" />
            )}
            {status === "PARTIAL" && (
              <AlertCircle className="w-3 h-3 mr-1 inline" />
            )}
            {status === "MISSING" && (
              <HelpCircle className="w-3 h-3 mr-1 inline" />
            )}
            {status === "MISSING" ? "NOT FOUND IN RESUME" : status}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {item.importance}
          </Badge>
        </div>
        <DialogTitle className="text-xl font-bold">{name}</DialogTitle>
        <DialogDescription>
          {isSkill
            ? "Skill overlap analysis and resume evidence"
            : "Job requirement satisfaction and context"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-3">
        {/* Partial explanation */}
        {status === "PARTIAL" && item.reason && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Partial Match Explanation:
            </div>
            {item.reason}
          </div>
        )}

        {/* Missing explanation */}
        {status === "MISSING" && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700">
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              Status Note:
            </div>
            This requirement was not explicitly detected in your resume text. It
            does not necessarily mean you lack the qualification—consider adding
            relevant experience or coursework if applicable.
          </div>
        )}

        {/* Resume Evidence */}
        {item.resumeEvidence && item.resumeEvidence.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Found in Resume
            </div>
            <div className="space-y-2">
              {item.resumeEvidence.map((quote, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-muted/40 rounded-lg border text-sm space-y-1"
                >
                  <div className="text-muted-foreground italic flex gap-2">
                    <Quote className="w-4 h-4 flex-shrink-0 text-muted-foreground/50" />
                    <span>&ldquo;{quote}&rdquo;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Requirement Evidence */}
        {item.jobEvidence && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Job Description Context
            </div>
            <div className="p-3 bg-muted/20 rounded-lg border text-sm text-muted-foreground italic flex gap-2">
              <Quote className="w-4 h-4 flex-shrink-0 text-muted-foreground/50" />
              <span>&ldquo;{item.jobEvidence}&rdquo;</span>
            </div>
          </div>
        )}

        {/* Confidence metric */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Match Confidence</span>
          <span className="font-semibold text-foreground">
            {Math.round((item.confidence || 1.0) * 100)}%
          </span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
