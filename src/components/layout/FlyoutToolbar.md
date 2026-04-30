# FlyoutToolbar

Floating tool rail with collapsing groups. Related tools fold into a
single group button that displays the active (or first) member; hover
or right-click opens a perpendicular submenu where any member can be
chosen. Keeps long tool palettes compact on small viewports.

## Import

```tsx
import { FlyoutToolbar } from "@infinibay/harbor/layout";
```

## Example

```tsx
<FlyoutToolbar
  position="left"
  title="Tools"
  entries={[
    { kind: "item", item: { id: "select", icon: <CursorIcon />, active: tool === "select", onClick: () => setTool("select") } },
    { kind: "group", group: {
      id: "shapes",
      label: "Shapes",
      items: [
        { id: "rect", icon: <RectIcon />, active: tool === "rect", onClick: () => setTool("rect") },
        { id: "ellipse", icon: <EllipseIcon />, active: tool === "ellipse", onClick: () => setTool("ellipse") },
      ],
    } },
    { kind: "item", item: { id: "draw", icon: <PenIcon />, onClick: () => setTool("draw"), divider: true } },
  ]}
/>
```

## Props

- **entries** — `FlyoutToolbarEntry[]`. Each is either
  `{ kind: "item", item }` or `{ kind: "group", group }`.
- **orientation** — `"vertical" | "horizontal"`. Default `"vertical"`.
- **floating** — `boolean`. Default `true`. Set `false` to render
  inline.
- **position** — `"top" | "bottom" | "left" | "right"`. Default
  `"left"`. Only used when `floating`.
- **title** — `ReactNode`. Header label inside the rail.
- **trailing** — `ReactNode`. Trailing slot — settings gear, "more", etc.
- **flyoutCloseDelay** — `number`. Delay (ms) before a hovered group
  closes after the pointer leaves. Default `120`.
- **className** — extra classes on the rail.

### `FlyoutToolbarItem`

`{ id; icon; label?; shortcut?; active?; disabled?; onClick?; divider? }`

### `FlyoutToolbarGroup`

`{ id; label; items: FlyoutToolbarItem[]; divider?; icon?; title? }` —
the group button shows the active item's icon by default, or the
first item's, or `group.icon` if provided.

## Notes

- The flyout submenu is portalled with `position: fixed`, so it
  escapes `overflow: hidden` ancestors (good for use inside a
  `<Canvas>` overlay or a constrained sidebar).
- Hover opens the flyout; right-click toggles it; clicking the group
  button itself fires the active item.
- A small triangle in the bottom-right corner marks group buttons.
- Pair with `<Canvas>` by dropping it in the `overlay` slot for a
  Figma-style left rail.
