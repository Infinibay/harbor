# MenuBar

`MenuBar` renders desktop-style application menus such as File, Edit, View, and Help. It supports portalled dropdowns, submenu hover behavior, checked rows, disabled rows, danger rows, shortcuts, icons, and left/right top-level navigation.

Use it in Tauri apps, IDE-like workbenches, canvas tools, and other keyboard-first product surfaces. For inline commands, use `Toolbar`; for right-click menus, use context-menu primitives.

## Import

```tsx
import { MenuBar, type MenuBarEntry, type MenuBarItemDef } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { MenuBar } from "@infinibay/harbor/layout";

export function AppMenu() {
  return (
    <MenuBar
      items={[
        {
          id: "file",
          label: "File",
          children: [
            { id: "new", label: "New", shortcut: "Ctrl+N", onSelect: createFile },
            { id: "open", label: "Open", shortcut: "Ctrl+O", onSelect: openFile },
            { id: "sep", separator: true },
            { id: "quit", label: "Quit", danger: true, onSelect: quitApp },
          ],
        },
        {
          id: "view",
          label: "View",
          children: [
            { id: "sidebar", label: "Sidebar", checked: true, onSelect: toggleSidebar },
          ],
        },
      ]}
    />
  );
}
```

## Entry Model

```ts
type MenuBarEntry = {
  id: string;
  label?: ReactNode;
  shortcut?: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  checked?: boolean;
  separator?: boolean;
  submenu?: MenuBarEntry[];
  onSelect?: () => void;
};
```

Separators render a divider and ignore the other display fields.

## Props

- **items**: `MenuBarItemDef[]`. Required top-level menus.
- **className**: custom class on the horizontal bar.

`MenuBarItemDef` is `{ id: string; label: string; children?: MenuBarEntry[] }`.

## Accessibility

Top-level entries and menu rows are buttons. `Escape` closes the open menu, and left/right arrows switch between top-level menus once a menu is open.

For full desktop semantics, pair menu actions with real keyboard shortcuts in your app logic. The `shortcut` string is visual documentation; it does not register a hotkey.

## Gotchas

- Dropdowns are portalled at `Z.POPOVER`; submenus use `Z.SUBMENU`.
- Submenus open on hover. Keep submenu depth shallow and avoid hiding critical commands inside nested paths.
- Menu rows close the menu after `onSelect`. Submenu rows do not call `onSelect` directly.
- The component does not manage focus trapping inside the dropdown.

## Related

- [`Toolbar`](./Toolbar.md) for visible command rows.
- [`CanvasShortcuts`](./CanvasShortcuts.md) for registering command hotkeys.
- [`CommandPalette`](../overlays/CommandPalette.md) for searchable commands.
