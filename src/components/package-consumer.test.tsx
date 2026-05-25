/// <reference types="node" />

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LiveRegion, prefersReducedMotion } from "@infinibay/harbor/a11y";
import { Button } from "@infinibay/harbor/buttons";
import { DataWorkspace } from "@infinibay/harbor/data";
import { PromptComposer } from "@infinibay/harbor/dev";
import { ProductShell } from "@infinibay/harbor/layout";
import { AdminCrudRecipe } from "@infinibay/harbor/recipes";
import {
  formatThemeAuditReport,
  formatThemeValidationReport,
  HarborProvider,
  harborBuiltInThemes,
  resolveTheme,
  type HarborDensity,
  type HarborTarget,
  validateTheme,
  validateThemeAudit,
} from "@infinibay/harbor/theme";
import type { ColumnDef } from "./data/table/types";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(resolve(currentDir, "../../package.json"), "utf8"),
) as { exports: Record<string, PackageExport> };

const packageName = "@infinibay/harbor";

type PackageExport =
  | string
  | {
      types?: string;
      source?: string;
      import?: string;
    };

function specifierForExport(subpath: string) {
  return subpath === "." ? packageName : `${packageName}/${subpath.slice(2)}`;
}

const importableSubpaths = Object.entries(packageJson.exports)
  .filter(([, target]) => {
    if (typeof target === "string") return target.startsWith("./src/");
    return Boolean(target.source?.startsWith("./src/") && target.import?.startsWith("./dist/"));
  })
  .map(([subpath]) => subpath)
  .sort();

interface Row {
  id: string;
  name: string;
  status: string;
}

const rows: Row[] = [{ id: "1", name: "Ada", status: "Active" }];
const columns: ColumnDef<Row>[] = [
  { id: "name", header: "Name" },
  { id: "status", header: "Status" },
];

function buildProductionThemeAudit() {
  const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
  const resolved = Object.fromEntries(
    harborBuiltInThemes.map((theme) => [
      theme.name,
      resolveTheme(theme, registry),
    ]),
  );

  return validateThemeAudit({
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
}

describe("package consumer smoke tests", () => {
  it.each(importableSubpaths)("imports %s through the package export map", async (subpath) => {
    const mod = await import(/* @vite-ignore */ specifierForExport(subpath));

    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });

  it("SSR-renders core product patterns from package subpaths", () => {
    const html = renderToString(
      <HarborProvider theme="harbor-enterprise-light">
        <ProductShell
          sidebar={<nav aria-label="App sections">Accounts</nav>}
          topbar={<div>Operations</div>}
          mainLabel="Consumer app"
        >
          <Button>Save</Button>
          <DataWorkspace
            title="Accounts"
            rows={rows}
            columns={columns}
            rowId={(row) => row.id}
          />
          <PromptComposer value="Review changes" onChange={() => {}} onSubmit={() => {}} />
          <LiveRegion message="Saved" />
        </ProductShell>
      </HarborProvider>,
    );

    expect(html).toContain("data-harbor-theme-styles");
    expect(html).toContain("Consumer app");
    expect(html).toContain("Accounts");
    expect(html).toContain("Review changes");
    expect(html).toContain("Saved");
  });

  it("imports shared a11y primitives from the public package subpath", () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it("SSR-renders copyable recipes from the package recipes export", () => {
    const html = renderToString(
      <HarborProvider theme="harbor-neutral-dark">
        <AdminCrudRecipe />
      </HarborProvider>,
    );

    expect(html).toContain("Admin CRUD recipe");
    expect(html).toContain("New member");
    expect(html).toContain("3 users");
  });

  it("SSR-renders every built-in theme preset", () => {
    for (const theme of harborBuiltInThemes) {
      const html = renderToString(
        <HarborProvider theme={theme.name}>
          <Button>{theme.name}</Button>
        </HarborProvider>,
      );

      expect(html).toContain(`data-harbor-theme="${theme.name}"`);
      expect(html).toContain(theme.name);
    }
  });

  it("imports the public theme validation report helpers", () => {
    const registry = new Map(harborBuiltInThemes.map((theme) => [theme.name, theme]));
    const report = validateTheme(
      resolveTheme(registry.get("harbor-enterprise-light")!, registry),
    );
    const formatted = formatThemeValidationReport(report);

    expect(report.passes).toBe(true);
    expect(report.tokenCoverage.missing).toEqual([]);
    expect(formatted).toContain("Theme: harbor-enterprise-light (light)");
    expect(formatted).toContain("Status: pass");
  });

  it("imports the public aggregate theme audit helpers", () => {
    const report = buildProductionThemeAudit();
    const formatted = formatThemeAuditReport(report);

    expect(report.passes).toBe(true);
    expect(report.summary).toMatchObject({
      themes: harborBuiltInThemes.length,
      pairs: 6,
      errors: 0,
      failedThemes: 0,
      failedPairs: 0,
    });
    expect(formatted).toContain("Theme audit");
    expect(formatted).toContain("Themes: 12 checked, 0 failed");
    expect(formatted).toContain("Pairs: 6 checked, 0 failed");
    expect(formatted).toContain("Theme pair: harbor-ai-workbench");
  });

  it("SSR-renders target and density matrix wrappers", () => {
    const targets: HarborTarget[] = [
      "desktop-app",
      "webapp",
      "website",
      "mobile",
      "tablet",
    ];
    const densities: HarborDensity[] = ["compact", "comfortable", "spacious"];

    for (const target of targets) {
      for (const density of densities) {
        const html = renderToString(
          <HarborProvider target={target} density={density}>
            <Button>{`${target} ${density}`}</Button>
          </HarborProvider>,
        );

        expect(html).toContain(`data-harbor-target="${target}"`);
        expect(html).toContain(`data-harbor-density="${density}"`);
      }
    }
  });
});
