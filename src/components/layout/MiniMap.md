# MiniMap

Compact world overview with a viewport indicator and click/drag-to-
navigate. Standalone — doesn't read any context. Wire `world`,
`viewport`, optional `items`, and `onNavigate(x, y)` and feed the
result back to your camera (e.g. `Canvas`'s `panTo` / `setTransform`).

## Import

```tsx
import { MiniMap } from "@infinibay/harbor/layout";
```

## Example

```tsx
<MiniMap
  world={{ w: 4000, h: 3000 }}
  viewport={{ x: 800, y: 500, w: 1280, h: 720 }}
  items={nodes.map((n) => ({ x: n.x, y: n.y, w: n.width, h: n.height }))}
  onNavigate={(x, y) => canvas.current?.panTo(-x, -y)}
/>
```

## Props

- **world** — `{ w: number; h: number }`. Total world bounds.
- **viewport** — `MiniMapRect`. The visible rect (world coords) drawn
  as the highlighted box.
- **items** — `MiniMapRect[]`. Optional dots/blocks for objects in the
  world. Each accepts `color` and `label`.
- **onNavigate** — `(x: number, y: number) => void`. Fires on click or
  drag with a clamped top-left target.
- **width** — `number`. Default `180`.
- **height** — `number`. Default `120`.
- **className** — extra classes on the panel.

## Notes

- Pointer capture keeps the drag tracking even if the cursor leaves
  the minimap mid-drag.
- The component clamps `onNavigate` so the viewport never escapes
  `world` bounds — handy for clamped cameras.
- For canvases driven by `<Canvas>`, derive `viewport` from
  `canvasRef.current?.getTransform()` and the viewport DOM rect.
