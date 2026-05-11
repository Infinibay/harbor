# CanvasMarquee

`CanvasMarquee` adds rubber-band selection to a Harbor `Canvas`. It listens for a left-button drag on empty canvas space, draws the marquee rectangle in screen space, converts that rectangle into world coordinates, and optionally hit-tests items for you.

Use it in diagram editors, whiteboards, layout builders, topology maps, and workflow canvases where users expect drag-to-select.

## Import

```tsx
import { CanvasMarquee, rectContains } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Canvas, CanvasItem, CanvasMarquee } from "@infinibay/harbor/layout";

export function WorkflowCanvas({ nodes }) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Canvas>
      {nodes.map((node) => (
        <CanvasItem key={node.id} id={node.id} x={node.x} y={node.y}>
          <NodeCard selected={selected.includes(node.id)} />
        </CanvasItem>
      ))}

      <CanvasMarquee
        items={nodes}
        onSelectionDrag={setSelected}
        onSelection={setSelected}
      />
    </Canvas>
  );
}
```

## How It Works

The visual rectangle is portalled into the canvas viewport so it remains aligned to the screen while the canvas world may be panned or zoomed. Emitted rectangles are normalized world-space rectangles:

```ts
type CanvasMarqueeRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

When `items` are provided, each item is tested by rectangle intersection and the matching ids are emitted during drag and on release.

## Props

- **onDrag**: `(rect: CanvasMarqueeRect) => void`. Live world-space rect.
- **onSelect**: `(rect: CanvasMarqueeRect) => void`. Final world-space rect.
- **items**: `ReadonlyArray<{ id: string; x: number; y: number; width?: number; height?: number }>` for built-in hit testing.
- **onSelectionDrag**: `(ids: string[]) => void`. Live selected ids. Requires `items`.
- **onSelection**: `(ids: string[]) => void`. Final selected ids. Requires `items`.
- **modifier**: `"none" | "shift" | "alt" | "ctrl"`. Defaults to `"none"`.
- **enabled**: `boolean`. Defaults to `true`.
- **className**: custom class on the marquee rectangle.

## Accessibility

Marquee selection is mouse-driven. Provide equivalent keyboard selection actions with `CanvasShortcuts`, tree/list sidebars, or toolbar buttons for select all, clear selection, and movement.

Interactive canvas children should opt out of marquee start behavior by using normal `CanvasItem` bounds or `data-canvas-no-marquee` on handles and panel chrome.

## Gotchas

- `CanvasMarquee` requires `Canvas` context. Outside a `Canvas`, it renders nothing.
- It uses mouse events, not pointer events, so touch selection needs a separate tool.
- Drag starts only on empty viewport space. Elements marked `data-canvas-bounds` or `data-canvas-no-marquee` are ignored.
- Item dimensions default to `0`, which only works for point-like hit targets. Provide `width` and `height` for real cards.

## Related

- [`Canvas`](./Canvas.md) for the viewport and world transform.
- [`CanvasShortcuts`](./CanvasShortcuts.md) for keyboard selection actions.
- [`CanvasSelectionBox`](./CanvasSelectionBox.md) for selected-object affordances.
