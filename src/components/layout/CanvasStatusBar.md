# CanvasStatusBar

`CanvasStatusBar` is a thin status strip for Harbor canvas workspaces. It reads
the active canvas context, shows live x/y coordinates and zoom, and provides
left/right slots for product-specific state such as selection count, save state,
branch, mode, or collaboration presence.

Use it inside the `overlay` slot of `Canvas` when building editors, diagrammers,
workflow builders, map tools, or any surface where spatial state matters.

## Import

```tsx
import { Canvas, CanvasItem, CanvasStatusBar } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Canvas
  grid="dots"
  overlay={
    <CanvasStatusBar
      left={<span>3 selected</span>}
      right={<span>Saved 2s ago</span>}
    />
  }
>
  <CanvasItem x={120} y={160} draggable>
    <NodeCard title="Deploy" />
  </CanvasItem>
</Canvas>
```

The bar subscribes to the canvas motion values, so pan and zoom updates appear
without you passing coordinates manually.

## Props

- **left** - `ReactNode`. Extra content shown before the built-in coordinate
  group.
- **right** - `ReactNode`. Extra content shown after the built-in zoom group.
- **showCoords** - `boolean`. Shows x/y coordinates. Default `true`.
- **showZoom** - `boolean`. Shows zoom percentage. Default `true`.
- **floating** - `boolean`. Pins the bar to the bottom of the canvas overlay.
  Default `true`.
- **className** - extra classes on the wrapper.

## Canvas Context

`CanvasStatusBar` calls `useCanvas()` internally. When it is rendered outside a
`Canvas`, it still renders but the built-in values remain at their initial
state. For a real workspace, place it in the canvas overlay so it shares the same
context as pan, zoom, and canvas items.

Use the slots for application state, not for replacing the canvas values. Common
left-slot content is selection count or active tool. Common right-slot content is
save state, environment, branch, or collaborator count.

## Accessibility

The bar is informational. Keep important destructive or blocking states in a
more explicit component such as `Alert`, `Banner`, or a disabled action with
helper text. The compact text is useful for operators, but it should not be the
only place critical errors appear.

If slot content is interactive, provide normal buttons or links; the bar itself
does not add keyboard behavior.

## Gotchas

- `floating` uses absolute positioning. The parent canvas overlay must be
  positioned correctly for the bar to pin to the bottom.
- Coordinates are rounded with `toFixed(0)`, and zoom is rendered as a rounded
  percentage. Use custom slot content if you need precision.
- This component is canvas-specific. Use `StatusBar` for general app chrome.

## Related

- `Canvas` for pan and zoom workspace context.
- `CanvasToolbar` and `CanvasZoomControls` for canvas actions.
- `StatusBar` for non-canvas app status.
- `Inspector` for editable selected-object properties.
