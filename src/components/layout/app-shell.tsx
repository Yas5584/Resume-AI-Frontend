"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { useAuth } from "../../hooks/use-auth";
import { LoadingState } from "../common/loading-state";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, isLoading, isError, error, refetch } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user && !isError) {
      router.replace("/login");
    }
  }, [isLoading, user, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <LoadingState message="Verifying session..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-destructive font-medium text-center">
          Unable to connect to session verification service.
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-sm">
          {error?.message ||
            "Please check your database connection or server status."}
        </p>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs rounded-md bg-secondary text-foreground hover:bg-secondary/80 border border-border"
          >
            Retry Connection
          </button>
          <button
            onClick={() => router.replace("/login")}
            className="px-4 py-2 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 space-y-4">
        <LoadingState message="No active session found. Redirecting to sign in..." />
        <p className="text-xs text-muted-foreground text-center">
          If you are not redirected automatically,{" "}
          <Link href="/login" className="text-primary underline font-medium">
            click here to sign in
          </Link>{" "}
          or{" "}
          <Link
            href="/register"
            className="text-primary underline font-medium"
          >
            create a new account
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Slide-over */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
