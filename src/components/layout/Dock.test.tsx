import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Dock } from "./Dock";

const items = [
  { id: "home", label: "Home", icon: <span>🏠</span> },
  { id: "search", label: "Search", icon: <span>🔍</span>, active: true },
  { id: "settings", label: "Settings", icon: <span>⚙</span>, onClick: vi.fn() },
];

describe("Dock", () => {
  it("renders dock items with icons", () => {
    renderWithHarbor(<Dock items={items} />);
    expect(screen.getByText("🏠")).toBeInTheDocument();
    expect(screen.getByText("🔍")).toBeInTheDocument();
    expect(screen.getByText("⚙")).toBeInTheDocument();
  });

  it("renders buttons with aria-labels", () => {
    renderWithHarbor(<Dock items={items} />);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });

  it("fires onClick for dock items", async () => {
    const onClick = vi.fn();
    const dockItems = [
      { id: "click", label: "Click", icon: <span>X</span>, onClick },
    ];
    const { user } = renderWithHarbor(<Dock items={dockItems} />);
    await user.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders active indicator for active items", () => {
    const { container } = renderWithHarbor(<Dock items={items} />);
    const activeDot = container.querySelector(".bg-fuchsia-400");
    expect(activeDot).toBeTruthy();
  });

  it("renders badge when provided", () => {
    const withBadge = [
      { id: "notif", label: "Notifications", icon: <span>🔔</span>, badge: <span data-testid="badge">3</span> },
    ];
    renderWithHarbor(<Dock items={withBadge} />);
    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("applies glass class to wrapper", () => {
    const { container } = renderWithHarbor(<Dock items={items} />);
    expect(container.querySelector(".glass")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Dock items={items} className="my-dock" />,
    );
    expect(container.querySelector(".my-dock")).toBeTruthy();
  });

  it("renders empty items", () => {
    const { container } = renderWithHarbor(<Dock items={[]} />);
    expect(container.querySelector(".glass")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Dock items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
