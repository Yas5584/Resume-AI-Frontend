"use client";

import * as React from "react";
import { MatchRecommendation } from "@resumeai/shared";
import { Badge } from "../../components/ui/badge";
import { Lightbulb, ChevronRight } from "lucide-react";

interface MatchRecommendationsProps {
  recommendations: MatchRecommendation[];
}

export function MatchRecommendations({
  recommendations,
}: MatchRecommendationsProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        No specific recommendations at this time.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, idx) => {
        const isHigh = rec.priority === "HIGH";
        const isMed = rec.priority === "MEDIUM";

        return (
          <div
            key={idx}
            className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <Lightbulb className="w-4 h-4" />
                </span>
                <span className="font-semibold text-sm">{rec.title}</span>
              </div>
              <Badge
                variant={
                  isHigh ? "destructive" : isMed ? "secondary" : "outline"
                }
                className="text-xs"
              >
                {rec.priority} Priority
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {rec.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
