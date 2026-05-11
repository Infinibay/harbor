# Gauge

`Gauge` renders a semicircular meter with threshold-based color, needle, numeric
value, optional unit, and label. It is useful for health, CPU, memory, latency,
quota pressure, risk scores, and other bounded measurements.

Use it for quick status reading. For trends or exact historical analysis, pair it
with a chart or table.

## Import

```tsx
import { Gauge } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
<Gauge value={72} min={0} max={100} label="CPU" unit="%" />
```

Custom thresholds:

```tsx
<Gauge
  value={240}
  max={500}
  label="p99 latency"
  unit="ms"
  thresholds={[
    { at: 0, color: "#34d399" },
    { at: 0.5, color: "#fbbf24" },
    { at: 0.8, color: "#f87171" },
  ]}
/>;
```

## Props

- **value** - `number`. Required current value.
- **min** - `number`. Minimum bound. Default `0`.
- **max** - `number`. Maximum bound. Default `100`.
- **label** - `string`. Optional label under the value.
- **unit** - `string`. Optional unit beside the value.
- **size** - `number`. SVG gauge width in pixels. Default `180`.
- **thresholds** - `{ at: number; color: string }[]`. Thresholds use normalized
  positions from `0` to `1`.
- **className** - extra classes on the wrapper.

## Behavior

The value is normalized between `min` and `max`, clamped from `0` to `1`, and
used to draw a 180-degree arc plus needle. The active color is the last threshold
whose `at` is less than or equal to the normalized value.

## Accessibility

The numeric value, unit, and label render as text. Do not rely on arc color alone
to communicate status; include labels or adjacent status copy when the value is
actionable.

## Gotchas

- `max` must be greater than `min`.
- Thresholds are normalized percentages, not raw domain values.
- The value is rounded for display.
- Gauges are poor for comparing many items; use bars or tables for that.

## Related

- `MetricCard` for headline numbers.
- `Progress` for linear bounded progress.
- `TimeSeriesChart` for historical trends.
- `BarChart` for comparing many values.
