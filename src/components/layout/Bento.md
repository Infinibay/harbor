# Bento

`Bento` is a responsive, container-aware grid for product surfaces made of tiles with different spans. Use it for overview dashboards, feature panels, media boards, metrics summaries, and any layout where not every tile should be the same size.

Unlike viewport-only grids, `Bento` measures its own container. That makes it work inside split panes, drawers, embedded previews, and documentation examples.

## Import

```tsx
import { Bento, BentoItem } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Card, MetricCard } from "@infinibay/harbor/display";
import { Bento, BentoItem } from "@infinibay/harbor/layout";

export function OverviewGrid() {
  return (
    <Bento columns={{ base: 2, md: 4, lg: 6 }} gap={12}>
      <BentoItem span={{ base: { col: 2 }, md: { col: 2 } }}>
        <MetricCard label="Requests" value="24.8k" delta={12} />
      </BentoItem>
      <BentoItem span={{ base: { col: 2 }, md: { col: 2 } }}>
        <MetricCard label="Errors" value="18" delta={-8} />
      </BentoItem>
      <BentoItem span={{ base: { col: 2 }, lg: { col: 4, row: 2 } }}>
        <Card title="Traffic">Chart or table content</Card>
      </BentoItem>
      <BentoItem span={{ base: { col: 2 }, lg: { col: 2, row: 2 } }}>
        <Card title="Incidents">Operational summary</Card>
      </BentoItem>
    </Bento>
  );
}
```

## Responsive Model

`columns` and item `span` accept either a single value or breakpoint object. Breakpoints are based on the grid container width:

```ts
type Span = { col?: number; row?: number };
type Responsive<T> = T | Partial<Record<"base" | "sm" | "md" | "lg" | "xl", T>>;
```

When a breakpoint is missing, Harbor falls back to the nearest smaller configured step.

## Props

### Bento

- **children**: `ReactNode`. Usually `BentoItem` children.
- **columns**: responsive column count. Defaults to `{ base: 2, md: 4, lg: 6 }`.
- **gap**: `number`. CSS grid gap in pixels. Defaults to `12`.
- **className**: custom class on the grid.

### BentoItem

- **span**: responsive `{ col?, row? }`. Controls grid column and row span.
- **children**: `ReactNode`.
- **className**: custom class on the rendered tile wrapper.

## Accessibility

`Bento` is layout only. Cards, buttons, charts, and regions inside each item keep their own semantics. Use headings inside larger tiles so the page remains navigable when the visual order becomes more complex.

## Gotchas

- Spans are capped to the current column count. A `col: 6` tile becomes `col: 2` on a two-column container.
- The grid uses `gridAutoRows: minmax(80px, auto)`, so row spans are most useful when tile content has stable height.
- Layout transitions use FLIP on breakpoint changes. Stable keys help animation quality.
- Do not use `Bento` for ordinary equal-card lists; `FluidGrid` is simpler.

## Related

- [`FluidGrid`](./FluidGrid.md) for equal responsive cards.
- [`Card`](../display/Card.md) for tile content.
- [`MetricCard`](../display/MetricCard.md) for dashboard stats.
