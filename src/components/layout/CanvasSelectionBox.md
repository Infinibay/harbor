# CanvasSelectionBox

`CanvasSelectionBox` draws the visible bounding box around selected canvas
items. It is the selection affordance users expect in design tools, node
editors, whiteboards, workflow builders, and diagramming apps: a rectangle
around selected objects, optional resize handles, and drag callbacks for moving
or resizing the selection.

Use it inside a Harbor `Canvas` overlay. It reads canvas pan and zoom from
context, so the selection stays aligned while the viewport moves.

## Import

```tsx
import { CanvasSelectionBox } from "@infinibay/harbor/layout";
```

## Basic Usage

Pass selected ids and the item geometry. Coordinates are world-space canvas
coordinates, not screen pixels.

```tsx
<Canvas>
  <CanvasLayer>{nodes.map((node) => <Node key={node.id} node={node} />)}</CanvasLayer>
  <CanvasOverlay>
    <CanvasSelectionBox
      ids={selectedIds}
      items={nodes}
      onMove={(delta, phase) => moveSelection(delta, phase)}
    />
  </CanvasOverlay>
</Canvas>
```

## Resizing

Resize handles appear by default when exactly one item is selected. Override
with `showHandles`.

```tsx
<CanvasSelectionBox
  ids={[selectedNode.id]}
  items={nodes}
  padding={6}
  onResize={(change) => resizeNode(selectedNode.id, change)}
/>
```

`onResize` receives the handle corner, delta values in world units, and the
current phase: `drag` or `end`.

## Props

- `ids`: selected item ids.
- `items`: geometry objects containing id, x, y, width, and height.
- `onMove`: called while the selected box is dragged.
- `onResize`: called while a resize handle is dragged.
- `showHandles`: force handle visibility.
- `padding`: extra world-space padding around the computed box.
- `className`: wrapper class override.

## How It Works

The component computes a bounding rectangle from all selected items. Motion
values subscribe to canvas pan and zoom so the DOM selection box follows the
canvas without rerendering every frame. It returns `null` when there is no canvas
context or no selected ids.

## Accessibility

The selection box is a pointer affordance and renders as `aria-hidden`. Provide
keyboard alternatives in your editor: arrow-key nudging, inspector fields for
position and size, command-palette actions, or toolbar buttons for alignment.

Do not make the selection rectangle the only way to understand selection state.
Selected objects should also have visual state or inspector context.

## Gotchas

Render it in an overlay layer above canvas content. If it sits in normal document
flow, it cannot align with pan and zoom correctly.

`onMove` and `onResize` deltas are world-space units. Convert them only if your
application stores geometry in a different coordinate system.

## Related

- `Canvas` for viewport context.
- `CanvasMarquee` for drag-to-select.
- `CanvasSnapGuides` for alignment feedback.
- `CanvasAlignmentToolbar` for keyboard and toolbar alignment actions.
