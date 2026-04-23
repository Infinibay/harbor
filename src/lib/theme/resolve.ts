/**
 * Theme resolution: walking the `extends` chain and serialising the
 * result to a CSS rule block.
 *
 * Merge semantics:
 *   - per-category shallow merge (child keys override parent keys)
 *   - `colorScheme` is NOT inherited (must be declared on every theme
 *     so `dark extends light` surprises can't happen silently)
 *   - cycles throw with the detected path
 */

import { cssVarMap } from "./tokens-map";
import type { HarborTheme, ResolvedTheme, ThemeTokens } from "./types";

function emptyResolvedTokens(): ResolvedTheme["tokens"] {
  return {
    color: {},
    typography: {},
    spacing: {},
    radius: {},
    shadow: {},
    motion: {},
  };
}

function mergeCategory<T extends object>(
  base: Partial<T> | undefined,
  overlay: Partial<T> | undefined,
): Partial<T> {
  if (!base && !overlay) return {};
  if (!base) return { ...overlay };
  if (!overlay) return { ...base };
  return { ...base, ...overlay };
}

function mergeTokens(
  base: ResolvedTheme["tokens"],
  overlay: ThemeTokens,
): ResolvedTheme["tokens"] {
  return {
    color: mergeCategory(base.color, overlay.color),
    typography: mergeCategory(base.typography, overlay.typography),
    spacing: mergeCategory(base.spacing, overlay.spacing),
    radius: mergeCategory(base.radius, overlay.radius),
    shadow: mergeCategory(base.shadow, overlay.shadow),
    motion: mergeCategory(base.motion, overlay.motion),
  };
}

export function resolveTheme(
  theme: HarborTheme,
  registry: ReadonlyMap<string, HarborTheme>,
  seen: Set<string> = new Set(),
): ResolvedTheme {
  if (seen.has(theme.name)) {
    const chain = [...seen, theme.name].join(" -> ");
    throw new Error(`[Harbor] Circular theme extends chain: ${chain}`);
  }

  let baseTokens = emptyResolvedTokens();
  let baseLabel: string | undefined;
  let baseMeta: HarborTheme["meta"] | undefined;

  if (theme.extends) {
    const parent = registry.get(theme.extends);
    if (!parent) {
      throw new Error(
        `[Harbor] Theme "${theme.name}" extends "${theme.extends}" ` +
          `which is not registered.`,
      );
    }
    const resolvedParent = resolveTheme(
      parent,
      registry,
      new Set([...seen, theme.name]),
    );
    baseTokens = resolvedParent.tokens;
    baseLabel = resolvedParent.label;
    baseMeta = resolvedParent.meta;
  }

  return {
    name: theme.name,
    label: theme.label ?? baseLabel,
    colorScheme: theme.colorScheme,
    tokens: mergeTokens(baseTokens, theme.tokens),
    meta: theme.meta ?? baseMeta,
  };
}

/**
 * Serialises a resolved theme to a CSS rule block. The selector is
 * provided by the caller so scope ("root" vs "self") stays a Provider
 * concern.
 */
export function themeToCss(theme: ResolvedTheme, selector: string): string {
  const lines: string[] = [];
  for (const category of Object.keys(cssVarMap) as (keyof typeof cssVarMap)[]) {
    const categoryMap = cssVarMap[category] as Record<string, string>;
    const values = theme.tokens[category] as
      | Record<string, string>
      | undefined;
    if (!values) continue;
    for (const [tokenKey, cssVar] of Object.entries(categoryMap)) {
      const value = values[tokenKey];
      if (value !== undefined && value !== null && value !== "") {
        lines.push(`  ${cssVar}: ${value};`);
      }
    }
  }
  return `${selector} {\n${lines.join("\n")}\n}`;
}
