import { describe, expect, it } from "vitest";
import { harborBuiltInThemes } from "./builtins";
import { resolveTheme, themeToCss } from "./resolve";
import {
  formatThemeAuditReport,
  formatThemePairValidationReport,
  formatThemeValidationReport,
  validateThemeAudit,
  validateTheme,
  validateThemePair,
} from "./validateTheme";

describe("theme validation", () => {
  it("passes every built-in production theme", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));

    for (const theme of harborBuiltInThemes) {
      const report = validateTheme(resolveTheme(theme, registry));
      expect(report, `${theme.name}: ${report.issues.map((issue) => issue.message).join(", ")}`).toMatchObject({
        theme: theme.name,
        passes: true,
      });
      expect(report.summary.errors).toBe(0);
      expect(report.tokenCoverage.missing).toEqual([]);
      expect(report.tokenCoverage.present).toBe(report.tokenCoverage.required);
      expect(report.focus.every((check) => check.passes)).toBe(true);
      expect(report.contrast.some((check) => check.name === "semantic primary text on canvas")).toBe(true);
      expect(report.contrast.some((check) => check.name === "semantic link text on canvas")).toBe(true);
      expect(report.chartContrast.length).toBeGreaterThan(0);
      expect(report.chartContrast.every((check) => check.passes)).toBe(true);
    }
  });

  it("passes every built-in dark/light production pair", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const pairs = [
      ["harbor-dark", "harbor-light", "harbor"],
      ["harbor-neutral-dark", "harbor-neutral-light", "harbor-neutral"],
      ["harbor-enterprise-dark", "harbor-enterprise-light", "harbor-enterprise"],
      ["harbor-dev-dark", "harbor-dev-light", "harbor-dev"],
      ["harbor-data-dark", "harbor-data-light", "harbor-data"],
      ["harbor-ai-workbench-dark", "harbor-ai-workbench-light", "harbor-ai-workbench"],
    ] as const;

    for (const [darkName, lightName, pairName] of pairs) {
      const report = validateThemePair(
        resolveTheme(registry.get(darkName)!, registry),
        resolveTheme(registry.get(lightName)!, registry),
        pairName,
      );

      expect(report, `${pairName}: ${report.issues.map((issue) => issue.message).join(", ")}`).toMatchObject({
        pair: pairName,
        passes: true,
      });
      expect(report.parity.missingInDark).toEqual([]);
      expect(report.parity.missingInLight).toEqual([]);
      expect(report.parity.sharedTokenCount).toBeGreaterThan(50);
      expect(report.summary).toMatchObject({
        errors: 0,
        missingInDark: 0,
        missingInLight: 0,
        darkErrors: 0,
        lightErrors: 0,
      });
    }
  });

  it("serializes semantic product tokens to css variables", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const theme = resolveTheme(registry.get("harbor-neutral-light")!, registry);
    const css = themeToCss(theme, ':root[data-harbor-theme="harbor-neutral-light"]');

    expect(css).toContain("--harbor-surface-panel:");
    expect(css).toContain("--harbor-text-primary:");
    expect(css).toContain("--harbor-text-link:");
    expect(css).toContain("--harbor-border-default:");
    expect(css).toContain("--harbor-focus-ring:");
    expect(css).toContain("--harbor-state-selected:");
    expect(css).toContain("--harbor-overlay-scrim:");
    expect(css).toContain("--harbor-chart-1:");
    expect(css).toContain("--harbor-syntax-keyword:");
  });

  it("reports contrast failures for unsafe resolved themes", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const unsafe = resolveTheme(
      {
        name: "unsafe-light",
        colorScheme: "light",
        extends: "harbor-light",
        tokens: {
          color: {
            text: "250 250 250",
            bg: "255 255 255",
          },
        },
      },
      registry,
    );

    const report = validateTheme(unsafe);

    expect(report.passes).toBe(false);
    expect(report.summary.contrastFailures).toBeGreaterThan(0);
    expect(report.issues.some((issue) => issue.code === "contrast-fail")).toBe(true);
  });

  it("reports missing focus affordances in resolved themes", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const unsafe = resolveTheme(
      {
        name: "unsafe-focus",
        colorScheme: "light",
        extends: "harbor-light",
        tokens: {
          focus: {
            shadow: "none",
          },
        },
      },
      registry,
    );

    const report = validateTheme(unsafe);

    expect(report.passes).toBe(false);
    expect(report.summary.focusFailures).toBeGreaterThan(0);
    expect(report.issues.some((issue) => issue.code === "focus-token-fail")).toBe(true);
  });

  it("reports chart contrast failures for low-contrast palettes", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const unsafe = resolveTheme(
      {
        name: "unsafe-chart",
        colorScheme: "light",
        extends: "harbor-light",
        tokens: {
          chart: {
            1: "245 245 245",
          },
        },
      },
      registry,
    );

    const report = validateTheme(unsafe);

    expect(report.passes).toBe(false);
    expect(report.summary.chartContrastFailures).toBeGreaterThan(0);
    expect(report.chartContrast.some((check) => check.name === "chart.1 on canvas" && !check.passes)).toBe(true);
  });

  it("formats single-theme validation reports for CI and release notes", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const unsafe = resolveTheme(
      {
        name: "unsafe-report",
        colorScheme: "light",
        tokens: {
          color: {
            text: "250 250 250",
            bg: "255 255 255",
          },
        },
      },
      registry,
    );

    const report = validateTheme(unsafe);
    const output = formatThemeValidationReport(report);

    expect(output).toContain("Theme: unsafe-report (light)");
    expect(output).toContain("Status: fail");
    expect(output).toContain("Tokens:");
    expect(output).toContain("Missing tokens:");
    expect(output).toContain("Failed contrast checks:");
    expect(output).toContain("[error] missing-token");
  });

  it("formats dark/light pair validation reports with parity counts", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const report = validateThemePair(
      resolveTheme(registry.get("harbor-neutral-dark")!, registry),
      resolveTheme(registry.get("harbor-neutral-light")!, registry),
      "neutral",
    );
    const output = formatThemePairValidationReport(report);

    expect(output).toContain("Theme pair: neutral");
    expect(output).toContain("Status: pass");
    expect(output).toContain("Shared tokens:");
    expect(output).toContain("Theme issues:");
  });

  it("audits all built-in production themes and pairs as one release gate", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const resolved = Object.fromEntries(
      harborBuiltInThemes.map((theme) => [
        theme.name,
        resolveTheme(theme, registry),
      ]),
    );
    const report = validateThemeAudit({
      themes: Object.values(resolved),
      pairs: [
        {
          name: "harbor",
          dark: resolved["harbor-dark"],
          light: resolved["harbor-light"],
        },
        {
          name: "harbor-neutral",
          dark: resolved["harbor-neutral-dark"],
          light: resolved["harbor-neutral-light"],
        },
        {
          name: "harbor-enterprise",
          dark: resolved["harbor-enterprise-dark"],
          light: resolved["harbor-enterprise-light"],
        },
        {
          name: "harbor-dev",
          dark: resolved["harbor-dev-dark"],
          light: resolved["harbor-dev-light"],
        },
        {
          name: "harbor-data",
          dark: resolved["harbor-data-dark"],
          light: resolved["harbor-data-light"],
        },
        {
          name: "harbor-ai-workbench",
          dark: resolved["harbor-ai-workbench-dark"],
          light: resolved["harbor-ai-workbench-light"],
        },
      ],
    });
    const output = formatThemeAuditReport(report);

    expect(report.passes).toBe(true);
    expect(report.summary).toMatchObject({
      themes: harborBuiltInThemes.length,
      pairs: 6,
      errors: 0,
      failedThemes: 0,
      failedPairs: 0,
    });
    expect(output).toContain("Theme audit");
    expect(output).toContain("Themes: 12 checked, 0 failed");
    expect(output).toContain("Pairs: 6 checked, 0 failed");
    expect(output).toContain("Theme pair: harbor-enterprise");
  });
});
