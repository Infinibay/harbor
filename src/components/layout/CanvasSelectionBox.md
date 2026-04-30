# CanvasSelectionBox

Floating bounding box for the currently-selected `<CanvasItem>`s,
rendered in viewport space. Sticks to the combined bbox and follows
pan/zoom via motion values (no re-renders). Drag the body to move the
group, or a corner/edge handle to resize a single-item selection.

## Import

```tsx
import { CanvasSelectionBox } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas
  overlay={
    <CanvasSelectionBox
      ids={selected}
      items={nodes}
      onMove={(d, phase) => {
        if (phase === "drag") translate(d);
        if (phase === "end") commit();
      }}
      onResize={({ dx, dy, corner, phase }) => resize({ dx, dy, corner, phase })}
    />
  }
>
  {/* items */}
</Canvas>
```

## Props

- **ids** — `ReadonlySet<string> | string[]`. Currently selected IDs.
- **items** — `ReadonlyArray<{ id; x; y; width; height }>`. Bbox is
  computed from those whose `id` is in `ids`.
- **onMove** — `(delta, phase) => void`. `phase: "drag" | "end"` —
  the parent commits a single history entry on `"end"`.
- **onResize** — `({ dx, dy, corner, phase }) => void`. `corner` is one
  of `nw | n | ne | e | se | s | sw | w`.
- **showHandles** — `boolean`. Default: `true` only when one item is
  selected.
- **padding** — `number`. World-unit padding around the bbox so handles
  don't touch content. Default `0`.
- **className** — extra classes on the box.

## Notes

- Render in the Canvas `overlay` slot so it sits above world content
  but below right-click menus.
- When `onMove` is omitted the box is display-only — pointer events
  pass through to items beneath.
- The box marks itself `data-canvas-no-marquee` so dragging it doesn't
  start a marquee select.
- See [Canvas.md](./Canvas.md) for the overlay slot and transform model.
