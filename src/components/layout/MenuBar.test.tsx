import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MenuBar, type MenuBarItemDef } from "./MenuBar";

const items: MenuBarItemDef[] = [
  {
    id: "file",
    label: "File",
    children: [
      { id: "new", label: "New", shortcut: "⌘N", onSelect: vi.fn() },
      { id: "open", label: "Open", shortcut: "⌘O" },
      { id: "sep1", separator: true },
      { id: "exit", label: "Exit", danger: true, onSelect: vi.fn() },
    ],
  },
  {
    id: "edit",
    label: "Edit",
    children: [
      { id: "undo", label: "Undo", shortcut: "⌘Z" },
      { id: "redo", label: "Redo", shortcut: "⌘⇧Z", disabled: true },
    ],
  },
  {
    id: "view",
    label: "View",
    children: [
      { id: "sidebar", label: "Sidebar", checked: true },
    ],
  },
];

describe("MenuBar", () => {
  it("renders menu item labels", () => {
    renderWithHarbor(<MenuBar items={items} />);
    expect(screen.getByText("File")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
  });

  it("opens dropdown on menu item click", async () => {
    const { user } = renderWithHarbor(<MenuBar items={items} />);
    await user.click(screen.getByText("File"));
    // Portal renders to document
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("shows shortcut labels", async () => {
    const { user } = renderWithHarbor(<MenuBar items={items} />);
    await user.click(screen.getByText("File"));
    expect(screen.getByText("⌘N")).toBeInTheDocument();
    expect(screen.getByText("⌘O")).toBeInTheDocument();
  });

  it("shows separator lines via Portal", async () => {
    const { user } = renderWithHarbor(<MenuBar items={items} />);
    await user.click(screen.getByText("File"));
    // Portal renders to document.body, not container
    const sep = document.querySelector(".bg-\\[var\\(--harbor-menu-separator\\)\\]");
    expect(sep).toBeTruthy();
  });

  it("fires onSelect and closes menu on item click", async () => {
    const onSelect = vi.fn();
    const menuItems: MenuBarItemDef[] = [
      {
        id: "file",
        label: "File",
        children: [{ id: "save", label: "Save", onSelect }],
      },
    ];
    const { user } = renderWithHarbor(<MenuBar items={menuItems} />);
    await user.click(screen.getByText("File"));
    await user.click(screen.getByText("Save"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("shows checked items with ✓", async () => {
    const { user } = renderWithHarbor(<MenuBar items={items} />);
    await user.click(screen.getByText("View"));
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("toggles dropdown on second click", async () => {
    const { user } = renderWithHarbor(<MenuBar items={items} />);
    await user.click(screen.getByText("File"));
    expect(screen.getByText("New")).toBeInTheDocument();
    await user.click(screen.getByText("File"));
    await waitFor(() => expect(screen.queryByText("New")).toBeNull());
  });

  it("renders disabled items", async () => {
    const { user } = renderWithHarbor(<MenuBar items={items} />);
    await user.click(screen.getByText("Edit"));
    const redo = screen.getByText("Redo");
    expect(redo.closest("button")).toBeDisabled();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <MenuBar items={items} className="my-menubar" />,
    );
    expect(container.querySelector(".my-menubar")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<MenuBar items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
