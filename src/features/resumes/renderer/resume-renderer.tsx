import * as React from "react";
import { ResumeData, TemplateConfig } from "@resumeai/shared";
import { getTemplate } from "../templates/registry";
import { PageContainer } from "./page-container";

interface ResumeRendererProps {
  data: ResumeData;
  config: TemplateConfig;
}

export function ResumeRenderer({ data, config }: ResumeRendererProps) {
  const templateDef = getTemplate(config.templateId);
  const TemplateComponent = templateDef.component;

  return (
    <PageContainer pageSize={config.pageSize}>
      <TemplateComponent data={data} config={config} />
    </PageContainer>
  );
}
