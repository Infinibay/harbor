# Tooltip

A small, single-line label that appears on hover or focus. Use it to
clarify icon buttons or surface keyboard shortcuts. The tooltip is
non-interactive (`pointer-events: none`) — for richer hover content
use `<HoverCard>`, and for click-driven panels use `<Popover>`.

## Import

```tsx
import { Tooltip } from "@infinibay/harbor/overlays";
```

## Example

```tsx
<Tooltip content="Saves and exits the editor" side="top">
  <IconButton icon={<SaveIcon />} aria-label="Save" />
</Tooltip>
```

## Props

- **children** — `ReactElement`. The trigger. Must accept a forwarded
  `ref` plus mouse and focus handlers.
- **content** — `ReactNode`. Tooltip body. Wraps to a single line —
  prefer short copy.
- **side** — `"top" | "bottom" | "left" | "right"`. Default `"top"`.
- **delay** — `number` ms before opening on hover. Default `250`.
  Focus opens the tooltip immediately regardless of `delay`.

## Notes

- Triggers on `mouseenter` / `focus`; closes on `mouseleave` / `blur`.
  No outside-click handling because the tooltip never traps focus.
- Always pair an icon-only trigger with `aria-label` — the tooltip
  text is visual only and isn't read by screen readers.
- Portals at `Z.TOOLTIP`, the highest layer in the stack. Repositions
  on scroll and resize.
