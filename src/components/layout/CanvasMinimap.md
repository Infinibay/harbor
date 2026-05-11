# CanvasMinimap

`CanvasMinimap` renders a miniature overview of a Harbor `Canvas`, including item rectangles and the current viewport. Users can click or drag in the minimap to pan the main canvas.

Use it in diagram editors, workflow builders, whiteboards, node graphs, map-like tools, and any canvas where users can lose their place while panning or zooming.

## Import

```tsx
import { Canvas, CanvasItem, CanvasMinimap } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Canvas, CanvasItem, CanvasMinimap } from "@infinibay/harbor/layout";

export function Diagram() {
  return (
    <Canvas grid="dots" overlay={<CanvasMinimap position="bottom-right" />}>
      <CanvasItem id="api" x={80} y={60} draggable>
        API
      </CanvasItem>
      <CanvasItem id="db" x={420} y={240} draggable>
        Database
      </CanvasItem>
    </Canvas>
  );
}
```

## Props

- **size** - `number`. Minimap width in pixels. Default `200`.
- **bounds** - `{ x, y, width, height }`. Explicit world bounds.
- **padding** - `number`. Padding around auto-computed bounds. Default `80`.
- **position** - `"bottom-right" | "bottom-left" | "top-right" | "top-left"`. Default `"bottom-right"`.
- **floating** - `boolean`. Applies absolute corner positioning. Default `true`.
- **className** - extra classes on the minimap wrapper.

## Behavior

The minimap reads canvas context through `useCanvas`. It scans the canvas viewport for `[data-canvas-bounds]` elements, maps their world positions into minimap coordinates, and draws the current viewport rectangle. It remeasures on pan, zoom, resize, and a periodic interval so moved items stay reflected.

Clicking the minimap pans the main canvas so the clicked world point moves to the center of the viewport.

## Accessibility

The minimap is pointer-first and does not expose keyboard panning. Keep pan and zoom available through `CanvasZoomControls`, keyboard shortcuts, or explicit navigation controls when accessibility matters.

## Gotchas

- Must be rendered inside a `Canvas` provider.
- Auto bounds depend on `CanvasItem` data attributes.
- Periodic remeasurement has a small layout cost.
- `size` controls width; height is derived from world aspect ratio.

## Related

- `Canvas` for pan and zoom workspaces.
- `CanvasPanel` for floating inspectors.
- `CanvasZoomControls` for viewport controls.
