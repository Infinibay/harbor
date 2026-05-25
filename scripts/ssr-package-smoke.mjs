import { readFile } from "node:fs/promises";
import React from "react";
import { renderToString } from "react-dom/server";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8"),
);
const packageName = packageJson.name;

const jsSubpaths = Object.entries(packageJson.exports)
  .filter(([subpath, target]) => {
    if (subpath === "./package.json") return false;
    if (typeof target === "string") return target.endsWith(".js");
    return Boolean(target.import?.endsWith(".js"));
  })
  .map(([subpath]) => subpath)
  .sort();

function specifierForExport(subpath) {
  return subpath === "." ? packageName : `${packageName}/${subpath.slice(2)}`;
}

const loaded = new Map();
for (const subpath of jsSubpaths) {
  const specifier = specifierForExport(subpath);
  const mod = await import(specifier);
  if (Object.keys(mod).length === 0) {
    throw new Error(`${specifier} imported from dist but exported nothing.`);
  }
  loaded.set(subpath, mod);
}

const { HarborProvider } = loaded.get("./theme");
const { ProductShell } = loaded.get("./layout");
const { Button } = loaded.get("./buttons");
const { DataWorkspace } = loaded.get("./data");
const { PromptComposer } = loaded.get("./dev");
const { LiveRegion } = loaded.get("./a11y");
const { AdminCrudRecipe } = loaded.get("./recipes");

const rows = [{ id: "1", name: "Ada", status: "Active" }];
const columns = [
  { id: "name", header: "Name" },
  { id: "status", header: "Status" },
];

const appHtml = renderToString(
  React.createElement(
    HarborProvider,
    { theme: "harbor-enterprise-light" },
    React.createElement(
      ProductShell,
      {
        sidebar: React.createElement("nav", { "aria-label": "App sections" }, "Accounts"),
        topbar: React.createElement("div", null, "Operations"),
        mainLabel: "Dist consumer app",
      },
      React.createElement(Button, null, "Save"),
      React.createElement(DataWorkspace, {
        title: "Accounts",
        rows,
        columns,
        rowId: (row) => row.id,
      }),
      React.createElement(PromptComposer, {
        value: "Review changes",
        onChange: () => {},
        onSubmit: () => {},
      }),
      React.createElement(LiveRegion, { message: "Saved" }),
    ),
  ),
);

const recipeHtml = renderToString(
  React.createElement(
    HarborProvider,
    { theme: "harbor-neutral-dark" },
    React.createElement(AdminCrudRecipe),
  ),
);

for (const expected of [
  'data-harbor-theme="harbor-enterprise-light"',
  "Dist consumer app",
  "Accounts",
  "Review changes",
  "Saved",
]) {
  if (!appHtml.includes(expected)) {
    throw new Error(`SSR dist smoke output did not contain ${expected}.`);
  }
}

for (const expected of ["Admin CRUD recipe", "New member", "3 users"]) {
  if (!recipeHtml.includes(expected)) {
    throw new Error(`SSR dist recipe output did not contain ${expected}.`);
  }
}

console.log(
  `SSR dist package smoke passed: ${jsSubpaths.length} JS subpaths imported and core patterns rendered.`,
);
