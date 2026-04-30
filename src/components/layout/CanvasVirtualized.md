# CanvasVirtualized

Renders only those items whose world-space bounding box overlaps the
current Canvas viewport (plus an optional buffer). Recomputes on the
next animation frame whenever pan or zoom change, so React renders no
more often than the browser paints. Use when you have hundreds or
thousands of items in a `<Canvas>` and most are off-screen at any
given time.

## Import

```tsx
import { CanvasVirtualized } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas>
  <CanvasVirtualized
    items={nodes}
    renderItem={(it) => (
      <CanvasItem key={it.id} id={it.id} x={it.x} y={it.y}>
        <NodeCard data={it} />
      </CanvasItem>
    )}
    buffer={300}
  />
</Canvas>
```

## Props

- **items** — `readonly { id; x; y; width; height }[]`. World-space rects.
- **renderItem** — `(item) => ReactNode`. Called once per visible item.
- **buffer** — `number`. World-space margin around the viewport.
  Default `200`.
- **disabled** — `boolean`. Skip filtering; render everything.

## Notes

- Must be a descendant of `<Canvas>` — it reads pan/zoom from
  `useCanvas()`. Outside a Canvas it falls back to rendering all items.
- `width` / `height` in each item are used for hit-testing the
  viewport rectangle. They don't have to match the rendered DOM size,
  but ballpark accuracy avoids visual pop-in at the edges.
- For very dense graphs combine with stable item ids and
  `React.memo` on the rendered node component so hidden subtrees don't
  re-mount across frames.
