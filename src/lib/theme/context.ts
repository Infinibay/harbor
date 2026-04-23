/**
 * React context + its value type live here (instead of in
 * HarborProvider.tsx) so that the Provider file exports only a
 * component, keeping Fast Refresh / HMR working correctly.
 */

import { createContext } from "react";
import type { ResolvedTheme } from "./types";

export interface HarborThemeContextValue {
  /** Name of the currently active theme. */
  theme: string;
  /** Fully resolved theme (after `extends` merging). */
  themeObject: ResolvedTheme;
  /** Convenience mirror of `themeObject.colorScheme`. */
  colorScheme: "dark" | "light";
  /** Switch to a different registered theme by name. */
  setTheme: (name: string) => void;
  /** Every theme in the registry, resolved. Useful for pickers. */
  themes: ResolvedTheme[];
  /** Current OS-level color scheme preference. */
  systemColorScheme: "dark" | "light";
}

export const HarborThemeContext =
  createContext<HarborThemeContextValue | null>(null);
