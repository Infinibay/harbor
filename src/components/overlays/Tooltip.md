# Tooltip

`Tooltip` shows short contextual help when a user hovers or focuses a child
element. It positions the floating label in a portal, supports four sides, and
uses a delay for pointer hover so tooltips do not flash while users move across
the interface.

Use it for icon buttons, dense toolbar controls, abbreviated statuses, and
non-obvious values. Do not use it for essential instructions that must always be
visible.

## Import

```tsx
import { Tooltip } from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
<Tooltip content="Deploy to production" side="bottom">
  <Button aria-label="Deploy" icon={<RocketIcon />} />
</Tooltip>
```

With text content:

```tsx
<Tooltip content="This filter only applies to active projects">
  <Badge>Active only</Badge>
</Tooltip>
```

## Props

- **content** - `ReactNode`. Required. Short tooltip body.
- **side** - `"top" | "bottom" | "left" | "right"`. Preferred side. Default
  `"top"`.
- **delay** - `number`. Hover delay in milliseconds. Default `250`.
- **children** - `ReactElement`. Required. The single element that receives
  hover and focus handlers.

## Behavior

`Tooltip` clones its child to attach refs and event handlers. On hover, it opens
after `delay`. On focus, it opens immediately. On blur or mouse leave, it closes.

The tooltip is rendered in a portal with Harbor's tooltip z-index and recalculates
position on scroll and resize while open.

## Accessibility

Focus opens the tooltip, so keyboard users can access the same contextual text as
pointer users. The child still needs its own accessible name. A tooltip is not a
replacement for `aria-label` on an icon-only button.

Keep tooltip content brief. If the user needs paragraphs, actions, or rich
interactive content, use `Popover` or `HoverCard`.

## Gotchas

- `children` must be a single React element that can receive a ref and event
  handlers.
- The tooltip is pointer-events none, so it cannot contain interactive content.
- Placement does not currently auto-flip when near viewport edges.
- Tooltip text should supplement visible UI, not hide required instructions.

## Related

- `Popover` for interactive floating content.
- `HoverCard` for richer hover previews.
- `Button` and `Toolbar` for icon-heavy command surfaces.
- `Badge` for short inline statuses that may need extra context.
