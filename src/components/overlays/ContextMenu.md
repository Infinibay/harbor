# ContextMenu

Wraps any region and shows a menu at the cursor on right-click. The
trigger is the wrapped children; the menu content is whatever you pass
to `menu`. For a click-anchored dropdown attached to a button, use
`<Menu>` instead — same look, different trigger.

## Import

```tsx
import { ContextMenu } from "@infinibay/harbor/overlays";
```

## Example

```tsx
<ContextMenu
  menu={
    <>
      <MenuItem onClick={cut}>Cut</MenuItem>
      <MenuItem onClick={copy}>Copy</MenuItem>
      <MenuSeparator />
      <MenuItem danger onClick={remove}>Delete</MenuItem>
    </>
  }
>
  <div className="canvas">Right-click me</div>
</ContextMenu>
```

## Props

- **children** — `ReactNode`. The right-clickable region.
- **menu** — `ReactNode`. Menu content. Compose with `<MenuItem>`,
  `<MenuSeparator>`, `<MenuLabel>` from `<Menu>`.
- **className** — extra classes on the wrapper.

## Notes

- Position is the cursor coordinate, clamped to the viewport (8px
  inset).
- Closes on outside click and Escape.
- Portals at `Z.CONTEXT_MENU` so it never gets clipped by overflow
  ancestors.
