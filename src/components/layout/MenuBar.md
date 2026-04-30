# MenuBar

Application-style horizontal menu (File / Edit / View …) with portalled
dropdowns, hover handoff, and arrow-key navigation. Use for desktop-app
shells or canvas tools. For inline button groups use `<Toolbar>`; for
right-click menus use the context-menu primitives.

## Import

```tsx
import { MenuBar } from "@infinibay/harbor/layout";
```

## Example

```tsx
<MenuBar
  items={[
    {
      id: "file",
      label: "File",
      children: [
        { id: "new",  label: "New",  shortcut: "⌘N", onSelect: create },
        { id: "open", label: "Open", shortcut: "⌘O", onSelect: open },
        { id: "sep1", separator: true },
        { id: "exit", label: "Quit", danger: true, onSelect: quit },
      ],
    },
    { id: "edit", label: "Edit", children: [/* ... */] },
  ]}
/>
```

## Props (`<MenuBar>`)

- **items** — `MenuBarItemDef[]`. Required. Top-level entries:
  - **id** — `string`. Unique key.
  - **label** — `string`.
  - **children** — `MenuBarEntry[]`. Dropdown rows.
- **className** — extra classes on the bar.

## `MenuBarEntry` shape

- **id** — `string`. Required.
- **label** — `ReactNode`.
- **shortcut** — `string`. Right-aligned hint (e.g. `"⌘K"`).
- **icon** — `ReactNode`. Leading slot.
- **danger** — `boolean`. Tints the row rose.
- **disabled** — `boolean`.
- **checked** — `boolean`. Renders a leading `✓`.
- **separator** — `boolean`. Renders a divider; other fields ignored.
- **submenu** — `MenuBarEntry[]`. Nested rows; opens on hover.
- **onSelect** — `() => void`. Fired on click for non-submenu rows.

## Notes

- Dropdowns are portalled and use `Z.POPOVER`; submenus use `Z.SUBMENU`.
- Once one menu is open, hovering siblings switches to them.
- Esc closes; Arrow Left/Right cycles top-level menus.
