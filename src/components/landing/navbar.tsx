"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/use-auth";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Protection", href: "#fact-guard" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-md shadow-lg shadow-black/20"
          : "border-b border-slate-800/40 bg-slate-950/70 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Wordmark */}
        <Link
          href="/"
          className="flex items-center space-x-2.5 font-bold text-lg tracking-tight group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1"
          aria-label="ResumeAI Home"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            ResumeAI
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center space-x-1 lg:space-x-2"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: Auth Action CTAs */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoading ? (
            <div className="h-9 w-24 bg-slate-800 animate-pulse rounded-md" />
          ) : isAuthenticated && user ? (
            <>
              <Link href="/resumes">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                  <FileText className="mr-1.5 h-3.5 w-3.5" />
                  My Resumes
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25">
                  <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                  Open Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25">
                  Get Started Free
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-slate-950/98 backdrop-blur-xl border-t border-slate-800 flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-blue-400 py-3 px-3 rounded-lg hover:bg-slate-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800 space-y-3">
            {isAuthenticated && user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full justify-center text-sm py-2.5 bg-blue-600 hover:bg-blue-500 text-white shadow-md">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Open Dashboard
                  </Button>
                </Link>
                <Link href="/resumes" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center text-sm py-2.5 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                    <FileText className="mr-2 h-4 w-4" />
                    Build a Resume
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full justify-center text-sm py-2.5 bg-blue-600 hover:bg-blue-500 text-white shadow-md">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center text-sm py-2.5 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
