# CanvasVirtualized

`CanvasVirtualized` renders only canvas items whose world-space rectangles overlap the current viewport plus a configurable buffer. Use it when a Harbor `Canvas` contains hundreds or thousands of nodes and mounting everything would make pan and zoom sluggish.

It is a rendering helper, not a layout engine. Your app still owns item data, selection, drag state, and persistence.

## Import

```tsx
import { Canvas, CanvasItem, CanvasVirtualized } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Canvas, CanvasItem, CanvasVirtualized } from "@infinibay/harbor/layout";

<Canvas grid="dots">
  <CanvasVirtualized
    items={nodes}
    buffer={240}
    renderItem={(node) => (
      <CanvasItem key={node.id} id={node.id} x={node.x} y={node.y}>
        <NodeCard node={node} />
      </CanvasItem>
    )}
  />
</Canvas>
```

## Props

- **items** - `readonly T[]`. Required items with `id`, `x`, `y`, `width`, and `height`.
- **renderItem** - `(item: T) => ReactNode`. Required renderer for visible items.
- **buffer** - `number`. Extra world-space buffer around the viewport. Default `200`.
- **disabled** - `boolean`. Renders every item when true.

## Item Model

```ts
type VirtualItem = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
```

Width and height must describe the item's world-space bounding box. Virtualization accuracy depends on those numbers.

## Behavior

The component reads `Canvas` pan, zoom, and viewport size from context. It computes world bounds for the visible viewport, expands them by `buffer`, and keeps only intersecting items mounted. Pan and zoom changes schedule recomputation with `requestAnimationFrame`, so React updates at most once per paint.

## Accessibility

Virtualized items outside the viewport are not in the DOM. That is good for performance, but it means screen readers and browser search cannot reach off-screen canvas nodes. Provide a searchable outline or data list for large diagrams when accessibility matters.

## Gotchas

- Must be rendered inside `Canvas`.
- Incorrect `width` or `height` can hide visible items.
- `items` identity affects recomputation.
- Selection state for off-screen items must live outside the mounted item tree.

## Related

- `Canvas` for pan and zoom workspaces.
- `CanvasMinimap` for viewport overview.
- `VirtualList` for non-canvas lists.
