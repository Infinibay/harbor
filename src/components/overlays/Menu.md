# Menu

A click-anchored dropdown of actions. The trigger element is supplied
by the caller — `<Menu>` clones it, attaches the click toggle, and
positions the popup. Use `<MenuItem>`, `<MenuSeparator>`, and
`<MenuLabel>` for content. For a right-click region use
`<ContextMenu>`; for a global ⌘K launcher use `<CommandPalette>`; for
a button-with-format-options export specifically, use `<ExportMenu>`.

## Import

```tsx
import {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuLabel,
} from "@infinibay/harbor/overlays";
```

## Example

```tsx
<Menu trigger={<Button variant="secondary">Actions ▾</Button>}>
  <MenuLabel>Document</MenuLabel>
  <MenuItem icon={<EditIcon />} onClick={rename}>
    Rename
  </MenuItem>
  <MenuItem onClick={duplicate} shortcut="⌘D">
    Duplicate
  </MenuItem>
  <MenuItem
    submenu={
      <>
        <MenuItem onClick={() => moveTo("inbox")}>Inbox</MenuItem>
        <MenuItem onClick={() => moveTo("archive")}>Archive</MenuItem>
      </>
    }
  >
    Move to…
  </MenuItem>
  <MenuSeparator />
  <MenuItem danger onClick={remove}>
    Delete
  </MenuItem>
</Menu>
```

## Props (Menu)

- **trigger** — `ReactElement`. The clickable element. Must accept a
  forwarded `ref` and an `onClick` (Harbor `<Button>` and any native
  element work).
- **children** — `ReactNode`. Menu content.
- **side** — `"bottom" | "right"`. Default `"bottom"`.
- **align** — `"start" | "end"`. Default `"start"`. Aligns to the
  trigger's leading or trailing edge.
- **className** — extra classes on the popup.

## Props (MenuItem)

- **children** — `ReactNode`. Label.
- **onClick** — `() => void`. Closes the menu after firing.
- **icon** — `ReactNode`. Leading 16×16 glyph slot.
- **shortcut** — `string`. Trailing hint (e.g. `"⌘D"`).
- **danger** — `boolean`. Renders the row in destructive red.
- **disabled** — `boolean`. Greys out and blocks click.
- **submenu** — `ReactNode`. When set, the item opens a flyout on
  hover instead of firing `onClick` on click.
- **className** — extra classes on the row.

## Subcomponents

- **`<MenuSeparator>`** — thin horizontal divider. No props.
- **`<MenuLabel>`** — uppercase section header above a group of items.

## Notes

- Closes on outside click and Escape. Items close the menu via
  `MenuCtx` after click — building your own item is fine, just call
  the context's `close()`.
- The popup repositions to stay inside the viewport (flips above when
  there's no room below).
- Portals at `Z.POPOVER`; submenus at `Z.SUBMENU`.
