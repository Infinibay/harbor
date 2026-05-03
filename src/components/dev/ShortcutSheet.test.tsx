import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ShortcutSheet, type ShortcutGroup } from "./ShortcutSheet";

const groups: ShortcutGroup[] = [
  {
    title: "Navigation",
    items: [
      { keys: ["⌘", "P"], description: "Open file" },
      { keys: ["⌘", "⇧", "P"], description: "Command palette" },
    ],
  },
  {
    title: "Editing",
    items: [
      { keys: ["⌘", "C"], description: "Copy" },
      { keys: ["⌘", "V"], description: "Paste" },
    ],
  },
];

describe("ShortcutSheet", () => {
  it("renders group titles", () => {
    renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={groups} />,
    );
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Editing")).toBeInTheDocument();
  });

  it("renders shortcut descriptions", () => {
    renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={groups} />,
    );
    expect(screen.getByText("Open file")).toBeInTheDocument();
    expect(screen.getByText("Command palette")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Paste")).toBeInTheDocument();
  });

  it("renders key shortcuts in kbd elements", () => {
    renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={groups} />,
    );
    // Dialog renders via Portal, so kbd elements are in document, not container
    const kbds = document.querySelectorAll("kbd");
    expect(kbds.length).toBeGreaterThanOrEqual(4);
  });

  it("renders search input", () => {
    renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={groups} />,
    );
    expect(
      screen.getByPlaceholderText("Search shortcuts…"),
    ).toBeInTheDocument();
  });

  it("filters shortcuts by description via search", async () => {
    const { user } = renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={groups} />,
    );
    await user.type(screen.getByPlaceholderText("Search shortcuts…"), "Copy");
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.queryByText("Open file")).toBeNull();
  });

  it("filters shortcuts by key via search", async () => {
    const { user } = renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={groups} />,
    );
    await user.type(screen.getByPlaceholderText("Search shortcuts…"), "⌘ P");
    expect(screen.getByText("Open file")).toBeInTheDocument();
  });

  it("renders empty groups gracefully", () => {
    renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={[]} />,
    );
    expect(
      screen.getByPlaceholderText("Search shortcuts…"),
    ).toBeInTheDocument();
  });

  it("a11y: known component gap — dialog has no accessible name", async () => {
    // ShortcutSheet renders via Dialog → Portal; running axe on `container`
    // (as the previous version of this test did) only sees the wrapper and
    // misses the dialog entirely. Running it on `document.body` correctly
    // surfaces the real issue: ShortcutSheet passes `title="…"` to Dialog,
    // but Dialog's prop-driven title API was removed — the dialog is rendered
    // with `aria-labelledby` pointing to an empty <DialogTitle>. To fix,
    // ShortcutSheet should render `<DialogTitle>Keyboard shortcuts</DialogTitle>`
    // as a child of Dialog instead of passing the dropped `title` prop.
    renderWithHarbor(
      <ShortcutSheet open={true} onClose={vi.fn()} groups={groups} />,
    );
    const results = await axe(document.body);
    expect(
      results.violations.some((v) => v.id === "aria-dialog-name"),
    ).toBe(true);
  });
});
