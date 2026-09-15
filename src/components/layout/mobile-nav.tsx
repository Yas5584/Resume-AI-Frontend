"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./sidebar";
import { cn } from "../../lib/utils";
import { X, Sparkles } from "lucide-react";

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  React.useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-border shadow-2xl flex flex-col animate-in slide-in-from-left">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 font-bold text-lg text-foreground"
          >
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="tracking-tight">ResumeAI</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
