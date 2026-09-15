import Link from "next/link";
import { Button } from "../components/ui/button";
import { Sparkles, ShieldCheck, Target, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {/* Navigation */}
      <header className="border-b border-border bg-white px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2 font-bold text-xl text-foreground">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span>ResumeAI</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Phase 0: Production Architecture Established</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
            AI-Powered Resumes with{" "}
            <span className="text-primary underline decoration-primary/30">
              Zero Hallucination
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build, tailor, and optimize your resume for applicant tracking
            systems. Backed by verified fact-checking, multi-agent evaluation,
            and enterprise-grade reliability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Open Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
            <div className="p-6 rounded-lg border border-border bg-white shadow-sm space-y-2">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">
                Targeted Job Tailoring
              </h3>
              <p className="text-sm text-muted-foreground">
                Deep job description extraction, keyword mapping, and strategic
                positioning.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-white shadow-sm space-y-2">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">
                Fact Guard Protection
              </h3>
              <p className="text-sm text-muted-foreground">
                Zero hallucination policy with four-state evidence verification
                for every claim.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-white shadow-sm space-y-2">
              <div className="h-10 w-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">
                Multi-Agent Intelligence
              </h3>
              <p className="text-sm text-muted-foreground">
                Specialized agents for intake, strategy, content, ATS
                compliance, and review.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-6 text-center text-xs text-muted-foreground">
        <p>© 2026 ResumeAI. Production SaaS Platform.</p>
      </footer>
    </div>
  );
}
