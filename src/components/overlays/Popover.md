# Popover

`Popover` opens interactive floating content from a trigger element. It renders
content in a portal, positions it relative to the trigger, closes on outside
click, and supports preferred side and alignment.

Use it for compact menus, quick actions, small forms, date/calendar surfaces,
inline settings, and contextual details that need controls. For non-interactive
hover text, use `Tooltip`.

## Import

```tsx
import { Popover } from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
<Popover
  side="bottom"
  align="end"
  content={
    <div className="grid gap-2">
      <Button variant="ghost">Rename</Button>
      <Button variant="ghost">Duplicate</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  }
>
  <Button variant="secondary">Actions</Button>
</Popover>
```

## Props

- **children** - `ReactElement`. Required trigger element. It must accept a ref
  and click handler.
- **content** - `ReactNode`. Required popover body.
- **side** - `"top" | "bottom" | "left" | "right"`. Preferred side. Default
  `"bottom"`.
- **align** - `"start" | "center" | "end"`. Horizontal alignment for top/bottom
  placement. Default `"center"`.
- **className** - extra classes on the floating surface.

## Behavior

`Popover` clones its child and toggles open state from the child's click. While
open, it measures the trigger and popover rectangles, then positions the portal
with fixed coordinates. It recomputes on scroll and resize.

Clicking outside the trigger and popover closes it. The component does not own
the state externally; open state is internal.

## Accessibility

Use a real button as the trigger and give it a descriptive label. Content can be
interactive, so keep focus order logical and make sure important actions have
visible labels.

This component does not currently implement full ARIA menu/dialog semantics or
focus trapping. For complex forms, destructive confirmations, or modal workflows,
use `Dialog` or `Drawer`.

## Gotchas

- The trigger must be a single element that can receive a ref.
- Placement does not auto-flip at viewport edges.
- Open state is not controlled from the outside.
- Because the trigger is cloned, be careful with custom components that do not
  forward refs or merge event handlers.

## Related

- `Tooltip` for non-interactive hints.
- `HoverCard` for hover previews.
- `Menu` for command lists.
- `Dialog` and `Drawer` for larger interactive surfaces.
