import { TemplateConfig, COLOR_PALETTES, AccentColor } from "@resumeai/shared";

export function getFontFamilyStyle(fontFamily: string): React.CSSProperties {
  switch (fontFamily) {
    case "Georgia":
      return {
        fontFamily: "Georgia, Cambria, 'Times New Roman', Times, serif",
      };
    case "Times New Roman":
      return { fontFamily: "'Times New Roman', Times, Georgia, serif" };
    case "Arial":
      return { fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" };
    case "Helvetica":
      return { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" };
    case "Inter":
    default:
      return {
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      };
  }
}

export function getFontSizeClasses(size: string) {
  switch (size) {
    case "sm":
      return {
        root: "text-xs leading-relaxed",
        name: "text-xl font-bold tracking-tight",
        role: "text-xs font-medium",
        sectionTitle: "text-xs font-bold uppercase tracking-wider",
        itemTitle: "text-xs font-semibold",
        itemSub: "text-[11px]",
        meta: "text-[11px]",
        body: "text-xs leading-relaxed",
        badge: "text-[10px] px-1.5 py-0.5",
      };
    case "lg":
      return {
        root: "text-base leading-relaxed",
        name: "text-3xl font-bold tracking-tight",
        role: "text-base font-medium",
        sectionTitle: "text-sm font-bold uppercase tracking-wider",
        itemTitle: "text-sm font-semibold",
        itemSub: "text-xs",
        meta: "text-xs",
        body: "text-sm leading-relaxed",
        badge: "text-xs px-2.5 py-1",
      };
    case "md":
    default:
      return {
        root: "text-sm leading-relaxed",
        name: "text-2xl font-bold tracking-tight",
        role: "text-sm font-medium",
        sectionTitle: "text-xs font-bold uppercase tracking-wider",
        itemTitle: "text-xs sm:text-sm font-semibold",
        itemSub: "text-xs",
        meta: "text-xs",
        body: "text-xs sm:text-sm leading-relaxed",
        badge: "text-xs px-2 py-0.5",
      };
  }
}

export function getSpacingClasses(spacing: string) {
  switch (spacing) {
    case "compact":
      return {
        sections: "space-y-3.5",
        items: "space-y-2",
        headerGap: "mb-3",
        listGap: "space-y-0.5",
        badgeGap: "gap-1",
      };
    case "spacious":
      return {
        sections: "space-y-6",
        items: "space-y-4",
        headerGap: "mb-6",
        listGap: "space-y-1.5",
        badgeGap: "gap-2",
      };
    case "comfortable":
    default:
      return {
        sections: "space-y-4.5",
        items: "space-y-3",
        headerGap: "mb-4",
        listGap: "space-y-1",
        badgeGap: "gap-1.5",
      };
  }
}

export function getMarginClasses(margins: string) {
  switch (margins) {
    case "compact":
      return "p-6";
    case "relaxed":
      return "p-12";
    case "normal":
    default:
      return "p-8";
  }
}

export function getAccentStyles(accentColor: string) {
  const safeColor = (
    accentColor in COLOR_PALETTES ? accentColor : "blue"
  ) as AccentColor;
  const palette = COLOR_PALETTES[safeColor];

  return {
    hex: palette.hex,
    text: palette.textClass,
    bg: palette.bgClass,
    border: palette.borderClass,
    inlineStyle: { color: palette.hex },
    borderStyle: { borderColor: palette.hex },
    bgStyle: { backgroundColor: palette.hex },
  };
}

export function sanitizeUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("vbscript:")
  ) {
    return null;
  }
  return trimmed;
}
