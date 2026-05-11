# TimeSeriesChart

`TimeSeriesChart` renders one or more timestamped numeric series with axes, hover readouts, optional filled areas, stacked mode, brush selection, and annotation markers. It is the right Harbor chart for usage graphs, latency, billing, queue depth, revenue, health checks, or any metric that changes over time.

The component owns rendering and pointer interaction. Your application owns the data, domain, formatting, and what to do when a user selects a time range.

## Import

```tsx
import { TimeSeriesChart, TimeSeriesMarker } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
const data = [
  { t: Date.now() - 60_000 * 4, v: 42 },
  { t: Date.now() - 60_000 * 3, v: 48 },
  { t: Date.now() - 60_000 * 2, v: 44 },
  { t: Date.now() - 60_000, v: 63 },
  { t: Date.now(), v: 71 },
];

<TimeSeriesChart
  height={260}
  formatY={(v) => `${Math.round(v)} ms`}
  series={[
    { id: "p95", label: "P95 latency", color: "#a855f7", data },
  ]}
>
  <TimeSeriesMarker at={Date.now() - 60_000 * 2} label="Deploy" />
</TimeSeriesChart>
```

## Brush Selection

```tsx
<TimeSeriesChart
  series={series}
  onRangeSelect={(range) => {
    setTimeWindow(range);
    refetchMetrics(range);
  }}
/>
```

When `onRangeSelect` is present, brushing is enabled by default. Pass `brushEnabled={false}` if the chart should show hover details only.

## Props

- `series`: required array of `{ id, label?, color?, data }`.
- `xDomain`: explicit `{ from, to }` date range.
- `yDomain`: explicit `[min, max]` value range.
- `area`: fills under each line. Default is `true`.
- `stacked`: stacks later series over earlier series.
- `yTicks`: y-axis tick count. Default is `4`.
- `height`: chart height in pixels. Default is `240`.
- `formatY`: value formatter for axis and hover readout.
- `onRangeSelect`: receives the brushed date range.
- `brushEnabled`: overrides brush behavior.

## Markers

Render `TimeSeriesMarker` as a child for deploys, incidents, alerts, or billing cutoffs. It accepts `at`, `label`, `color`, and `stroke`.

## Accessibility

Use surrounding text to name the metric and current range. The chart is visual and pointer-driven, so pair important values with summaries, `MetricCard`, or a `DataTable` when the exact numbers must be accessible.

## Gotchas

Stacked mode assumes aligned timestamps across series. If your backend returns sparse data, normalize it before rendering. For server-side zoom, keep `xDomain` controlled and update it from `onRangeSelect`.

## Related

Use with `MetricCard`, `MetricHeatmap`, `TraceWaterfall`, `DataTable`, and `SnapshotTimeline`.
