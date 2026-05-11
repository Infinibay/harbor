# CanvasAlignmentToolbar

`CanvasAlignmentToolbar` provides alignment and distribution commands for selected canvas items. It is designed for diagram editors, UI builders, whiteboards, flowchart tools, and any canvas where multiple objects can be selected and aligned.

The toolbar does not own your canvas state. It computes new positions and hands them back to your app.

## Import

```tsx
import { CanvasAlignmentToolbar } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { CanvasAlignmentToolbar } from "@infinibay/harbor/layout";

<CanvasAlignmentToolbar
  ids={selectedIds}
  items={nodes}
  onChange={(positions) => {
    setNodes((current) =>
      current.map((node) => {
        const next = positions.get(node.id);
        return next ? { ...node, x: next.x, y: next.y } : node;
      }),
    );
  }}
/>
```

## Props

- **ids** - `ReadonlySet<string> | string[]`. Selected item ids.
- **items** - `ReadonlyArray<IdRect>`. All available items with `id`, `x`, `y`, `width`, and `height`.
- **onChange** - `(positions: Map<string, { x: number; y: number }>) => void`. Receives positions to apply.
- **showLabels** - `boolean`. Shows text labels beside icons.
- **className** - extra classes on the toolbar wrapper.

## Operations

The toolbar supports left, horizontal center, right, top, vertical center, bottom, horizontal distribution, and vertical distribution. Align operations require at least two selected items. Distribution requires at least three.

Disabled buttons remain visible, which teaches users what becomes available after selecting more objects.

## Behavior

The component filters `items` by `ids`, calls pure helpers from `canvas-snap.ts`, and returns only the positions that need updating. Your app remains responsible for applying those positions, preserving undo history, and syncing selection state.

## Accessibility

Each command is a button with `title` and `aria-label`. Icons are inline SVGs. If your app supports keyboard-first editing, expose equivalent shortcuts and list them in `ShortcutSheet`.

## Gotchas

- Items without ids cannot be selected.
- Width and height must be accurate for alignment math.
- `onChange` does not mutate your data.
- Distribution order follows item geometry from the helper functions.

## Related

- `CanvasSelectionBox` for visible selection bounds.
- `CanvasSnapGuides` for drag-time alignment hints.
- `CanvasToolbar` for editor command groups.
