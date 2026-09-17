"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Settings,
  Sparkles,
  Target,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../hooks/use-auth";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4 mr-3" />,
  },
  {
    label: "My Resumes",
    href: "/resumes",
    icon: <FileText className="h-4 w-4 mr-3" />,
  },
  {
    label: "Job Tracker",
    href: "/jobs",
    icon: <Briefcase className="h-4 w-4 mr-3" />,
  },
  {
    label: "Resume Quality",
    href: "/quality",
    icon: <ShieldCheck className="h-4 w-4 mr-3" />,
  },
  {
    label: "Match Analysis",
    href: "/matches",
    icon: <Target className="h-4 w-4 mr-3" />,
  },
  {
    label: "Strategy & Tailoring",
    href: "/strategies",
    icon: <Compass className="h-4 w-4 mr-3" />,
  },
  {
    label: "Content Writer",
    href: "/content-writer",
    icon: <Sparkles className="h-4 w-4 mr-3" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-4 w-4 mr-3" />,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  React.useEffect(() => {
    // Proactively prefetch all dashboard routes in the background for instant navigation
    navItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  const credits = user?.creditsBalance ?? 10;
  const maxCredits =
    user?.subscriptionTier === "ENTERPRISE"
      ? 100
      : user?.subscriptionTier === "PRO"
        ? 50
        : 10;
  const creditPercent = Math.min(100, Math.round((credits / maxCredits) * 100));

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 border-r border-border bg-white h-screen sticky top-0",
        className,
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link
          href="/dashboard"
          prefetch={true}
          className="flex items-center space-x-2 font-bold text-lg text-foreground"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="tracking-tight">ResumeAI</span>
        </Link>
      </div>

      {/* Navigation Links */}
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
              onMouseEnter={() => router.prefetch(item.href)}
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

      {/* Footer Info / Credits */}
      <div className="p-4 border-t border-border">
        <div className="bg-secondary/60 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>AI Credits ({user?.subscriptionTier || "FREE"})</span>
            <span className="font-semibold text-foreground">
              {credits} / {maxCredits}
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${creditPercent}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
