# Donut

`Donut` renders a compact proportional breakdown as an SVG ring with a legend
and optional center label. It is useful for capacity split, cost allocation,
resource mix, traffic share, user segments, or any small dataset where the
question is "what is the composition?"

Use it for high-level summaries. If users need exact comparison, trends, or many
categories, prefer a bar chart, table, or time-series chart.

## Import

```tsx
import { Donut } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
<Donut
  centerLabel="usage"
  centerValue="72%"
  slices={[
    { id: "vm", label: "VMs", value: 42 },
    { id: "db", label: "Database", value: 18 },
    { id: "cache", label: "Cache", value: 8 },
    { id: "queue", label: "Queue", value: 4 },
  ]}
/>
```

Provide explicit colors when the categories have product meaning:

```tsx
<Donut
  slices={[
    { id: "compute", label: "Compute", value: 58, color: "#38bdf8" },
    { id: "storage", label: "Storage", value: 26, color: "#a855f7" },
    { id: "network", label: "Network", value: 16, color: "#34d399" },
  ]}
/>
```

## Props

- **slices** - `DonutSlice[]`. Required. Values are summed to calculate each
  slice percentage.
- **size** - `number`. SVG width and height in pixels. Default `180`.
- **thickness** - `number`. Ring stroke width in pixels. Default `18`.
- **centerLabel** - `string`. Small label shown in the center when no slice is
  hovered.
- **centerValue** - `string`. Large value shown in the center when no slice is
  hovered.
- **className** - extra classes on the outer wrapper.

## DonutSlice

```ts
type DonutSlice = {
  id: string;
  label: string;
  value: number;
  color?: string;
};
```

If `color` is omitted, Harbor cycles through its default chart palette.

## Interaction

Hovering a slice or legend item highlights that category, dims the rest, and
updates the center label/value to the hovered slice percentage. The component
does not own selection state; hover is local and temporary.

The total is calculated from the provided values. If the total is zero, Harbor
uses `1` internally to avoid division errors, so zero-only data should be handled
with an empty state before rendering.

## Accessibility

The legend provides readable labels and percentages, so users are not forced to
interpret color alone. Keep slice labels short, and place exact values nearby
when precision matters.

Because hover changes the center text, do not put critical information only in
the hover state. Important totals should also appear in the surrounding card,
table, or description.

## Gotchas

- Donut charts become hard to read with many slices. Keep them to roughly two to
  six categories.
- Very small slices may be visually difficult to target. Consider grouping them
  into `Other`.
- Negative values are not meaningful for this chart; validate data before
  rendering.

## Related

- `BarChart` for exact category comparison.
- `TimeSeriesChart` for trends over time.
- `MetricCard` for the headline number next to the composition.
- `EmptyState` for zero or unavailable data.
