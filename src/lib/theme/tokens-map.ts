/**
 * Maps every semantic token key (category + key) to the CSS custom
 * property declared in src/tokens.css. Adding a new token requires
 * updating both this map and the corresponding type in `types.ts`.
 */

import type {
  ColorTokens,
  MotionTokens,
  RadiusTokens,
  ShadowTokens,
  SpacingTokens,
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
  typography: typographyCssVar,
  spacing: spacingCssVar,
  radius: radiusCssVar,
  shadow: shadowCssVar,
  motion: motionCssVar,
} as const;

export type TokenCategory = keyof typeof cssVarMap;
