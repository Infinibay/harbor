import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("does not render its body when closed", () => {
    renderWithHarbor(
      <Drawer open={false} onClose={() => {}}>
        <p>Settings</p>
      </Drawer>,
    );
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("renders its body when open", () => {
    renderWithHarbor(
      <Drawer open onClose={() => {}}>
        <p>Settings</p>
      </Drawer>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <Drawer open onClose={onClose}>
        <p>Body</p>
      </Drawer>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the drawer and restores focus when closed", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open drawer
          </button>
          <Drawer open={open} onClose={() => setOpen(false)} title="Filters">
            <button type="button">First filter</button>
            <button type="button">Second filter</button>
          </Drawer>
        </>
      );
    }

    const { user } = renderWithHarbor(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open drawer" });
    await user.click(trigger);

    expect(await screen.findByRole("button", { name: "Close" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("traps Tab navigation inside the drawer", async () => {
    const { user } = renderWithHarbor(
      <Drawer open onClose={() => {}} title="Filters">
        <button type="button">First filter</button>
        <button type="button">Second filter</button>
      </Drawer>,
    );

    const close = await screen.findByRole("button", { name: "Close" });
    const first = screen.getByRole("button", { name: "First filter" });
    const second = screen.getByRole("button", { name: "Second filter" });

    expect(close).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab();
    expect(second).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
  });

  it("closes on outside pointer down without closing inside interactions", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <Drawer open onClose={onClose} title="Filters">
        <button type="button">Inside action</button>
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "Inside action" }));
    expect(onClose).not.toHaveBeenCalled();

    await user.pointer({ target: document.body, keys: "[MouseLeft]" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("a11y: no violations when open", async () => {
    const { baseElement } = renderWithHarbor(
      <Drawer open onClose={() => {}} title="Settings">
        <p>Content</p>
      </Drawer>,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
