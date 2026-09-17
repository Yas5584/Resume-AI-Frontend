import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ResumeAI — Build Job-Tailored Resumes with AI",
  description:
    "Build and tailor professional resumes for specific jobs with evidence-backed AI suggestions, resume matching, Fact Guard, and PDF/DOCX export.",
  keywords: [
    "AI resume builder",
    "resume tailoring",
    "job description match",
    "ATS resume checker",
    "Fact Guard resume",
    "PDF resume export",
    "DOCX resume export",
  ],
  authors: [{ name: "ResumeAI" }],
  openGraph: {
    title: "ResumeAI — Build Job-Tailored Resumes with AI",
    description:
      "Build and tailor professional resumes for specific jobs with evidence-backed AI suggestions, resume matching, Fact Guard, and PDF/DOCX export.",
    type: "website",
    siteName: "ResumeAI",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeAI — Build Job-Tailored Resumes with AI",
    description:
      "Build and tailor professional resumes for specific jobs with evidence-backed AI suggestions, resume matching, Fact Guard, and PDF/DOCX export.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
