import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  HarborI18nContext,
  deriveDirection,
  type HarborI18nContextValue,
} from "./context";
import {
  formatDate as fmtDate,
  formatList as fmtList,
  formatNumber as fmtNumber,
  formatRelative as fmtRelative,
} from "./format";
import { formatMessage } from "./parse";
import type { FormatVars, HarborLocale } from "./types";

export interface HarborI18nProviderProps {
  /** Registered locales. Order matters only insofar as the first entry is
   *  the implicit fallback when `fallback` is not set. */
  locales: readonly HarborLocale[];
  /** Controlled active locale code. When omitted, the provider is
   *  uncontrolled and tracks its own state. */
  locale?: string;
  /** Initial active locale when uncontrolled. Defaults to
   *  `locales[0].code`. */
  defaultLocale?: string;
  /** Called with the new code any time the provider wants to switch. */
  onLocaleChange?: (code: string) => void;
  /** Locale code to fall back to when a key is missing from the active
   *  catalog. Defaults to `locales[0].code`. */
  fallback?: string;
  /** Write `dir` + `lang` on `<html>` as the active locale changes.
   *  Default `true`. */
  syncHtmlAttrs?: boolean;
  children: ReactNode;
}

/** Provides the active locale, text direction, and translation helpers.
 *  Stack inside your `HarborProvider` so theme + i18n coexist. */
export function HarborI18nProvider({
  locales,
  locale: controlledLocale,
  defaultLocale,
  onLocaleChange,
  fallback,
  syncHtmlAttrs = true,
  children,
}: HarborI18nProviderProps) {
  if (locales.length === 0) {
    throw new Error("HarborI18nProvider: `locales` must include at least one entry.");
  }

  const registry = useMemo(() => {
    const m = new Map<string, HarborLocale>();
    for (const l of locales) m.set(l.code, l);
    return m;
  }, [locales]);

  const fallbackCode = fallback ?? locales[0].code;
  const fallbackLocale = registry.get(fallbackCode) ?? locales[0];

  const [userChoice, setUserChoice] = useState<string | null>(null);
  const resolvedCode =
    controlledLocale ??
    userChoice ??
    defaultLocale ??
    locales[0].code;

  const active = registry.get(resolvedCode) ?? fallbackLocale;
  const direction = active.direction ?? deriveDirection(active.code);

  const setLocale = useCallback(
    (code: string) => {
      if (!registry.has(code)) {
        if (import.meta.env?.DEV) {
          console.warn(
            `[Harbor i18n] setLocale("${code}"): locale not registered. Ignored.`,
          );
        }
        return;
      }
      if (controlledLocale === undefined) setUserChoice(code);
      onLocaleChange?.(code);
    },
    [controlledLocale, onLocaleChange, registry],
  );

  const t = useCallback(
    (key: string, vars?: FormatVars) => {
      const template =
        active.messages[key] ?? fallbackLocale.messages[key] ?? key;
      return formatMessage(template, vars ?? {}, active.code);
    },
    [active, fallbackLocale],
  );

  // Sync <html> dir + lang so CSS logical properties flip correctly and
  // screen readers pronounce content in the right language.
  useEffect(() => {
    if (!syncHtmlAttrs || typeof document === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("dir", direction);
    root.setAttribute("lang", active.code);
  }, [direction, active.code, syncHtmlAttrs]);

  const value = useMemo<HarborI18nContextValue>(() => {
    return {
      locale: active,
      code: active.code,
      direction,
      locales,
      t,
      setLocale,
      formatDate: (v, o) => fmtDate(v, active.code, o),
      formatNumber: (v, o) => fmtNumber(v, active.code, o),
      formatRelative: (s, u, o) => fmtRelative(s, active.code, u, o),
      formatList: (items, o) => fmtList(items, active.code, o),
    };
  }, [active, direction, locales, t, setLocale]);

  return (
    <HarborI18nContext.Provider value={value}>
      {children}
    </HarborI18nContext.Provider>
  );
}
