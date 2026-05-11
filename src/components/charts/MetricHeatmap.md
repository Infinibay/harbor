# MetricHeatmap

`MetricHeatmap` renders a generic two-dimensional matrix of numeric values. Use
it for hour-by-day traffic, endpoint latency by region, test failures by suite,
feature adoption by segment, or any categorical grid where color makes patterns
visible faster than a table.

It is not a calendar component. For calendar-shaped contribution or uptime
views, use `HeatmapCalendar`.

## Import

```tsx
import { MetricHeatmap } from "@infinibay/harbor/charts";
```

## Basic Usage

Rows and columns define the matrix. `cells` is sparse; missing row/column pairs
render as empty cells.

```tsx
<MetricHeatmap
  rows={["us-east", "eu-west", "ap-south"]}
  cols={["00", "06", "12", "18"]}
  cells={[
    { r: 0, c: 1, v: 148 },
    { r: 1, c: 2, v: 321 },
    { r: 2, c: 3, v: 87 },
  ]}
  formatV={(value) => `${value.toFixed(0)} ms`}
/>
```

## Scale

By default the component derives min and max from the visible data. Pass
`scale` when multiple heatmaps need comparable color meaning.

```tsx
<MetricHeatmap
  rows={regions}
  cols={hours}
  cells={latencyCells}
  scale={{ min: 0, mid: 250, max: 1000 }}
/>
```

## Interaction

`onCellClick` receives either the cell data or `null` for an empty coordinate,
plus the row/column index. Use it to open a filtered table, trace list, or
details drawer.

```tsx
<MetricHeatmap
  rows={services}
  cols={days}
  cells={errorCells}
  onCellClick={(cell, rc) => openErrors({ cell, row: rc.r, col: rc.c })}
/>
```

## Props

- `rows`: row labels, top to bottom.
- `cols`: column labels, left to right.
- `cells`: sparse `{ r, c, v }` values.
- `formatV`: value formatter for hover text and min/max display.
- `scale`: optional `min`, `mid`, and `max` color anchors.
- `onCellClick`: optional selection callback.
- `cellSize`: pixel size for each cell; defaults to `22`.
- `className`: wrapper class override.

## Accessibility

The heatmap is a visual summary. Keep the selected cell details, min/max text,
and any critical alerts available as readable text near the chart. If cell
selection drives a workflow, provide a parallel table, list, or summary panel for
keyboard users.

## Gotchas

Sparse coordinates outside the row or column range are ignored. Validate data at
the API boundary so the heatmap does not silently hide important values.

Color scale is relative unless `scale` is fixed. Relative scales are useful for
one panel, but misleading when comparing environments side by side.

## Related

- `HeatmapCalendar` for calendar-shaped grids.
- `TimeSeriesChart` for values over continuous time.
- `DataTable` for exact row-level inspection.
- `MetricCard` for top-line values above the heatmap.
