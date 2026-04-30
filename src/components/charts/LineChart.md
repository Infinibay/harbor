# LineChart

Multi-series line chart over an indexed x axis (categorical labels, not timestamps). Use when your x is a sequence of named buckets ("Mon"…"Sun"); for real timestamps with brushing, markers, and stacking use `TimeSeriesChart`. For a tiny inline trend indicator use `Sparkline`.

## Import

```tsx
import { LineChart } from "@infinibay/harbor/charts";
```

## Example

```tsx
<LineChart
  labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
  series={[
    { id: "p50", label: "p50", data: [42, 38, 51, 47, 49, 55, 60] },
    { id: "p99", label: "p99", data: [180, 165, 210, 220, 195, 240, 255] },
  ]}
  formatY={(v) => `${v}ms`}
/>
```

## Props

- **series** — `LineSeries[]`. Each `{ id, label?, color?, data: number[] }`. Series share the same index axis.
- **labels** — `string[]`. X-axis labels (one per index). Sampled to ~6 visible.
- **height** — chart height in px. Default: `220`.
- **yTicks** — number of horizontal grid lines. Default: `4`.
- **area** — fill below each line with a vertical gradient. Default: `true`.
- **formatY** — y-tick + tooltip value formatter. Default: rounded number.
- **className** — wrapper class.

## Notes

- SVG `viewBox` is fixed at 600 × `height` and stretches to fit the container.
- Hovering a vertical hit-zone shows a dashed crosshair, point markers, and a legend strip with the value at that index.
- Y domain auto-pads by 10 % on each side so peaks aren't flush with the edge.
- Default palette cycles through 5 colors when `series.color` is unset.
