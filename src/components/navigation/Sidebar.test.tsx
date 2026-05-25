import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Sidebar } from "./Sidebar";

const sections = [
  {
    label: "Nav",
    items: [
      { id: "home", label: "Home", icon: <span>🏠</span> },
      { id: "projects", label: "Projects", badge: <span data-testid="badge">5</span> },
      { id: "external", label: "External", href: "https://example.com" },
    ],
  },
];

describe("Sidebar", () => {
  it("renders item labels", () => {
    renderWithHarbor(<Sidebar sections={sections} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("renders section labels", () => {
    renderWithHarbor(<Sidebar sections={sections} />);
    expect(screen.getByText("Nav")).toBeInTheDocument();
  });

  it("renders icons", () => {
    renderWithHarbor(<Sidebar sections={sections} />);
    expect(screen.getByText("🏠")).toBeInTheDocument();
  });

  it("renders badges", () => {
    renderWithHarbor(<Sidebar sections={sections} />);
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("renders href on items", () => {
    const { container } = renderWithHarbor(<Sidebar sections={sections} />);
    const link = container.querySelector('a[href="https://example.com"]');
    expect(link).toBeTruthy();
  });

  it("fires onSelect on item click", async () => {
    const onSelect = vi.fn();
    const { user } = renderWithHarbor(
      <Sidebar sections={sections} onSelect={onSelect} />,
    );
    await user.click(screen.getByText("Home"));
    expect(onSelect).toHaveBeenCalledWith("home");
  });

  it("applies active class for selected item", () => {
    renderWithHarbor(<Sidebar sections={sections} selected="home" />);
    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toBeTruthy();
    expect(homeLink!.className).toContain("text-[var(--harbor-state-selected-fg)]");
    expect(homeLink!.className).not.toContain("text-[rgb(var(--harbor-text-muted))]");

    const projectsLink = screen.getByText("Projects").closest("a");
    expect(projectsLink!.className).toContain("text-[rgb(var(--harbor-text-muted))]");
  });

  it("renders header slot", () => {
    renderWithHarbor(
      <Sidebar sections={sections} header={<span data-testid="hdr">Logo</span>} />,
    );
    expect(screen.getByTestId("hdr")).toBeInTheDocument();
  });

  it("renders footer slot", () => {
    renderWithHarbor(
      <Sidebar sections={sections} footer={<span data-testid="ftr">Footer</span>} />,
    );
    expect(screen.getByTestId("ftr")).toBeInTheDocument();
  });

  it("renders as aside element", () => {
    const { container } = renderWithHarbor(<Sidebar sections={sections} />);
    expect(container.querySelector("aside")).toBeTruthy();
  });

  it("applies sticky class when sticky=true", () => {
    const { container } = renderWithHarbor(
      <Sidebar sections={sections} sticky />,
    );
    const aside = container.querySelector("aside");
    expect(aside?.className).toContain("sticky");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Sidebar sections={sections} className="my-sidebar" />,
    );
    expect(container.querySelector(".my-sidebar")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Sidebar sections={sections} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
