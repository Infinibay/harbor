import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { RailSidebar } from "./RailSidebar";

const items = [
  { id: "home", label: "Home", icon: <span>🏠</span> },
  { id: "search", label: "Search", icon: <span>🔍</span> },
  { id: "notif", label: "Notifications", icon: <span>🔔</span>, badge: <span data-testid="badge">3</span> },
];

describe("RailSidebar", () => {
  it("renders item icons", () => {
    renderWithHarbor(<RailSidebar items={items} />);
    expect(screen.getByText("🏠")).toBeInTheDocument();
    expect(screen.getByText("🔍")).toBeInTheDocument();
    expect(screen.getByText("🔔")).toBeInTheDocument();
  });

  it("renders buttons with aria-labels", () => {
    renderWithHarbor(<RailSidebar items={items} />);
    expect(screen.getByLabelText("Home")).toBeInTheDocument();
    expect(screen.getByLabelText("Search")).toBeInTheDocument();
  });

  it("does not render item labels in the rail", () => {
    renderWithHarbor(<RailSidebar items={items} />);
    // Labels are only in tooltips, not directly in DOM
    expect(screen.queryByText("Home")).toBeNull();
  });

  it("fires onChange on item click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <RailSidebar items={items} onChange={onChange} />,
    );
    await user.click(screen.getByLabelText("Home"));
    expect(onChange).toHaveBeenCalledWith("home");
  });

  it("renders active indicator for selected item", () => {
    const { container } = renderWithHarbor(
      <RailSidebar items={items} value="search" />,
    );
    const indicator = container.querySelector(".bg-fuchsia-400");
    expect(indicator).toBeTruthy();
  });

  it("renders badges", () => {
    renderWithHarbor(<RailSidebar items={items} />);
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("renders header slot", () => {
    renderWithHarbor(
      <RailSidebar items={items} header={<span data-testid="hdr">Logo</span>} />,
    );
    expect(screen.getByTestId("hdr")).toBeInTheDocument();
  });

  it("renders footer slot", () => {
    renderWithHarbor(
      <RailSidebar items={items} footer={<span data-testid="ftr">User</span>} />,
    );
    expect(screen.getByTestId("ftr")).toBeInTheDocument();
  });

  it("renders as aside element", () => {
    const { container } = renderWithHarbor(<RailSidebar items={items} />);
    expect(container.querySelector("aside")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <RailSidebar items={items} className="my-rail" />,
    );
    expect(container.querySelector(".my-rail")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<RailSidebar items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
