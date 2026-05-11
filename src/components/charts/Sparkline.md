# Sparkline

`Sparkline` renders a tiny inline trend line with an optional area fill and last
point dot. It is meant for dense dashboards, metric cards, tables, and list rows
where users need quick directional context without opening a full chart.

Use it as a supporting visual next to a number. If users need axes, labels,
tooltips, comparison, or time navigation, use `TimeSeriesChart` instead.

## Import

```tsx
import { Sparkline } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
<MetricCard
  label="Requests"
  value="24.8k"
  delta={12}
  footer={
    <Sparkline
      data={[12, 14, 13, 18, 22, 19, 24, 28]}
      width={120}
      height={32}
    />
  }
/>
```

Use color to match the metric tone:

```tsx
<Sparkline
  data={errorRate}
  stroke="#f43f5e"
  fill="rgba(244,63,94,0.18)"
  showDot={false}
/>
```

## Props

- **data** - `number[]`. Required. Values are normalized between the minimum and
  maximum value in the array.
- **width** - `number`. SVG width in pixels. Default `100`.
- **height** - `number`. SVG height in pixels. Default `28`.
- **stroke** - `string`. Line color. Default `"#a855f7"`.
- **fill** - `string`. Area fill color used in a vertical gradient. Default
  `"rgba(168,85,247,0.15)"`.
- **showDot** - `boolean`. Shows a dot on the last data point. Default `true`.
- **className** - extra classes on the SVG.

## Data Model

The component calculates `min`, `max`, and range from the provided data. A flat
series uses a fallback range of `1` so it still renders without division errors.
An empty data array renders `null`.

The x-axis is evenly distributed across the SVG width. `Sparkline` does not know
timestamps; pass already-ordered values from your data layer.

## Accessibility

Sparklines are compact visual context, not a complete data table. Pair them with
the current value, label, and delta in nearby text. Do not rely on the line color
alone to communicate good or bad states.

If the trend is important for decisions, provide a larger chart, detail drawer,
or table where users can inspect exact values.

## Gotchas

- No axes, tooltips, or labels are rendered.
- Data is normalized to the local min/max, so two sparklines with different
  ranges are not directly comparable unless you explain the scale elsewhere.
- Very small `height` values can make flat data look more dramatic than it is.

## Related

- `MetricCard` for headline metrics.
- `TimeSeriesChart` for full trend charts.
- `LineChart` for labeled chart surfaces.
- `Donut` for proportional composition.
