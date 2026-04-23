/**
 * Access the active Harbor theme, switch between registered themes,
 * and read the OS-level color-scheme preference.
 *
 * Must be called beneath a <HarborProvider>. Components that want to
 * remain usable without the Provider should use `useOptionalHarborTheme`
 * instead (returns null when absent).
 */

import { useContext } from "react";
import {
  HarborThemeContext,
  type HarborThemeContextValue,
} from "./context";

export function useHarborTheme(): HarborThemeContextValue {
  const ctx = useContext(HarborThemeContext);
  if (!ctx) {
    throw new Error(
      "[Harbor] useHarborTheme must be used inside <HarborProvider>.",
    );
  }
  return ctx;
}

export function useOptionalHarborTheme(): HarborThemeContextValue | null {
  return useContext(HarborThemeContext);
}
