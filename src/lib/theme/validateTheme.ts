import { cssVarMap } from "./tokens-map";
import type { ResolvedTheme } from "./types";

export type ThemeValidationLevel = "error" | "warning";

export interface ThemeValidationIssue {
  level: ThemeValidationLevel;
  code: string;
  message: string;
  token?: string;
}

export interface ThemeContrastCheck {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  minimum: number;
  passes: boolean;
}

export interface ThemeValidationReport {
  theme: string;
  colorScheme: ResolvedTheme["colorScheme"];
  summary: ThemeValidationSummary;
  tokenCoverage: ThemeTokenCoverage;
  issues: ThemeValidationIssue[];
  contrast: ThemeContrastCheck[];
  focus: ThemeFocusCheck[];
  chartContrast: ThemeContrastCheck[];
  passes: boolean;
}

export interface ThemeValidationSummary {
  errors: number;
  warnings: number;
  missingTokens: number;
  contrastFailures: number;
  chartContrastFailures: number;
  focusFailures: number;
}

export interface ThemeTokenCoverage {
  required: number;
  present: number;
  missing: string[];
}

export interface ThemeFocusCheck {
  name: string;
  token: string;
  value: string;
  passes: boolean;
}

export interface ThemePairValidationReport {
  pair: string;
  dark: ThemeValidationReport;
  light: ThemeValidationReport;
  summary: ThemePairValidationSummary;
  issues: ThemeValidationIssue[];
  parity: {
    sharedTokenCount: number;
    missingInDark: string[];
    missingInLight: string[];
  };
  passes: boolean;
}

export interface ThemePairValidationSummary {
  errors: number;
  warnings: number;
  missingInDark: number;
  missingInLight: number;
  darkErrors: number;
  lightErrors: number;
}

export interface ThemeAuditPair {
  name: string;
  dark: ResolvedTheme;
  light: ResolvedTheme;
}

export interface ThemeAuditReport {
  themes: ThemeValidationReport[];
  pairs: ThemePairValidationReport[];
  summary: ThemeAuditSummary;
  passes: boolean;
}

export interface ThemeAuditSummary {
  themes: number;
  pairs: number;
  errors: number;
  warnings: number;
  failedThemes: number;
  failedPairs: number;
}

const REQUIRED_TOKEN_CATEGORIES = [
  "color",
  "surface",
  "text",
  "border",
  "focus",
  "state",
  "overlay",
  "chart",
  "code",
] as const;

type Rgb = [number, number, number];

function parseTriplet(value: string | undefined): Rgb | null {
  if (!value) return null;
  if (value.startsWith("var(") || value.startsWith("rgb(")) return null;

  const parts = value
    .trim()
    .split(/\s+/)
    .map((part) => Number(part));

  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isFinite(part) || part < 0 || part > 255)
  ) {
    return null;
  }

  return parts as Rgb;
}

function colorVarTriplet(theme: ResolvedTheme, cssVar: string): string | undefined {
  switch (cssVar) {
    case "--harbor-accent":
      return theme.tokens.color.accent;
    case "--harbor-accent-2":
      return theme.tokens.color.accent2;
    case "--harbor-brand-fg":
      return theme.tokens.color.brandFg;
    case "--harbor-text":
      return theme.tokens.color.text;
    case "--harbor-text-muted":
      return theme.tokens.color.textMuted;
    case "--harbor-text-subtle":
      return theme.tokens.color.textSubtle;
    case "--harbor-bg":
      return theme.tokens.color.bg;
    case "--harbor-bg-elev-1":
      return theme.tokens.color.bgElev1;
    default:
      return undefined;
  }
}

function parseThemeColor(theme: ResolvedTheme, value: string | undefined): Rgb | null {
  if (!value) return null;
  const direct = parseTriplet(value);
  if (direct) return direct;

  const varMatch = value.match(/^rgb\(var\((--harbor-[^)]+)\)(?:\s*\/\s*[\d.]+)?\)$/);
  if (varMatch) return parseTriplet(colorVarTriplet(theme, varMatch[1]));

  const rgbMatch = value.match(/^rgb\((\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*[\d.]+)?\)$/);
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])];
  }

  return null;
}

function luminance([r, g, b]: Rgb): number {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return channel(r) * 0.2126 + channel(g) * 0.7152 + channel(b) * 0.0722;
}

function contrastRatio(foreground: Rgb, background: Rgb): number {
  const fg = luminance(foreground);
  const bg = luminance(background);
  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
}

function addContrastCheck(
  checks: ThemeContrastCheck[],
  theme: ResolvedTheme,
  name: string,
  foreground: string | undefined,
  background: string | undefined,
  minimum: number,
) {
  const fg = parseThemeColor(theme, foreground);
  const bg = parseThemeColor(theme, background);
  if (!fg || !bg) return;

  const ratio = contrastRatio(fg, bg);
  checks.push({
    name,
    foreground: foreground ?? "",
    background: background ?? "",
    ratio,
    minimum,
    passes: ratio >= minimum,
  });
}

function tokenEntries(theme: ResolvedTheme): Set<string> {
  const entries = new Set<string>();
  for (const category of REQUIRED_TOKEN_CATEGORIES) {
    const values = theme.tokens[category] as Record<string, string | undefined>;
    for (const key of Object.keys(values ?? {})) {
      if (values[key]) entries.add(`${category}.${key}`);
    }
  }
  return entries;
}

function validateFocus(theme: ResolvedTheme): ThemeFocusCheck[] {
  const focus = theme.tokens.focus;
  const checks: ThemeFocusCheck[] = [
    {
      name: "focus ring token",
      token: "focus.ring",
      value: focus.ring ?? "",
      passes: Boolean(focus.ring),
    },
    {
      name: "focus ring offset token",
      token: "focus.ringOffset",
      value: focus.ringOffset ?? "",
      passes: Boolean(focus.ringOffset),
    },
    {
      name: "focus shadow includes visible ring",
      token: "focus.shadow",
      value: focus.shadow ?? "",
      passes: Boolean(focus.shadow && /0 0 0\s+3px/.test(focus.shadow)),
    },
  ];

  return checks;
}

export function validateTheme(theme: ResolvedTheme): ThemeValidationReport {
  const issues: ThemeValidationIssue[] = [];
  const contrast: ThemeContrastCheck[] = [];
  const chartContrast: ThemeContrastCheck[] = [];
  const missingTokens: string[] = [];
  let requiredTokenCount = 0;

  for (const category of REQUIRED_TOKEN_CATEGORIES) {
    const values = theme.tokens[category] as Record<string, string | undefined>;
    const requiredKeys = Object.keys(cssVarMap[category]);
    for (const key of requiredKeys) {
      requiredTokenCount += 1;
      if (!values?.[key]) {
        const token = `${category}.${key}`;
        missingTokens.push(token);
        issues.push({
          level: "error",
          code: "missing-token",
          token,
          message: `${token} is required for production themes.`,
        });
      }
    }
  }

  addContrastCheck(
    contrast,
    theme,
    "text on canvas",
    theme.tokens.color.text,
    theme.tokens.color.bg,
    4.5,
  );
  addContrastCheck(
    contrast,
    theme,
    "muted text on canvas",
    theme.tokens.color.textMuted,
    theme.tokens.color.bg,
    4.5,
  );
  addContrastCheck(
    contrast,
    theme,
    "subtle text on panel",
    theme.tokens.color.textSubtle,
    theme.tokens.color.bgElev1,
    3,
  );
  addContrastCheck(
    contrast,
    theme,
    "semantic primary text on canvas",
    theme.tokens.text.primary,
    theme.tokens.color.bg,
    4.5,
  );
  addContrastCheck(
    contrast,
    theme,
    "semantic secondary text on panel",
    theme.tokens.text.secondary,
    theme.tokens.color.bgElev1,
    4.5,
  );
  addContrastCheck(
    contrast,
    theme,
    "semantic link text on canvas",
    theme.tokens.text.link,
    theme.tokens.color.bg,
    4.5,
  );
  addContrastCheck(
    contrast,
    theme,
    "brand foreground on accent",
    theme.tokens.color.brandFg,
    theme.tokens.color.accent,
    4.5,
  );
  addContrastCheck(
    contrast,
    theme,
    "selected foreground on selected state",
    theme.tokens.state.selectedFg,
    theme.tokens.color.bgElev1,
    4.5,
  );

  for (const key of ["1", "2", "3", "4", "5", "positive", "negative", "warning", "neutral"] as const) {
    addContrastCheck(
      chartContrast,
      theme,
      `chart.${key} on canvas`,
      theme.tokens.chart[key],
      theme.tokens.color.bg,
      3,
    );
    addContrastCheck(
      chartContrast,
      theme,
      `chart.${key} on panel`,
      theme.tokens.chart[key],
      theme.tokens.color.bgElev1,
      3,
    );
  }

  const focus = validateFocus(theme);
  for (const check of focus) {
    if (!check.passes) {
      issues.push({
        level: "error",
        code: "focus-token-fail",
        token: check.token,
        message: `${check.token} must be present and visibly usable.`,
      });
    }
  }

  for (const check of [...contrast, ...chartContrast]) {
    if (!check.passes) {
      issues.push({
        level: "error",
        code: "contrast-fail",
        message: `${check.name} contrast is ${check.ratio.toFixed(2)}:1; expected ${check.minimum}:1 or better.`,
      });
    }
  }

  const contrastFailures = contrast.filter((check) => !check.passes).length;
  const chartContrastFailures = chartContrast.filter((check) => !check.passes).length;
  const focusFailures = focus.filter((check) => !check.passes).length;
  const summary: ThemeValidationSummary = {
    errors: issues.filter((issue) => issue.level === "error").length,
    warnings: issues.filter((issue) => issue.level === "warning").length,
    missingTokens: missingTokens.length,
    contrastFailures,
    chartContrastFailures,
    focusFailures,
  };

  return {
    theme: theme.name,
    colorScheme: theme.colorScheme,
    summary,
    tokenCoverage: {
      required: requiredTokenCount,
      present: requiredTokenCount - missingTokens.length,
      missing: missingTokens.sort(),
    },
    issues,
    contrast,
    focus,
    chartContrast,
    passes: !issues.some((issue) => issue.level === "error"),
  };
}

export function validateThemePair(
  darkTheme: ResolvedTheme,
  lightTheme: ResolvedTheme,
  pairName = `${darkTheme.name} / ${lightTheme.name}`,
): ThemePairValidationReport {
  const issues: ThemeValidationIssue[] = [];
  const dark = validateTheme(darkTheme);
  const light = validateTheme(lightTheme);

  if (darkTheme.colorScheme !== "dark") {
    issues.push({
      level: "error",
      code: "pair-dark-scheme",
      message: `${darkTheme.name} must be a dark theme in a dark/light pair.`,
    });
  }
  if (lightTheme.colorScheme !== "light") {
    issues.push({
      level: "error",
      code: "pair-light-scheme",
      message: `${lightTheme.name} must be a light theme in a dark/light pair.`,
    });
  }

  const darkTokens = tokenEntries(darkTheme);
  const lightTokens = tokenEntries(lightTheme);
  const missingInDark = [...lightTokens].filter((token) => !darkTokens.has(token)).sort();
  const missingInLight = [...darkTokens].filter((token) => !lightTokens.has(token)).sort();

  for (const token of missingInDark) {
    issues.push({
      level: "error",
      code: "pair-token-missing-dark",
      token,
      message: `${token} exists in the light theme but is missing in the dark theme.`,
    });
  }
  for (const token of missingInLight) {
    issues.push({
      level: "error",
      code: "pair-token-missing-light",
      token,
      message: `${token} exists in the dark theme but is missing in the light theme.`,
    });
  }

  const summary: ThemePairValidationSummary = {
    errors: issues.filter((issue) => issue.level === "error").length,
    warnings: issues.filter((issue) => issue.level === "warning").length,
    missingInDark: missingInDark.length,
    missingInLight: missingInLight.length,
    darkErrors: dark.summary.errors,
    lightErrors: light.summary.errors,
  };

  return {
    pair: pairName,
    dark,
    light,
    summary,
    issues,
    parity: {
      sharedTokenCount: [...darkTokens].filter((token) => lightTokens.has(token)).length,
      missingInDark,
      missingInLight,
    },
    passes:
      dark.passes &&
      light.passes &&
      !issues.some((issue) => issue.level === "error"),
  };
}

export function validateThemeAudit({
  themes,
  pairs = [],
}: {
  themes: readonly ResolvedTheme[];
  pairs?: readonly ThemeAuditPair[];
}): ThemeAuditReport {
  const themeReports = themes.map(validateTheme);
  const pairReports = pairs.map((pair) =>
    validateThemePair(pair.dark, pair.light, pair.name),
  );
  const errors =
    themeReports.reduce((total, report) => total + report.summary.errors, 0) +
    pairReports.reduce((total, report) => total + report.summary.errors, 0);
  const warnings =
    themeReports.reduce((total, report) => total + report.summary.warnings, 0) +
    pairReports.reduce((total, report) => total + report.summary.warnings, 0);
  const failedThemes = themeReports.filter((report) => !report.passes).length;
  const failedPairs = pairReports.filter((report) => !report.passes).length;

  return {
    themes: themeReports,
    pairs: pairReports,
    summary: {
      themes: themeReports.length,
      pairs: pairReports.length,
      errors,
      warnings,
      failedThemes,
      failedPairs,
    },
    passes: failedThemes === 0 && failedPairs === 0,
  };
}

export function formatThemeValidationReport(report: ThemeValidationReport): string {
  const lines = [
    `Theme: ${report.theme} (${report.colorScheme})`,
    `Status: ${report.passes ? "pass" : "fail"}`,
    `Tokens: ${report.tokenCoverage.present}/${report.tokenCoverage.required} present`,
    `Issues: ${report.summary.errors} errors, ${report.summary.warnings} warnings`,
    `Contrast: ${report.summary.contrastFailures} text failures, ${report.summary.chartContrastFailures} chart failures`,
    `Focus: ${report.summary.focusFailures} failures`,
  ];

  if (report.tokenCoverage.missing.length > 0) {
    lines.push(`Missing tokens: ${report.tokenCoverage.missing.join(", ")}`);
  }

  const failedChecks = [...report.contrast, ...report.chartContrast]
    .filter((check) => !check.passes)
    .map((check) => `${check.name} ${check.ratio.toFixed(2)}:1 < ${check.minimum}:1`);
  if (failedChecks.length > 0) {
    lines.push("Failed contrast checks:");
    lines.push(...failedChecks.map((check) => `- ${check}`));
  }

  if (report.issues.length > 0) {
    lines.push("Issues:");
    lines.push(...report.issues.map((issue) => `- [${issue.level}] ${issue.code}: ${issue.message}`));
  }

  return lines.join("\n");
}

export function formatThemePairValidationReport(report: ThemePairValidationReport): string {
  const lines = [
    `Theme pair: ${report.pair}`,
    `Status: ${report.passes ? "pass" : "fail"}`,
    `Shared tokens: ${report.parity.sharedTokenCount}`,
    `Pair issues: ${report.summary.errors} errors, ${report.summary.warnings} warnings`,
    `Theme issues: ${report.dark.theme} ${report.summary.darkErrors} errors, ${report.light.theme} ${report.summary.lightErrors} errors`,
  ];

  if (report.parity.missingInDark.length > 0) {
    lines.push(`Missing in dark: ${report.parity.missingInDark.join(", ")}`);
  }
  if (report.parity.missingInLight.length > 0) {
    lines.push(`Missing in light: ${report.parity.missingInLight.join(", ")}`);
  }
  if (report.issues.length > 0) {
    lines.push("Issues:");
    lines.push(...report.issues.map((issue) => `- [${issue.level}] ${issue.code}: ${issue.message}`));
  }

  return lines.join("\n");
}

export function formatThemeAuditReport(report: ThemeAuditReport): string {
  const lines = [
    "Theme audit",
    `Status: ${report.passes ? "pass" : "fail"}`,
    `Themes: ${report.summary.themes} checked, ${report.summary.failedThemes} failed`,
    `Pairs: ${report.summary.pairs} checked, ${report.summary.failedPairs} failed`,
    `Issues: ${report.summary.errors} errors, ${report.summary.warnings} warnings`,
  ];

  for (const theme of report.themes) {
    lines.push("");
    lines.push(formatThemeValidationReport(theme));
  }

  for (const pair of report.pairs) {
    lines.push("");
    lines.push(formatThemePairValidationReport(pair));
  }

  return lines.join("\n");
}
