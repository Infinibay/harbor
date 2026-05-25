import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { renderWithHarbor } from "../test/renderWithHarbor";
import {
  AdminCrudRecipe,
  AuditComplianceRecipe,
  AiAgentConsoleRecipe,
  BillingAccountRecipe,
  DataReviewQueueRecipe,
  IncidentDashboardRecipe,
  RbacAdminRecipe,
  SettingsConsoleRecipe,
  productRecipes,
} from "./ProductRecipes";

describe("product recipes", () => {
  it("exports the expected copyable product patterns", () => {
    expect(Object.keys(productRecipes)).toEqual([
      "AdminCrudRecipe",
      "SettingsConsoleRecipe",
      "BillingAccountRecipe",
      "RbacAdminRecipe",
      "AuditComplianceRecipe",
      "AiAgentConsoleRecipe",
      "DataReviewQueueRecipe",
      "IncidentDashboardRecipe",
    ]);
  });

  it("renders an admin CRUD workspace", () => {
    renderWithHarbor(<AdminCrudRecipe />);

    expect(screen.getByRole("main", { name: "Admin CRUD recipe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Accounts" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Active/ })).toBeInTheDocument();
    expect(screen.getByRole("toolbar", { name: "Bulk actions" })).toHaveTextContent("1 selected");
  });

  it("renders a settings console with schema-backed fields", () => {
    renderWithHarbor(<SettingsConsoleRecipe />);

    expect(screen.getByRole("main", { name: "Settings recipe" })).toBeInTheDocument();
    expect(screen.getByLabelText("Workspace")).toHaveValue("Harbor");
    expect(screen.getByLabelText("Owner email")).toHaveValue("owner@example.com");
    expect(screen.getByRole("button", { name: "Save settings" })).toBeInTheDocument();
  });

  it("renders a billing account workspace", () => {
    renderWithHarbor(<BillingAccountRecipe />);

    expect(screen.getByRole("main", { name: "Billing recipe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Invoices" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Current plan" })).toHaveTextContent("Team plan");
  });

  it("renders an RBAC admin matrix", () => {
    renderWithHarbor(<RbacAdminRecipe />);

    expect(screen.getByRole("main", { name: "RBAC admin recipe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Roles" })).toBeInTheDocument();
    expect(screen.getByText("3 principals × 3 resources")).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "RBAC role summary" })).toHaveTextContent("Auditor");
  });

  it("renders an audit and compliance panel", () => {
    renderWithHarbor(<AuditComplianceRecipe />);

    expect(screen.getByRole("main", { name: "Audit compliance recipe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Compliance evidence" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Audit trail" })).toHaveTextContent("SOC 2 access review");
    expect(screen.getAllByText("DPIA data retention")).toHaveLength(2);
  });

  it("renders an AI agent console pattern", () => {
    renderWithHarbor(<AiAgentConsoleRecipe />);

    expect(screen.getByRole("main", { name: "AI agent console recipe" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Prompt" })).toHaveValue("Audit checkout failures");
    expect(screen.getByLabelText("Model")).toHaveValue("fast");
    expect(screen.getByRole("progressbar", { name: "Token usage" })).toBeInTheDocument();
  });

  it("renders a data review queue", () => {
    renderWithHarbor(<DataReviewQueueRecipe />);

    expect(screen.getByRole("main", { name: "Data review recipe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Verification queue" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Needs review/ })).toBeInTheDocument();
    expect(screen.getByRole("toolbar", { name: "Bulk actions" })).toHaveTextContent("2 selected");
  });

  it("renders an incident dashboard with evaluation results", () => {
    renderWithHarbor(<IncidentDashboardRecipe />);

    expect(screen.getByRole("main", { name: "Incident dashboard recipe" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Active incidents" })).toBeInTheDocument();
    expect(screen.getByText("SLO burn")).toBeInTheDocument();
    expect(screen.getByText("Paging policy")).toBeInTheDocument();
  });

  it("a11y: recipes do not introduce obvious accessibility violations", async () => {
    for (const Recipe of Object.values(productRecipes)) {
      const { container, unmount } = renderWithHarbor(<Recipe />);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
