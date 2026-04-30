# CanvasToolbar

Floating tool rail — the vertical (or horizontal) strip of icons that
every serious canvas app has. Each item is described as data with an
icon, optional label, optional shortcut hint, `active` state and
`divider` flag. Pairs with a Canvas `overlay` slot to pin it to a
side, or render inline with `floating={false}`.

## Import

```tsx
import { CanvasToolbar } from "@infinibay/harbor/layout";
import type { CanvasToolbarItem } from "@infinibay/harbor/layout";
```

## Example

```tsx
const tools: CanvasToolbarItem[] = [
  { id: "select", icon: <CursorIcon />, label: "Select", shortcut: "V", active: tool === "select", onClick: () => setTool("select") },
  { id: "pen",    icon: <PenIcon />,    label: "Pen",    shortcut: "P", active: tool === "pen",    onClick: () => setTool("pen"), divider: true },
  { id: "text",   icon: <TextIcon />,   label: "Text",   shortcut: "T", active: tool === "text",   onClick: () => setTool("text") },
];

<Canvas
  overlay={<CanvasToolbar items={tools} position="left" />}
>
  ...
</Canvas>
```

## Props (`<CanvasToolbar>`)

- **items** — `CanvasToolbarItem[]`.
- **orientation** — `"vertical" | "horizontal"`. Default `"vertical"`.
- **floating** — `boolean`. Default `true`.
- **position** — `"top" | "bottom" | "left" | "right"`. Default `"left"`.
- **title** — `ReactNode`. Optional header above/before tools.
- **className** — extra classes.

## Item shape (`CanvasToolbarItem`)

- **id** — `string`.
- **icon** — `ReactNode`.
- **label** — `string`. Used for `aria-label` and tooltip.
- **shortcut** — `string`. Appended to the tooltip.
- **active** — `boolean`. Renders the fuchsia "selected" pill.
- **disabled** — `boolean`.
- **onClick** — `() => void`.
- **divider** — `boolean`. Render a thin separator after this item.

## Notes

- The toolbar is purely presentational — it doesn't read the Canvas
  context. Wire `active` and `onClick` to your own tool state.
- Pair with `<CanvasShortcuts>` to bind the keyboard shortcuts whose
  hints are shown in tooltips.
