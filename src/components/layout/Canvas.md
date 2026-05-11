# Canvas

`Canvas` is Harbor's infinite workspace foundation. It gives you a GPU-accelerated world layer with pan, zoom, grid rendering, overlays, right-click menus, draggable items, snapping, and an imperative API. Use it for diagram editors, workflow builders, whiteboards, topology maps, visual query tools, and design surfaces.

The viewport owns screen-space behavior. `CanvasItem` places content in world-space coordinates. Overlays stay fixed to the viewport, which is where toolbars, minimaps, zoom controls, and status bars belong.

## Import

```tsx
import {
  Canvas,
  CanvasItem,
  CanvasSnapGuides,
  type CanvasHandle,
} from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
const canvasRef = useRef<CanvasHandle>(null);

<Canvas
  ref={canvasRef}
  grid="dots"
  gridSize={32}
  pan="both"
  snap
  overlay={
    <>
      <CanvasSnapGuides />
      <CanvasZoomControls />
    </>
  }
>
  <CanvasItem id="api" x={120} y={160} draggable onDragEnd={savePosition}>
    <Card>API Gateway</Card>
  </CanvasItem>
  <CanvasItem id="worker" x={420} y={260} draggable>
    <Card>Worker Pool</Card>
  </CanvasItem>
</Canvas>
```

## Mental Model

`Canvas` tracks `{ x, y, zoom }`. Wheel zoom happens around the cursor. Panning can be space+drag, middle-click drag, both, or always-on left drag. `CanvasItem` receives `x` and `y` in world units, not CSS pixels.

## Props

- `minZoom`, `maxZoom`: default `0.1` and `8`.
- `defaultTransform`: uncontrolled initial transform.
- `transform`, `onTransformChange`: controlled mode.
- `grid`, `gridSize`, `gridColor`, `gridMajor`, `gridMajorColor`: grid behavior.
- `pan`, `wheelZoom`, `wheelSensitivity`: navigation.
- `overlay`: viewport-space layer.
- `menu`: canvas-level right-click menu. Function form receives world coordinates.
- `cursor`: tool-mode cursor override.
- `snap`: `true` or `SnapOptions` to enable snap guides.

## CanvasItem Props

`CanvasItem` accepts `id`, `x`, `y`, `children`, `fixedSize`, `draggable`, `onDrag`, `onDragStart`, `onDragEnd`, `bounds`, `menu`, `transition`, `rotate`, `scale`, `opacity`, `className`, and `style`.

## Imperative API

The `CanvasHandle` ref and `useCanvas().api` expose `getTransform`, `setTransform`, `zoomTo`, `panTo`, `screenToWorld`, `worldToScreen`, `fit`, `reset`, and `getViewportElement`.

## Accessibility

Canvas interaction is spatial, so expose core workflows through keyboard-accessible controls outside the world layer: zoom buttons, fit/reset buttons, command palette actions, and editable side panels. Interactive children inside `CanvasItem` keep their own semantics.

## Gotchas

The canvas fills its parent. Give the parent a real height. For very large graphs, combine `Canvas` with `CanvasVirtualized`. Use `bounds={false}` for decorative items that should not affect `fit()`.

## Related

Use with `CanvasToolbar`, `FlyoutToolbar`, `CanvasZoomControls`, `CanvasStatusBar`, `CanvasConnection`, `CanvasSelectionBox`, `CanvasMotion`, and `GraphCanvas`.
