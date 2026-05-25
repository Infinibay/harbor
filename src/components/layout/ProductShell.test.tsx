import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  AdminShell,
  DashboardShell,
  EditorShell,
  ProductShell,
  WorkbenchShell,
} from "./ProductShell";

describe("ProductShell", () => {
  it("renders the common product slots", () => {
    renderWithHarbor(
      <ProductShell
        sidebar={<div>Navigation</div>}
        mobileNavigation={<div>Mobile sections</div>}
        topbar={<div>Top bar</div>}
        breadcrumbs={<ol><li>Home</li></ol>}
        toolbar={<div>Toolbar</div>}
        header={<h1>Overview</h1>}
        detailPanel={<div>Inspector</div>}
        mobileDetailPanel={<div>Mobile inspector</div>}
        statusBar={<div>Ready</div>}
        commandPalette={<div role="dialog" aria-label="Command palette" />}
      >
        Main workspace
      </ProductShell>,
    );

    expect(screen.getByRole("complementary", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toHaveTextContent("Mobile sections");
    expect(screen.getByRole("banner")).toHaveTextContent("Top bar");
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent("Home");
    expect(screen.getByText("Toolbar")).toBeInTheDocument();
    expect(screen.getByRole("main", { name: "Main content" })).toHaveTextContent("Main workspace");
    expect(screen.getByRole("complementary", { name: "Details" })).toHaveTextContent("Inspector");
    expect(screen.getByRole("complementary", { name: "Mobile details" })).toHaveTextContent("Mobile inspector");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Ready");
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
  });

  it("supports custom landmark labels for product-specific shells", () => {
    renderWithHarbor(
      <ProductShell
        mainLabel="Accounts workspace"
        sidebarLabel="Admin sections"
        mobileNavigationLabel="Compact admin sections"
        detailPanelLabel="Account details"
        mobileDetailPanelLabel="Compact account details"
        sidebar={<div>Users</div>}
        mobileNavigation={<div>Mobile users</div>}
        detailPanel={<div>Profile</div>}
        mobileDetailPanel={<div>Mobile profile</div>}
      >
        Accounts
      </ProductShell>,
    );

    expect(screen.getByRole("main", { name: "Accounts workspace" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Admin sections" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Compact admin sections" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Account details" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Compact account details" })).toBeInTheDocument();
  });

  it("exposes explicit responsive shell slots without duplicating desktop landmarks", () => {
    renderWithHarbor(
      <ProductShell
        sidebar={<nav aria-label="Desktop sections">Desktop nav</nav>}
        mobileNavigation={<nav aria-label="Compact sections">Compact nav</nav>}
        detailPanel={<section aria-label="Desktop inspector">Desktop detail</section>}
        mobileDetailPanel={<section aria-label="Compact inspector">Compact detail</section>}
      >
        Workspace
      </ProductShell>,
    );

    expect(screen.getByRole("complementary", { name: "Primary navigation" })).toHaveClass("md:block");
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toHaveClass("md:hidden");
    expect(screen.getByRole("complementary", { name: "Details" })).toHaveClass("lg:block");
    expect(screen.getByRole("complementary", { name: "Mobile details" })).toHaveClass("lg:hidden");
    expect(screen.getByRole("navigation", { name: "Desktop sections" })).toHaveTextContent("Desktop nav");
    expect(screen.getByRole("navigation", { name: "Compact sections" })).toHaveTextContent("Compact nav");
  });

  it("publishes preset shells with distinct product-shell markers", () => {
    const { rerender, container } = renderWithHarbor(
      <DashboardShell>Dashboard</DashboardShell>,
    );
    expect(container.querySelector("[data-harbor-product-shell='dashboard']")).toBeTruthy();

    rerender(<AdminShell>Admin</AdminShell>);
    expect(container.querySelector("[data-harbor-product-shell='admin']")).toBeTruthy();

    rerender(<WorkbenchShell>Workbench</WorkbenchShell>);
    expect(container.querySelector("[data-harbor-product-shell='workbench']")).toBeTruthy();

    rerender(<EditorShell>Editor</EditorShell>);
    expect(container.querySelector("[data-harbor-product-shell='editor']")).toBeTruthy();
  });

  it("includes a skip link for keyboard users", () => {
    renderWithHarbor(<ProductShell>Content</ProductShell>);

    const skip = screen.getByRole("link", { name: "Skip to content" });
    const main = screen.getByRole("main", { name: "Main content" });
    expect(skip).toHaveAttribute("href", `#${main.id}`);
  });

  it("a11y: no violations for a composed product shell", async () => {
    const { container } = renderWithHarbor(
      <ProductShell
        sidebar={<nav aria-label="Sections"><a href="#overview">Overview</a></nav>}
        topbar={<div>Operations</div>}
        breadcrumbs={<ol><li>Operations</li><li>Incidents</li></ol>}
        toolbar={<div role="toolbar" aria-label="Incident actions"><button type="button">Refresh</button></div>}
        detailPanel={<section aria-label="Incident detail">Selected incident</section>}
        statusBar={<div>2 services degraded</div>}
      >
        <section id="overview" aria-label="Incident overview">
          Incident list
        </section>
      </ProductShell>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
