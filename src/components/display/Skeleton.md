# Skeleton

Shimmering placeholder block for loading states. `<SkeletonText>`
is a convenience wrapper that stacks several `<Skeleton>` rows with
the last line shortened to mimic a paragraph.

## Import

```tsx
import { Skeleton, SkeletonText } from "@infinibay/harbor/display";
```

## Example

```tsx
<Skeleton width="60%" height={12} />
<Skeleton circle width={48} height={48} />

<SkeletonText lines={4} />
```

## Props (`<Skeleton>`)

- **width** — `number | string`. CSS width. Pixels as number, any
  CSS unit as string (`"60%"`, `"12rem"`).
- **height** — `number | string`. CSS height.
- **circle** — `boolean`. Use `rounded-full` instead of
  `rounded-md` — for avatars, dots.
- **className** — extra classes on the span.

## Props (`<SkeletonText>`)

- **lines** — `number`. Number of rows. Default `3`. The last row is
  rendered at 60% width.

## Notes

- The shimmer comes from a global `.shimmer` class — make sure your
  Harbor theme CSS is loaded.
- The element is a `<span>` with `display: block`, so it nests
  cleanly inside text containers.
