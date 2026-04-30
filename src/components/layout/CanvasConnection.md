# CanvasConnection

SVG edge between two world-space points, drawn inside a `<Canvas>` so
it rides the pan/zoom transform. For node editors, flowcharts, and
"data flow" diagrams. Supports straight, bezier, orthogonal, and a
"smart" router that bends around obstacles.

## Import

```tsx
import { CanvasConnection } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas grid="dots">
  <CanvasItem id="a" x={80} y={80}>
    <NodeCard title="Source" />
  </CanvasItem>
  <CanvasItem id="b" x={420} y={220}>
    <NodeCard title="Sink" />
  </CanvasItem>

  <CanvasConnection
    from={{ x: 220, y: 110 }}
    to={{ x: 420, y: 250 }}
    curve="bezier"
    arrow
    animated
    label="emit"
  />
</Canvas>
```

## Props

- **from** — `{ x: number; y: number }`. World-space start.
- **to** — `{ x: number; y: number }`. World-space end.
- **curve** — `"straight" | "bezier" | "orthogonal" | "smart"`.
  Default `"bezier"`. `"smart"` routes around `obstacles`.
- **color** — `string`. Stroke color. Default fuchsia-ish.
- **thickness** — `number`. Stroke width in world units. Default `2`.
- **animated** — `boolean`. Dashed flow animation — good for "data is
  moving" feedback.
- **label** — `ReactNode`. Rendered at the segment midpoint.
- **arrow** — `boolean`. Show an arrowhead at `to`.
- **obstacles** — `ReadonlyArray<{ x; y; width; height }>`. Rects to
  avoid when `curve="smart"`. No-op for other curves.
- **obstaclePadding** — `number`. World-unit padding around obstacles.
  Default `12`.
- **className** — extra classes on the wrapper `<div>`.

## Notes

- Render as a sibling of your `<CanvasItem>`s (a direct child of
  `<Canvas>`) so the line shares the world transform.
- `"smart"` routing is heuristic — it tries an H-V elbow, then V-H,
  then a three-segment detour above/below the obstacle cluster. Good
  enough for node editors; not optimal pathfinding.
- The label is `pointer-events: auto` so it can host clickable badges.
- See [Canvas.md](./Canvas.md) for the host's transform model.
