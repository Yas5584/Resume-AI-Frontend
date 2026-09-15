import * as React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { FileText } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center max-w-sm mx-auto",
        className,
      )}
    >
      <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
        {icon || <FileText className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="default" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="default" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
