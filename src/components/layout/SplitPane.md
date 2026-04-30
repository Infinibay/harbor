# SplitPane

Two-pane resizable layout with a draggable separator. Use it for
sidebar + content, editor + preview, or any "drag the gutter"
arrangement. Supports horizontal or vertical orientations and an
optional double-click-to-collapse on the first pane.

## Import

```tsx
import { SplitPane } from "@infinibay/harbor/layout";
```

## Example

```tsx
<SplitPane
  orientation="horizontal"
  initialSize={280}
  min={160}
  max={600}
  collapsible
  first={<Sidebar />}
  second={<Editor />}
/>
```

## Props

- **orientation** — `"horizontal" | "vertical"`. Default `"horizontal"`.
- **initialSize** — `number`. Pixel size of the first pane on
  mount. Default `280`.
- **min** — `number`. Lower bound while dragging. Default `160`.
- **max** — `number`. Upper bound while dragging. Default `600`.
- **collapsible** — `boolean`. Double-click the gutter to
  collapse / restore the first pane.
- **first** — `ReactNode`. Pane that owns the resizable size.
- **second** — `ReactNode`. Fills the remaining space.
- **className** — extra classes on the outer flex container.

## Notes

- The first pane animates with a spring on release; while
  dragging it tracks the cursor with zero duration so the gutter
  never feels laggy.
- The container uses `min-h-0 min-w-0` so the second pane can
  scroll independently — make sure the parent has a constrained
  height for vertical splits.
- Pointer capture is taken on `pointerdown`, so dragging keeps
  working even if the cursor leaves the gutter.
