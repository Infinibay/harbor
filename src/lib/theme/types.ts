/**
 * Harbor theme type contract.
 *
 * Tokens are organised into six categories mirroring the structure of
 * src/tokens.css. A HarborTheme is a nameable bundle that can fully
 * define, partially override, or extend another theme via `extends`.
 *
 * Authors use `defineTheme` (not this file) to construct themes — it
 * applies color normalisation and basic validation.
 */

/** Colors are RGB triplets ("168 85 247") to work with Tailwind's
 *  `rgb(var(--name) / <alpha-value>)` slash syntax. `defineTheme` also
 *  accepts hex ("#FF6B35") and `rgb(...)` strings and converts them. */
export interface ColorTokens {
  accent: string;
  accent2: string;
  accent3: string;
  brand: string;
  brandFg: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  bg: string;
  bgElev1: string;
  bgElev2: string;
  bgElev3: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
}

export interface TypographyTokens {
  fontSans: string;
  fontMono: string;
  textXs: string;
  textSm: string;
  textBase: string;
  textLg: string;
  textXl: string;
  text2xl: string;
  text3xl: string;
  text4xl: string;
  text5xl: string;
  leadingTight: string;
  leadingSnug: string;
  leadingNormal: string;
  leadingRelaxed: string;
  leadingLoose: string;
  trackingTight: string;
  trackingNormal: string;
  trackingWide: string;
  trackingWidest: string;
}

/** Numeric keys mirror the `--harbor-space-{n}` scale. Note the scale
 *  is sparse (1..6, then 8, 10, 12, 16, 20, 24). */
export interface SpacingTokens {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
}

export interface RadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  glow: string;
}

export interface MotionTokens {
  durInstant: string;
  durFast: string;
  durBase: string;
  durSlow: string;
  durSlower: string;
  easeLinear: string;
  easeOut: string;
  easeInOut: string;
  easeSpring: string;
}

export interface ThemeTokens {
  color?: Partial<ColorTokens>;
  typography?: Partial<TypographyTokens>;
  spacing?: Partial<SpacingTokens>;
  radius?: Partial<RadiusTokens>;
  shadow?: Partial<ShadowTokens>;
  motion?: Partial<MotionTokens>;
}

export interface HarborTheme {
  /** Unique identifier, slug-safe (kebab-case recommended). */
  name: string;
  /** Human-readable label for theme pickers. */
  label?: string;
  /** Determines whether light-mode blanket overrides apply. Not inherited. */
  colorScheme: "dark" | "light";
  /** Name of another registered theme to inherit from. Resolved at mount. */
  extends?: string;
  tokens: ThemeTokens;
  meta?: {
    description?: string;
    preview?: { primary: string; surface: string };
  };
}

/** Result of walking the `extends` chain and merging. All category
 *  keys are present (possibly as empty objects) to simplify lookup. */
export interface ResolvedTheme {
  name: string;
  label?: string;
  colorScheme: "dark" | "light";
  tokens: Required<{ [K in keyof ThemeTokens]: ThemeTokens[K] }>;
  meta?: HarborTheme["meta"];
}
