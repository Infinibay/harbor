import { describe, it, expect, vi } from "vitest";
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
