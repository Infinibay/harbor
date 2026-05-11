# CanvasBrush

`CanvasBrush` adds a freehand pen tool to Harbor `Canvas`. It listens for left-button drag on empty canvas space, converts pointer coordinates into world coordinates, previews the stroke while drawing, and emits a final SVG path on release.

Use it for annotation layers, whiteboards, diagram markups, review tools, and canvas products that need lightweight sketching.

## Import

```tsx
import {
  Canvas,
  CanvasBrush,
  type BrushStroke,
} from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { useState } from "react";
import { Canvas, CanvasBrush, type BrushStroke } from "@infinibay/harbor/layout";

export function AnnotatedCanvas() {
  const [tool, setTool] = useState<"select" | "draw">("select");
  const [strokes, setStrokes] = useState<BrushStroke[]>([]);

  return (
    <Canvas>
      <svg style={{ position: "absolute", overflow: "visible", width: 0, height: 0 }}>
        {strokes.map((stroke, index) => (
          <path
            key={index}
            d={stroke.d}
            stroke={stroke.color}
            strokeWidth={stroke.thickness}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>

      <CanvasBrush
        enabled={tool === "draw"}
        color="#a855f7"
        thickness={3}
        smoothing={0.55}
        onStroke={(stroke) => setStrokes((current) => [...current, stroke])}
      />
    </Canvas>
  );
}
```

## Stroke Model

```ts
type BrushStroke = {
  d: string;
  color: string;
  thickness: number;
};
```

`d` is an SVG path string in canvas world coordinates. Store strokes in your own state and render them inside the canvas as SVG paths.

## Props

- **enabled**: `boolean`. Enables or disables listening. Defaults to `true`.
- **thickness**: `number`. Stroke width. Defaults to `2`.
- **color**: `string`. Stroke color. Defaults to `"#fff"`.
- **smoothing**: `number`. Catmull-Rom smoothing tension, from angular `0` to smooth `1`. Defaults to `0.5`.
- **onStroke**: `(stroke: BrushStroke) => void`. Called on pointer release when at least two points were collected.

## Accessibility

Freehand drawing is pointer-driven. Provide alternate annotation controls when drawing is required for task completion: text notes, shape tools, keyboard shortcuts, or upload/comment workflows.

## Gotchas

- `CanvasBrush` requires `Canvas` context. Outside a canvas it has no viewport to listen to.
- The component uses mouse events. Touch and stylus-specific pressure are not implemented.
- Drag starts only on empty canvas. Elements marked `data-canvas-bounds` or `data-canvas-no-marquee` are ignored.
- It emits the path only on release; it does not store strokes for you.

## Related

- [`Canvas`](./Canvas.md) for the world/viewport transform.
- [`CanvasMarquee`](./CanvasMarquee.md) for drag selection.
- [`CanvasToolbar`](./CanvasToolbar.md) for tool switching.
