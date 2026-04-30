# CanvasMinimap

A miniature of the Canvas world with a highlighted viewport rectangle.
Click or drag inside it to pan the main canvas. Items are read from
the live `[data-canvas-bounds]` descendants (every `<CanvasItem>`
contributes one) and shown as tiny rectangles. Drop it as a child of
`<Canvas>` (typically inside the `overlay` slot, but it positions
itself absolutely either way).

## Import

```tsx
import { CanvasMinimap } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas
  overlay={<CanvasMinimap size={220} position="bottom-right" />}
>
  <CanvasItem x={120} y={200}><Node /></CanvasItem>
  <CanvasItem x={520} y={400}><Node /></CanvasItem>
</Canvas>
```

## Props

- **size** — `number`. Width in pixels (height derives from aspect).
  Default `200`.
- **bounds** — `{ x; y; width; height }`. Explicit world bounds. By
  default they're computed from items + the current viewport.
- **padding** — `number`. World-unit padding around auto-bounds.
  Default `80`.
- **position** — `"bottom-right" | "bottom-left" | "top-right" | "top-left"`.
  Default `"bottom-right"`.
- **floating** — `boolean`. Default `true`. Pin to a corner. Set
  `false` to render inline.

## Notes

- Must live inside a `<Canvas>` — it reads pan/zoom from `useCanvas()`
  and returns `null` outside.
- Items are re-measured every 400ms (plus on every transform change
  and viewport resize), so newly added or moved items appear without
  any extra wiring.
- The viewport rectangle is sky-blue; item dots are fuchsia.
