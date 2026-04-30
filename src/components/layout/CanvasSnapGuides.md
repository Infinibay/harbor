# CanvasSnapGuides

Subscribes to the `<Canvas>` snap bus and draws live pink guide lines
whenever a drag is snapping to another item, the grid, or the canvas
edges. Render in the Canvas `overlay` slot. A no-op if `snap` isn't
enabled on the parent Canvas.

## Import

```tsx
import { CanvasSnapGuides } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas
  snap={{ threshold: 6, edges: true }}
  overlay={<CanvasSnapGuides />}
>
  <CanvasItem id="a" x={40} y={40} draggable>...</CanvasItem>
  <CanvasItem id="b" x={240} y={120} draggable>...</CanvasItem>
</Canvas>
```

## Props

- **color** — `string`. Stroke color for the guides. Default
  `"rgb(236 72 153)"` (fuchsia-500).
- **className** — extra classes on the SVG layer.

## Notes

- Requires `snap` on the parent `<Canvas>` (set to `true` or to a
  `SnapOptions` object). Without it the component renders nothing.
- Guides are published by `<CanvasItem>`'s drag handler via the snap
  bus — there's no prop wiring needed.
- See [Canvas.md](./Canvas.md) for `snap` configuration and the snap bus.
