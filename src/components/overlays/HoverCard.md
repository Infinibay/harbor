# HoverCard

A rich preview card that opens on hover after a delay — typically for
"@mention" peeks, link previews, or inline summaries. Compared to
`<Tooltip>`, the content is a styled card (multi-line, links, images)
and the user can move the cursor into it. For click-driven panels with
form controls use `<Popover>`.

## Import

```tsx
import { HoverCard } from "@infinibay/harbor/overlays";
```

## Example

```tsx
<HoverCard
  content={
    <div>
      <div className="font-medium">@ana</div>
      <p className="text-white/70">Engineer · Infrastructure</p>
    </div>
  }
>
  <a href="/u/ana">@ana</a>
</HoverCard>
```

## Props

- **children** — `ReactElement`. The trigger. Must accept a forwarded
  `ref` and mouse handlers — most native elements and Harbor primitives
  qualify.
- **content** — `ReactNode`. Card body.
- **side** — `"top" | "bottom"`. Default `"bottom"`.
- **delay** — `number` ms before opening on hover. Default `300`.
- **className** — extra classes on the card.

## Notes

- The card stays open while the cursor is over it; leaving either the
  trigger or the card schedules a 140ms close. This lets users move
  into the card to interact with links inside.
- Width is fixed at 280px to keep card geometry predictable; clamp
  longer text with the usual line-clamp utilities.
- Portals at `Z.HOVER_CARD`. Repositions on scroll and resize.
- Not focus-triggered — use `<Tooltip>` if keyboard-only users need to
  see the content.
