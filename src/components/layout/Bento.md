# Bento

Container-measured grid for "bento box" layouts where tiles span
varying numbers of columns and rows per breakpoint. Use this when
each child needs its own non-uniform footprint and you want tiles
to animate to their new positions when the container reflows
(including during a slow continuous window-drag). For uniform
cards, prefer `FluidGrid` (auto-fit by min width) or
`ResponsiveGrid` (viewport breakpoints, no measurement).

## Import

```tsx
import { Bento, BentoItem } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Bento columns={{ base: 2, md: 4, lg: 6 }} gap={12}>
  <BentoItem span={{ base: { col: 2, row: 2 }, md: { col: 2, row: 2 } }}>
    <Tile />
  </BentoItem>
  <BentoItem span={{ md: { col: 2, row: 1 } }}>
    <Tile />
  </BentoItem>
  <BentoItem>
    <Tile />
  </BentoItem>
</Bento>
```

## Props (`<Bento>`)

- **columns** — `number | Partial<Record<"base"|"sm"|"md"|"lg"|"xl", number>>`.
  Columns at each container-width step. Default `{ base: 2, md: 4, lg: 6 }`.
- **gap** — `number`. Pixel gap between tiles. Default `12`.
- **className** — extra classes on the grid wrapper.

## Props (`<BentoItem>`)

- **span** — `{ col?: number, row?: number }` or a per-breakpoint
  record of those. Defaults to `{ col: 1, row: 1 }`.
- **className** — extra classes on the cell wrapper.

## Notes

- Breakpoints are evaluated against the wrapper's measured width,
  not the viewport — safe inside drawers, panels, or split panes.
- Tiles use a manual FLIP transition keyed by the resolved step,
  so position changes animate smoothly across breakpoint crossings.
- A child's `col` is clamped to the resolved column count.
