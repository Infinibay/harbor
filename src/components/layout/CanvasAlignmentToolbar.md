# CanvasAlignmentToolbar

Six-way alignment + horizontal/vertical distribute controls for a
multi-item selection on a `<Canvas>`. Hand it `ids` and the full `items`
array; the toolbar computes the new world-space positions via the pure
helpers in `canvas-snap.ts` and emits them through `onChange`. Works
inside or outside a Canvas — it doesn't read the Canvas context.

## Import

```tsx
import { CanvasAlignmentToolbar } from "@infinibay/harbor/layout";
```

## Example

```tsx
<CanvasAlignmentToolbar
  ids={selectedIds}
  items={nodes}
  onChange={(positions) => {
    setNodes((prev) =>
      prev.map((n) => {
        const next = positions.get(n.id);
        return next ? { ...n, ...next } : n;
      }),
    );
  }}
/>
```

## Props

- **ids** — `ReadonlySet<string> | string[]`. The IDs to align.
- **items** — `ReadonlyArray<IdRect>`. All items (`{ id, x, y, width, height }`).
  Selection is filtered from this list.
- **onChange** — `(positions: Map<string, { x: number; y: number }>) => void`.
  Receives the next positions for the affected items.
- **showLabels** — `boolean`. Render labels next to icons.
- **className** — extra classes on the toolbar.

## Notes

- Single-axis alignments (left/right/top/bottom/center) require ≥ 2 items;
  distribute requires ≥ 3 — buttons disable themselves automatically.
- Pair with `<CanvasSelectionBox>` to surface a visual handle for the
  same selection set.
- Drop it inside a Canvas `overlay` slot to float over the world, or
  inline in a side panel.
