import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CommandPalette, type Command } from "./CommandPalette";

const commands: Command[] = [
  { id: "a", label: "Open settings", action: () => {} },
  { id: "b", label: "Toggle theme", action: () => {} },
  { id: "c", label: "Restart workspace", action: () => {} },
];

describe("CommandPalette", () => {
  it("is invisible when closed", () => {
    renderWithHarbor(
      <CommandPalette
        open={false}
        onOpenChange={() => {}}
        commands={commands}
      />,
    );
    expect(screen.queryByText("Open settings")).not.toBeInTheDocument();
  });

  it("lists all commands when open", () => {
    renderWithHarbor(
      <CommandPalette
        open
        onOpenChange={() => {}}
        commands={commands}
      />,
    );
    for (const c of commands) {
      expect(screen.getByText(c.label)).toBeInTheDocument();
    }
  });

  it("filters commands by subsequence match", async () => {
    const { user } = renderWithHarbor(
      <CommandPalette
        open
        onOpenChange={() => {}}
        commands={commands}
      />,
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "restart");
    // AnimatePresence keeps exiting items briefly — wait for the filter
    // to settle before asserting.
    await waitFor(
      () => {
        expect(screen.getByText("Restart workspace")).toBeInTheDocument();
        expect(screen.queryByText("Open settings")).not.toBeInTheDocument();
        expect(screen.queryByText("Toggle theme")).not.toBeInTheDocument();
      },
      { timeout: 1500 },
    );
  });

  it("runs the selected command and closes", async () => {
    const action = vi.fn();
    const onOpenChange = vi.fn();
    const { user } = renderWithHarbor(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        commands={[{ id: "x", label: "Only one", action }]}
      />,
    );
    await user.click(screen.getByText("Only one"));
    expect(action).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("a11y: no violations when open", async () => {
    const { baseElement } = renderWithHarbor(
      <CommandPalette
        open
        onOpenChange={() => {}}
        commands={commands}
      />,
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
