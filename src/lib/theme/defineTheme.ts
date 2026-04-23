/**
 * Factory for HarborTheme definitions.
 *
 * `defineTheme` is an identity-with-validation function: it returns a
 * well-formed HarborTheme and, in dev, warns on common mistakes
 * (missing name, invalid colorScheme, malformed color values). The
 * function also normalises color inputs so authors can freely write
 * hex, rgb(), or triplet syntax.
 *
 * Extends resolution does NOT happen here — it's deferred to the
 * Provider, which has visibility of the whole registry.
 */

import { normalizeColor } from "./color";
import type { ColorTokens, HarborTheme, ThemeTokens } from "./types";

const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function defineTheme(theme: HarborTheme): HarborTheme {
  if (!theme.name || typeof theme.name !== "string") {
    throw new Error('[Harbor] defineTheme: "name" is required.');
  }
  if (theme.colorScheme !== "dark" && theme.colorScheme !== "light") {
    throw new Error(
      `[Harbor] defineTheme("${theme.name}"): "colorScheme" must be "dark" or "light".`,
    );
  }
  if (import.meta.env?.DEV && !NAME.test(theme.name)) {
    console.warn(
      `[Harbor] defineTheme: name "${theme.name}" is not kebab-case. ` +
        `This may cause issues when used in CSS attribute selectors.`,
    );
  }

  const nextTokens: ThemeTokens = { ...theme.tokens };
  if (theme.tokens.color) {
    const color: Partial<ColorTokens> = {};
    for (const [key, value] of Object.entries(theme.tokens.color)) {
      if (value !== undefined) {
        color[key as keyof ColorTokens] = normalizeColor(value);
      }
    }
    nextTokens.color = color;
  }

  return {
    ...theme,
    tokens: nextTokens,
  };
}
