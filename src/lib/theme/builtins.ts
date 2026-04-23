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
import type { HarborTheme } from "./types";

export const harborDark: HarborTheme = defineTheme({
  name: "harbor-dark",
  label: "Harbor Dark",
  colorScheme: "dark",
  tokens: {
    color: {
      accent: "168 85 247",
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
    preview: { primary: "#A855F7", surface: "#0A0A0F" },
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
    shadow: {
      sm: "0 2px 8px -2px rgb(0 0 0 / 0.08)",
      md: "0 12px 30px -10px rgb(0 0 0 / 0.12)",
      lg: "0 30px 80px -20px rgb(0 0 0 / 0.18)",
    },
  },
  meta: {
    description: "Harbor's default light theme.",
    preview: { primary: "#A855F7", surface: "#F4F6FC" },
  },
});
