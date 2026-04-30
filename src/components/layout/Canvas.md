# Canvas

GPU-accelerated infinite canvas with pan, zoom and a live grid. The
viewport fills its container, and a world layer inside is transformed
via `translate3d + scale` so pan/zoom stay on the compositor thread —
hundreds of children can ride on top without re-rendering each frame.
Pair with `<CanvasItem>` for absolutely-positioned children, and with
the rest of the Canvas family (`CanvasToolbar`, `CanvasMinimap`,
`CanvasZoomControls`, `CanvasStatusBar`, `CanvasRuler`,
`CanvasShortcuts`, `CanvasVirtualized`, `CanvasMotion`) which all read
the shared context exposed by `useCanvas()`.

## Import

```tsx
import { Canvas, CanvasItem, useCanvas } from "@infinibay/harbor/layout";
import type { CanvasHandle } from "@infinibay/harbor/layout";
```

## Example

```tsx
const canvas = useRef<CanvasHandle>(null);

<Canvas
  ref={canvas}
  grid="dots"
  gridSize={32}
  pan="both"
  overlay={<CanvasZoomControls />}
>
  <CanvasItem x={120} y={200} draggable>
    <div className="px-3 py-2 rounded-lg bg-fuchsia-500/20">Node A</div>
  </CanvasItem>
  <CanvasItem x={420} y={320} draggable>
    <div className="px-3 py-2 rounded-lg bg-sky-500/20">Node B</div>
  </CanvasItem>
</Canvas>
```

## Props (`<Canvas>`)

- **minZoom** / **maxZoom** — `number`. Default `0.1` / `8`.
- **defaultTransform** — `Partial<{ x; y; zoom }>`. Uncontrolled start.
- **transform** — `{ x; y; zoom }`. Controlled transform.
- **onTransformChange** — `(t) => void`. Fires on every change.
- **grid** — `"dots" | "lines" | false`. Default `"dots"`.
- **gridSize** — `number`. World units per cell. Default `32`.
- **gridColor** / **gridMajorColor** — `string`.
- **gridMajor** — `number`. Major axis every N cells. `0` disables.
- **pan** — `"space" | "middle" | "both" | "always"`. Default `"both"`.
- **wheelZoom** — `boolean`. Default `true`.
- **wheelSensitivity** — `number`. Default `0.002`.
- **overlay** — `ReactNode`. Drawn in screen space, on top of world.
- **menu** — `ReactNode | (ctx) => ReactNode`. Right-click menu for
  the empty canvas; the function form receives world-space coords.
- **cursor** — `CSSProperties["cursor"]`. Override for tool modes.
- **snap** — `SnapOptions | true`. Enables drag snapping; pair with
  `<CanvasSnapGuides>` in the overlay.

## Imperative API (via `ref` or `useCanvas().api`)

- **getTransform()** — `{ x, y, zoom }`.
- **setTransform(partial, opts?)** — animate or snap.
- **zoomTo(z, { around?, animate? })** — zoom around a screen point.
- **panTo(x, y, opts?)**.
- **screenToWorld(p)** / **worldToScreen(p)**.
- **fit({ padding? })** — frame all `[data-canvas-bounds]` children.
- **reset()** — `x=0, y=0, zoom=1`.
- **getViewportElement()** — DOM handle.

## Props (`<CanvasItem>`)

- **id** — `string`. Threaded through as `data-canvas-id`.
- **x** / **y** — `number`. World-space top-left.
- **fixedSize** — `boolean`. Stay constant on screen across zoom.
- **draggable** — `boolean`. Plus `onDrag` / `onDragStart` / `onDragEnd`.
- **bounds** — `boolean`. Include in `fit()` (default `true`).
- **menu** — `ReactNode`. Per-item right-click menu.
- **transition** — `Transition | "spring" | "tween" | false`.
- **rotate** / **scale** / **opacity** — `number`.

## Notes

- Pan via space + drag (or middle-click); zoom with the wheel around
  the cursor. `pan="always"` enables left-click panning anywhere.
- Children of `<Canvas>` consume the shared context — that's how
  toolbars, minimaps and status bars stay in sync without prop drilling.
- For huge graphs, wrap items in `<CanvasVirtualized>` so only those
  intersecting the viewport mount.
