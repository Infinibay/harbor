# MetricHeatmap

Sparse 2-D categorical heatmap over named rows × columns with a cold-mid-hot color scale. Use for hour-of-day × day-of-week density, region × instance-type spend, etc. Distinct from a calendar heatmap (which is shaped like a calendar grid) — this one is a generic matrix view.

## Import

```tsx
import { MetricHeatmap } from "@infinibay/harbor/charts";
```

## Example

```tsx
<MetricHeatmap
  rows={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
  cols={["00", "04", "08", "12", "16", "20"]}
  cells={[
    { r: 0, c: 2, v: 0.4 },
    { r: 0, c: 3, v: 0.9 },
    { r: 1, c: 3, v: 1.2 },
    { r: 2, c: 4, v: 0.7 },
    { r: 4, c: 5, v: 1.5 },
  ]}
  formatV={(v) => `${v.toFixed(2)} req/s`}
/>
```

## Props

- **rows** — `string[]`. Row labels, top-to-bottom.
- **cols** — `string[]`. Column labels, left-to-right.
- **cells** — `readonly HeatmapCell[]`. Sparse `{ r, c, v }`. Missing pairs render empty.
- **formatV** — formatter for the value in tooltip + scale legend. Default: `v.toFixed(2)`.
- **scale** — `{ min?, mid?, max? }` color anchors. Default: data min/max with mid at midpoint.
- **onCellClick** — `(cell, { r, c }) => void`. `cell` is `null` if there's no data for that cell.
- **cellSize** — pixel size of each cell. Default: `22`.
- **className** — wrapper class.

## Notes

- Color scale is two-leg: cold → mid (sky-blue → fuchsia) below `mid`, mid → hot (fuchsia → rose) above.
- Out-of-bounds cells (`r` / `c` outside the labels) are silently dropped.
- A status line under the grid shows the hovered cell's value (or `min` / `max` of the data when nothing is hovered).
