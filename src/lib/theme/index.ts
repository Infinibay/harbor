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
export {
  harborAiWorkbenchDark,
  harborAiWorkbenchLight,
  harborBuiltInThemes,
  harborDark,
  harborDataDark,
  harborDataLight,
  harborDevDark,
  harborDevLight,
  harborEnterpriseDark,
  harborEnterpriseLight,
  harborLight,
  harborNeutralDark,
  harborNeutralLight,
} from "./builtins";
export { normalizeColor } from "./color";
export {
  HarborProvider,
  harborAdaptivePresets,
  type DefaultThemeSpec,
  type HarborAdaptiveTokens,
  type HarborDensity,
  type HarborProviderProps,
  type HarborTarget,
} from "./HarborProvider";
export {
  HarborThemeContext,
  type HarborThemeContextValue,
} from "./context";
export { useHarborTheme, useOptionalHarborTheme } from "./useHarborTheme";
export { resolveTheme, themeToCss } from "./resolve";
export { cssVarMap } from "./tokens-map";
export {
  formatThemeAuditReport,
  formatThemePairValidationReport,
  formatThemeValidationReport,
  validateThemeAudit,
  validateTheme,
  validateThemePair,
  type ThemeAuditPair,
  type ThemeAuditReport,
  type ThemeAuditSummary,
  type ThemeContrastCheck,
  type ThemeFocusCheck,
  type ThemePairValidationReport,
  type ThemePairValidationSummary,
  type ThemeTokenCoverage,
  type ThemeValidationIssue,
  type ThemeValidationLevel,
  type ThemeValidationReport,
  type ThemeValidationSummary,
} from "./validateTheme";
export type {
  ColorTokens,
  BorderTokens,
  ChartTokens,
  CodeTokens,
  FocusTokens,
  HarborTheme,
  MotionTokens,
  OverlayTokens,
  RadiusTokens,
  ResolvedTheme,
  ShadowTokens,
  SpacingTokens,
  StateTokens,
  SurfaceTokens,
  ThemeTokens,
  TypographyTokens,
} from "./types";
