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

export function ClassicTemplate({ data, config }: TemplateProps) {
  const fontStyle = getFontFamilyStyle(config.fontFamily || "Georgia");
  const fontClasses = getFontSizeClasses(config.fontSize);
  const spacing = getSpacingClasses(config.spacing);
  const marginClass = getMarginClasses(config.margins);
  const accent = getAccentStyles(config.accentColor);

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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Summary
            </h2>
            <p
              className={`${fontClasses.body} text-neutral-800 text-justify leading-relaxed`}
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Professional Experience
            </h2>
            <div className={spacing.items}>
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span
                      className={`${fontClasses.itemTitle} font-bold text-neutral-900`}
                    >
                      {exp.company}
                    </span>
                    <span
                      className={`${fontClasses.meta} italic text-neutral-700`}
                    >
                      {exp.startDate} –{" "}
                      {exp.current ? "Present" : exp.endDate || "Present"}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span
                      className={`${fontClasses.itemSub} italic text-neutral-800`}
                    >
                      {exp.position || exp.jobTitle}
                    </span>
                    {exp.location && (
                      <span className={`${fontClasses.meta} text-neutral-600`}>
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Education
            </h2>
            <div className={spacing.items}>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span
                      className={`${fontClasses.itemTitle} font-bold text-neutral-900`}
                    >
                      {edu.institution}
                    </span>
                    <span
                      className={`${fontClasses.meta} italic text-neutral-700`}
                    >
                      {edu.startDate ? `${edu.startDate} – ` : ""}
                      {edu.current ? "Present" : edu.endDate || ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className={`${fontClasses.itemSub} text-neutral-800`}>
                      {edu.degree}
                      {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                      {edu.gpa ? ` (GPA: ${edu.gpa})` : ""}
                      {edu.honors && edu.honors.length > 0
                        ? ` — ${edu.honors.join(", ")}`
                        : ""}
                    </span>
                    {edu.location && (
                      <span className={`${fontClasses.meta} text-neutral-600`}>
                        {edu.location}
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Key Projects
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
                    <div className="flex justify-between items-baseline">
                      <span
                        className={`${fontClasses.itemTitle} font-bold text-neutral-900`}
                      >
                        {proj.name}
                        {proj.role ? ` (${proj.role})` : ""}
                      </span>
                      {safeUrl && (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${fontClasses.meta} underline`}
                          style={{ color: accent.hex }}
                        >
                          Link
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
                        className={`${fontClasses.body} text-neutral-700 italic`}
                      >
                        Tools: {proj.technologies.join(", ")}
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Skills & Qualifications
            </h2>
            <div className={`space-y-1.5 ${fontClasses.body}`}>
              {skills.map((skillGroup) => (
                <div
                  key={skillGroup.id}
                  className="flex flex-wrap items-baseline gap-1.5"
                >
                  <strong className="font-semibold text-neutral-900">
                    {skillGroup.category}:
                  </strong>
                  <span className="text-neutral-800">
                    {skillGroup.skills.join(", ")}
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Certifications
            </h2>
            <div className={spacing.items}>
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex justify-between items-baseline"
                >
                  <span className={`${fontClasses.body} text-neutral-900`}>
                    <strong>{cert.name}</strong>, {cert.issuer}
                  </span>
                  {cert.issueDate && (
                    <span
                      className={`${fontClasses.meta} italic text-neutral-600`}
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Honors & Achievements
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
                        className={`${fontClasses.meta} italic text-neutral-600`}
                      >
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Languages
            </h2>
            <p className={`${fontClasses.body} text-neutral-800 text-center`}>
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
              className={`${fontClasses.sectionTitle} font-bold text-center tracking-wider pb-1 border-b`}
              style={{ borderColor: accent.hex }}
            >
              Publications & Links
            </h2>
            <div
              className={`flex flex-wrap justify-center gap-x-4 ${fontClasses.body}`}
            >
              {links.map((link) => {
                const safeUrl = sanitizeUrl(link.url);
                return safeUrl ? (
                  <a
                    key={link.id}
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: accent.hex }}
                  >
                    {link.label || link.url}
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
      {/* Centered Traditional Header */}
      <header className={`${spacing.headerGap} text-center`}>
        <h1
          className={`${fontClasses.name} font-bold tracking-normal uppercase text-neutral-950 mb-1`}
        >
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.headline && (
          <p className={`${fontClasses.role} italic text-neutral-700 mb-1.5`}>
            {personalInfo.headline}
          </p>
        )}
        <div
          className={`flex flex-wrap justify-center items-center gap-x-2.5 text-neutral-700 ${fontClasses.meta}`}
        >
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="hover:underline"
            >
              • {personalInfo.email}
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
              • {personalInfo.website?.replace(/^https?:\/\//, "")}
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
              • LinkedIn
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
              • GitHub
            </a>
          )}
        </div>
      </header>

      {/* Main Sections Ordered */}
      <div className={spacing.sections}>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </div>
    </div>
  );
}
