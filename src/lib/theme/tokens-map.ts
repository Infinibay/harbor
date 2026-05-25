/**
 * Maps every semantic token key (category + key) to the CSS custom
 * property declared in src/tokens.css. Adding a new token requires
 * updating both this map and the corresponding type in `types.ts`.
 */

import type {
  BorderTokens,
  ChartTokens,
  CodeTokens,
  ColorTokens,
  FocusTokens,
  MotionTokens,
  OverlayTokens,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
  StateTokens,
  SurfaceTokens,
  TextTokens,
  TypographyTokens,
} from "./types";

export const colorCssVar: Record<keyof ColorTokens, string> = {
  accent: "--harbor-accent",
  accent2: "--harbor-accent-2",
  accent3: "--harbor-accent-3",
  brand: "--harbor-brand",
  brandFg: "--harbor-brand-fg",
  success: "--harbor-success",
  warning: "--harbor-warning",
  danger: "--harbor-danger",
  info: "--harbor-info",
  bg: "--harbor-bg",
  bgElev1: "--harbor-bg-elev-1",
  bgElev2: "--harbor-bg-elev-2",
  bgElev3: "--harbor-bg-elev-3",
  text: "--harbor-text",
  textMuted: "--harbor-text-muted",
  textSubtle: "--harbor-text-subtle",
  border: "--harbor-border",
};

export const surfaceCssVar: Record<keyof SurfaceTokens, string> = {
  canvas: "--harbor-surface-canvas",
  panel: "--harbor-surface-panel",
  panelMuted: "--harbor-surface-panel-muted",
  toolbar: "--harbor-surface-toolbar",
  raised: "--harbor-surface-raised",
  sunken: "--harbor-surface-sunken",
};

export const textCssVar: Record<keyof TextTokens, string> = {
  primary: "--harbor-text-primary",
  secondary: "--harbor-text-secondary",
  tertiary: "--harbor-text-tertiary",
  disabled: "--harbor-text-disabled",
  inverse: "--harbor-text-inverse",
  link: "--harbor-text-link",
};

export const borderCssVar: Record<keyof BorderTokens, string> = {
  subtle: "--harbor-border-subtle",
  default: "--harbor-border-default",
  strong: "--harbor-border-strong",
  focus: "--harbor-border-focus",
};

export const focusCssVar: Record<keyof FocusTokens, string> = {
  ring: "--harbor-focus-ring",
  ringOffset: "--harbor-focus-ring-offset",
  shadow: "--harbor-focus-shadow",
};

export const stateCssVar: Record<keyof StateTokens, string> = {
  hover: "--harbor-state-hover",
  active: "--harbor-state-active",
  selected: "--harbor-state-selected",
  selectedFg: "--harbor-state-selected-fg",
  disabledFg: "--harbor-state-disabled-fg",
};

export const overlayCssVar: Record<keyof OverlayTokens, string> = {
  scrim: "--harbor-overlay-scrim",
  surface: "--harbor-overlay-surface",
  border: "--harbor-overlay-border",
};

export const chartCssVar: Record<keyof ChartTokens, string> = {
  1: "--harbor-chart-1",
  2: "--harbor-chart-2",
  3: "--harbor-chart-3",
  4: "--harbor-chart-4",
  5: "--harbor-chart-5",
  positive: "--harbor-chart-positive",
  negative: "--harbor-chart-negative",
  warning: "--harbor-chart-warning",
  neutral: "--harbor-chart-neutral",
  grid: "--harbor-chart-grid",
  axis: "--harbor-chart-axis",
};

export const codeCssVar: Record<keyof CodeTokens, string> = {
  keyword: "--harbor-syntax-keyword",
  string: "--harbor-syntax-string",
  comment: "--harbor-syntax-comment",
  number: "--harbor-syntax-number",
  function: "--harbor-syntax-function",
  type: "--harbor-syntax-type",
  variable: "--harbor-syntax-variable",
  operator: "--harbor-syntax-operator",
  property: "--harbor-syntax-property",
  attribute: "--harbor-syntax-attribute",
  tag: "--harbor-syntax-tag",
  regex: "--harbor-syntax-regex",
  meta: "--harbor-syntax-meta",
  error: "--harbor-syntax-error",
};

export const typographyCssVar: Record<keyof TypographyTokens, string> = {
  fontSans: "--harbor-font-sans",
  fontMono: "--harbor-font-mono",
  textXs: "--harbor-text-xs",
  textSm: "--harbor-text-sm",
  textBase: "--harbor-text-base",
  textLg: "--harbor-text-lg",
  textXl: "--harbor-text-xl",
  text2xl: "--harbor-text-2xl",
  text3xl: "--harbor-text-3xl",
  text4xl: "--harbor-text-4xl",
  text5xl: "--harbor-text-5xl",
  leadingTight: "--harbor-leading-tight",
  leadingSnug: "--harbor-leading-snug",
  leadingNormal: "--harbor-leading-normal",
  leadingRelaxed: "--harbor-leading-relaxed",
  leadingLoose: "--harbor-leading-loose",
  trackingTight: "--harbor-tracking-tight",
  trackingNormal: "--harbor-tracking-normal",
  trackingWide: "--harbor-tracking-wide",
  trackingWidest: "--harbor-tracking-widest",
};

export const spacingCssVar: Record<keyof SpacingTokens, string> = {
  0: "--harbor-space-0",
  1: "--harbor-space-1",
  2: "--harbor-space-2",
  3: "--harbor-space-3",
  4: "--harbor-space-4",
  5: "--harbor-space-5",
  6: "--harbor-space-6",
  8: "--harbor-space-8",
  10: "--harbor-space-10",
  12: "--harbor-space-12",
  16: "--harbor-space-16",
  20: "--harbor-space-20",
  24: "--harbor-space-24",
};

export const radiusCssVar: Record<keyof RadiusTokens, string> = {
  none: "--harbor-radius-none",
  sm: "--harbor-radius-sm",
  md: "--harbor-radius-md",
  lg: "--harbor-radius-lg",
  xl: "--harbor-radius-xl",
  "2xl": "--harbor-radius-2xl",
  full: "--harbor-radius-full",
};

export const shadowCssVar: Record<keyof ShadowTokens, string> = {
  sm: "--harbor-shadow-sm",
  md: "--harbor-shadow-md",
  lg: "--harbor-shadow-lg",
  glow: "--harbor-shadow-glow",
};

export const motionCssVar: Record<keyof MotionTokens, string> = {
  durInstant: "--harbor-dur-instant",
  durFast: "--harbor-dur-fast",
  durBase: "--harbor-dur-base",
  durSlow: "--harbor-dur-slow",
  durSlower: "--harbor-dur-slower",
  easeLinear: "--harbor-ease-linear",
  easeOut: "--harbor-ease-out",
  easeInOut: "--harbor-ease-in-out",
  easeSpring: "--harbor-ease-spring",
};

export const cssVarMap = {
  color: colorCssVar,
  surface: surfaceCssVar,
  text: textCssVar,
  border: borderCssVar,
  focus: focusCssVar,
  state: stateCssVar,
  overlay: overlayCssVar,
  chart: chartCssVar,
  code: codeCssVar,
  typography: typographyCssVar,
  spacing: spacingCssVar,
  radius: radiusCssVar,
  shadow: shadowCssVar,
  motion: motionCssVar,
} as const;

export type TokenCategory = keyof typeof cssVarMap;
