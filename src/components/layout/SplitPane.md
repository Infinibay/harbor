# SplitPane

`SplitPane` creates a resizable two-pane layout with a draggable gutter. Use it for file explorer plus editor, list plus detail, canvas plus inspector, settings navigation plus content, console plus output, and desktop-style workbenches.

The first pane has a controlled pixel size internally. The second pane fills the remaining space and scrolls independently.

## Import

```tsx
import { SplitPane } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { SplitPane } from "@infinibay/harbor/layout";

export function Workbench() {
  return (
    <SplitPane
      initialSize={280}
      min={180}
      max={520}
      collapsible
      first={<aside>Project files</aside>}
      second={<main>Editor surface</main>}
    />
  );
}
```

## Props

- **orientation** - `"horizontal" | "vertical"`. Default `"horizontal"`.
- **initialSize** - `number`. Initial first-pane size in pixels. Default `280`.
- **min** - `number`. Minimum first-pane size. Default `160`.
- **max** - `number`. Maximum first-pane size. Default `600`.
- **first** - `ReactNode`. Required first pane.
- **second** - `ReactNode`. Required second pane.
- **collapsible** - `boolean`. Allows double-clicking the gutter to collapse the first pane.
- **className** - extra classes on the root container.

## Behavior

Horizontal mode resizes width. Vertical mode resizes height. Pointer drag captures the gutter and updates size until pointer up. While dragging, animation duration is disabled. When not dragging, size changes use a spring transition.

If `collapsible` is true, double-clicking the separator toggles the first pane between its current size and `0`.

## Accessibility

The gutter uses `role="separator"` and sets `aria-orientation`. It does not implement keyboard resizing or `aria-valuenow`. If pane resizing is an important workflow, add keyboard shortcuts or explicit resize controls around it.

## Gotchas

- `min` and `max` are treated as pixels by the current implementation.
- Collapsing does not remember a separate restored size; it restores the current internal `size`.
- The component is uncontrolled after mount.
- The parent must provide a bounded height for vertical layouts and full-height workbenches.

## Related

- `AppShell` for full application frames.
- `MovablePanelLayout` for floating/resizable panels.
- `Sidebar` for fixed navigation panes.
