"use client";

import * as React from "react";
import Link from "next/link";
import {
  ResumeData,
  createDefaultResumeData,
  TemplateConfig,
  TemplateConfigSchema,
  getDefaultTemplateConfig,
} from "@resumeai/shared";
import { ResumeDetail, resumesService } from "../../services/resumes.service";
import { ResumeRenderer } from "./renderer/resume-renderer";
import { DesignPanel } from "./design/design-panel";
import { getTemplate } from "./templates/registry";
import { PersonalInfoSection } from "./sections/personal-info-section";
import { SummarySection } from "./sections/summary-section";
import { ExperienceSection } from "./sections/experience-section";
import { EducationSection } from "./sections/education-section";
import { ProjectsSection } from "./sections/projects-section";
import { SkillsSection } from "./sections/skills-section";
import { CertificationsSection } from "./sections/certifications-section";
import { AchievementsSection } from "./sections/achievements-section";
import { LanguagesSection } from "./sections/languages-section";
import { LinksSection } from "./sections/links-section";
import { SectionSettingsModal } from "./sections/section-settings-modal";
import { VersionsModal } from "./sections/versions-modal";
import { ExportButton } from "./export/export-button";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  History,
  SlidersHorizontal,
  Eye,
  Edit3,
  Columns,
  Palette,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Award,
  Trophy,
  Languages,
  Link2,
} from "lucide-react";

interface ResumeEditorProps {
  initialResume: ResumeDetail;
}

type SaveStatus = "saved" | "saving" | "unsaved" | "error";
type MobileTab = "edit" | "design" | "preview" | "split";
type EditorMode = "content" | "design";

export function ResumeEditor({ initialResume }: ResumeEditorProps) {
  const [title, setTitle] = React.useState(initialResume.title);
  const [targetRole, setTargetRole] = React.useState(
    initialResume.targetRole || "",
  );
  const [resumeData, setResumeData] = React.useState<ResumeData>(() => {
    if (
      initialResume.resumeData &&
      Object.keys(initialResume.resumeData).length > 0
    ) {
      return {
        ...createDefaultResumeData(),
        ...initialResume.resumeData,
      };
    }
    return createDefaultResumeData();
  });

  const [templateConfig, setTemplateConfig] = React.useState<TemplateConfig>(
    () => {
      if (
        initialResume.templateConfig &&
        Object.keys(initialResume.templateConfig).length > 0
      ) {
        try {
          return TemplateConfigSchema.parse(initialResume.templateConfig);
        } catch {
          // fallback to defaults if invalid
        }
      }
      return getDefaultTemplateConfig(initialResume.currentTemplateId);
    },
  );

  const [editorMode, setEditorMode] = React.useState<EditorMode>("content");
  const [activeSection, setActiveSection] =
    React.useState<string>("personalInfo");
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("saved");
  const [, setLastSavedAt] = React.useState<Date>(new Date());
  const [mobileTab, setMobileTab] = React.useState<MobileTab>("edit");
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);
  const [versionsModalOpen, setVersionsModalOpen] = React.useState(false);

  // Debounce & Dirty tracking refs
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isDirtyRef = React.useRef(false);
  const isMountedRef = React.useRef(false);

  const triggerAutosave = React.useCallback(
    async (
      currentTitle: string,
      currentTargetRole: string,
      currentData: ResumeData,
      currentConfig: TemplateConfig,
    ) => {
      setSaveStatus("saving");
      try {
        await resumesService.update(initialResume.id, {
          title: currentTitle,
          targetRole: currentTargetRole,
          templateId: currentConfig.templateId,
          templateConfig: currentConfig,
          resumeData: currentData,
          createVersion: false, // Do not spam version snapshots on autosave
        });
        setSaveStatus("saved");
        setLastSavedAt(new Date());
        isDirtyRef.current = false;
      } catch (err) {
        console.error("Autosave failed:", err);
        setSaveStatus("error");
      }
    },
    [initialResume.id],
  );

  // Schedule autosave after 1500ms of inactivity
  const scheduleAutosave = React.useCallback(
    (
      newTitle: string,
      newTargetRole: string,
      newData: ResumeData,
      newConfig: TemplateConfig,
    ) => {
      setSaveStatus("unsaved");
      isDirtyRef.current = true;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        triggerAutosave(newTitle, newTargetRole, newData, newConfig);
      }, 1500);
    },
    [triggerAutosave],
  );

  // Mark dirty & queue autosave when content updates
  const handleDataChange = (updater: (prev: ResumeData) => ResumeData) => {
    setResumeData((prev) => {
      const next = updater(prev);
      scheduleAutosave(title, targetRole, next, templateConfig);
      return next;
    });
  };

  // Mark dirty & queue autosave when design updates
  const handleConfigChange = (updatedConfig: TemplateConfig) => {
    setTemplateConfig(updatedConfig);
    scheduleAutosave(title, targetRole, resumeData, updatedConfig);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    scheduleAutosave(newTitle, targetRole, resumeData, templateConfig);
  };

  const handleTargetRoleChange = (newRole: string) => {
    setTargetRole(newRole);
    scheduleAutosave(title, newRole, resumeData, templateConfig);
  };

  // Immediate manual save
  const handleManualSave = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    triggerAutosave(title, targetRole, resumeData, templateConfig);
  };

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (isDirtyRef.current) {
        triggerAutosave(title, targetRole, resumeData, templateConfig);
      }
    };
  }, [title, targetRole, resumeData, templateConfig, triggerAutosave]);

  const activeTemplateDef = getTemplate(templateConfig.templateId);

  const sectionsList = [
    { id: "personalInfo", label: "Personal Info", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    {
      id: "experience",
      label: "Experience",
      icon: Briefcase,
      count: resumeData.experience?.length,
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      count: resumeData.education?.length,
    },
    {
      id: "projects",
      label: "Projects",
      icon: FolderGit2,
      count: resumeData.projects?.length,
    },
    {
      id: "skills",
      label: "Skills",
      icon: Wrench,
      count: resumeData.skills?.length,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
      count: resumeData.certifications?.length,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      count: resumeData.achievements?.length,
    },
    {
      id: "languages",
      label: "Languages",
      icon: Languages,
      count: resumeData.languages?.length,
    },
    {
      id: "links",
      label: "Links",
      icon: Link2,
      count: resumeData.links?.length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Action & Status Bar */}
      <header className="bg-card border border-border rounded-lg p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Back button & Title/Role inputs */}
        <div className="flex items-start sm:items-center space-x-3">
          <Link href="/resumes">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="space-y-1 flex-1 min-w-0">
            <input
              type="text"
              className="text-base sm:text-lg font-bold text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 py-0.5 w-full max-w-sm sm:max-w-md transition-colors"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Resume Title"
            />
            <div className="flex items-center space-x-2 text-xs text-muted-foreground px-1">
              <span>Target Role:</span>
              <input
                type="text"
                className="font-medium text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 py-0.2 w-48 transition-colors"
                value={targetRole}
                onChange={(e) => handleTargetRoleChange(e.target.value)}
                placeholder="e.g. Lead Engineer"
              />
            </div>
          </div>
        </div>

        {/* Right: Autosave Status, Checkpoint, Settings & View Toggles */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 border-t md:border-t-0 pt-3 md:pt-0">
          {/* Status Indicator */}
          <div className="flex items-center space-x-1.5 text-xs text-muted-foreground mr-1 select-none">
            {saveStatus === "saving" && (
              <>
                <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                <span>Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Saved</span>
              </>
            )}
            {saveStatus === "unsaved" && (
              <>
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Unsaved</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="text-destructive underline hover:opacity-80"
                >
                  Retry
                </button>
              </>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setVersionsModalOpen(true)}
            title="Version History & Checkpoints"
          >
            <History className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="hidden sm:inline">Versions</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setSettingsModalOpen(true)}
            title="Reorder or toggle sections"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <span className="hidden sm:inline">Sections</span>
          </Button>

          <ExportButton
            resumeId={initialResume.id}
            resumeTitle={title}
            onBeforeExport={async () => {
              if (isDirtyRef.current || debounceTimerRef.current) {
                if (debounceTimerRef.current) {
                  clearTimeout(debounceTimerRef.current);
                }
                await triggerAutosave(
                  title,
                  targetRole,
                  resumeData,
                  templateConfig,
                );
              }
            }}
          />

          {/* View Modes for Mobile / Tablet */}
          <div className="flex lg:hidden rounded-md border border-border bg-muted p-0.5 text-xs">
            <button
              type="button"
              className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
                mobileTab === "edit"
                  ? "bg-white text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                setMobileTab("edit");
                setEditorMode("content");
              }}
            >
              <Edit3 className="h-3.5 w-3.5 sm:mr-1 inline" />
              <span className="hidden sm:inline">Content</span>
            </button>
            <button
              type="button"
              className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
                mobileTab === "design"
                  ? "bg-white text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => {
                setMobileTab("design");
                setEditorMode("design");
              }}
            >
              <Palette className="h-3.5 w-3.5 sm:mr-1 inline" />
              <span className="hidden sm:inline">Design</span>
            </button>
            <button
              type="button"
              className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
                mobileTab === "preview"
                  ? "bg-white text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setMobileTab("preview")}
            >
              <Eye className="h-3.5 w-3.5 sm:mr-1 inline" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              type="button"
              className={`hidden md:inline px-2.5 py-1 rounded-sm font-medium transition-colors ${
                mobileTab === "split"
                  ? "bg-white text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setMobileTab("split")}
            >
              <Columns className="h-3.5 w-3.5 sm:mr-1 inline" />
              <span>Split</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Content & Design Mode */}
        <div
          className={`space-y-4 ${
            mobileTab === "preview" ? "hidden lg:block lg:col-span-6" : ""
          } ${
            mobileTab === "split"
              ? "col-span-1 md:col-span-6 lg:col-span-6"
              : "col-span-1 lg:col-span-6"
          }`}
        >
          {/* Primary Mode Switcher (Desktop / General) */}
          <div className="flex rounded-lg border border-border bg-muted p-1 text-xs">
            <button
              type="button"
              onClick={() => setEditorMode("content")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all ${
                editorMode === "content"
                  ? "bg-white text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Content Sections</span>
            </button>
            <button
              type="button"
              onClick={() => setEditorMode("design")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md font-medium transition-all ${
                editorMode === "design"
                  ? "bg-white text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Palette className="h-3.5 w-3.5 text-primary" />
              <span>Templates & Design</span>
            </button>
          </div>

          {/* If Design Mode */}
          {editorMode === "design" ? (
            <Card className="shadow-xs">
              <CardContent className="p-4 sm:p-6">
                <DesignPanel
                  config={templateConfig}
                  onChange={handleConfigChange}
                />
              </CardContent>
            </Card>
          ) : (
            /* If Content Mode: Section Navigation & Forms */
            <>
              {/* Section Selector Tabs Bar */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {sectionsList.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-card text-muted-foreground border-border hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{sec.label}</span>
                      {sec.count !== undefined && sec.count > 0 && (
                        <span
                          className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {sec.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Section Editor Container */}
              <Card className="shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span>
                      {sectionsList.find((s) => s.id === activeSection)?.label}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Auto-saved to cloud
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  {activeSection === "personalInfo" && (
                    <PersonalInfoSection
                      value={resumeData.personalInfo}
                      onChange={(personalInfo) =>
                        handleDataChange((prev) => ({ ...prev, personalInfo }))
                      }
                    />
                  )}

                  {activeSection === "summary" && (
                    <SummarySection
                      value={resumeData.summary}
                      resumeId={initialResume.id}
                      onApplied={(newData) => handleDataChange(() => newData)}
                      onChange={(summary) =>
                        handleDataChange((prev) => ({ ...prev, summary }))
                      }
                    />
                  )}

                  {activeSection === "experience" && (
                    <ExperienceSection
                      value={resumeData.experience}
                      resumeId={initialResume.id}
                      onApplied={(newData) => handleDataChange(() => newData)}
                      onChange={(experience) =>
                        handleDataChange((prev) => ({ ...prev, experience }))
                      }
                    />
                  )}

                  {activeSection === "education" && (
                    <EducationSection
                      value={resumeData.education}
                      onChange={(education) =>
                        handleDataChange((prev) => ({ ...prev, education }))
                      }
                    />
                  )}

                  {activeSection === "projects" && (
                    <ProjectsSection
                      value={resumeData.projects}
                      resumeId={initialResume.id}
                      onApplied={(newData) => handleDataChange(() => newData)}
                      onChange={(projects) =>
                        handleDataChange((prev) => ({ ...prev, projects }))
                      }
                    />
                  )}

                  {activeSection === "skills" && (
                    <SkillsSection
                      value={resumeData.skills}
                      resumeId={initialResume.id}
                      onApplied={(newData) => handleDataChange(() => newData)}
                      onChange={(skills) =>
                        handleDataChange((prev) => ({ ...prev, skills }))
                      }
                    />
                  )}

                  {activeSection === "certifications" && (
                    <CertificationsSection
                      value={resumeData.certifications}
                      onChange={(certifications) =>
                        handleDataChange((prev) => ({
                          ...prev,
                          certifications,
                        }))
                      }
                    />
                  )}

                  {activeSection === "achievements" && (
                    <AchievementsSection
                      value={resumeData.achievements}
                      resumeId={initialResume.id}
                      onApplied={(newData) => handleDataChange(() => newData)}
                      onChange={(achievements) =>
                        handleDataChange((prev) => ({
                          ...prev,
                          achievements,
                        }))
                      }
                    />
                  )}

                  {activeSection === "languages" && (
                    <LanguagesSection
                      value={resumeData.languages}
                      onChange={(languages) =>
                        handleDataChange((prev) => ({ ...prev, languages }))
                      }
                    />
                  )}

                  {activeSection === "links" && (
                    <LinksSection
                      value={resumeData.links}
                      onChange={(links) =>
                        handleDataChange((prev) => ({ ...prev, links }))
                      }
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right Side: Professional Template Preview Engine */}
        <div
          className={`space-y-4 ${
            mobileTab === "edit" || mobileTab === "design"
              ? "hidden lg:block lg:col-span-6"
              : ""
          } ${
            mobileTab === "split"
              ? "col-span-1 md:col-span-6 lg:col-span-6"
              : "col-span-1 lg:col-span-6"
          }`}
        >
          <div className="sticky top-20 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-primary" />
                Live Preview
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                  {activeTemplateDef.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditorMode("design");
                    setMobileTab("design");
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Customize ⚙
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-border shadow-sm overflow-hidden bg-white max-h-[calc(100vh-140px)] flex flex-col">
              <ResumeRenderer data={resumeData} config={templateConfig} />
            </div>
          </div>
        </div>
      </div>

      {/* Section Visibility & Ordering Modal */}
      <SectionSettingsModal
        open={settingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        visibility={resumeData.sectionVisibility}
        onVisibilityChange={(visibility) =>
          handleDataChange((prev) => ({
            ...prev,
            sectionVisibility: visibility,
          }))
        }
        order={resumeData.sectionOrder}
        onOrderChange={(order) =>
          handleDataChange((prev) => ({
            ...prev,
            sectionOrder: order,
          }))
        }
      />

      {/* Versions & Checkpoints Modal */}
      <VersionsModal
        open={versionsModalOpen}
        onOpenChange={setVersionsModalOpen}
        resumeId={initialResume.id}
        onRestoreVersion={(restoredData) => {
          handleDataChange(() => restoredData);
        }}
      />
    </div>
  );
}
