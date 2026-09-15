"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "../../../hooks/use-auth";
import {
  ResumeSummary,
  resumesService,
} from "../../../services/resumes.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { EmptyState } from "../../../components/common/empty-state";
import {
  FileText,
  Plus,
  Briefcase,
  Zap,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = React.useState<ResumeSummary[]>([]);
  const [totalResumes, setTotalResumes] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await resumesService.list(1, 5);
        setResumes(data.items || []);
        setTotalResumes(data.total || 0);
      } catch (err) {
        console.error("Failed to load dashboard resumes", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build, edit, and organize your resumes with deterministic ATS
            optimization.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/resumes/new">
            <Button size="md">
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resumes Created
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : totalResumes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active resume documents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subscription
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {user?.subscriptionTier
                ? user.subscriptionTier.toLowerCase()
                : "Free"}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Standard access active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Credits
            </CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.creditsBalance ?? 10}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Reserved for future AI tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resume Builder
            </CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Ready</div>
            <p className="text-xs text-muted-foreground mt-1">
              Phase 2 Deterministic Core
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Resumes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Resumes
            </h2>
            {resumes.length > 0 && (
              <Link
                href="/resumes"
                className="text-xs font-medium text-primary hover:underline"
              >
                View All ({totalResumes})
              </Link>
            )}
          </div>

          {loading && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
              Loading your recent resumes...
            </div>
          )}

          {!loading && resumes.length === 0 && (
            <EmptyState
              title="No resumes yet"
              description="Get started by creating your first resume in our builder."
              actionLabel="Create Resume"
              actionHref="/resumes/new"
            />
          )}

          {!loading && resumes.length > 0 && (
            <Card className="divide-y divide-border border border-border">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                        {resume.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                        <Calendar className="h-3 w-3 mr-1" />
                        Updated{" "}
                        {new Date(resume.updatedAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                        {resume.targetRole && ` • ${resume.targetRole}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">
                      {resume.currentTemplateId || "Modern Standard"}
                    </Badge>
                    <Link href={`/resumes/${resume.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Right Col: Quick Actions & Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Quick Actions
          </h2>
          <Card className="p-5 space-y-4 border border-border">
            <div className="space-y-2">
              <Link href="/resumes/new" className="block">
                <Button className="w-full justify-start text-xs" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  Create New Master Resume
                </Button>
              </Link>
              <Link href="/resumes" className="block">
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs"
                  size="sm"
                >
                  <FileText className="h-3.5 w-3.5 mr-2" />
                  Browse All Resumes
                </Button>
              </Link>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Builder Features
              </h3>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li className="flex items-center text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  10 Structured Data Sections
                </li>
                <li className="flex items-center text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Debounced Autosave (1500ms)
                </li>
                <li className="flex items-center text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Live Deterministic Preview
                </li>
                <li className="flex items-center text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                  Version Snapshots & Restore
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
