# BarChart

Categorical bar chart with vertical or horizontal orientation, hover tooltips, and per-bar color overrides. Use when you have a small set of named categories to compare; for time series prefer `LineChart` / `TimeSeriesChart`.

## Import

```tsx
import { BarChart } from "@infinibay/harbor/charts";
```

## Example

```tsx
<BarChart
  bars={[
    { id: "us-east", label: "US East", value: 412 },
    { id: "us-west", label: "US West", value: 287 },
    { id: "eu", label: "EU", value: 198, color: "#38bdf8" },
    { id: "apac", label: "APAC", value: 96 },
  ]}
  formatValue={(v) => `${v} req/s`}
/>
```

## Props

- **bars** — `Bar[]`. Each `{ id, label, value, color? }`.
- **height** — `number`. Chart height in px (vertical only). Default: `220`.
- **orientation** — `"vertical" | "horizontal"`. Default: `"vertical"`.
- **formatValue** — `(v: number) => string`. Tick + tooltip formatter. Default: rounded number.
- **className** — wrapper class.

## Notes

- SVG-rendered. Vertical mode horizontally scrolls when `bars.length * 40` exceeds container width — width grows with bar count.
- Default fill is `#a855f7`; override per bar via `color`.
- Y-axis baseline ticks at 0, 25, 50, 75, 100 % of the data max.
- Hover reveals the formatted value above the bar (vertical) or a soft outline (horizontal).
