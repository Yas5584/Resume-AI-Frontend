import * as React from "react";
import {
  ResumeData,
  TemplateConfig,
  getDefaultTemplateConfig,
} from "@resumeai/shared";
import { ResumeRenderer } from "./renderer/resume-renderer";

export interface ResumePreviewProps {
  resumeData: ResumeData;
  templateConfig?: TemplateConfig | null;
  templateId?: string | null;
  title?: string;
  targetRole?: string | null;
}

export function ResumePreview({
  resumeData,
  templateConfig,
  templateId,
}: ResumePreviewProps) {
  const config = React.useMemo(() => {
    if (templateConfig && Object.keys(templateConfig).length > 0) {
      return templateConfig;
    }
    return getDefaultTemplateConfig(templateId);
  }, [templateConfig, templateId]);

  return <ResumeRenderer data={resumeData} config={config} />;
}
