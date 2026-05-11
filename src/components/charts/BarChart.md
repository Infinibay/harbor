# BarChart

`BarChart` compares numeric values across categories. It supports vertical SVG bars for dashboard charts and horizontal rows for compact ranking lists. Use it for regional traffic, feature usage, revenue by plan, queue depth, error counts, or any small categorical comparison.

It is intentionally lightweight. For advanced axes, legends, stacked series, or tooltips, use a specialized charting layer or extend the component.

## Import

```tsx
import { BarChart } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
import { BarChart } from "@infinibay/harbor/charts";

const bars = [
  { id: "us-east", label: "US East", value: 412 },
  { id: "us-west", label: "US West", value: 287 },
  { id: "eu", label: "EU", value: 198, color: "#38bdf8" },
];

export function TrafficByRegion() {
  return (
    <BarChart
      bars={bars}
      height={240}
      formatValue={(value) => `${value} req/s`}
    />
  );
}
```

## Props

- **bars** - `Bar[]`. Required category values.
- **height** - `number`. SVG height for vertical charts. Default `220`.
- **orientation** - `"vertical" | "horizontal"`. Default `"vertical"`.
- **formatValue** - `(value: number) => string`. Formats axis and hover labels.
- **className** - extra classes on the wrapper.

## Bar Model

```ts
type Bar = {
  id: string;
  label: string;
  value: number;
  color?: string;
};
```

`value` is compared against the maximum value in the provided array. `color` overrides the default Harbor accent for that bar.

## Behavior

Vertical mode renders an SVG with horizontal guide lines, sampled axis labels, x-axis category labels, and a hover value above the active bar. Width grows with the number of bars and becomes horizontally scrollable.

Horizontal mode renders each bar as a row with a fixed label column, flexible bar track, and formatted value on the right.

## Accessibility

The current chart is visual and does not generate a data table or ARIA chart semantics. For customer-facing analytics, include a nearby table, summary text, or screen-reader-only list with the same values.

## Gotchas

- Empty `bars` produces a `max` fallback but has no visual content.
- Negative values are not supported.
- Long labels may truncate in horizontal mode and can overlap in dense vertical charts.
- Hover labels are pointer-only.

## Related

- `LineChart` for trends over ordered points.
- `Donut` for part-to-whole composition.
- `MetricCard` for headline values.
