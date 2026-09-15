import { normalizeTemplateId } from "@resumeai/shared";
import { TemplateDefinition } from "./template.interface";
import { ModernTemplate } from "./modern-template";
import { ClassicTemplate } from "./classic-template";
import { MinimalTemplate } from "./minimal-template";
import { ExecutiveTemplate } from "./executive-template";

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "modern",
    name: "Modern Standard",
    description:
      "Clean, contemporary design with subtle accent colors and modern badge tags. Balanced for human reviewers and ATS readers.",
    category: "Modern",
    recommendedFor: "Tech, Marketing, Product & General Roles",
    component: ModernTemplate,
  },
  {
    id: "classic",
    name: "Classic Serif",
    description:
      "Traditional centered layout with formal serif typography and horizontal dividers. Maximum ATS parseability and institutional appeal.",
    category: "Classic",
    recommendedFor: "Finance, Law, Banking, Consulting & Academia",
    component: ClassicTemplate,
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description:
      "High whitespace, streamlined layout with compact typography and efficient use of space. Ideal for concise single-page resumes.",
    category: "Minimal",
    recommendedFor: "Software Engineers, Designers & Startups",
    component: MinimalTemplate,
  },
  {
    id: "executive",
    name: "Executive Leadership",
    description:
      "Authoritative design with a strong headline banner and structured accent headers. Built to highlight career progression and leadership scope.",
    category: "Executive",
    recommendedFor: "Directors, VPs, C-Suite & Senior Leadership",
    component: ExecutiveTemplate,
  },
];

const TEMPLATE_MAP = new Map<string, TemplateDefinition>(
  TEMPLATES.map((t) => [t.id, t]),
);

export function getTemplate(templateId?: string | null): TemplateDefinition {
  const canonicalId = normalizeTemplateId(templateId);
  const found = TEMPLATE_MAP.get(canonicalId);
  return found || TEMPLATES[0];
}
