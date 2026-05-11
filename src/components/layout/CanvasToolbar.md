# CanvasToolbar

`CanvasToolbar` is the floating tool rail for canvas-based apps: design editors,
node builders, whiteboards, workflow tools, diagramming surfaces, and visual
automation products. It renders icon buttons, active state, disabled state,
shortcuts, dividers, and an optional title block.

Use it inside a `Canvas` overlay so tools stay pinned while the world pans and
zooms.

## Import

```tsx
import { CanvasToolbar } from "@infinibay/harbor/layout";
```

## Basic Usage

Provide tool items with stable ids, icons, labels, and click handlers.

```tsx
<CanvasToolbar
  items={[
    { id: "select", icon: <MousePointerIcon />, label: "Select", shortcut: "V", active: tool === "select", onClick: () => setTool("select") },
    { id: "frame", icon: <FrameIcon />, label: "Frame", shortcut: "F", active: tool === "frame", onClick: () => setTool("frame") },
    { id: "text", icon: <TypeIcon />, label: "Text", shortcut: "T", onClick: () => setTool("text") },
  ]}
/>
```

## Placement

Use `position` when the toolbar floats in an overlay. Set `floating={false}` for
inline toolbars in inspectors or panels.

```tsx
<CanvasToolbar orientation="horizontal" position="top" items={items} />
<CanvasToolbar floating={false} orientation="horizontal" items={items} />
```

## Props

- `items`: required tool item array.
- `orientation`: `vertical` or `horizontal`; defaults to `vertical`.
- `floating`: absolute overlay placement; defaults to `true`.
- `position`: `top`, `bottom`, `left`, or `right`.
- `title`: optional toolbar title.
- `className`: wrapper class override.

Each item includes `id`, `icon`, optional `label`, optional `shortcut`, optional
`active`, optional `disabled`, optional `onClick`, and optional `divider`.

## Accessibility

Tool buttons expose labels and pressed state. Always pass `label`, even when the
visual UI is icon-only. Keep shortcuts visible through the `title` text or in a
separate `CanvasShortcuts` panel.

## Gotchas

The toolbar is pointer-enabled by design. Render it in an overlay region above
the canvas, not inside the transformed world layer.

Use `active` for modes, not one-shot commands. A delete or export button should
not remain pressed after it runs.

## Related

- `Canvas` for the workspace.
- `CanvasSelectionBox` for selected objects.
- `CanvasAlignmentToolbar` for alignment actions.
- `CanvasShortcuts` for keyboard help.
