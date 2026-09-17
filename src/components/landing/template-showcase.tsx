"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Layout, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface TemplateInfo {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  recommendedFor: string;
  highlights: string[];
  stylePreview: {
    fontFamily: string;
    accentColor: string;
    headerStyle: string;
    layoutType: string;
  };
}

const TEMPLATE_DETAILS: TemplateInfo[] = [
  {
    id: "modern",
    name: "Modern Standard",
    category: "Most Popular",
    tagline: "Balanced hierarchy for tech & product roles",
    description:
      "Contemporary sans-serif layout with subtle color accents and clean pill badges. Structured for rapid scanning by human screeners while guaranteeing 100% ATS tokenization.",
    recommendedFor: "Tech, Product, Marketing, Data Science & General Roles",
    highlights: [
      "Dynamic skill badges & tech stack tags",
      "Two-column contact & credential layout",
      "Optimized metric bullet spacing",
      "ATS friendly Unicode symbols",
    ],
    stylePreview: {
      fontFamily: "Inter, sans-serif",
      accentColor: "#2563eb",
      headerStyle: "Left-aligned with primary accent name and meta subtitle",
      layoutType: "Clean modern margin with compact section rules",
    },
  },
  {
    id: "classic",
    name: "Classic Serif",
    category: "Traditional",
    tagline: "Institutional elegance for formal industries",
    description:
      "Time-tested centered header with formal serif typography, horizontal rule dividers, and structured dates. Ideal for conservative industries where traditional presentation is expected.",
    recommendedFor: "Finance, Law, Investment Banking, Consulting & Academia",
    highlights: [
      "Formal serif heading hierarchy (Georgia/Times style)",
      "Traditional centered header with justified body text",
      "Subtle horizontal border rules between sections",
      "Zero non-standard symbols for legacy enterprise ATS",
    ],
    stylePreview: {
      fontFamily: "Merriweather, Georgia, serif",
      accentColor: "#334155",
      headerStyle: "Centered uppercase name with contact row divider",
      layoutType: "Full-width linear flow with horizontal dividers",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    category: "High Whitespace",
    tagline: "Streamlined elegance for maximum content density",
    description:
      "Generous whitespace, compact typography, and razor-sharp typographic contrast. Perfect for experienced software engineers and designers who want high signal-to-noise ratio.",
    recommendedFor: "Software Engineers, UX/UI Designers & Fast-Paced Startups",
    highlights: [
      "Ultra-efficient vertical density for 1-page resumes",
      "Monochrome or single subtle slate tone palette",
      "High-contrast section tags without heavy dividers",
      "Compact nested metadata (Role | Dates | Location)",
    ],
    stylePreview: {
      fontFamily: "Inter, system-ui, sans-serif",
      accentColor: "#0f172a",
      headerStyle: "Minimal left flush with inline contact anchors",
      layoutType: "High density linear flow with subtle spacing",
    },
  },
  {
    id: "executive",
    name: "Executive Leadership",
    category: "Leadership",
    tagline: "Authoritative design for directors & C-suite",
    description:
      "Commanding presence featuring an authoritative headline banner, executive summary callout, and structured corporate achievement blocks designed for board & committee reviews.",
    recommendedFor: "Directors, VPs, C-Suite, Principal Engineers & Management",
    highlights: [
      "Prominent Executive Summary & Core Competencies grid",
      "Two-tone executive accent styling",
      "Dedicated Board & Advisory / Revenue Growth blocks",
      "Distinguished header with clear seniority signaling",
    ],
    stylePreview: {
      fontFamily: "Inter, sans-serif",
      accentColor: "#1e293b",
      headerStyle: "Authoritative header block with title subtitle",
      layoutType: "Structured executive modules with bold accents",
    },
  },
];

export function LandingTemplateShowcase() {
  const { isAuthenticated } = useAuth();
  const [selectedId, setSelectedId] = useState<string>("modern");
  const activeTemplate =
    TEMPLATE_DETAILS.find((t) => t.id === selectedId) || TEMPLATE_DETAILS[0];

  const ctaHref = isAuthenticated ? "/dashboard" : "/register";

  return (
    <section id="templates" className="py-24 bg-slate-900/40 border-b border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-4">
            <Layout className="w-3.5 h-3.5" />
            <span>Built-in Design Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            ATS-Tested, Professionally Styled Templates
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Clean typographic hierarchies that ATS parsers extract without parsing errors, and hiring managers enjoy reading. Switch between templates anytime with one click.
          </p>
        </div>

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {TEMPLATE_DETAILS.map((template) => {
            const isSelected = template.id === selectedId;
            return (
              <button
                key={template.id}
                onClick={() => setSelectedId(template.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-slate-800/90 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {template.category}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
                <div className="font-semibold text-white text-sm sm:text-base">
                  {template.name}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {template.tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Template Detailed Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-slate-950/70 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          {/* Left: Template Meta & Highlights */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommended for</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {activeTemplate.name}
              </h3>
              <p className="text-sm text-blue-300 font-medium mb-4">
                {activeTemplate.recommendedFor}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {activeTemplate.description}
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Design Specifications
                </div>
                {activeTemplate.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={ctaHref}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>Use {activeTemplate.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-400">
                Included in all accounts · 1-click swap
              </span>
            </div>
          </div>

          {/* Right: Realistic Rendered Resume Paper Preview */}
          <div className="lg:col-span-7 bg-slate-900/80 rounded-xl border border-slate-800 p-4 sm:p-6 flex flex-col justify-center">
            {/* Mock A4 Paper Surface */}
            <div className="bg-white text-slate-900 rounded-lg shadow-2xl p-6 sm:p-8 font-sans max-w-xl mx-auto w-full transition-all duration-300">
              {/* Modern Template Preview */}
              {activeTemplate.id === "modern" && (
                <div className="space-y-4 text-[11px] sm:text-xs">
                  <div className="border-b-2 border-blue-600 pb-3">
                    <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                      Alex Rivera
                    </h4>
                    <p className="text-blue-600 font-semibold text-xs mt-0.5">
                      Senior Full-Stack Engineer
                    </p>
                    <p className="text-slate-500 text-[10px] mt-1">
                      San Francisco, CA · alex.rivera@example.com · github.com/alexrivera
                    </p>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-blue-600 mb-1">
                      Professional Experience
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between font-semibold text-slate-900">
                          <span>Lead Platform Engineer — HyperScale Labs</span>
                          <span className="text-slate-500 text-[10px]">2022 – Present</span>
                        </div>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-1 text-[10px] sm:text-[11px]">
                          <li>Architected distributed message pipeline ingesting 140M daily events with 99.99% uptime.</li>
                          <li>Reduced p99 GraphQL query latency by 42% via Redis multi-layer caching.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-blue-600 mb-1">
                      Key Technical Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Kafka", "Docker", "AWS"].map((s) => (
                        <span
                          key={s}
                          className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-medium border border-blue-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Classic Serif Preview */}
              {activeTemplate.id === "classic" && (
                <div className="space-y-4 text-[11px] sm:text-xs font-serif">
                  <div className="text-center border-b border-slate-400 pb-3">
                    <h4 className="text-xl sm:text-2xl font-bold tracking-wide text-slate-950 uppercase">
                      Alex Rivera
                    </h4>
                    <p className="text-slate-600 italic text-xs mt-0.5">
                      Senior Financial Systems & Infrastructure Lead
                    </p>
                    <p className="text-slate-500 text-[10px] mt-1 font-sans">
                      New York, NY | alex.rivera@example.com | (555) 234-5678
                    </p>
                  </div>

                  <div>
                    <div className="text-center font-bold uppercase tracking-widest text-[11px] text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                      Professional Experience
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Morgan Stanley — Vice President, Trading Infrastructure</span>
                          <span className="text-slate-600 text-[10px] font-normal">2021 – Present</span>
                        </div>
                        <p className="text-slate-600 text-[10px] sm:text-[11px] mt-1 leading-relaxed">
                          Managed execution architecture across institutional equities routing, delivering zero trade discrepancy across $12B quarterly volume.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-center font-bold uppercase tracking-widest text-[11px] text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
                      Education & Honors
                    </div>
                    <div className="flex justify-between text-[10px] sm:text-[11px]">
                      <span className="font-semibold text-slate-900">B.S. in Computer Science — Columbia University</span>
                      <span className="text-slate-600">Magna Cum Laude</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Minimal Clean Preview */}
              {activeTemplate.id === "minimal" && (
                <div className="space-y-3 text-[11px] sm:text-xs font-sans">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-slate-950">
                        Alex Rivera
                      </h4>
                      <p className="text-slate-600 text-xs">Software Engineer</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      <div>alex@rivera.dev</div>
                      <div>github.com/alexrivera</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Work Experience
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between font-semibold text-slate-900 text-xs">
                          <span>Staff Engineer · Vercel</span>
                          <span className="text-slate-400 text-[10px]">2023 – Present</span>
                        </div>
                        <p className="text-slate-600 text-[10px] sm:text-[11px] mt-0.5">
                          Built edge streaming runtime features serving 85k developers globally. Shipped zero-dependency telemetry protocol.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Technologies
                    </div>
                    <p className="text-slate-700 text-[10px] sm:text-[11px]">
                      Rust, TypeScript, Go, React Server Components, WebAssembly, SQLite
                    </p>
                  </div>
                </div>
              )}

              {/* Executive Leadership Preview */}
              {activeTemplate.id === "executive" && (
                <div className="space-y-4 text-[11px] sm:text-xs font-sans">
                  <div className="bg-slate-900 text-white p-4 rounded -mx-2 -mt-2">
                    <h4 className="text-xl sm:text-2xl font-bold tracking-tight">
                      Alex Rivera
                    </h4>
                    <p className="text-blue-300 text-xs font-medium uppercase tracking-wider mt-0.5">
                      VP of Engineering & Technology Operations
                    </p>
                    <div className="flex gap-3 text-slate-400 text-[10px] mt-2">
                      <span>alex.rivera@executive.com</span>
                      <span>•</span>
                      <span>San Francisco, CA</span>
                      <span>•</span>
                      <span>linkedin.com/in/alexrivera-vp</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-900 pb-0.5 mb-1.5">
                      Executive Summary
                    </div>
                    <p className="text-slate-600 text-[10px] sm:text-[11px] leading-relaxed">
                      Engineering executive with 14+ years scaling high-growth SaaS and enterprise data platforms from series A through \$120M ARR. Champion of developer velocity and high-integrity architectures.
                    </p>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-900 pb-0.5 mb-1.5">
                      Executive Leadership History
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>VP Engineering — CloudMatrix Global</span>
                        <span className="text-slate-500 text-[10px] font-normal">2020 – Present</span>
                      </div>
                      <p className="text-slate-600 text-[10px] sm:text-[11px]">
                        Scaled multi-national engineering org from 42 to 180+ engineers across 4 business units.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
