import { LandingNavbar } from "@/components/landing/navbar";
import { LandingHero } from "@/components/landing/hero";
import { LandingProductPreview } from "@/components/landing/product-preview";
import { LandingValueStrip } from "@/components/landing/value-strip";
import { LandingProblemSection } from "@/components/landing/problem-section";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingFactGuard } from "@/components/landing/fact-guard";
import { LandingJobMatch } from "@/components/landing/job-match";
import { LandingAgentWorkflow } from "@/components/landing/agent-workflow";
import { LandingFeaturesGrid } from "@/components/landing/features-grid";
import { LandingTemplateShowcase } from "@/components/landing/template-showcase";
import { LandingPricingTeaser } from "@/components/landing/pricing-teaser";
import { LandingFaqSection } from "@/components/landing/faq-section";
import { LandingFinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Sticky, blur Navigation with auth awareness & mobile drawer */}
      <LandingNavbar />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <LandingHero />

        {/* Realistic Interactive Product UI Mockup */}
        <LandingProductPreview />

        {/* 4-point Value Metric Strip */}
        <LandingValueStrip />

        {/* Before / Problem vs ResumeAI Solution */}
        <LandingProblemSection />

        {/* 4-Step Interactive Timeline */}
        <LandingHowItWorks />

        {/* Fact Guard Hallucination Prevention Feature */}
        <LandingFactGuard />

        {/* Job Match & Keyword Diagnostic Engine */}
        <LandingJobMatch />

        {/* Multi-Agent Architecture Pipeline */}
        <LandingAgentWorkflow />

        {/* Core Capabilities 8-card Grid */}
        <LandingFeaturesGrid />

        {/* ATS-Tested Template Showcase */}
        <LandingTemplateShowcase />

        {/* Honest Pricing & Roadmap Tier */}
        <LandingPricingTeaser />

        {/* Accessible FAQ Accordion */}
        <LandingFaqSection />

        {/* Closing Conversion CTA Banner */}
        <LandingFinalCta />
      </main>

      {/* Production-Grade Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
