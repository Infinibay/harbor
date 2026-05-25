/// <reference types="node" />

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement, type ComponentType } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Menu, MenuItem } from "./overlays/Menu";
import { Tab, TabList, TabPanel, Tabs } from "./navigation/Tabs";
import { ProductShell } from "./layout/ProductShell";
import { DataWorkspace } from "./data/DataWorkspace";
import { Button } from "./buttons/Button";
import { playground as agentWorkflowPlayground } from "./dev/AgentWorkflow.playground";
import { playground as dataWorkspacePlayground } from "./data/DataWorkspace.playground";
import { renderWithHarbor } from "../test/renderWithHarbor";
import { productRecipes } from "../recipes";
import { harborBuiltInThemes } from "../lib/theme/builtins";
import { HarborProvider } from "../lib/theme/HarborProvider";
import { resolveTheme } from "../lib/theme/resolve";
import { validateThemeAudit } from "../lib/theme/validateTheme";
import { prefersReducedMotion } from "../lib/a11y";
import type { ColumnDef } from "./data/table/types";

const currentDir = dirname(fileURLToPath(import.meta.url));
const semanticThemeVars = [
  "--harbor-surface-canvas",
  "--harbor-surface-panel",
  "--harbor-surface-toolbar",
  "--harbor-border-subtle",
  "--harbor-border-default",
  "--harbor-focus-ring",
  "--harbor-state-hover",
  "--harbor-state-selected",
  "--harbor-overlay-scrim",
  "--harbor-chart-1",
];

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

function QualityWorkflow() {
  return (
    <ProductShell
      sidebar={<nav aria-label="Sections">Accounts</nav>}
      topbar={<div>Quality gate</div>}
      mainLabel="Quality workflow"
    >
      <DataWorkspace
        title="Accounts"
        rows={rows}
        columns={columns}
        rowId={(row) => row.id}
        detailDrawerOpen={false}
        detailDrawer={<div>Detail</div>}
      />
      <Button>Save</Button>
    </ProductShell>
  );
}

describe("sellable quality gates", () => {
  it("renders a core workflow across every built-in light/dark theme", () => {
    for (const theme of harborBuiltInThemes) {
      const { unmount } = renderWithHarbor(<QualityWorkflow />, {
        theme: theme.name,
      });

      expect(screen.getByRole("main", { name: "Quality workflow" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Accounts" })).toBeInTheDocument();
      unmount();
    }
  });

  it("smoke-renders product recipes across built-in themes with semantic theme CSS attached", async () => {
    for (const theme of harborBuiltInThemes) {
      for (const [name, Recipe] of Object.entries(productRecipes)) {
        const { container, unmount } = renderWithHarbor(<Recipe />, {
          theme: theme.name,
        });

        await waitFor(() =>
          expect(document.documentElement).toHaveAttribute(
            "data-harbor-theme",
            theme.name,
          ),
        );

        const themeCss = Array.from(
          document.querySelectorAll<HTMLStyleElement>(
            "style[data-harbor-theme-styles]",
          ),
        )
          .map((style) => style.textContent ?? "")
          .join("\n");

        expect(container.querySelector("main"), `${name}/${theme.name} main`).not.toBeNull();
        expect(container.textContent?.trim().length, `${name}/${theme.name} content`).toBeGreaterThan(80);
        expect(themeCss).toContain(`:root[data-harbor-theme="${theme.name}"]`);
        for (const token of semanticThemeVars) {
          expect(themeCss, `${name}/${theme.name} missing ${token}`).toContain(token);
        }

        unmount();
      }
    }
  });

  it("smoke-renders the core workflow across target and density presets", () => {
    const targets = ["desktop-app", "webapp", "website", "mobile", "tablet"] as const;
    const densities = ["compact", "comfortable", "spacious"] as const;

    for (const target of targets) {
      for (const density of densities) {
        const { container, unmount } = render(
          <HarborProvider
            theme="harbor-neutral-light"
            target={target}
            density={density}
          >
            <QualityWorkflow />
          </HarborProvider>,
        );

        const scope = container.querySelector<HTMLElement>("[data-harbor-target]");
        expect(scope, `${target}/${density} target scope`).not.toBeNull();
        expect(scope).toHaveAttribute("data-harbor-target", target);
        expect(scope).toHaveAttribute("data-harbor-density", density);
        expect(scope?.style.getPropertyValue("--harbor-target-control-height")).not.toBe("");
        expect(screen.getByRole("main", { name: "Quality workflow" })).toBeInTheDocument();
        unmount();
      }
    }
  });

  it("validates production theme contrast, focus, charts and dark/light parity", () => {
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
    const failures = [
      ...report.themes.flatMap((themeReport) =>
        themeReport.issues.map((issue) => `${themeReport.theme}: ${issue.message}`),
      ),
      ...report.pairs.flatMap((pairReport) =>
        pairReport.issues.map((issue) => `${pairReport.pair}: ${issue.message}`),
      ),
    ];

    expect(report.passes, failures.join(", ")).toBe(true);
    expect(report.summary).toMatchObject({
      themes: harborBuiltInThemes.length,
      pairs: 6,
      errors: 0,
      failedThemes: 0,
      failedPairs: 0,
    });
  });

  it("supports keyboard-only menu and tabs flows", async () => {
    const onSecond = vi.fn();
    const { user } = renderWithHarbor(
      <>
        <Menu trigger={<button type="button">Open menu</button>}>
          <MenuItem onClick={() => {}}>First</MenuItem>
          <MenuItem onClick={onSecond}>Second</MenuItem>
        </Menu>
        <Tabs defaultValue="alpha">
          <TabList>
            <Tab value="alpha">Alpha</Tab>
            <Tab value="beta">Beta</Tab>
          </TabList>
          <TabPanel value="alpha">Alpha panel</TabPanel>
          <TabPanel value="beta">Beta panel</TabPanel>
        </Tabs>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus());
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onSecond).toHaveBeenCalledTimes(1);

    screen.getByRole("tab", { name: "Alpha" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Beta panel");
  });

  it("keeps modal overlay docs aligned with focus-management guarantees", () => {
    const overlayDocs = ["overlays/Dialog.md", "overlays/Drawer.md"];
    const staleFocusCopy =
      /does not currently trap focus|does not trap focus|does not currently.*restore focus/i;

    for (const file of overlayDocs) {
      const doc = readFileSync(resolve(currentDir, file), "utf8");

      expect(doc, `${file} should document focus trapping`).toMatch(/traps? Tab navigation/i);
      expect(doc, `${file} should document focus restoration`).toMatch(/restores? focus/i);
      expect(doc, `${file} still contains stale focus-management limitations`).not.toMatch(
        staleFocusCopy,
      );
    }
  });

  it("ships docs and interactive showcase playgrounds for workflow-level kits", () => {
    const workflowKits = [
      {
        name: "ProductShell",
        category: "layout",
        expectedImportPath: "@infinibay/harbor/layout",
        requiredSections: ["## Import", "## Example", "## Props", "## Notes"],
        requiredOperationalCopy: ["navigation", "detail", "status"],
      },
      {
        name: "DataWorkspace",
        category: "data",
        expectedImportPath: "@infinibay/harbor/data",
        requiredSections: ["## Import", "## Example", "## Server Data", "## Serious Tables", "## Props", "## Gotchas"],
        requiredOperationalCopy: ["saved views", "bulk", "server", "pinning", "virtualization"],
      },
      {
        name: "AgentWorkflow",
        category: "dev",
        expectedImportPath: "@infinibay/harbor/dev",
        requiredSections: ["## Import", "## Example", "## Components", "## Props", "## Gotchas"],
        requiredOperationalCopy: ["approval", "trace", "logs"],
      },
    ];
    const placeholderPattern =
      /\b(?:fantasy|magical|lorem|placeholder|orb|glass|hero)\b/i;

    for (const kit of workflowKits) {
      const basePath = resolve(currentDir, kit.category, kit.name);
      const docPath = `${basePath}.md`;
      const playgroundPath = `${basePath}.playground.tsx`;

      expect(existsSync(docPath), `${kit.name} missing documentation`).toBe(true);
      expect(existsSync(playgroundPath), `${kit.name} missing showcase playground`).toBe(true);

      const doc = readFileSync(docPath, "utf8");
      const playground = readFileSync(playgroundPath, "utf8");

      expect(doc, `${kit.name} should not show the placeholder copy`).not.toContain(
        "No documentation has been written yet",
      );
      for (const section of kit.requiredSections) {
        expect(doc, `${kit.name} missing ${section}`).toContain(section);
      }
      expect(playground, `${kit.name} playground should use the public import path`).toContain(
        `importPath: "${kit.expectedImportPath}"`,
      );
      expect(playground, `${kit.name} playground should expose controls`).toContain("controls:");
      expect(playground, `${kit.name} playground should expose variants`).toContain("variants:");
      expect(playground.match(/label:/g)?.length ?? 0, `${kit.name} should provide multiple concrete variants`).toBeGreaterThanOrEqual(3);
      expect(`${doc}\n${playground}`, `${kit.name} still reads like decorative placeholder content`).not.toMatch(
        placeholderPattern,
      );
      for (const phrase of kit.requiredOperationalCopy) {
        expect(`${doc}\n${playground}`.toLowerCase(), `${kit.name} missing operational copy: ${phrase}`).toContain(
          phrase,
        );
      }
    }
  });

  it("documents the pragmatic form system contract for real product forms", () => {
    const docPath = resolve(currentDir, "../lib/form/HarborForm.md");

    expect(existsSync(docPath), "HarborForm form-system docs are missing").toBe(true);

    const doc = readFileSync(docPath, "utf8");
    const requiredSections = [
      "## Import",
      "## Example",
      "## Server Errors",
      "## Wizard Flows",
      "## Adapters",
      "## Props",
      "## Gotchas",
    ];
    const requiredExports = [
      "HarborForm",
      "HarborField",
      "useAsyncFieldValidation",
      "useFormAutosave",
      "useFormDirtyGuard",
      "useFieldArray",
      "useFormWizard",
      "useServerErrors",
      "fromZod",
      "fromStandardSchema",
      "toReactHookFormResolver",
    ];
    const requiredOperationalCopy = [
      "autosave",
      "dirty",
      "async",
      "server errors",
      "field arrays",
      "multi-step",
      "React Hook Form",
      "Standard Schema",
    ];

    expect(doc).not.toContain("No documentation has been written yet");
    for (const section of requiredSections) {
      expect(doc, `HarborForm docs missing ${section}`).toContain(section);
    }
    for (const exported of requiredExports) {
      expect(doc, `HarborForm docs missing ${exported}`).toContain(exported);
    }
    for (const phrase of requiredOperationalCopy) {
      expect(doc.toLowerCase(), `HarborForm docs missing ${phrase}`).toContain(
        phrase.toLowerCase(),
      );
    }
  });

  it("documents shared accessibility primitives for interactive components", () => {
    const docPath = resolve(currentDir, "../lib/a11y/A11yPrimitives.md");

    expect(existsSync(docPath), "A11y primitives docs are missing").toBe(true);

    const doc = readFileSync(docPath, "utf8");
    const requiredSections = [
      "## Import",
      "## Focus Trap",
      "## Dismissable Layer",
      "## Roving Tabindex",
      "## Live Regions",
      "## Reduced Motion",
      "## Keyboard Flows",
      "## Gotchas",
    ];
    const requiredExports = [
      "focusFirst",
      "trapFocus",
      "getFocusableElements",
      "DismissableLayer",
      "useDismissableLayer",
      "RovingFocusGroup",
      "useRovingFocusItem",
      "LiveRegion",
      "useLiveRegion",
      "prefersReducedMotion",
      "useReducedMotionPreference",
      "reducedMotionTransition",
    ];
    const requiredOperationalCopy = [
      "restore focus",
      "Escape",
      "outside-pointer",
      "arrow-key",
      "Tab navigation",
      "autosave",
      "reduced-motion",
    ];

    expect(doc).not.toContain("No documentation has been written yet");
    for (const section of requiredSections) {
      expect(doc, `A11y docs missing ${section}`).toContain(section);
    }
    for (const exported of requiredExports) {
      expect(doc, `A11y docs missing ${exported}`).toContain(exported);
    }
    for (const phrase of requiredOperationalCopy) {
      expect(doc.toLowerCase(), `A11y docs missing ${phrase}`).toContain(
        phrase.toLowerCase(),
      );
    }
  });

  it("documents copyable product recipes as owned workflow starting points", () => {
    const docPath = resolve(currentDir, "../recipes/ProductRecipes.md");

    expect(existsSync(docPath), "ProductRecipes docs are missing").toBe(true);

    const doc = readFileSync(docPath, "utf8");
    const requiredSections = [
      "## Import",
      "## Recipes",
      "## Example",
      "## Ownership",
      "## Gotchas",
    ];
    const requiredRecipes = [
      "AdminCrudRecipe",
      "SettingsConsoleRecipe",
      "BillingAccountRecipe",
      "RbacAdminRecipe",
      "AuditComplianceRecipe",
      "AiAgentConsoleRecipe",
      "DataReviewQueueRecipe",
      "IncidentDashboardRecipe",
    ];
    const requiredOperationalCopy = [
      "admin",
      "settings",
      "billing",
      "RBAC",
      "audit",
      "AI",
      "review queue",
      "incident",
      "copied",
      "owned",
    ];

    expect(doc).not.toContain("No documentation has been written yet");
    for (const section of requiredSections) {
      expect(doc, `ProductRecipes docs missing ${section}`).toContain(section);
    }
    for (const recipe of requiredRecipes) {
      expect(doc, `ProductRecipes docs missing ${recipe}`).toContain(recipe);
    }
    for (const phrase of requiredOperationalCopy) {
      expect(doc.toLowerCase(), `ProductRecipes docs missing ${phrase}`).toContain(
        phrase.toLowerCase(),
      );
    }
  });

  it("keeps workflow showcase examples interactive instead of static decoration", async () => {
    const DataWorkspaceDemo =
      dataWorkspacePlayground.component as ComponentType<{
        queue?: "access" | "billing";
        selectedCount?: number;
      }>;
    const AgentWorkflowDemo =
      agentWorkflowPlayground.component as ComponentType<{
        scenario?: "deploy" | "incident";
        pendingApproval?: boolean;
      }>;

    const data = renderWithHarbor(
      createElement(DataWorkspaceDemo, {
        queue: "access",
        selectedCount: 0,
      }),
    );

    expect(screen.getByText("Billing export access")).toBeInTheDocument();
    await data.user.click(screen.getByRole("tab", { name: /Blocked/ }));

    expect(screen.getByText(/Server query:/)).toHaveTextContent("view=blocked");
    expect(screen.getByText("Production read role")).toBeInTheDocument();
    expect(screen.queryByText("Billing export access")).not.toBeInTheDocument();
    data.unmount();

    const agent = renderWithHarbor(
      createElement(AgentWorkflowDemo, {
        scenario: "deploy",
        pendingApproval: true,
      }),
    );

    await agent.user.click(screen.getByRole("button", { name: "Approve" }));
    expect(screen.getByText(/Decision: approved/)).toBeInTheDocument();

    await agent.user.click(screen.getByRole("button", { name: "Run" }));
    expect(screen.getByLabelText("Run log")).toHaveTextContent("Manual rerun 2");
    agent.unmount();
  });

  it("exposes a deterministic reduced-motion gate in non-browser and default test contexts", () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it("keeps priority workflow components on semantic theme tokens instead of dark-first white overlays", () => {
    const priorityFiles = [
      "buttons/Button.tsx",
      "buttons/IconButton.tsx",
      "buttons/CloseButton.tsx",
      "buttons/CopyButton.tsx",
      "buttons/ToggleButton.tsx",
      "buttons/SplitButton.tsx",
      "buttons/MoreButton.tsx",
      "buttons/FAB.tsx",
      "buttons/SpeedDial.tsx",
      "overlays/Dialog.tsx",
      "overlays/Drawer.tsx",
      "overlays/CommandPalette.tsx",
      "overlays/Tooltip.tsx",
      "overlays/HoverCard.tsx",
      "overlays/ExportMenu.tsx",
      "navigation/SegmentedControl.tsx",
      "navigation/Pagination.tsx",
      "navigation/NavBar.tsx",
      "navigation/Breadcrumbs.tsx",
      "navigation/Sidebar.tsx",
      "navigation/RailSidebar.tsx",
      "navigation/CollapsibleSidebar.tsx",
      "navigation/AppHeader.tsx",
      "navigation/Tabs.tsx",
      "inputs/Checkbox.tsx",
      "inputs/Switch.tsx",
      "inputs/Radio.tsx",
      "inputs/ToggleGroup.tsx",
      "inputs/TextField.tsx",
      "inputs/Textarea.tsx",
      "inputs/SearchField.tsx",
      "inputs/Select.tsx",
      "inputs/FormField.tsx",
      "inputs/FieldSet.tsx",
      "inputs/FormSection.tsx",
      "inputs/NumberField.tsx",
      "inputs/TagInput.tsx",
      "inputs/MultiSelect.tsx",
      "inputs/Slider.tsx",
      "inputs/RangeSlider.tsx",
      "inputs/SliderField.tsx",
      "inputs/PasswordStrength.tsx",
      "inputs/Rating.tsx",
      "inputs/FileDrop.tsx",
      "inputs/Calendar.tsx",
      "inputs/Wizard.tsx",
      "inputs/CronBuilder.tsx",
      "inputs/HotkeyRecorder.tsx",
      "inputs/ZoomControls.tsx",
      "inputs/MFASetup.tsx",
      "inputs/Knob.tsx",
      "inputs/DiskAllocator.tsx",
      "charts/Sparkline.tsx",
      "charts/Gauge.tsx",
      "charts/Donut.tsx",
      "charts/LineChart.tsx",
      "charts/TimeSeriesChart.tsx",
      "charts/BarChart.tsx",
      "charts/MetricHeatmap.tsx",
      "charts/TraceWaterfall.tsx",
      "charts/CostBreakdown.tsx",
      "charts/ResourceForecast.tsx",
      "charts/FlameGraph.tsx",
      "data/DataTable.tsx",
      "data/AuditLog.tsx",
      "data/Kanban.tsx",
      "data/PermissionMatrix.tsx",
      "feedback/Toast.tsx",
    ];
    const darkFirstClassPattern =
      /\b(?:text|bg|border|ring|outline|placeholder):?-(?:white|black)(?:\/|\b)|\b(?:text|bg|border|ring|outline|placeholder)-(?:white|black)(?:\/|\b)/;

    for (const file of priorityFiles) {
      const source = readFileSync(resolve(currentDir, file), "utf8");
      const offenders = source
        .split("\n")
        .map((line, index) => ({ line, index: index + 1 }))
        .filter(({ line }) => darkFirstClassPattern.test(line));

      expect(
        offenders,
        `${file} still has dark-first utility classes:\n${offenders
          .map(({ index, line }) => `${index}: ${line.trim()}`)
          .join("\n")}`,
      ).toEqual([]);
    }
  });
});
