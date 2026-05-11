# Skeleton

`Skeleton` renders a shimmering placeholder block while content is loading. Use it for initial page loads, cards, rows, avatars, charts, sidebars, and preview panels when the final layout is known but the data has not arrived yet.

The same module exports `SkeletonText`, a helper that renders multiple text-like lines with a shorter final line.

## Import

```tsx
import { Skeleton, SkeletonText } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<Card>
  <div className="flex items-center gap-3">
    <Skeleton circle width={40} height={40} />
    <div className="flex-1">
      <Skeleton height={14} width="45%" />
      <Skeleton className="mt-2" height={10} width="70%" />
    </div>
  </div>
</Card>
```

For text blocks:

```tsx
<SkeletonText lines={4} />
```

## Props

`Skeleton` accepts:

- **className** - optional string merged onto the root span.
- **circle** - optional boolean. Uses a full round shape instead of rounded rectangle.
- **width** - optional number or CSS string.
- **height** - optional number or CSS string.

`SkeletonText` accepts:

- **lines** - optional number. Defaults to `3`.

## Layout Guidance

Match the skeleton to the eventual content size as closely as possible. Good skeletons reduce layout shift because users see the shape of what is coming. Poor skeletons create a second layout that disappears and makes the page jump.

Use circles for avatars and icons, short rectangles for labels, wide rectangles for titles, and grouped lines for paragraphs.

## Accessibility

Skeletons are visual placeholders. Put loading semantics on the surrounding region when needed:

```tsx
<section aria-busy={loading} aria-label="Loading project summary">
  {loading ? <SkeletonText /> : <ProjectSummary />}
</section>
```

Do not announce every skeleton. If the app needs a status message, use a single `role="status"` message near the loading region.

## Gotchas

- Skeletons are for loading, not empty states or errors.
- Do not show skeletons forever. Swap to content, `EmptyState`, or `ErrorState`.
- Set dimensions explicitly when the parent does not constrain size.
- Avoid using many animated skeletons in very large virtualized lists.

## Related

- `LoadingOverlay` for blocking panel operations.
- `Spinner` for inline pending actions.
- `EmptyState` for successful empty content.
- `ErrorState` for failed loading.
