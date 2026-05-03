import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders children in main area", () => {
    renderWithHarbor(<AppShell>Content</AppShell>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders sidebar when provided", () => {
    renderWithHarbor(
      <AppShell sidebar={<nav>Sidebar</nav>}>Main</AppShell>,
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });

  it("renders header when provided", () => {
    renderWithHarbor(
      <AppShell header={<header>Header</header>}>Main</AppShell>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("wraps main content in <main> element", () => {
    const { container } = renderWithHarbor(<AppShell>Main</AppShell>);
    expect(container.querySelector("main")).toBeTruthy();
  });

  it("applies flex layout", () => {
    const { container } = renderWithHarbor(<AppShell>X</AppShell>);
    const wrapper = container.querySelector(".flex");
    expect(wrapper).toBeTruthy();
  });

  it("applies gutter classes when gutter set", () => {
    const { container } = renderWithHarbor(
      <AppShell gutter="md">X</AppShell>,
    );
    const wrapper = container.querySelector(".p-3");
    expect(wrapper).toBeTruthy();
  });

  it("applies content padding classes", () => {
    const { container } = renderWithHarbor(
      <AppShell contentPadding="sm">X</AppShell>,
    );
    // sm padding = px-3 py-3 (see AppShell paddings record).
    expect(container.querySelector(".px-3.py-3")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <AppShell className="my-shell">X</AppShell>,
    );
    expect(container.querySelector(".my-shell")).toBeTruthy();
  });

  it("applies custom style", () => {
    const { container } = renderWithHarbor(
      <AppShell style={{ color: "red" }}>X</AppShell>,
    );
    const wrapper = container.querySelector("[style]");
    expect(wrapper?.getAttribute("style")).toContain("red");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <AppShell
        sidebar={<nav>Nav</nav>}
        header={<header>Top</header>}
      >
        Main content
      </AppShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
