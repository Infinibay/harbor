import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Menu, MenuItem } from "./Menu";

describe("Menu", () => {
  it("is closed by default — items are not visible", () => {
    renderWithHarbor(
      <Menu trigger={<button type="button">Open</button>}>
        <MenuItem onClick={() => {}}>Item one</MenuItem>
      </Menu>,
    );
    expect(screen.queryByText("Item one")).not.toBeInTheDocument();
  });

  it("opens on trigger click and reveals its items", async () => {
    const { user } = renderWithHarbor(
      <Menu trigger={<button type="button">Open</button>}>
        <MenuItem onClick={() => {}}>Item one</MenuItem>
        <MenuItem onClick={() => {}}>Item two</MenuItem>
      </Menu>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Item one")).toBeInTheDocument();
    expect(screen.getByText("Item two")).toBeInTheDocument();
  });

  it("fires an item's onClick and closes the menu", async () => {
    const onPick = vi.fn();
    const { user } = renderWithHarbor(
      <Menu trigger={<button type="button">Open</button>}>
        <MenuItem onClick={onPick}>Pick me</MenuItem>
      </Menu>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    await user.click(screen.getByText("Pick me"));
    expect(onPick).toHaveBeenCalledTimes(1);
    // AnimatePresence exit animation — wait for the menu to detach.
    await waitFor(
      () => expect(screen.queryByText("Pick me")).not.toBeInTheDocument(),
      { timeout: 1500 },
    );
  });

  it("uses menu roles and supports arrow-key navigation", async () => {
    const { user } = renderWithHarbor(
      <Menu trigger={<button type="button">Open</button>}>
        <MenuItem onClick={() => {}}>Item one</MenuItem>
        <MenuItem onClick={() => {}}>Item two</MenuItem>
        <MenuItem onClick={() => {}}>Item three</MenuItem>
      </Menu>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();

    const items = screen.getAllByRole("menuitem");
    await waitFor(() => expect(items[0]).toHaveFocus());

    await user.keyboard("{ArrowDown}");
    expect(items[1]).toHaveFocus();

    await user.keyboard("{End}");
    expect(items[2]).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(items[0]).toHaveFocus();
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const { user } = renderWithHarbor(
      <Menu trigger={<button type="button">Open</button>}>
        <MenuItem onClick={() => {}}>Item one</MenuItem>
      </Menu>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    await waitFor(() => expect(screen.getByRole("menuitem")).toHaveFocus());

    await user.keyboard("{Escape}");

    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("a11y: no violations when open", async () => {
    const { baseElement, user } = renderWithHarbor(
      <Menu trigger={<button type="button">Menu</button>}>
        <MenuItem onClick={() => {}}>Duplicate</MenuItem>
        <MenuItem onClick={() => {}}>Archive</MenuItem>
      </Menu>,
    );
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(
      await axe(baseElement, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
