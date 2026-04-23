/**
 * HarborProvider — registers themes, injects their CSS variable
 * declarations into the document, and exposes the active theme via
 * context.
 *
 * Activation model:
 *   - Uncontrolled (default): the Provider remembers only the user's
 *     explicit choice (if any). The active theme is derived from that
 *     choice, otherwise from `defaultTheme` resolved against the
 *     current system color-scheme preference. System changes flow
 *     through automatically — no mirror state, no sync effect.
 *   - Controlled: pass `theme` + `onThemeChange`; Provider follows.
 *
 * `defaultTheme` can be a theme name, a `{ dark, light }` pair (for
 * system-preference tracking), or a function.
 *
 * Backwards compatibility: whenever the active theme's colorScheme is
 * "light", the Provider also writes `data-theme="light"` on <html>.
 * That keeps existing `[data-theme="light"]` rules in tokens.css and
 * theme-light.css working without edits.
 *
 * Stability note: the `themes` and `persist` props are read via
 * referential identity. For best performance, consumers should pass
 * stable references (useMemo the themes array; hoist `persist` options
 * out of render) — otherwise the registry and CSS re-derive on every
 * render.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { harborDark, harborLight } from "./builtins";
import { HarborThemeContext, type HarborThemeContextValue } from "./context";
import { resolveTheme, themeToCss } from "./resolve";
import type { HarborTheme, ResolvedTheme } from "./types";

export type DefaultThemeSpec =
  | string
  | { dark: string; light: string }
  | ((ctx: { systemColorScheme: "dark" | "light" }) => string);

export interface HarborProviderProps {
  /** Themes to register in addition to the built-in `harbor-dark` and
   *  `harbor-light`. Pass one with the same `name` as a built-in to
   *  replace it entirely. Should be a stable reference (useMemo). */
  themes?: HarborTheme[];
  /** Which theme to activate when uncontrolled and nothing is
   *  persisted. Omit to default to "harbor-dark". */
  defaultTheme?: DefaultThemeSpec;
  /** Controlled active-theme name. When provided, `onThemeChange` is
   *  how the Provider reports requested changes. */
  theme?: string;
  /** Called with the new name whenever the Provider wants to change
   *  theme (fired in both controlled and uncontrolled modes). In
   *  controlled mode, persistence is the caller's responsibility. */
  onThemeChange?: (name: string) => void;
  /** Persist the uncontrolled selection. `true` uses localStorage
   *  under "harbor-theme"; pass an object to customise. Stable
   *  reference recommended. */
  persist?: boolean | { key?: string; storage?: Storage };
  children: ReactNode;
}

const DEFAULT_STORAGE_KEY = "harbor-theme";
const FALLBACK_THEME = "harbor-dark";

function getStorage(
  persist: HarborProviderProps["persist"],
): Storage | null {
  if (!persist || typeof window === "undefined") return null;
  if (persist === true) return window.localStorage;
  return persist.storage ?? window.localStorage;
}

function getStorageKey(persist: HarborProviderProps["persist"]): string {
  if (!persist || persist === true) return DEFAULT_STORAGE_KEY;
  return persist.key ?? DEFAULT_STORAGE_KEY;
}

function detectSystemScheme(): "dark" | "light" {
  if (typeof window === "undefined" || !window.matchMedia) return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveDefaultName(
  defaultTheme: DefaultThemeSpec | undefined,
  systemColorScheme: "dark" | "light",
): string {
  if (typeof defaultTheme === "string") return defaultTheme;
  if (typeof defaultTheme === "function") {
    return defaultTheme({ systemColorScheme });
  }
  if (defaultTheme && typeof defaultTheme === "object") {
    return defaultTheme[systemColorScheme];
  }
  return FALLBACK_THEME;
}

export function HarborProvider({
  themes = [],
  defaultTheme,
  theme: controlledTheme,
  onThemeChange,
  persist = false,
  children,
}: HarborProviderProps) {
  const registry = useMemo(() => {
    const r = new Map<string, HarborTheme>();
    r.set(harborDark.name, harborDark);
    r.set(harborLight.name, harborLight);
    for (const t of themes) r.set(t.name, t);
    return r;
  }, [themes]);

  const resolved = useMemo(() => {
    const m = new Map<string, ResolvedTheme>();
    for (const t of registry.values()) {
      m.set(t.name, resolveTheme(t, registry));
    }
    return m;
  }, [registry]);

  const css = useMemo(
    () =>
      [...resolved.values()]
        .map((t) => themeToCss(t, `:root[data-harbor-theme="${t.name}"]`))
        .join("\n"),
    [resolved],
  );

  const [systemColorScheme, setSystemColorScheme] = useState<
    "dark" | "light"
  >(() => detectSystemScheme());

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () =>
      setSystemColorScheme(mq.matches ? "dark" : "light");
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  // Only the user's explicit selection lives in state. Everything else
  // (default, system tracking) is derived — so an OS-level preference
  // flip recomputes the active theme via useMemo without an extra
  // render cycle.
  const [userChoice, setUserChoice] = useState<string | null>(() => {
    const storage = getStorage(persist);
    if (!storage) return null;
    try {
      return storage.getItem(getStorageKey(persist));
    } catch {
      return null;
    }
  });

  const activeName = useMemo(() => {
    if (controlledTheme !== undefined) return controlledTheme;
    if (userChoice && registry.has(userChoice)) return userChoice;
    return resolveDefaultName(defaultTheme, systemColorScheme);
  }, [
    controlledTheme,
    userChoice,
    defaultTheme,
    systemColorScheme,
    registry,
  ]);

  const isKnown = resolved.has(activeName);
  const safeActive = isKnown ? activeName : FALLBACK_THEME;

  if (import.meta.env?.DEV && !isKnown) {
    console.warn(
      `[Harbor] Active theme "${activeName}" is not registered. ` +
        `Falling back to "${FALLBACK_THEME}".`,
    );
  }

  const setTheme = useCallback(
    (name: string) => {
      if (!registry.has(name)) {
        if (import.meta.env?.DEV) {
          console.warn(
            `[Harbor] setTheme("${name}"): theme is not registered. Ignored.`,
          );
        }
        return;
      }
      if (controlledTheme === undefined) {
        setUserChoice(name);
        const storage = getStorage(persist);
        if (storage) {
          try {
            storage.setItem(getStorageKey(persist), name);
          } catch {
            // Quota / privacy mode — selection still applies in-memory.
          }
        }
      }
      onThemeChange?.(name);
    },
    [controlledTheme, onThemeChange, persist, registry],
  );

  // Sync the root element with the active theme. Plain useEffect (not
  // useLayoutEffect) to stay SSR-safe — a single-frame default-theme
  // flash is the trade-off until a flash-free script helper ships.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const active = resolved.get(safeActive);
    if (!active) return;
    root.setAttribute("data-harbor-theme", active.name);
    if (active.colorScheme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [safeActive, resolved]);

  const contextValue = useMemo<HarborThemeContextValue>(() => {
    const themeObject = resolved.get(safeActive) as ResolvedTheme;
    return {
      theme: safeActive,
      themeObject,
      colorScheme: themeObject.colorScheme,
      setTheme,
      themes: [...resolved.values()],
      systemColorScheme,
    };
  }, [safeActive, resolved, setTheme, systemColorScheme]);

  return (
    <HarborThemeContext.Provider value={contextValue}>
      <style
        data-harbor-theme-styles=""
        dangerouslySetInnerHTML={{ __html: css }}
      />
      {children}
    </HarborThemeContext.Provider>
  );
}
