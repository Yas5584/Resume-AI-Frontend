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

export function MinimalTemplate({ data, config }: TemplateProps) {
  const fontStyle = getFontFamilyStyle(config.fontFamily || "Arial");
  const fontClasses = getFontSizeClasses(config.fontSize || "sm");
  const spacing = getSpacingClasses(config.spacing || "compact");
  const marginClass = getMarginClasses(config.margins || "compact");
  const accent = getAccentStyles(config.accentColor || "charcoal");

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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              About
            </h2>
            <p
              className={`${fontClasses.body} text-neutral-800 leading-relaxed`}
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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Experience
            </h2>
            <div className={spacing.items}>
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span
                      className={`${fontClasses.itemTitle} font-semibold text-neutral-900`}
                    >
                      {exp.position || exp.jobTitle}{" "}
                      <span className="font-normal text-neutral-500">
                        at {exp.company}
                      </span>
                    </span>
                    <span
                      className={`${fontClasses.meta} text-neutral-400 font-mono`}
                    >
                      {exp.startDate} –{" "}
                      {exp.current ? "Now" : exp.endDate || "Now"}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      className={`list-none space-y-1 text-neutral-700 ${fontClasses.body} pl-2 border-l border-neutral-200 my-1`}
                    >
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="relative pl-2">
                          <span className="absolute left-0 text-neutral-400">
                            •
                          </span>
                          {bullet}
                        </li>
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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Education
            </h2>
            <div className={spacing.items}>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span
                      className={`${fontClasses.itemTitle} font-semibold text-neutral-900`}
                    >
                      {edu.degree}
                      {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                    </span>
                    <span
                      className={`${fontClasses.meta} text-neutral-400 font-mono`}
                    >
                      {edu.startDate ? `${edu.startDate} – ` : ""}
                      {edu.current ? "Now" : edu.endDate || ""}
                    </span>
                  </div>
                  <div className={`text-neutral-500 ${fontClasses.itemSub}`}>
                    {edu.institution}
                    {edu.location ? ` — ${edu.location}` : ""}
                    {edu.gpa ? ` (GPA ${edu.gpa})` : ""}
                    {edu.honors && edu.honors.length > 0
                      ? ` (Honors: ${edu.honors.join(", ")})`
                      : ""}
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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Projects
            </h2>
            <div className={spacing.items}>
              {projects.map((proj) => {
                const safeUrl = sanitizeUrl(proj.url);
                const projectBullets =
                  proj.bullets && proj.bullets.length > 0
                    ? proj.bullets
                    : proj.highlights;
                return (
                  <div key={proj.id} className="space-y-0.5">
                    <div className="flex items-baseline justify-between">
                      <span
                        className={`${fontClasses.itemTitle} font-semibold text-neutral-900`}
                      >
                        {proj.name}
                        {proj.role ? ` / ${proj.role}` : ""}
                      </span>
                      {safeUrl && (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${fontClasses.meta} hover:underline font-mono`}
                          style={{ color: accent.hex }}
                        >
                          link ↗
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className={`${fontClasses.body} text-neutral-700`}>
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p
                        className={`${fontClasses.meta} text-neutral-500 font-mono`}
                      >
                        [{proj.technologies.join(", ")}]
                      </p>
                    )}
                    {projectBullets && projectBullets.length > 0 && (
                      <ul
                        className={`list-none space-y-1 text-neutral-700 ${fontClasses.body} pl-2 border-l border-neutral-200 my-1`}
                      >
                        {projectBullets.map((hl, i) => (
                          <li key={i} className="relative pl-2">
                            <span className="absolute left-0 text-neutral-400">
                              •
                            </span>
                            {hl}
                          </li>
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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Skills
            </h2>
            <div className={`space-y-1 ${fontClasses.body}`}>
              {skills.map((skillGroup) => (
                <div
                  key={skillGroup.id}
                  className="flex flex-wrap items-baseline gap-2"
                >
                  <span className="font-semibold text-neutral-900 text-xs w-28 shrink-0">
                    {skillGroup.category}
                  </span>
                  <span className="text-neutral-700">
                    {skillGroup.skills.join(" · ")}
                  </span>
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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Certifications
            </h2>
            <div className={spacing.items}>
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex justify-between items-baseline"
                >
                  <span className={`${fontClasses.body} text-neutral-800`}>
                    <strong className="font-semibold text-neutral-900">
                      {cert.name}
                    </strong>{" "}
                    — {cert.issuer}
                  </span>
                  {cert.issueDate && (
                    <span
                      className={`${fontClasses.meta} text-neutral-400 font-mono`}
                    >
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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Achievements
            </h2>
            <div className={spacing.items}>
              {achievements.map((ach) => (
                <div key={ach.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span
                      className={`${fontClasses.itemTitle} font-semibold text-neutral-900`}
                    >
                      {ach.title}
                    </span>
                    {ach.date && (
                      <span
                        className={`${fontClasses.meta} text-neutral-400 font-mono`}
                      >
                        {ach.date}
                      </span>
                    )}
                  </div>
                  {ach.description && (
                    <p className={`${fontClasses.body} text-neutral-700`}>
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
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Languages
            </h2>
            <p className={`${fontClasses.body} text-neutral-700`}>
              {languages
                .map(
                  (l) =>
                    `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`,
                )
                .join(" · ")}
            </p>
          </section>
        );
      }

      case "links": {
        if (!sectionVisibility.showLinks || links.length === 0) return null;
        return (
          <section key="links" className={spacing.items}>
            <h2
              className={`${fontClasses.sectionTitle} font-semibold text-neutral-400 tracking-wider`}
            >
              Links
            </h2>
            <div className={`flex flex-wrap gap-x-3 ${fontClasses.body}`}>
              {links.map((link) => {
                const safeUrl = sanitizeUrl(link.url);
                return safeUrl ? (
                  <a
                    key={link.id}
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-mono"
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
      {/* Streamlined Minimal Header */}
      <header className={spacing.headerGap}>
        <h1
          className={`${fontClasses.name} font-light tracking-tight text-neutral-900`}
        >
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.headline && (
          <p
            className={`${fontClasses.role} font-normal text-neutral-500 mt-0.5`}
          >
            {personalInfo.headline}
          </p>
        )}
        <div
          className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 text-neutral-500 ${fontClasses.meta} mt-2 font-mono`}
        >
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="hover:underline text-neutral-700"
            >
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && <span>· {personalInfo.phone}</span>}
          {personalInfo.location && <span>· {personalInfo.location}</span>}
          {safeWebsite && (
            <a
              href={safeWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: accent.hex }}
            >
              · web
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
              · in
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
              · git
            </a>
          )}
        </div>
      </header>

      {/* Main Sections */}
      <div className={spacing.sections}>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </div>
    </div>
  );
}
