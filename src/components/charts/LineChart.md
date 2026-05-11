# LineChart

`LineChart` renders one or more numeric series over a shared index axis. Use it for compact trend views where each value is aligned by position: daily counts, latency buckets, build duration by run, or revenue by month.

For timestamp-heavy telemetry with richer time semantics, use `TimeSeriesChart`. For a tiny inline trend inside a card or table cell, use `Sparkline`.

## Import

```tsx
import { LineChart } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
import { LineChart } from "@infinibay/harbor/charts";

export function LatencyTrend() {
  return (
    <LineChart
      labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      series={[
        { id: "p50", label: "p50", data: [42, 38, 51, 47, 49, 55, 60] },
        { id: "p99", label: "p99", data: [180, 165, 210, 220, 195, 240, 255] },
      ]}
      formatY={(value) => `${Math.round(value)}ms`}
    />
  );
}
```

## How It Works

The chart computes the y-domain from all series, pads that domain by 10 percent, then draws an SVG with horizontal grid lines, optional area fills, line paths, and hover hit zones. Hovering an index shows a vertical guide and values for every series at that index.

Every series should have the same number of points. `labels` are sampled so long arrays do not overload the x-axis.

## Props

- **series**: `LineSeries[]`. Required. Each series is `{ id, label?, color?, data: number[] }`.
- **labels**: `string[]`. Optional x-axis labels. Match by index.
- **height**: `number`. SVG height in pixels. Defaults to `220`.
- **yTicks**: `number`. Number of y-axis intervals. Defaults to `4`.
- **area**: `boolean`. Fill below each line. Defaults to `true`.
- **formatY**: `(v: number) => string`. Formats y ticks and hover values.
- **className**: custom class on the wrapper.

## Accessibility

The SVG exposes an image role and label, but charts still need surrounding text. Put the key conclusion in a card heading, caption, or adjacent metric so the chart is not the only source of meaning.

Do not rely on color alone when several series matter. Use explicit `label` values and keep the legend visible.

## Gotchas

- This is an index-axis chart, not a date parser.
- Series are expected to align by index. Mismatched lengths can produce confusing hover values.
- The SVG stretches horizontally with `preserveAspectRatio="none"`, which is useful in dashboards but not ideal for precise analytical charting.
- Empty series render a padded zero-domain chart. Prefer an explicit empty state if no data exists.

## Related

- [`TimeSeriesChart`](./TimeSeriesChart.md) for operational telemetry.
- [`Sparkline`](../display/Sparkline.md) for inline trends.
- [`MetricCard`](../display/MetricCard.md) for headline values beside a chart.
