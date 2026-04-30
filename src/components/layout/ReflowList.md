# ReflowList

Horizontal flex list that wraps on overflow, with smooth FLIP
animations as items are pushed between rows. Reach for it on
toolbars, chip rows, avatar stacks, or nav bars where shrinking
the viewport should slide the trailing items down rather than
snap them. For uniform-cell grids, use `FluidGrid`; for
direction-changing layouts, use `ResponsiveStack`.

## Import

```tsx
import { ReflowList } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ReflowList gap={8} align="center">
  <Chip>All</Chip>
  <Chip>Open</Chip>
  <Chip>Closed</Chip>
  <Chip>Archived</Chip>
</ReflowList>
```

## Props

- **gap** — `number`. Pixel gap between items. Default `8`.
- **align** — `"start" | "center" | "end" | "stretch"`. Default `"center"`.
- **justify** — `"start" | "center" | "end" | "between"`. Default `"start"`.
- **wrap** — `boolean`. Items wrap when they don't fit. Default `true`.
- **className** — extra classes on the wrapper.

## Notes

- Reflow detection buckets the container width to ~64px steps,
  so animations only fire on meaningful changes — slow continuous
  drags still animate, but mouse jitter does not.
- Uses a manual FLIP transition keyed on the bucket; ensure
  children have stable `key`s for best results.
