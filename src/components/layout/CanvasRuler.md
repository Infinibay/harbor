# CanvasRuler

`CanvasRuler` draws a horizontal or vertical pixel ruler that follows Harbor
`Canvas` pan and zoom. It is designed for visual editors, diagramming tools,
layout builders, whiteboards, and canvas workspaces where users need spatial
orientation.

Render one horizontal ruler and one vertical ruler in the canvas overlay for the
classic design-tool frame.

## Import

```tsx
import { Canvas, CanvasItem, CanvasRuler } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Canvas
  grid="dots"
  overlay={
    <>
      <CanvasRuler orientation="horizontal" />
      <CanvasRuler orientation="vertical" />
    </>
  }
>
  <CanvasItem x={120} y={160} draggable>
    <NodeCard title="API Gateway" />
  </CanvasItem>
</Canvas>
```

The ruler subscribes to the canvas context, so ticks update when users pan or
zoom the workspace.

## Props

- **orientation** - `"horizontal" | "vertical"`. Required. Chooses ruler axis.
- **thickness** - `number`. Height for horizontal rulers, width for vertical
  rulers. Default `22`.
- **targetTickSpacing** - `number`. Approximate screen-pixel distance between
  labeled major ticks. Default `100`.
- **className** - extra classes on the ruler wrapper.

## Tick Model

`CanvasRuler` converts screen position into world units using the canvas pan and
zoom motion values. It then chooses a "nice" major interval using 1, 2, or 5
times a power of ten, and renders minor ticks at one-fifth of that interval.

This keeps labels readable across zoom levels without hardcoding one scale.

## Accessibility

The ruler is marked `aria-hidden` because it is visual orientation chrome, not
primary content. Do not rely on ruler ticks as the only way to edit exact
position. Provide numeric x/y fields in an inspector when precision matters.

For keyboard users, pair the canvas with selection controls and editable
properties outside the drawing surface.

## Gotchas

- `CanvasRuler` must be rendered inside a `Canvas` context. Outside of it, it
  falls back to a plain rail.
- The ruler uses absolute positioning at the top or left edge. Leave room for it
  in your canvas content or offset initial items by the ruler thickness.
- Labels are rounded world units. Use inspector fields for exact values.

## Related

- `Canvas` for pan and zoom context.
- `CanvasStatusBar` for live coordinates and zoom.
- `CanvasZoomControls` for zoom commands.
- `Inspector` for precise object properties.
