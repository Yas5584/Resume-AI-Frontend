"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does Fact Guard prevent AI hallucinations?",
    answer:
      "Unlike generic chatbot prompts that invent company accomplishments or exaggerate metrics, ResumeAI uses a dedicated verification pass called Fact Guard. Before any rewritten bullet is saved, it cross-references the proposed statement against your verified career history. If the AI introduces unsupported claims (like unmentioned revenue figures or fictitious tools), Fact Guard flags or blocks the addition, prompting you to provide verifiable context.",
  },
  {
    question: "Will resumes built with ResumeAI parse properly in ATS software?",
    answer:
      "Yes. Our templates and document generators are engineered specifically around modern parsing standards used by systems like Greenhouse, Lever, Workday, and Taleo. We enforce linear structural hierarchies, standard section headers, clean text tokenization, and zero invisible text tricks or multi-column layout breaks that cause ATS parsers to misread dates or job titles.",
  },
  {
    question: "Can I import my existing resume instead of starting from scratch?",
    answer:
      "Yes. You can upload an existing PDF or DOCX resume. Our structured parsing pipeline extracts your contact details, work experience, education, skills, and projects directly into the interactive editor, where you can review, refine, and tailor it.",
  },
  {
    question: "How does the Job Match scoring system work?",
    answer:
      "When you paste a target job description, ResumeAI's analyzer extracts hard technical competencies, soft skills, seniority indicators, and required tools. It compares these against your resume's stated experience to calculate a Match Score (0–100%) and provides actionable diagnostic suggestions showing which required keywords are missing or could be strengthened.",
  },
  {
    question: "Are exports free, and do they include any watermarks?",
    answer:
      "Exports in PDF and DOCX formats are 100% watermark-free on all accounts. We believe you should always own your resume content and be able to download clean, professional documents without unexpected paywalls.",
  },
  {
    question: "Can I manually edit and customize my resume at any time?",
    answer:
      "Absolutely. ResumeAI is a collaborative studio, not a black-box generator. You can manually edit every line of text, reorder sections, adjust styling accents, toggle template layouts, and accept or reject AI rewrite suggestions individually.",
  },
  {
    question: "How is my personal and career information protected?",
    answer:
      "We use encrypted cloud storage (TLS 1.3 in transit and AES-256 at rest) with strict user isolation. Your data is never sold to recruiters, shared with data brokers, or used to train general foundation models without explicit authorization.",
  },
];

export function LandingFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 bg-slate-900/40 border-b border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Clear, straightforward answers about how ResumeAI works, our verification technology, and privacy standards.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const contentId = `faq-content-${idx}`;
            const headerId = `faq-header-${idx}`;

            return (
              <div
                key={idx}
                className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-900/90 border-blue-500/50 shadow-md shadow-blue-500/5"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                }`}
              >
                <button
                  id={headerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[48px]"
                >
                  <span className="font-semibold text-white text-base sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className="px-6 pb-6 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/60"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
