/// <reference types="node" />

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(resolve(currentDir, "../../package.json"), "utf8"),
) as {
  files?: string[];
  main?: string;
  module?: string;
  types?: string;
  scripts?: Record<string, string>;
  exports: Record<string, PackageExport>;
};
const consumerGuide = readFileSync(
  resolve(currentDir, "../../docs/consumer-guide.md"),
  "utf8",
);

const packageName = "@infinibay/harbor";
const runtimeContractStart = consumerGuide.indexOf("## Runtime Boundaries");
const runtimeContractEnd = consumerGuide.indexOf("## Vite");
const runtimeContract =
  runtimeContractStart === -1 || runtimeContractEnd === -1
    ? ""
    : consumerGuide.slice(runtimeContractStart, runtimeContractEnd);

function specifierForExport(subpath: string) {
  return subpath === "." ? packageName : `${packageName}/${subpath.slice(2)}`;
}

type PackageExport =
  | string
  | {
      types?: string;
      source?: string;
      import?: string;
    };

function exportImportTarget(subpath: string) {
  const target = packageJson.exports[subpath];
  return typeof target === "string" ? target : target.import;
}

function exportSourceTarget(subpath: string) {
  const target = packageJson.exports[subpath];
  return typeof target === "string" ? target : target.source;
}

function exportTypesTarget(subpath: string) {
  const target = packageJson.exports[subpath];
  return typeof target === "string" ? undefined : target.types;
}

describe("package export contract", () => {
  it("publishes every root component barrel subpath", async () => {
    const rootBarrel = readFileSync(resolve(currentDir, "index.ts"), "utf8");
    const componentSubpaths = [...rootBarrel.matchAll(/export \* from "\.\/([^"]+)";/g)]
      .map((match) => `./${match[1]}`)
      .sort();

    expect(Object.keys(packageJson.exports).sort()).toEqual(
      expect.arrayContaining(componentSubpaths),
    );
  });

  it("keeps backgrounds and motion importable as first-class categories", () => {
    expect(exportImportTarget("./backgrounds")).toBe(
      "./dist/components/backgrounds/index.js",
    );
    expect(exportImportTarget("./motion")).toBe(
      "./dist/components/motion/index.js",
    );
  });

  it("publishes shared a11y utilities for interaction guarantees", () => {
    expect(exportImportTarget("./a11y")).toBe("./dist/lib/a11y/index.js");
  });

  it("publishes product recipes as copyable application patterns", () => {
    expect(exportImportTarget("./recipes")).toBe("./dist/recipes/index.js");
  });

  it("publishes built package artifacts instead of raw TypeScript sources", () => {
    expect(packageJson.files).toContain("dist");
    expect(packageJson.main).toBe("./dist/components/index.js");
    expect(packageJson.module).toBe("./dist/components/index.js");
    expect(packageJson.types).toBe("./dist/components/index.d.ts");
    expect(packageJson.scripts?.["build:package"]).toContain("vite.package.config.ts");

    for (const [subpath, target] of Object.entries(packageJson.exports)) {
      if (subpath === "./package.json") continue;
      if (typeof target === "string") {
        if (target.endsWith(".css")) expect(target).toMatch(/^\.\/dist\//);
        continue;
      }

      expect(target.import, subpath).toMatch(/^\.\/dist\/.+\.js$/);
      if (subpath === "./tailwind-preset") {
        expect(target.source, subpath).toBe("./tailwind.config.js");
      } else {
        expect(target.source, subpath).toMatch(/^\.\/src\/.+\.tsx?$/);
      }
      if (target.types) expect(target.types, subpath).toMatch(/^\.\/dist\/.+\.d\.ts$/);
    }
  });

  it("documents every public package subpath in the consumer guide", () => {
    for (const subpath of Object.keys(packageJson.exports)) {
      if (subpath === "." || subpath === "./package.json") continue;

      const specifier = specifierForExport(subpath);

      expect(consumerGuide).toContain(specifier);
    }
  });

  it("documents the server/client runtime boundary for every public runtime export", () => {
    expect(runtimeContract).toContain("Pure utility export");
    expect(runtimeContract).toContain("SSR-importable React export");
    expect(runtimeContract).toContain("Styles and build-time export");
    expect(runtimeContract).toContain('"use client"');

    for (const subpath of Object.keys(packageJson.exports)) {
      if (subpath === "./package.json") continue;

      const importTarget = exportImportTarget(subpath);
      const sourceTarget = exportSourceTarget(subpath);
      const typesTarget = exportTypesTarget(subpath);
      const isRuntimeExport =
        Boolean(sourceTarget?.startsWith("./src/")) ||
        Boolean(importTarget?.endsWith(".css")) ||
        Boolean(typesTarget) ||
        subpath === "./tailwind-preset";

      if (!isRuntimeExport) continue;

      expect(runtimeContract).toContain(`| \`${specifierForExport(subpath)}\` |`);
    }
  });
});
