# FluidGrid

Auto-fit grid that picks its column count from the container's
measured width and a `minItemWidth`. Use when every child has the
same shape and you want columns to materialize as space allows —
classic for card decks, photo grids, dashboards. For non-uniform
spans use `Bento`; for media-query columns without runtime
measurement use `ResponsiveGrid`.

## Import

```tsx
import { FluidGrid } from "@infinibay/harbor/layout";
```

## Example

```tsx
<FluidGrid minItemWidth={220} gap={16}>
  <Card />
  <Card />
  <Card />
  <Card />
</FluidGrid>
```

## Props

- **minItemWidth** — `number`. Pixel floor for a child before
  wrapping to a new column. Default `220`.
- **maxColumns** — `number`. Cap on resolved columns; `0` means
  unlimited. Default `0`.
- **gap** — `number`. Pixel gap between children. Default `16`.
- **animate** — `boolean`. Animate position changes when columns
  reflow. Default `true`.
- **className** — extra classes on the grid wrapper.

## Notes

- Column count is recomputed from the container, not the viewport —
  safe inside drawers, split panes, or animated tabs.
- When `animate` is on, children FLIP between cells on every
  column-count change, so slow window drags stay smooth.
- Internally uses `repeat(N, minmax(0, 1fr))`, so children fill
  evenly rather than stair-stepping like `auto-fit`.
