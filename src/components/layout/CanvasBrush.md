# CanvasBrush

Freehand pen tool that lives inside `<Canvas>`. Listens for left-drag
on empty canvas while `enabled`, draws a live preview, and emits a
smoothed SVG path (in world coordinates) on release. You own the
strokes — store them in state and render them as SVG inside the Canvas
so they pan/zoom with the world.

## Import

```tsx
import { CanvasBrush, smoothPath } from "@infinibay/harbor/layout";
```

## Example

```tsx
const [strokes, setStrokes] = useState<BrushStroke[]>([]);

<Canvas grid="dots" cursor="crosshair">
  <svg style={{ position: "absolute", overflow: "visible", width: 0, height: 0 }}>
    {strokes.map((s, i) => (
      <path
        key={i}
        d={s.d}
        stroke={s.color}
        strokeWidth={s.thickness}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ))}
  </svg>
  <CanvasBrush
    enabled={tool === "draw"}
    color="#f0abfc"
    thickness={3}
    onStroke={(s) => setStrokes((prev) => [...prev, s])}
  />
</Canvas>
```

## Props

- **enabled** — `boolean`. Default `true`. Set to `false` to mute the
  listener while another tool is active.
- **thickness** — `number`. Stroke width in world units. Default `2`.
- **color** — `string`. CSS color. Default `"#fff"`.
- **smoothing** — `number`. `0` = angular dot-to-dot, `1` = max
  Catmull-Rom smoothing. Default `0.5`.
- **onStroke** — `(stroke: BrushStroke) => void`. Fires on release with
  the final `{ d, color, thickness }`.

## Notes

- Must be a descendant of `<Canvas>` — uses `useCanvas()` to translate
  pointer positions into world coords.
- The component skips strokes that start on a `[data-canvas-bounds]`
  item or anything marked `data-canvas-no-marquee`, so the brush
  doesn't fight other drag handlers.
- `smoothPath()` is exported in case you want to re-smooth or replay
  raw point arrays elsewhere.
- See [Canvas.md](./Canvas.md) for the parent's pan/zoom + grid setup.
