"use client";

import Link from "next/link";
import { Sparkles, ArrowUp } from "lucide-react";

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white font-bold text-lg tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>ResumeAI</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              AI-powered, evidence-backed resume engineering. Designed to prevent unsupported claims, optimize ATS parseability, and align applications to target roles.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
              <span className="text-slate-600">·</span>
              <span>v1.0.0 Production</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#fact-guard" className="hover:text-white transition-colors">
                  Fact Guard Verification
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white transition-colors">
                  ATS Templates
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing & Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Platform & Workflows */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Workflows
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Job Match Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  PDF / Word Import
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  ATS Compliance Audit
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Evidence-Based Rewriting
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Account & Trust */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Account & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Data Security & Privacy
                </a>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Back to Top */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            © {new Date().getFullYear()} ResumeAI Inc. All rights reserved. ResumeAI is engineered to optimize resume clarity and ATS parseability based on candidate-provided inputs. We do not falsify credentials.
          </p>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-md hover:bg-slate-900 cursor-pointer"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
