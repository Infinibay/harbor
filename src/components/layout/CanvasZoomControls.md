# CanvasZoomControls

`CanvasZoomControls` renders a compact zoom widget for Harbor `Canvas` surfaces. Use it in diagram editors, whiteboards, graph tools, layout builders, process maps, and any canvas-heavy workflow where users need explicit zoom out, zoom in, fit, and reset controls.

The component reads and mutates the nearest canvas context through `useCanvas`. If it is rendered outside a `Canvas`, it returns `null`.

## Import

```tsx
import { Canvas, CanvasItem, CanvasZoomControls } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Canvas
  grid="dots"
  overlay={<CanvasZoomControls />}
>
  <CanvasItem x={120} y={140} draggable>
    <Card title="API" />
  </CanvasItem>
</Canvas>
```

Change placement when another canvas control already uses the bottom-right corner:

```tsx
<CanvasZoomControls position="top-right" />
```

## Props

- **presets** - optional `number[]`. Defaults to `[0.25, 0.5, 1, 1.5, 2, 4]`.
- **position** - optional `"bottom-right"`, `"bottom-left"`, `"top-right"`, or `"top-left"`. Defaults to `"bottom-right"`.
- **floating** - optional boolean. Defaults to `true`. Applies absolute positioning when enabled.
- **className** - optional string merged onto the root.

## Interaction Model

The widget subscribes to the canvas zoom motion value and displays the current zoom as a percentage. The minus button chooses the next lower preset or `ctx.minZoom`. The plus button chooses the next higher preset or `ctx.maxZoom`. `Fit` calls `ctx.api.fit()`. `1:1` calls `ctx.api.reset()`.

Buttons disable when the current zoom is already at the canvas min or max.

## Placement Guidance

The most common placement is the canvas `overlay` slot. Use `floating={false}` when placing the widget in a toolbar or custom panel instead of directly over the canvas.

Keep it visible but out of the primary drawing area. Corners work well because canvas users expect navigation controls there.

## Accessibility

Each button has an `aria-label`, and the current zoom percentage is visible text. The control helps pointer and keyboard users who do not want to rely on trackpad gestures. If your editor supports keyboard shortcuts for zoom, document them near the canvas or in a shortcut sheet.

## Gotchas

- It must render inside a `Canvas` provider.
- `presets` should be sorted ascending for predictable plus/minus behavior.
- `Fit` depends on the canvas implementation knowing its content bounds.
- Absolute positioning requires a positioned canvas container.

## Related

- `Canvas` and `CanvasItem` for spatial editing.
- `CanvasToolbar` for editing commands.
- `CanvasMinimap` for navigation in large canvases.
- `CanvasSnapGuides` for alignment feedback.
