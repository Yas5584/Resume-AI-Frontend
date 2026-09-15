"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/button";

interface StaleWarningBannerProps {
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function StaleWarningBanner({
  onRegenerate,
  isRegenerating = false,
}: StaleWarningBannerProps) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-sm">Suggestions are Stale</h4>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            These suggestions were generated from an older version of your
            resume or job description. To ensure 100% accuracy, regenerate
            recommendations before applying.
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-medium shrink-0 gap-1.5"
        disabled={isRegenerating}
        onClick={onRegenerate}
      >
        <RefreshCw
          className={
            isRegenerating ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"
          }
        />
        {isRegenerating ? "Regenerating..." : "Generate New Suggestions"}
      </Button>
    </div>
  );
}
