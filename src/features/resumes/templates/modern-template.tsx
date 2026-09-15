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

export function ModernTemplate({ data, config }: TemplateProps) {
  const fontStyle = getFontFamilyStyle(config.fontFamily);
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Professional Summary
              </h2>
            </div>
            <p
              className={`${fontClasses.body} text-neutral-700 whitespace-pre-line`}
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Work Experience
              </h2>
            </div>
            <div className={spacing.items}>
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`${fontClasses.itemTitle} text-neutral-900`}
                      >
                        {exp.position || exp.jobTitle || "Position"}
                      </span>
                      <span
                        className={`${fontClasses.itemSub} font-medium text-neutral-600`}
                      >
                        • {exp.company || "Company"}
                      </span>
                    </div>
                    <span
                      className={`${fontClasses.meta} font-medium text-neutral-500`}
                    >
                      {exp.startDate} –{" "}
                      {exp.current ? "Present" : exp.endDate || "Present"}
                      {exp.location ? ` | ${exp.location}` : ""}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul
                      className={`list-disc list-outside ml-4 text-neutral-700 ${spacing.listGap} ${fontClasses.body}`}
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Education
              </h2>
            </div>
            <div className={spacing.items}>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span
                      className={`${fontClasses.itemTitle} text-neutral-900`}
                    >
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
                    </span>
                    <span
                      className={`${fontClasses.meta} font-medium text-neutral-500`}
                    >
                      {edu.startDate ? `${edu.startDate} – ` : ""}
                      {edu.current ? "Present" : edu.endDate || ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-neutral-600">
                    <span className={`${fontClasses.itemSub} font-medium`}>
                      {edu.institution}
                    </span>
                    {edu.location && (
                      <span className={fontClasses.meta}>• {edu.location}</span>
                    )}
                    {edu.gpa && (
                      <span className={fontClasses.meta}>• GPA: {edu.gpa}</span>
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Projects
              </h2>
            </div>
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
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`${fontClasses.itemTitle} text-neutral-900`}
                        >
                          {proj.name}
                        </span>
                        {proj.role && (
                          <span
                            className={`${fontClasses.itemSub} text-neutral-600`}
                          >
                            ({proj.role})
                          </span>
                        )}
                      </div>
                      {safeUrl && (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${fontClasses.meta} hover:underline font-medium`}
                          style={{ color: accent.hex }}
                        >
                          View Project ↗
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className={`${fontClasses.body} text-neutral-700`}>
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div
                        className={`flex flex-wrap items-center ${spacing.badgeGap}`}
                      >
                        {proj.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className={`${fontClasses.badge} rounded font-medium bg-neutral-100 text-neutral-800 border border-neutral-200`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {projectBullets && projectBullets.length > 0 && (
                      <ul
                        className={`list-disc list-outside ml-4 text-neutral-700 ${spacing.listGap} ${fontClasses.body}`}
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Skills & Competencies
              </h2>
            </div>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${spacing.badgeGap}`}
            >
              {skills.map((skillGroup) => (
                <div key={skillGroup.id} className="space-y-1">
                  <span
                    className={`${fontClasses.itemTitle} text-neutral-900 block`}
                  >
                    {skillGroup.category}
                  </span>
                  <div className={`flex flex-wrap ${spacing.badgeGap}`}>
                    {skillGroup.skills.map((item, i) => (
                      <span
                        key={i}
                        className={`${fontClasses.badge} rounded font-medium bg-neutral-100 text-neutral-800 border border-neutral-200`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Certifications
              </h2>
            </div>
            <div className={spacing.items}>
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex justify-between items-baseline"
                >
                  <div>
                    <span
                      className={`${fontClasses.itemTitle} text-neutral-900`}
                    >
                      {cert.name}
                    </span>
                    <span
                      className={`${fontClasses.itemSub} text-neutral-600 ml-2`}
                    >
                      — {cert.issuer}
                    </span>
                  </div>
                  {cert.issueDate && (
                    <span className={`${fontClasses.meta} text-neutral-500`}>
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Key Achievements
              </h2>
            </div>
            <div className={spacing.items}>
              {achievements.map((ach) => (
                <div key={ach.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span
                      className={`${fontClasses.itemTitle} text-neutral-900`}
                    >
                      {ach.title}
                    </span>
                    {ach.date && (
                      <span className={`${fontClasses.meta} text-neutral-500`}>
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
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Languages
              </h2>
            </div>
            <div className={`flex flex-wrap ${spacing.badgeGap}`}>
              {languages.map((lang) => (
                <span
                  key={lang.id}
                  className={`${fontClasses.badge} rounded font-medium bg-neutral-100 text-neutral-800 border border-neutral-200`}
                >
                  <strong className="font-semibold">{lang.language}</strong>
                  {lang.proficiency ? ` (${lang.proficiency})` : ""}
                </span>
              ))}
            </div>
          </section>
        );
      }

      case "links": {
        if (!sectionVisibility.showLinks || links.length === 0) return null;
        return (
          <section key="links" className={spacing.items}>
            <div
              className="flex items-center gap-2 border-b pb-1"
              style={{ borderColor: accent.hex }}
            >
              <div
                className="w-1.5 h-3.5 rounded-sm"
                style={{ backgroundColor: accent.hex }}
              />
              <h2
                className={`${fontClasses.sectionTitle} text-neutral-900 tracking-wider`}
              >
                Additional Links
              </h2>
            </div>
            <div className={`flex flex-wrap ${spacing.badgeGap}`}>
              {links.map((link) => {
                const safeUrl = sanitizeUrl(link.url);
                return safeUrl ? (
                  <a
                    key={link.id}
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${fontClasses.body} hover:underline font-medium`}
                    style={{ color: accent.hex }}
                  >
                    {link.label || link.url} ↗
                  </a>
                ) : (
                  <span key={link.id} className={fontClasses.body}>
                    {link.label}
                  </span>
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
      {/* Header */}
      <header className={spacing.headerGap}>
        <div className="flex flex-col gap-1">
          <h1
            className={`${fontClasses.name} text-neutral-950 font-extrabold tracking-tight`}
          >
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          {personalInfo.headline && (
            <p
              className={`${fontClasses.role} font-semibold`}
              style={{ color: accent.hex }}
            >
              {personalInfo.headline}
            </p>
          )}
          {/* Contact Details */}
          <div
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-600 ${fontClasses.meta} mt-1.5`}
          >
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:underline"
              >
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
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
        </div>
      </header>

      {/* Main Sections Ordered */}
      <div className={spacing.sections}>
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </div>
    </div>
  );
}
