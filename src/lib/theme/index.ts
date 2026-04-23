/**
 * Public entry point for Harbor's theming subsystem.
 *
 * import {
 *   HarborProvider,
 *   defineTheme,
 *   useHarborTheme,
 * } from "@infinibay/harbor/theme";
 */

export { defineTheme } from "./defineTheme";
export { harborDark, harborLight } from "./builtins";
export { normalizeColor } from "./color";
export {
  HarborProvider,
  type DefaultThemeSpec,
  type HarborProviderProps,
} from "./HarborProvider";
export {
  HarborThemeContext,
  type HarborThemeContextValue,
} from "./context";
export { useHarborTheme, useOptionalHarborTheme } from "./useHarborTheme";
export { resolveTheme, themeToCss } from "./resolve";
export { cssVarMap } from "./tokens-map";
export type {
  ColorTokens,
  HarborTheme,
  MotionTokens,
  RadiusTokens,
  ResolvedTheme,
  ShadowTokens,
  SpacingTokens,
  ThemeTokens,
  TypographyTokens,
} from "./types";
