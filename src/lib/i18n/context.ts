import { createContext } from "react";
import type { Direction, FormatVars, HarborLocale } from "./types";

export interface HarborI18nContextValue {
  /** Active locale object (never null inside a Provider). */
  locale: HarborLocale;
  /** Shorthand for `locale.code` (BCP-47). */
  code: string;
  /** Resolved text direction. */
  direction: Direction;
  /** Registered locales (for pickers). */
  locales: readonly HarborLocale[];
  /** Translate + interpolate a key. Returns the key itself if the active
   *  catalog + fallback both lack it (so production never crashes). */
  t: (key: string, vars?: FormatVars) => string;
  /** Request a locale change. In uncontrolled mode, the Provider flips;
   *  in controlled mode, the caller must honour it via `onLocaleChange`. */
  setLocale: (code: string) => void;
  /** Thin `Intl.*` wrappers preconfigured with the active code. */
  formatDate: (
    v: Date | number,
    options?: Intl.DateTimeFormatOptions,
  ) => string;
  formatNumber: (v: number, options?: Intl.NumberFormatOptions) => string;
  formatRelative: (
    seconds: number,
    unit?: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ) => string;
  formatList: (
    items: readonly string[],
    options?: Intl.ListFormatOptions,
  ) => string;
}

export const HarborI18nContext =
  createContext<HarborI18nContextValue | null>(null);

const RTL_LANGS = new Set(["ar", "he", "fa", "ur", "ps", "yi", "dv"]);

export function deriveDirection(code: string): Direction {
  const base = code.toLowerCase().split(/[-_]/)[0];
  return RTL_LANGS.has(base) ? "rtl" : "ltr";
}
