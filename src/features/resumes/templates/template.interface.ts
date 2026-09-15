import { ResumeData, TemplateConfig } from "@resumeai/shared";

export interface TemplateProps {
  data: ResumeData;
  config: TemplateConfig;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: "Modern" | "Classic" | "Minimal" | "Executive";
  recommendedFor: string;
  component: React.ComponentType<TemplateProps>;
}
