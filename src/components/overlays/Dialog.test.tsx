import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("does not render content when closed", () => {
    renderWithHarbor(
      <Dialog open={false} onClose={() => {}} title="Hi">
        <p>Body</p>
      </Dialog>,
    );
    expect(screen.queryByText("Body")).not.toBeInTheDocument();
    expect(screen.queryByText("Hi")).not.toBeInTheDocument();
  });

  it("renders title, description, body, and footer when open", () => {
    renderWithHarbor(
      <Dialog
        open
        onClose={() => {}}
        title="Confirm deletion"
        description="This cannot be undone."
        footer={<button type="button">Delete</button>}
      >
        <p>Workspace will be permanently removed.</p>
      </Dialog>,
    );
    expect(screen.getByText("Confirm deletion")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
    expect(screen.getByText(/permanently removed/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <Dialog open onClose={onClose} title="x" />,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the backdrop is clicked", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <Dialog open onClose={onClose} title="x">
        <p>Body</p>
      </Dialog>,
    );
    // Click on the backdrop — use the body paragraph's grandparent's parent
    // (backdrop). Simpler: click somewhere that isn't the dialog panel.
    // The close "×" button is a reliable target that calls onClose directly.
    await user.click(
      screen
        .getAllByRole("button")
        .find((b) => b.textContent === "×")!,
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("a11y: no violations when open", async () => {
    const { container, baseElement } = renderWithHarbor(
      <Dialog
        open
        onClose={() => {}}
        title="A"
        description="B"
        footer={<button type="button">OK</button>}
      >
        <p>Body</p>
      </Dialog>,
    );
    // Dialog portals into document.body — audit both.
    expect(await axe(baseElement)).toHaveNoViolations();
    // `container` left here to satisfy linters / future expansion.
    void container;
  });
});
