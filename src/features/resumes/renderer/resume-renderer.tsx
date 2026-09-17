import * as React from "react";
import { ResumeData, TemplateConfig } from "@resumeai/shared";
import { getTemplate } from "../templates/registry";
import { PageContainer } from "./page-container";

interface ResumeRendererProps {
  data: ResumeData;
  config: TemplateConfig;
  /** "compact" for inline split-view preview, "full" for standalone/overlay preview */
  variant?: "compact" | "full";
}

export function ResumeRenderer({
  data,
  config,
  variant = "compact",
}: ResumeRendererProps) {
  const templateDef = getTemplate(config.templateId);
  const TemplateComponent = templateDef.component;

  return (
    <PageContainer pageSize={config.pageSize} variant={variant}>
      <TemplateComponent data={data} config={config} />
    </PageContainer>
  );
}
