/**
 * Built-in Harbor themes. These mirror the defaults declared in
 * src/tokens.css (dark) and its `[data-theme="light"]` override block
 * (light), so any consumer that doesn't register a custom theme still
 * gets the exact same visual result they get today.
 *
 * The Provider always includes both in its registry; consumers can
 * replace either by registering a theme with the same `name`.
 */

import { defineTheme } from "./defineTheme";
import type { HarborTheme, ThemeTokens } from "./types";

const darkProductTokens: ThemeTokens = {
  surface: {
    canvas: "rgb(var(--harbor-bg))",
    panel: "rgb(var(--harbor-bg-elev-1))",
    panelMuted: "rgb(var(--harbor-bg-elev-2))",
    toolbar: "rgb(var(--harbor-bg-elev-1) / 0.92)",
    raised: "rgb(var(--harbor-bg-elev-3))",
    sunken: "rgb(6 6 10)",
  },
  text: {
    primary: "rgb(var(--harbor-text))",
    secondary: "rgb(var(--harbor-text-muted))",
    tertiary: "rgb(var(--harbor-text-subtle))",
    disabled: "rgb(var(--harbor-text) / 0.34)",
    inverse: "rgb(var(--harbor-brand-fg))",
    link: "rgb(var(--harbor-accent-2))",
  },
  border: {
    subtle: "rgb(var(--harbor-border) / 0.08)",
    default: "rgb(var(--harbor-border) / 0.12)",
    strong: "rgb(var(--harbor-border) / 0.18)",
    focus: "rgb(var(--harbor-accent) / 0.70)",
  },
  focus: {
    ring: "rgb(var(--harbor-accent) / 0.78)",
    ringOffset: "rgb(var(--harbor-bg))",
    shadow: "0 0 0 1px rgb(var(--harbor-bg)), 0 0 0 3px rgb(var(--harbor-accent) / 0.55)",
  },
  state: {
    hover: "rgb(var(--harbor-text) / 0.06)",
    active: "rgb(var(--harbor-text) / 0.10)",
    selected: "rgb(var(--harbor-accent) / 0.22)",
    selectedFg: "rgb(var(--harbor-text))",
    disabledFg: "rgb(var(--harbor-text) / 0.34)",
  },
  overlay: {
    scrim: "rgb(2 2 6 / 0.70)",
    surface: "rgb(var(--harbor-bg-elev-3))",
    border: "rgb(var(--harbor-border) / 0.16)",
  },
  chart: {
    1: "56 189 248",
    2: "168 85 247",
    3: "52 211 153",
    4: "251 191 36",
    5: "244 114 182",
    positive: "52 211 153",
    negative: "244 63 94",
    warning: "251 191 36",
    neutral: "148 163 184",
    grid: "rgb(var(--harbor-border) / 0.10)",
    axis: "rgb(var(--harbor-text-muted) / 0.66)",
  },
  code: {
    keyword: "232 121 249",
    string: "110 231 183",
    comment: "148 163 184",
    number: "252 211 77",
    function: "125 211 252",
    type: "56 189 248",
    variable: "226 232 240",
    operator: "203 213 225",
    property: "147 197 253",
    attribute: "251 191 36",
    tag: "251 113 133",
    regex: "251 146 60",
    meta: "103 232 249",
    error: "244 63 94",
  },
};

const lightProductTokens: ThemeTokens = {
  surface: {
    canvas: "rgb(var(--harbor-bg))",
    panel: "rgb(var(--harbor-bg-elev-1))",
    panelMuted: "rgb(var(--harbor-bg-elev-2))",
    toolbar: "rgb(255 255 255 / 0.92)",
    raised: "rgb(255 255 255)",
    sunken: "rgb(236 239 246)",
  },
  text: {
    primary: "rgb(var(--harbor-text))",
    secondary: "rgb(var(--harbor-text-muted))",
    tertiary: "rgb(var(--harbor-text-subtle))",
    disabled: "rgb(var(--harbor-text) / 0.38)",
    inverse: "rgb(var(--harbor-brand-fg))",
    link: "rgb(var(--harbor-accent))",
  },
  border: {
    subtle: "rgb(var(--harbor-border) / 0.08)",
    default: "rgb(var(--harbor-border) / 0.12)",
    strong: "rgb(var(--harbor-border) / 0.18)",
    focus: "rgb(var(--harbor-accent) / 0.72)",
  },
  focus: {
    ring: "rgb(var(--harbor-accent) / 0.86)",
    ringOffset: "rgb(var(--harbor-bg-elev-1))",
    shadow: "0 0 0 1px rgb(255 255 255), 0 0 0 3px rgb(var(--harbor-accent) / 0.50)",
  },
  state: {
    hover: "rgb(15 23 42 / 0.045)",
    active: "rgb(15 23 42 / 0.075)",
    selected: "rgb(var(--harbor-accent) / 0.14)",
    selectedFg: "rgb(var(--harbor-text))",
    disabledFg: "rgb(var(--harbor-text) / 0.38)",
  },
  overlay: {
    scrim: "rgb(15 23 42 / 0.48)",
    surface: "rgb(var(--harbor-bg-elev-1))",
    border: "rgb(var(--harbor-border) / 0.14)",
  },
  chart: {
    1: "2 132 199",
    2: "126 34 206",
    3: "5 150 105",
    4: "180 83 9",
    5: "190 18 60",
    positive: "5 150 105",
    negative: "225 29 72",
    warning: "180 83 9",
    neutral: "100 116 139",
    grid: "rgb(15 23 42 / 0.10)",
    axis: "rgb(51 65 85 / 0.72)",
  },
  code: {
    keyword: "168 85 247",
    string: "5 150 105",
    comment: "100 116 139",
    number: "180 83 9",
    function: "2 132 199",
    type: "3 105 161",
    variable: "30 41 59",
    operator: "71 85 105",
    property: "29 78 216",
    attribute: "180 83 9",
    tag: "190 18 60",
    regex: "194 65 12",
    meta: "14 116 144",
    error: "225 29 72",
  },
};

export const harborDark: HarborTheme = defineTheme({
  name: "harbor-dark",
  label: "Harbor Dark",
  colorScheme: "dark",
  tokens: {
    color: {
      accent: "147 51 234",
      accent2: "56 189 248",
      accent3: "244 114 182",
      brand: "var(--harbor-accent)",
      brandFg: "255 255 255",
      success: "52 211 153",
      warning: "251 191 36",
      danger: "244 63 94",
      info: "56 189 248",
      bg: "10 10 15",
      bgElev1: "18 18 26",
      bgElev2: "28 28 38",
      bgElev3: "38 38 50",
      text: "255 255 255",
      textMuted: "170 170 180",
      textSubtle: "120 120 130",
      border: "255 255 255",
    },
    ...darkProductTokens,
    typography: {
      fontSans: '"Inter", ui-sans-serif, system-ui, sans-serif',
      fontMono:
        'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      textXs: "11px",
      textSm: "13px",
      textBase: "15px",
      textLg: "17px",
      textXl: "20px",
      text2xl: "24px",
      text3xl: "30px",
      text4xl: "36px",
      text5xl: "48px",
      leadingTight: "1.2",
      leadingSnug: "1.4",
      leadingNormal: "1.5",
      leadingRelaxed: "1.7",
      leadingLoose: "1.8",
      trackingTight: "-0.01em",
      trackingNormal: "0em",
      trackingWide: "0.05em",
      trackingWidest: "0.25em",
    },
    spacing: {
      0: "0px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      8: "32px",
      10: "40px",
      12: "48px",
      16: "64px",
      20: "80px",
      24: "96px",
    },
    radius: {
      none: "0px",
      sm: "6px",
      md: "10px",
      lg: "14px",
      xl: "20px",
      "2xl": "28px",
      full: "9999px",
    },
    shadow: {
      sm: "0 2px 8px -2px rgb(0 0 0 / 0.3)",
      md: "0 12px 30px -10px rgb(0 0 0 / 0.5)",
      lg: "0 30px 80px -20px rgb(0 0 0 / 0.7)",
      glow: "0 0 24px -4px rgb(var(--harbor-accent) / 0.45)",
    },
    motion: {
      durInstant: "80ms",
      durFast: "150ms",
      durBase: "260ms",
      durSlow: "420ms",
      durSlower: "620ms",
      easeLinear: "linear",
      easeOut: "cubic-bezier(0.22, 0.7, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
      easeSpring: "cubic-bezier(0.3, 1.4, 0.4, 1)",
    },
  },
  meta: {
    description: "Harbor's default dark theme.",
    preview: { primary: "#9333EA", surface: "#0A0A0F" },
  },
});

/**
 * Inherits all non-surface tokens from harbor-dark, then remaps surface
 * and text colours for a light backdrop. Mirrors the existing
 * `[data-theme="light"]` block in tokens.css exactly.
 */
export const harborLight: HarborTheme = defineTheme({
  name: "harbor-light",
  label: "Harbor Light",
  colorScheme: "light",
  extends: "harbor-dark",
  tokens: {
    color: {
      bg: "244 246 252",
      bgElev1: "255 255 255",
      bgElev2: "249 250 254",
      bgElev3: "242 244 250",
      text: "15 20 30",
      textMuted: "60 70 85",
      textSubtle: "105 115 130",
      border: "0 0 0",
      brandFg: "255 255 255",
    },
    ...lightProductTokens,
    shadow: {
      sm: "0 2px 8px -2px rgb(0 0 0 / 0.08)",
      md: "0 12px 30px -10px rgb(0 0 0 / 0.12)",
      lg: "0 30px 80px -20px rgb(0 0 0 / 0.18)",
    },
  },
  meta: {
    description: "Harbor's default light theme.",
    preview: { primary: "#9333EA", surface: "#F4F6FC" },
  },
});

export const harborNeutralDark: HarborTheme = defineTheme({
  name: "harbor-neutral-dark",
  label: "Harbor Neutral Dark",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    color: {
      accent: "37 99 235",
      accent2: "20 184 166",
      accent3: "99 102 241",
      bg: "9 11 15",
      bgElev1: "18 21 27",
      bgElev2: "27 31 39",
      bgElev3: "38 43 53",
      textMuted: "177 184 196",
      textSubtle: "126 136 151",
    },
    chart: {
      1: "59 130 246",
      2: "20 184 166",
      3: "132 204 22",
      4: "245 158 11",
      5: "139 92 246",
    },
  },
  meta: {
    description: "A restrained SaaS/admin default with blue-teal accents.",
    preview: { primary: "#3B82F6", surface: "#090B0F" },
  },
});

export const harborNeutralLight: HarborTheme = defineTheme({
  name: "harbor-neutral-light",
  label: "Harbor Neutral Light",
  colorScheme: "light",
  extends: "harbor-light",
  tokens: {
    color: {
      accent: "37 99 235",
      accent2: "13 148 136",
      accent3: "79 70 229",
      bg: "247 248 251",
      bgElev1: "255 255 255",
      bgElev2: "242 244 248",
      bgElev3: "235 239 245",
      text: "17 24 39",
      textMuted: "75 85 99",
      textSubtle: "107 114 128",
    },
    chart: {
      1: "37 99 235",
      2: "13 148 136",
      3: "77 124 15",
      4: "180 83 9",
      5: "109 40 217",
    },
  },
  meta: {
    description: "A clean light SaaS/admin default with soft gray surfaces.",
    preview: { primary: "#2563EB", surface: "#F7F8FB" },
  },
});

export const harborEnterpriseDark: HarborTheme = defineTheme({
  name: "harbor-enterprise-dark",
  label: "Harbor Enterprise Dark",
  colorScheme: "dark",
  extends: "harbor-neutral-dark",
  tokens: {
    color: {
      accent: "3 105 161",
      accent2: "45 212 191",
      bg: "8 12 18",
      bgElev1: "15 23 32",
      bgElev2: "24 34 46",
      bgElev3: "35 47 62",
    },
    radius: {
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
    },
  },
  meta: {
    description: "Dense enterprise chrome for admin, finance, and ops tools.",
    preview: { primary: "#0EA5E9", surface: "#080C12" },
  },
});

export const harborEnterpriseLight: HarborTheme = defineTheme({
  name: "harbor-enterprise-light",
  label: "Harbor Enterprise Light",
  colorScheme: "light",
  extends: "harbor-neutral-light",
  tokens: {
    color: {
      accent: "3 105 161",
      accent2: "13 148 136",
      bg: "245 247 250",
      bgElev2: "239 243 248",
      bgElev3: "231 237 245",
    },
    radius: {
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "12px",
      "2xl": "16px",
    },
  },
  meta: {
    description: "A quiet enterprise light theme for dense product screens.",
    preview: { primary: "#0284C7", surface: "#F5F7FA" },
  },
});

export const harborDevDark: HarborTheme = defineTheme({
  name: "harbor-dev-dark",
  label: "Harbor Dev Dark",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    color: {
      accent: "14 116 144",
      accent2: "52 211 153",
      accent3: "192 132 252",
      bg: "5 7 10",
      bgElev1: "11 15 20",
      bgElev2: "18 24 32",
      bgElev3: "27 35 46",
    },
    typography: {
      fontSans:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
  },
  meta: {
    description: "Technical workbench defaults for IDE, AI, and infra UIs.",
    preview: { primary: "#22D3EE", surface: "#05070A" },
  },
});

export const harborDevLight: HarborTheme = defineTheme({
  name: "harbor-dev-light",
  label: "Harbor Dev Light",
  colorScheme: "light",
  extends: "harbor-light",
  tokens: {
    color: {
      accent: "14 116 144",
      accent2: "5 150 105",
      accent3: "126 34 206",
      bg: "246 248 250",
      bgElev1: "255 255 255",
      bgElev2: "240 244 248",
      bgElev3: "232 238 245",
    },
  },
  meta: {
    description: "A light technical workbench palette with readable code colors.",
    preview: { primary: "#0891B2", surface: "#F6F8FA" },
  },
});

export const harborDataDark: HarborTheme = defineTheme({
  name: "harbor-data-dark",
  label: "Harbor Data Dark",
  colorScheme: "dark",
  extends: "harbor-neutral-dark",
  tokens: {
    color: {
      accent: "4 120 87",
      accent2: "56 189 248",
      accent3: "250 204 21",
    },
    chart: {
      1: "16 185 129",
      2: "56 189 248",
      3: "250 204 21",
      4: "248 113 113",
      5: "167 139 250",
    },
  },
  meta: {
    description: "Data-heavy defaults for analytics and operational consoles.",
    preview: { primary: "#10B981", surface: "#090B0F" },
  },
});

export const harborDataLight: HarborTheme = defineTheme({
  name: "harbor-data-light",
  label: "Harbor Data Light",
  colorScheme: "light",
  extends: "harbor-neutral-light",
  tokens: {
    color: {
      accent: "4 120 87",
      accent2: "2 132 199",
      accent3: "161 98 7",
    },
    chart: {
      1: "5 150 105",
      2: "2 132 199",
      3: "161 98 7",
      4: "220 38 38",
      5: "124 58 237",
    },
  },
  meta: {
    description: "Light analytics defaults with chart colors tuned for white UI.",
    preview: { primary: "#059669", surface: "#F7F8FB" },
  },
});

export const harborAiWorkbenchDark: HarborTheme = defineTheme({
  name: "harbor-ai-workbench-dark",
  label: "Harbor AI Workbench Dark",
  colorScheme: "dark",
  extends: "harbor-dev-dark",
  tokens: {
    color: {
      accent: "124 58 237",
      accent2: "34 211 238",
      accent3: "244 114 182",
    },
    state: {
      selected: "rgb(124 58 237 / 0.24)",
    },
  },
  meta: {
    description: "Agent, eval, and AI console defaults with distinct run states.",
    preview: { primary: "#8B5CF6", surface: "#05070A" },
  },
});

export const harborAiWorkbenchLight: HarborTheme = defineTheme({
  name: "harbor-ai-workbench-light",
  label: "Harbor AI Workbench Light",
  colorScheme: "light",
  extends: "harbor-dev-light",
  tokens: {
    color: {
      accent: "124 58 237",
      accent2: "8 145 178",
      accent3: "219 39 119",
    },
    state: {
      selected: "rgb(124 58 237 / 0.14)",
    },
  },
  meta: {
    description: "A light AI workbench palette for chat, tools, and artifacts.",
    preview: { primary: "#7C3AED", surface: "#F6F8FA" },
  },
});

export const harborBuiltInThemes = [
  harborDark,
  harborLight,
  harborNeutralDark,
  harborNeutralLight,
  harborEnterpriseDark,
  harborEnterpriseLight,
  harborDevDark,
  harborDevLight,
  harborDataDark,
  harborDataLight,
  harborAiWorkbenchDark,
  harborAiWorkbenchLight,
] as const;
