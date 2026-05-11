# CanvasSnapGuides

`CanvasSnapGuides` draws the live dashed alignment lines that appear while draggable canvas items snap to edges or centers. Use it inside Harbor `Canvas` when building editors, diagramming tools, whiteboards, layout builders, graph tools, and other spatial interfaces where users need confidence that objects are aligning correctly.

The component subscribes to the canvas snap bus. If snapping is not enabled on the parent `Canvas`, it renders nothing.

## Import

```tsx
import { Canvas, CanvasItem, CanvasSnapGuides } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Canvas
  grid="dots"
  snap={{ threshold: 8, edges: true }}
  overlay={<CanvasSnapGuides />}
>
  <CanvasItem id="card-a" x={120} y={120} draggable>
    <Card title="API" />
  </CanvasItem>
  <CanvasItem id="card-b" x={360} y={180} draggable>
    <Card title="Worker" />
  </CanvasItem>
</Canvas>
```

Customize the guide color when your canvas has a strong accent:

```tsx
<CanvasSnapGuides color="rgb(34 211 238)" />
```

## Props

- **color** - optional CSS color string for the guide stroke. Defaults to `rgb(236 72 153)`.
- **className** - optional string merged onto the SVG overlay.

## Interaction Model

`CanvasSnapGuides` calls `useCanvas`, subscribes to `ctx.snap`, and stores the current guide list while dragging. It measures the viewport with `ResizeObserver`, projects guide coordinates through the current canvas pan and zoom values, and draws SVG lines over the canvas.

The overlay is `pointer-events: none`, so it will not block dragging, clicking, or selection.

## Canvas Requirements

Render the component through the `Canvas` `overlay` slot so it shares the same viewport and positioning model as the canvas. The parent canvas must have `snap` configured. Without `snap`, the component returns `null` by design.

Use it with draggable `CanvasItem` elements. Static canvases do not need snap guides.

## Accessibility

Snap guides are purely visual and use `aria-hidden`. They help pointer users align objects but should not be the only way to build precise layouts. Keyboard-accessible editors should also expose position fields, alignment commands, or shortcut-driven nudging.

## Gotchas

- `CanvasSnapGuides` does not enable snapping; it only visualizes snap events from the parent canvas.
- Render it in `overlay`, not as a normal canvas child.
- Very low-contrast guide colors can disappear over busy canvas content.
- If pan or zoom behavior changes, verify guide projection against actual dragged items.

## Related

- `Canvas` and `CanvasItem` for the editor surface.
- `CanvasToolbar` for alignment and editing commands.
- `CanvasRuler` for spatial measurement.
- `CanvasSelectionBox` and `CanvasMarquee` for selection workflows.
