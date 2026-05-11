# CanvasPanel

`CanvasPanel` is a floating, draggable, collapsible panel for canvas-style applications. Use it for inspectors, layers, history, properties, color controls, minimaps, and tool settings that should hover above a pan or zoom surface.

The panel is designed for the `Canvas` overlay slot, where it stays fixed to the viewport instead of moving with world coordinates.

## Import

```tsx
import { CanvasPanel } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Canvas, CanvasItem, CanvasPanel } from "@infinibay/harbor/layout";

export function DiagramInspector() {
  return (
    <Canvas
      overlay={
        <CanvasPanel title="Inspector" width={260} closable>
          <div>Selected node properties</div>
        </CanvasPanel>
      }
    >
      <CanvasItem x={200} y={200}>Selected node</CanvasItem>
    </Canvas>
  );
}
```

## Props

- **title** - `ReactNode`. Required header label.
- **children** - `ReactNode`. Required panel body.
- **defaultPosition** - `{ x: number; y: number }`. Uncontrolled starting position. Default `{ x: 16, y: 16 }`.
- **position** - `{ x: number; y: number }`. Controlled position.
- **onPositionChange** - `(position) => void`. Called when dragging updates position.
- **width** - `number`. Panel width. Default `240`.
- **defaultCollapsed** - `boolean`. Starts with the body hidden.
- **closable** - `boolean`. Shows the close button.
- **onClose** - `() => void`. Called from the close button.
- **className** - extra classes on the panel.

## Behavior

Drag the header to move the panel. Buttons inside the header do not start a drag. The chevron toggles collapsed state with an animated body height. If `position` is provided, movement is controlled and only `onPositionChange` reports updates. Otherwise the panel stores its own position.

## Accessibility

Collapse and close controls have `aria-label` values. Dragging is mouse-based; there is no keyboard repositioning. If exact placement matters, expose position fields or reset controls elsewhere in your canvas UI.

## Gotchas

- The panel uses absolute positioning and expects an overlay or positioned parent.
- It does not clamp position to the viewport.
- Collapsed state is internal after mount.
- `onClose` does not hide the panel unless your parent removes it.

## Related

- `Canvas` for pan and zoom workspaces.
- `CanvasToolbar` for canvas command chrome.
- `MovablePanelLayout` for multi-panel application shells.
