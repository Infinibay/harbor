# PeekCard

Hover-to-expand card. The card grows in place revealing a `more` slot
while siblings inside `<PeekGrid>` reflow smoothly. Good for quick
previews of related items, search results, or thumbnails that benefit
from a peek without a click. For static cards use `<Card>`.

## Import

```tsx
import { PeekCard, PeekGrid } from "@infinibay/harbor/display";
```

## Example

```tsx
<PeekGrid cols={3}>
  <PeekCard
    title="Living UI library"
    description="Hover to peek at the details panel."
    media={<img src="/picture.png" alt="" />}
    more={<p>Detail content shown on hover.</p>}
  />
</PeekGrid>
```

## Props (`<PeekCard>`)

- **title** — `ReactNode`. Required. Always-visible heading.
- **description** — `ReactNode`. Subtitle under the title.
- **media** — `ReactNode`. Optional media slot above the body.
- **children** — `ReactNode`. Body content rendered above the
  expandable section.
- **more** — `ReactNode`. Required. Content revealed on hover/focus.
- **className** — extra classes on the wrapper.

## Props (`<PeekGrid>`)

- **children** — `ReactNode`. Required.
- **cols** — `2 | 3 | 4`. Default `3`. Grid breakpoint is `md`.
- **className** — extra classes on the grid.

## Notes

- Expansion is triggered by both pointer hover and keyboard focus
  (`onFocusCapture`).
- `framer-motion` `layout` is used for the in-place growth — wrap a row
  of cards in `<PeekGrid>` so neighbours reflow together.
