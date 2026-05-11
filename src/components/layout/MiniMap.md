# MiniMap

`MiniMap` is a standalone minimap primitive for arbitrary world and viewport coordinates. It draws item rectangles, draws the current viewport, and emits new camera coordinates when the user clicks or drags.

Use it when you already have your own pan/zoom model. Use `CanvasMinimap` when you are inside Harbor `Canvas`.

## Import

```tsx
import { MiniMap, type MiniMapRect } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { useState } from "react";
import { MiniMap } from "@infinibay/harbor/layout";

export function DocumentOverview() {
  const [viewport, setViewport] = useState({ x: 800, y: 500, w: 1280, h: 720 });

  return (
    <MiniMap
      world={{ w: 4000, h: 3000 }}
      viewport={viewport}
      items={[{ x: 200, y: 150, w: 280, h: 180 }]}
      onNavigate={(x, y) => setViewport((prev) => ({ ...prev, x, y }))}
    />
  );
}
```

## Props

- **world** - `{ w: number; h: number }`. Required world dimensions.
- **viewport** - `MiniMapRect`. Required current viewport rectangle.
- **items** - `MiniMapRect[]`. Optional world items to draw.
- **onNavigate** - `(x: number, y: number) => void`. Called with new viewport top-left coordinates.
- **width** - `number`. Minimap width. Default `180`.
- **height** - `number`. Minimap height. Default `120`.
- **className** - extra classes on the wrapper.

## Rect Model

`MiniMapRect` uses `{ x, y, w, h, label?, color? }`. `label` is currently not rendered. `color` controls item fill and defaults to a translucent Harbor accent.

## Behavior

The minimap maps world coordinates to minimap pixels with independent x and y scales. Pointer down captures the pointer, recenters the viewport around the pointer position, clamps it inside world bounds, and keeps emitting while dragging.

## Accessibility

The minimap is pointer-first and does not expose keyboard navigation. If it controls essential navigation, provide alternative pan buttons, keyboard shortcuts, or numeric camera fields.

## Gotchas

- `world.w` and `world.h` must be nonzero.
- `viewport.w` and `viewport.h` are used for centering and clamping.
- `label` is data only in the current implementation.
- This is not connected to Harbor `Canvas`; it is a generic minimap.

## Related

- `CanvasMinimap` for Harbor Canvas integration.
- `CanvasZoomControls` for viewport controls.
- `CanvasPanel` for floating canvas UI.
