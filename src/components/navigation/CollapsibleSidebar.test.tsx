import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CollapsibleSidebar } from "./CollapsibleSidebar";

const sections = [
  {
    label: "Main",
    items: [
      { id: "home", label: "Home", icon: <span>🏠</span> },
      { id: "settings", label: "Settings", icon: <span>⚙</span>, badge: <span data-testid="badge">3</span> },
    ],
  },
];

describe("CollapsibleSidebar", () => {
  it("renders item labels", () => {
    renderWithHarbor(<CollapsibleSidebar sections={sections} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders section labels", () => {
    renderWithHarbor(<CollapsibleSidebar sections={sections} />);
    expect(screen.getByText("Main")).toBeInTheDocument();
  });

  it("renders icons", () => {
    renderWithHarbor(<CollapsibleSidebar sections={sections} />);
    expect(screen.getByText("🏠")).toBeInTheDocument();
  });

  it("renders badges", () => {
    renderWithHarbor(<CollapsibleSidebar sections={sections} />);
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("renders collapse/expand button with aria-label", () => {
    renderWithHarbor(<CollapsibleSidebar sections={sections} />);
    expect(
      screen.getByLabelText("Collapse sidebar"),
    ).toBeInTheDocument();
  });

  it("collapses on toggle click", async () => {
    const { user } = renderWithHarbor(
      <CollapsibleSidebar sections={sections} />,
    );
    await user.click(screen.getByLabelText("Collapse sidebar"));
    expect(
      screen.getByLabelText("Expand sidebar"),
    ).toBeInTheDocument();
  });

  it("hides labels when collapsed", async () => {
    renderWithHarbor(
      <CollapsibleSidebar sections={sections} defaultCollapsed />,
    );
    // Labels are not rendered when collapsed (only icons)
    expect(screen.queryByText("Home")).toBeNull();
  });

  it("fires onChange on item click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <CollapsibleSidebar sections={sections} onChange={onChange} />,
    );
    await user.click(screen.getByText("Home"));
    expect(onChange).toHaveBeenCalledWith("home");
  });

  it("renders header slot", () => {
    renderWithHarbor(
      <CollapsibleSidebar
        sections={sections}
        header={<span data-testid="hdr">Logo</span>}
      />,
    );
    expect(screen.getByTestId("hdr")).toBeInTheDocument();
  });

  it("renders footer slot", () => {
    renderWithHarbor(
      <CollapsibleSidebar
        sections={sections}
        footer={<span data-testid="ftr">Footer</span>}
      />,
    );
    expect(screen.getByTestId("ftr")).toBeInTheDocument();
  });

  it("applies active class for selected item", () => {
    const { container } = renderWithHarbor(
      <CollapsibleSidebar sections={sections} value="home" />,
    );
    const activeBtn = container.querySelector(".bg-fuchsia-500\\/15");
    expect(activeBtn).toBeTruthy();
  });

  it("renders as aside element", () => {
    const { container } = renderWithHarbor(
      <CollapsibleSidebar sections={sections} />,
    );
    expect(container.querySelector("aside")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <CollapsibleSidebar sections={sections} className="my-sidebar" />,
    );
    expect(container.querySelector(".my-sidebar")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <CollapsibleSidebar sections={sections} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
