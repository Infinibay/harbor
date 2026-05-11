# PeekCard

`PeekCard` is a hover and focus card that expands in place to reveal extra detail. It is useful when a list or grid should stay scannable, but users may want a quick preview before clicking through.

Use it for search results, template galleries, related resources, media thumbnails, marketplace items, and compact documentation cards. For always-visible content, use `Card`.

## Import

```tsx
import { PeekCard, PeekGrid } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { PeekCard, PeekGrid } from "@infinibay/harbor/display";

export function TemplateGallery() {
  return (
    <PeekGrid cols={3}>
      <PeekCard
        title="SaaS dashboard"
        description="Metrics, filters, charts, and user actions."
        media={<img src="/picture.png" alt="" />}
        more={<p>Includes a sidebar, page header, metric cards, and a data table.</p>}
      />
      <PeekCard
        title="Admin console"
        description="Users, billing, audit trail, and approvals."
        more={<p>Use this when operators need dense tables and side panels.</p>}
      />
    </PeekGrid>
  );
}
```

## Props

- **title** - `ReactNode`. Required visible heading.
- **description** - `ReactNode`. Optional subtitle under the title.
- **media** - `ReactNode`. Optional media slot above the body.
- **children** - `ReactNode`. Always-visible body content above the peek area.
- **more** - `ReactNode`. Required content revealed while the card is open.
- **className** - extra classes on the card wrapper.

## PeekGrid Props

- **children** - `ReactNode`. Required list of cards.
- **cols** - `2 | 3 | 4`. Default `3`. Applies the responsive column count at the `md` breakpoint.
- **className** - extra classes on the grid.

## Behavior

The card opens on pointer hover and on focus capture. It closes when the pointer leaves or focus leaves the card. `framer-motion` layout animation lets the card grow while adjacent cards reflow. `PeekGrid` gives siblings the same layout context, which is why grids feel smoother than isolated cards.

## Accessibility

Focus opens the peek content, so keyboard users can reach hidden detail when the card or an interactive child receives focus. The card itself is a `div`, not a link or button. If the card should navigate, place a visible link or button inside the card instead of relying on the whole surface.

## Gotchas

- Hover-only discovery is easy to miss. Keep essential information visible in `title`, `description`, or `children`.
- The card uses `cursor-pointer` even though it is not inherently clickable.
- Large `more` content can cause significant grid reflow.
- On touch devices, prefer an explicit details action if the peek content matters.

## Related

- `Card` for static framed content.
- `HoverCard` for floating contextual previews.
- `MasonryGrid` for uneven content grids.
