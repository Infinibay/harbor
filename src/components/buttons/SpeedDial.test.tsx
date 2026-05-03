import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SpeedDial } from "./SpeedDial";

const actions = [
  { id: "edit", label: "Edit", icon: <span>E</span>, onSelect: vi.fn() },
  { id: "delete", label: "Delete", icon: <span>D</span>, onSelect: vi.fn() },
];

describe("SpeedDial", () => {
  it("renders the FAB trigger button", () => {
    renderWithHarbor(<SpeedDial icon={<span>+</span>} actions={actions} />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("opens actions on trigger click", async () => {
    const { user } = renderWithHarbor(
      <SpeedDial icon={<span>+</span>} actions={actions} />,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("changes label to Close menu when open", async () => {
    const { user } = renderWithHarbor(
      <SpeedDial icon={<span>+</span>} actions={actions} />,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("fires action onSelect and closes", async () => {
    const onSelect = vi.fn();
    const items = [
      { id: "a", label: "Action", icon: <span>A</span>, onSelect },
    ];
    const { user } = renderWithHarbor(
      <SpeedDial icon={<span>+</span>} actions={items} />,
    );
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("renders empty actions without error", () => {
    renderWithHarbor(<SpeedDial icon={<span>+</span>} actions={[]} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <SpeedDial icon={<span>+</span>} actions={actions} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
