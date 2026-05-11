# MetricCard

`MetricCard` is the dashboard tile for one important number: revenue, latency,
error rate, cache hit rate, queue depth, deployment count, or any other metric
that needs to be scanned in a grid. It combines a label, a formatted value, an
optional unit, a percent delta chip, threshold coloring, and a compact sparkline.

Use it when the card is about monitoring state. If the content is a generic
summary, use `Card`; if the user needs to compare many rows, use `DataTable` or
`MetricHeatmap`.

## Import

```tsx
import { MetricCard } from "@infinibay/harbor/display";
```

## Basic Usage

Start with a label and an already-formatted value. Harbor does not guess how
your business numbers should be rounded; format the value before passing it.

```tsx
<MetricCard
  label="Requests"
  value="24.8k"
  delta={12}
  series={[18, 21, 20, 24, 27, 26, 31, 35]}
/>
```

The `delta` prop is a percent change. Positive values render an upward chip;
negative values render a downward chip.

```tsx
<MetricCard label="Errors" value="18" delta={-8} />
```

## Thresholds

Pass `threshold={[warn, danger]}` when a metric needs a visual status. The
component compares `raw` first, then falls back to `value` if `value` is a
number. Use `raw` whenever the displayed value is formatted text.

```tsx
<MetricCard
  label="Error rate"
  value="4.2"
  unit="%"
  raw={4.2}
  threshold={[2, 5]}
/>
```

For metrics where lower is worse, set `inverseThreshold`.

```tsx
<MetricCard
  label="Cache hit rate"
  value="91"
  unit="%"
  raw={91}
  threshold={[95, 90]}
  inverseThreshold
/>
```

## Props

- `label`: required text shown above the value.
- `value`: required `ReactNode`; pass the exact formatted display.
- `unit`: small muted unit after the value.
- `delta`: percent change number; `12` means 12 percent.
- `series`: number array rendered as a small `Sparkline` when it has multiple values.
- `icon`: optional leading icon beside the label.
- `threshold`: `[warn, danger]` numeric bands.
- `raw`: numeric value used for threshold comparison.
- `inverseThreshold`: reverses threshold logic so lower values are worse.
- `onClick`: makes the card interactive for drill-down workflows.
- `className`: wrapper class override.

## Accessibility

When `onClick` is present the component renders as an interactive card. Use it
for a real drill-down action, such as opening a dashboard route, metric drawer,
or filtered table. The visible label and value should be enough for screen
reader users to understand what the metric represents.

Do not rely on threshold color alone. If the metric is dangerous, pair the card
with visible text, a status badge, or an alert elsewhere in the dashboard.

## Gotchas

`value="24.8k"` cannot be compared against thresholds unless you also pass
`raw={24800}`. The threshold engine only compares numbers.

Keep metric grids stable. Mixing cards with and without sparklines can create
uneven scanning rhythm; use consistent card density within one dashboard band.

## Related

- `Sparkline` for the inline trend visual used by `MetricCard`.
- `Gauge` for progress toward a fixed target.
- `TimeSeriesChart` when the trend needs axes, labels, and interaction.
- `Card` for non-metric summaries.
