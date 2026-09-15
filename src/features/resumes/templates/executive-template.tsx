import * as React from "react";
import { TemplateProps } from "./template.interface";
import {
  getFontFamilyStyle,
  getFontSizeClasses,
  getSpacingClasses,
  getMarginClasses,
  getAccentStyles,
  sanitizeUrl,
} from "./style-helpers";

export function ExecutiveTemplate({ data, config }: TemplateProps) {
  const fontStyle = getFontFamilyStyle(config.fontFamily || "Times New Roman");
  const fontClasses = getFontSizeClasses(config.fontSize || "md");
  const spacing = getSpacingClasses(config.spacing || "comfortable");
  const marginClass = getMarginClasses(config.margins || "normal");
  const accent = getAccentStyles(config.accentColor || "navy");

  const {
    personalInfo = {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    summary = "",
    experience = [],
    education = [],
    projects = [],
    skills = [],
    certifications = [],
    achievements = [],
    languages = [],
    links = [],
    sectionVisibility = {
      showSummary: true,
      showExperience: true,
      showEducation: true,
      showProjects: true,
      showSkills: true,
      showCertifications: true,
      showAchievements: true,
      showLanguages: true,
      showLinks: true,
    },
    sectionOrder = [
      "summary",
      "experience",
      "education",
      "projects",
      "skills",
      "certifications",
      "achievements",
      "languages",
      "links",
    ],
  } = data;

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary": {
        if (!sectionVisibility.showSummary || !summary?.trim()) return null;
        return (
          <section key="summary" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Executive Summary
            </h2>
            <p
              className={`${fontClasses.body} text-neutral-800 leading-relaxed font-normal`}
            >
              {summary}
            </p>
          </section>
        );
      }

      case "experience": {
        if (!sectionVisibility.showExperience || experience.length === 0)
          return null;
        return (
          <section key="experience" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Executive Experience
            </h2>
            <div className={spacing.items}>
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span
                      className={`${fontClasses.itemTitle} font-bold text-neutral-900`}
                    >
                      {exp.position || exp.jobTitle}
                    </span>
                    <span
                      className={`${fontClasses.meta} font-semibold text-neutral-600`}
                    >
                      {exp.startDate} –{" "}
                      {exp.current ? "Present" : exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span
                      className={`${fontClasses.itemSub} font-semibold`}
                      style={{ color: accent.hex }}
                    >
                      {exp.company}
                    </span>
                    {exp.location && (
                      <span className={`${fontClasses.meta} text-neutral-500`}>
                        {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      className={`list-disc list-outside ml-4 text-neutral-800 ${spacing.listGap} ${fontClasses.body}`}
                    >
                      {exp.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "education": {
        if (!sectionVisibility.showEducation || education.length === 0)
          return null;
        return (
          <section key="education" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Education & Credentials
            </h2>
            <div className={spacing.items}>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span
                      className={`${fontClasses.itemTitle} font-bold text-neutral-900`}
                    >
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </span>
                    <span className={`${fontClasses.meta} text-neutral-600`}>
                      {edu.startDate ? `${edu.startDate} – ` : ""}
                      {edu.current ? "Present" : edu.endDate || ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-neutral-700">
                    <span
                      className={`${fontClasses.itemSub} font-medium`}
                      style={{ color: accent.hex }}
                    >
                      {edu.institution}
                    </span>
                    {edu.location && (
                      <span className={fontClasses.meta}>• {edu.location}</span>
                    )}
                    {edu.honors && edu.honors.length > 0 && (
                      <span className={fontClasses.meta}>
                        • {edu.honors.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "projects": {
        if (!sectionVisibility.showProjects || projects.length === 0)
          return null;
        return (
          <section key="projects" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Key Initiatives & Strategic Projects
            </h2>
            <div className={spacing.items}>
              {projects.map((proj) => {
                const safeUrl = sanitizeUrl(proj.url);
                const projectBullets =
                  proj.bullets && proj.bullets.length > 0
                    ? proj.bullets
                    : proj.highlights;
                return (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                      <span
                        className={`${fontClasses.itemTitle} font-bold text-neutral-900`}
                      >
                        {proj.name}
                        {proj.role && ` — ${proj.role}`}
                      </span>
                      {safeUrl && (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${fontClasses.meta} underline font-medium`}
                          style={{ color: accent.hex }}
                        >
                          Overview ↗
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className={`${fontClasses.body} text-neutral-800`}>
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p
                        className={`${fontClasses.meta} text-neutral-600 font-medium`}
                      >
                        Focus Areas: {proj.technologies.join(" | ")}
                      </p>
                    )}
                    {projectBullets && projectBullets.length > 0 && (
                      <ul
                        className={`list-disc list-outside ml-4 text-neutral-800 ${spacing.listGap} ${fontClasses.body}`}
                      >
                        {projectBullets.map((hl, i) => (
                          <li key={i}>{hl}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      }

      case "skills": {
        if (!sectionVisibility.showSkills || skills.length === 0) return null;
        return (
          <section key="skills" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Core Competencies & Leadership Scope
            </h2>
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${spacing.items}`}>
              {skills.map((skillGroup) => (
                <div key={skillGroup.id} className="space-y-1">
                  <span
                    className={`${fontClasses.itemTitle} font-bold block text-neutral-900`}
                  >
                    {skillGroup.category}
                  </span>
                  <p className={`${fontClasses.body} text-neutral-700`}>
                    {skillGroup.skills.join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "certifications": {
        if (
          !sectionVisibility.showCertifications ||
          certifications.length === 0
        )
          return null;
        return (
          <section key="certifications" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Board & Professional Certifications
            </h2>
            <div className={spacing.items}>
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex justify-between items-baseline"
                >
                  <span
                    className={`${fontClasses.body} text-neutral-900 font-medium`}
                  >
                    <strong>{cert.name}</strong> — {cert.issuer}
                  </span>
                  {cert.issueDate && (
                    <span className={`${fontClasses.meta} text-neutral-600`}>
                      {cert.issueDate}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "achievements": {
        if (!sectionVisibility.showAchievements || achievements.length === 0)
          return null;
        return (
          <section key="achievements" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Selected Honors & Impact
            </h2>
            <div className={spacing.items}>
              {achievements.map((ach) => (
                <div key={ach.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span
                      className={`${fontClasses.itemTitle} font-bold text-neutral-900`}
                    >
                      {ach.title}
                    </span>
                    {ach.date && (
                      <span className={`${fontClasses.meta} text-neutral-600`}>
                        {ach.date}
                      </span>
                    )}
                  </div>
                  {ach.description && (
                    <p className={`${fontClasses.body} text-neutral-800`}>
                      {ach.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      }

      case "languages": {
        if (!sectionVisibility.showLanguages || languages.length === 0)
          return null;
        return (
          <section key="languages" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Global Languages
            </h2>
            <p className={`${fontClasses.body} text-neutral-800`}>
              {languages
                .map(
                  (l) =>
                    `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
                )
                .join(" • ")}
            </p>
          </section>
        );
      }

      case "links": {
        if (!sectionVisibility.showLinks || links.length === 0) return null;
        return (
          <section key="links" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-bold tracking-widest uppercase pl-3 border-l-4`}
              style={{ borderColor: accent.hex, color: accent.hex }}
            >
              Affiliations & Profiles
            </h2>
            <div className={`flex flex-wrap gap-x-4 ${fontClasses.body}`}>
              {links.map((link) => {
                const safeUrl = sanitizeUrl(link.url);
                return safeUrl ? (
                  <a
                    key={link.id}
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                    style={{ color: accent.hex }}
                  >
                    {link.label || link.url} ↗
                  </a>
                ) : (
                  <span key={link.id}>{link.label}</span>
                );
              })}
            </div>
          </section>
        );
      }

      default:
        return null;
    }
  };

  const safeWebsite = sanitizeUrl(personalInfo.website);
  const safeLinkedin = sanitizeUrl(personalInfo.linkedin);
  const safeGithub = sanitizeUrl(personalInfo.github);

  return (
    <div
      style={fontStyle}
      className={`w-full bg-white text-neutral-900 ${marginClass} ${fontClasses.root}`}
    >
      {/* Executive Header with divider bar */}
      <header className={spacing.headerGap}>
        <div className="border-b-2 pb-3" style={{ borderColor: accent.hex }}>
          <h1
            className={`${fontClasses.name} font-extrabold uppercase tracking-tight text-neutral-950`}
          >
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          {personalInfo.headline && (
            <p
              className={`${fontClasses.role} font-semibold uppercase tracking-widest mt-1`}
              style={{ color: accent.hex }}
            >
              {personalInfo.headline}
            </p>
          )}
          <div
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-600 ${fontClasses.meta} mt-2`}
          >
            {personalInfo.location && (
              <span className="font-medium">{personalInfo.location}</span>
            )}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:underline"
              >
                | {personalInfo.email}
              </a>
            )}
            {safeWebsite && (
              <a
                href={safeWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: accent.hex }}
              >
                | {personalInfo.website?.replace(/^https?:\/\//, "")}
              </a>
            )}
            {safeLinkedin && (
              <a
                href={safeLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: accent.hex }}
              >
                | LinkedIn
              </a>
            )}
            {safeGithub && (
              <a
                href={safeGithub}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: accent.hex }}
              >
                | GitHub
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Sections Ordered */}
      <div className={spacing.sections}>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </div>
    </div>
  );
}
