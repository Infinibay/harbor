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
import type { CSSProperties, ReactNode } from "react";
import { harborDark, harborLight } from "./builtins";
import { HarborThemeContext, type HarborThemeContextValue } from "./context";
import { resolveTheme, themeToCss } from "./resolve";
import type { HarborTheme, ResolvedTheme } from "./types";

export type DefaultThemeSpec =
  | string
  | { dark: string; light: string }
  | ((ctx: { systemColorScheme: "dark" | "light" }) => string);

export type HarborTarget =
  | "desktop-app"
  | "webapp"
  | "website"
  | "mobile"
  | "tablet";

export type HarborDensity = "compact" | "comfortable" | "spacious";

export interface HarborAdaptiveTokens {
  controlHeight: string;
  controlPaddingX: string;
  controlPaddingY: string;
  panelPadding: string;
  gap: string;
  radius: string;
  shadow: string;
  fontSize: string;
  lineHeight: string;
  borderAlpha: string;
  menuPadding: string;
  menuItemPaddingX: string;
  menuItemPaddingY: string;
  tabHeight: string;
  toolbarHeight: string;
  statusbarHeight: string;
  iconSize: string;
  inputHeight: string;
  cardPadding: string;
}

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
  /** Product surface target. When provided, the provider scopes a set
   *  of adaptive CSS variables around `children` so the same component
   *  can feel like desktop software, a web app, a website, or a touch UI. */
  target?: HarborTarget;
  /** Density within the selected target. Desktop apps usually use
   *  "compact"; websites usually use "spacious". */
  density?: HarborDensity;
  /** Optional per-scope adaptive token overrides. */
  adaptiveTokens?: Partial<HarborAdaptiveTokens>;
  /** Applied to the adaptive scope. Only renders a wrapper when one of
   *  target/density/adaptiveTokens/className/style is provided. */
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

const DEFAULT_STORAGE_KEY = "harbor-theme";
const FALLBACK_THEME = "harbor-dark";

const DEFAULT_TARGET: HarborTarget = "webapp";
const DEFAULT_DENSITY: HarborDensity = "comfortable";

// eslint-disable-next-line react-refresh/only-export-components
export const harborAdaptivePresets: Record<
  HarborTarget,
  Record<HarborDensity, HarborAdaptiveTokens>
> = {
  "desktop-app": {
    compact: {
      controlHeight: "30px",
      controlPaddingX: "8px",
      controlPaddingY: "4px",
      panelPadding: "10px",
      gap: "6px",
      radius: "3px",
      shadow: "none",
      fontSize: "12px",
      lineHeight: "1.42",
      borderAlpha: "0.12",
      menuPadding: "3px",
      menuItemPaddingX: "8px",
      menuItemPaddingY: "4px",
      tabHeight: "34px",
      toolbarHeight: "32px",
      statusbarHeight: "22px",
      iconSize: "14px",
      inputHeight: "30px",
      cardPadding: "10px",
    },
    comfortable: {
      controlHeight: "34px",
      controlPaddingX: "10px",
      controlPaddingY: "6px",
      panelPadding: "12px",
      gap: "8px",
      radius: "4px",
      shadow: "var(--harbor-shadow-sm)",
      fontSize: "13px",
      lineHeight: "1.45",
      borderAlpha: "0.12",
      menuPadding: "4px",
      menuItemPaddingX: "9px",
      menuItemPaddingY: "5px",
      tabHeight: "36px",
      toolbarHeight: "36px",
      statusbarHeight: "24px",
      iconSize: "15px",
      inputHeight: "34px",
      cardPadding: "12px",
    },
    spacious: {
      controlHeight: "38px",
      controlPaddingX: "12px",
      controlPaddingY: "7px",
      panelPadding: "14px",
      gap: "10px",
      radius: "6px",
      shadow: "var(--harbor-shadow-sm)",
      fontSize: "13px",
      lineHeight: "1.5",
      borderAlpha: "0.12",
      menuPadding: "5px",
      menuItemPaddingX: "10px",
      menuItemPaddingY: "6px",
      tabHeight: "38px",
      toolbarHeight: "38px",
      statusbarHeight: "26px",
      iconSize: "16px",
      inputHeight: "38px",
      cardPadding: "14px",
    },
  },
  webapp: {
    compact: {
      controlHeight: "36px",
      controlPaddingX: "12px",
      controlPaddingY: "7px",
      panelPadding: "12px",
      gap: "8px",
      radius: "8px",
      shadow: "var(--harbor-shadow-sm)",
      fontSize: "13px",
      lineHeight: "1.45",
      borderAlpha: "0.10",
      menuPadding: "4px",
      menuItemPaddingX: "10px",
      menuItemPaddingY: "6px",
      tabHeight: "36px",
      toolbarHeight: "36px",
      statusbarHeight: "26px",
      iconSize: "16px",
      inputHeight: "36px",
      cardPadding: "14px",
    },
    comfortable: {
      controlHeight: "40px",
      controlPaddingX: "14px",
      controlPaddingY: "8px",
      panelPadding: "16px",
      gap: "12px",
      radius: "10px",
      shadow: "var(--harbor-shadow-sm)",
      fontSize: "13px",
      lineHeight: "1.5",
      borderAlpha: "0.10",
      menuPadding: "5px",
      menuItemPaddingX: "12px",
      menuItemPaddingY: "7px",
      tabHeight: "40px",
      toolbarHeight: "40px",
      statusbarHeight: "28px",
      iconSize: "16px",
      inputHeight: "40px",
      cardPadding: "16px",
    },
    spacious: {
      controlHeight: "44px",
      controlPaddingX: "16px",
      controlPaddingY: "10px",
      panelPadding: "20px",
      gap: "16px",
      radius: "14px",
      shadow: "var(--harbor-shadow-md)",
      fontSize: "14px",
      lineHeight: "1.55",
      borderAlpha: "0.10",
      menuPadding: "6px",
      menuItemPaddingX: "14px",
      menuItemPaddingY: "9px",
      tabHeight: "44px",
      toolbarHeight: "44px",
      statusbarHeight: "32px",
      iconSize: "18px",
      inputHeight: "44px",
      cardPadding: "20px",
    },
  },
  website: {
    compact: {
      controlHeight: "40px",
      controlPaddingX: "14px",
      controlPaddingY: "8px",
      panelPadding: "16px",
      gap: "12px",
      radius: "12px",
      shadow: "var(--harbor-shadow-sm)",
      fontSize: "14px",
      lineHeight: "1.55",
      borderAlpha: "0.10",
      menuPadding: "5px",
      menuItemPaddingX: "12px",
      menuItemPaddingY: "7px",
      tabHeight: "40px",
      toolbarHeight: "40px",
      statusbarHeight: "30px",
      iconSize: "16px",
      inputHeight: "40px",
      cardPadding: "18px",
    },
    comfortable: {
      controlHeight: "44px",
      controlPaddingX: "16px",
      controlPaddingY: "10px",
      panelPadding: "22px",
      gap: "18px",
      radius: "16px",
      shadow: "var(--harbor-shadow-md)",
      fontSize: "15px",
      lineHeight: "1.6",
      borderAlpha: "0.10",
      menuPadding: "6px",
      menuItemPaddingX: "14px",
      menuItemPaddingY: "9px",
      tabHeight: "44px",
      toolbarHeight: "44px",
      statusbarHeight: "32px",
      iconSize: "18px",
      inputHeight: "44px",
      cardPadding: "22px",
    },
    spacious: {
      controlHeight: "48px",
      controlPaddingX: "20px",
      controlPaddingY: "12px",
      panelPadding: "28px",
      gap: "24px",
      radius: "20px",
      shadow: "var(--harbor-shadow-lg)",
      fontSize: "16px",
      lineHeight: "1.65",
      borderAlpha: "0.12",
      menuPadding: "8px",
      menuItemPaddingX: "16px",
      menuItemPaddingY: "10px",
      tabHeight: "48px",
      toolbarHeight: "48px",
      statusbarHeight: "34px",
      iconSize: "20px",
      inputHeight: "48px",
      cardPadding: "28px",
    },
  },
  mobile: {
    compact: {
      controlHeight: "42px",
      controlPaddingX: "14px",
      controlPaddingY: "10px",
      panelPadding: "14px",
      gap: "10px",
      radius: "12px",
      shadow: "var(--harbor-shadow-sm)",
      fontSize: "14px",
      lineHeight: "1.55",
      borderAlpha: "0.10",
      menuPadding: "6px",
      menuItemPaddingX: "12px",
      menuItemPaddingY: "10px",
      tabHeight: "42px",
      toolbarHeight: "44px",
      statusbarHeight: "32px",
      iconSize: "18px",
      inputHeight: "42px",
      cardPadding: "16px",
    },
    comfortable: {
      controlHeight: "46px",
      controlPaddingX: "16px",
      controlPaddingY: "12px",
      panelPadding: "18px",
      gap: "14px",
      radius: "16px",
      shadow: "var(--harbor-shadow-md)",
      fontSize: "15px",
      lineHeight: "1.6",
      borderAlpha: "0.10",
      menuPadding: "8px",
      menuItemPaddingX: "14px",
      menuItemPaddingY: "12px",
      tabHeight: "46px",
      toolbarHeight: "48px",
      statusbarHeight: "34px",
      iconSize: "20px",
      inputHeight: "46px",
      cardPadding: "18px",
    },
    spacious: {
      controlHeight: "52px",
      controlPaddingX: "18px",
      controlPaddingY: "14px",
      panelPadding: "22px",
      gap: "18px",
      radius: "20px",
      shadow: "var(--harbor-shadow-md)",
      fontSize: "16px",
      lineHeight: "1.65",
      borderAlpha: "0.12",
      menuPadding: "10px",
      menuItemPaddingX: "16px",
      menuItemPaddingY: "14px",
      tabHeight: "52px",
      toolbarHeight: "52px",
      statusbarHeight: "36px",
      iconSize: "22px",
      inputHeight: "52px",
      cardPadding: "22px",
    },
  },
  tablet: {
    compact: {
      controlHeight: "38px",
      controlPaddingX: "12px",
      controlPaddingY: "8px",
      panelPadding: "14px",
      gap: "10px",
      radius: "10px",
      shadow: "var(--harbor-shadow-sm)",
      fontSize: "13px",
      lineHeight: "1.5",
      borderAlpha: "0.10",
      menuPadding: "5px",
      menuItemPaddingX: "12px",
      menuItemPaddingY: "8px",
      tabHeight: "40px",
      toolbarHeight: "40px",
      statusbarHeight: "28px",
      iconSize: "17px",
      inputHeight: "38px",
      cardPadding: "16px",
    },
    comfortable: {
      controlHeight: "44px",
      controlPaddingX: "16px",
      controlPaddingY: "10px",
      panelPadding: "18px",
      gap: "14px",
      radius: "14px",
      shadow: "var(--harbor-shadow-md)",
      fontSize: "14px",
      lineHeight: "1.55",
      borderAlpha: "0.10",
      menuPadding: "7px",
      menuItemPaddingX: "14px",
      menuItemPaddingY: "10px",
      tabHeight: "44px",
      toolbarHeight: "44px",
      statusbarHeight: "30px",
      iconSize: "18px",
      inputHeight: "44px",
      cardPadding: "20px",
    },
    spacious: {
      controlHeight: "48px",
      controlPaddingX: "18px",
      controlPaddingY: "12px",
      panelPadding: "24px",
      gap: "20px",
      radius: "18px",
      shadow: "var(--harbor-shadow-md)",
      fontSize: "15px",
      lineHeight: "1.6",
      borderAlpha: "0.12",
      menuPadding: "8px",
      menuItemPaddingX: "16px",
      menuItemPaddingY: "12px",
      tabHeight: "48px",
      toolbarHeight: "48px",
      statusbarHeight: "34px",
      iconSize: "20px",
      inputHeight: "48px",
      cardPadding: "24px",
    },
  },
};

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

function adaptiveTokensToStyle(
  target: HarborTarget,
  density: HarborDensity,
  overrides?: Partial<HarborAdaptiveTokens>,
): CSSProperties {
  const tokens = {
    ...harborAdaptivePresets[target][density],
    ...overrides,
  };
  return {
    "--harbor-target-control-height": tokens.controlHeight,
    "--harbor-target-control-padding-x": tokens.controlPaddingX,
    "--harbor-target-control-padding-y": tokens.controlPaddingY,
    "--harbor-target-panel-padding": tokens.panelPadding,
    "--harbor-target-gap": tokens.gap,
    "--harbor-target-radius": tokens.radius,
    "--harbor-target-shadow": tokens.shadow,
    "--harbor-target-font-size": tokens.fontSize,
    "--harbor-target-line-height": tokens.lineHeight,
    "--harbor-target-border-alpha": tokens.borderAlpha,
    "--harbor-target-menu-padding": tokens.menuPadding,
    "--harbor-target-menu-item-padding-x": tokens.menuItemPaddingX,
    "--harbor-target-menu-item-padding-y": tokens.menuItemPaddingY,
    "--harbor-target-tab-height": tokens.tabHeight,
    "--harbor-target-toolbar-height": tokens.toolbarHeight,
    "--harbor-target-statusbar-height": tokens.statusbarHeight,
    "--harbor-target-icon-size": tokens.iconSize,
    "--harbor-target-input-height": tokens.inputHeight,
    "--harbor-target-card-padding": tokens.cardPadding,
  } as CSSProperties;
}

export function HarborProvider({
  themes = [],
  defaultTheme,
  theme: controlledTheme,
  onThemeChange,
  persist = false,
  target,
  density = DEFAULT_DENSITY,
  adaptiveTokens,
  className,
  style,
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

  const hasAdaptiveScope =
    target !== undefined ||
    adaptiveTokens !== undefined ||
    className !== undefined ||
    style !== undefined;
  const adaptiveTarget = target ?? DEFAULT_TARGET;
  const adaptiveStyle = hasAdaptiveScope
    ? {
        ...adaptiveTokensToStyle(adaptiveTarget, density, adaptiveTokens),
        ...style,
      }
    : undefined;

  return (
    <HarborThemeContext.Provider value={contextValue}>
      <style
        data-harbor-theme-styles=""
        dangerouslySetInnerHTML={{ __html: css }}
      />
      {hasAdaptiveScope ? (
        <div
          data-harbor-target={adaptiveTarget}
          data-harbor-density={density}
          className={className}
          style={adaptiveStyle}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </HarborThemeContext.Provider>
  );
}
