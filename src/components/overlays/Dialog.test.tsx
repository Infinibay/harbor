import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
} from "./Dialog";

describe("Dialog", () => {
  it("does not render content when closed", () => {
    renderWithHarbor(
      <Dialog open={false} onClose={() => {}}>
        <DialogTitle>Hi</DialogTitle>
      </Dialog>,
    );
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });

  it("renders title, description, body, and footer when open", async () => {
    renderWithHarbor(
      <Dialog open onClose={() => {}}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogDescription>This cannot be undone.</DialogDescription>
        <DialogBody>
          <p>Workspace will be permanently removed.</p>
        </DialogBody>
        <DialogButtons>
          <button type="button">Delete</button>
        </DialogButtons>
      </Dialog>,
    );
    // AnimatePresence renders with initial opacity:0; waitFor lets the
    // animation frame settle so elements are fully present in the DOM.
    await waitFor(() => {
      expect(screen.getByText("Confirm deletion")).toBeInTheDocument();
    });
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    expect(screen.getByText(/permanently removed/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <Dialog open onClose={onClose}>
        <DialogTitle>x</DialogTitle>
      </Dialog>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the close button is clicked", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <Dialog open onClose={onClose}>
        <DialogTitle>x</DialogTitle>
        <DialogBody>
          <p>Body</p>
        </DialogBody>
      </Dialog>,
    );
    await waitFor(() => {
      expect(screen.getByText("Body")).toBeInTheDocument();
    });
    // Click the "×" close button
    await user.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into the dialog and restores it when closed", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Launch
          </button>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Focusable dialog</DialogTitle>
            <DialogBody>
              <button type="button">First action</button>
              <button type="button">Second action</button>
            </DialogBody>
          </Dialog>
        </>
      );
    }

    const { user } = renderWithHarbor(<Harness />);
    const trigger = screen.getByRole("button", { name: "Launch" });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "First action" })).toHaveFocus();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it("traps Tab navigation inside the dialog", async () => {
    const { user } = renderWithHarbor(
      <Dialog open onClose={() => {}}>
        <DialogTitle>Trapped dialog</DialogTitle>
        <DialogBody>
          <button type="button">First action</button>
          <button type="button">Second action</button>
        </DialogBody>
      </Dialog>,
    );

    const first = screen.getByRole("button", { name: "First action" });
    const second = screen.getByRole("button", { name: "Second action" });

    await waitFor(() => expect(first).toHaveFocus());
    await user.tab();
    expect(second).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
  });

  it("a11y: no violations when open", async () => {
    const { baseElement } = renderWithHarbor(
      <Dialog open onClose={() => {}}>
        <DialogTitle>Accessible Dialog</DialogTitle>
        <DialogDescription>A description for a11y</DialogDescription>
        <DialogBody>
          <p>Body content</p>
        </DialogBody>
        <DialogButtons>
          <button type="button">OK</button>
        </DialogButtons>
      </Dialog>,
    );
    // Wait for AnimatePresence to settle before running axe
    await waitFor(() => {
      expect(screen.getByText("Accessible Dialog")).toBeInTheDocument();
    });
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
