# HeatmapCalendar

`HeatmapCalendar` renders daily values as a compact week-by-week contribution
grid. It is useful for usage history, deploy frequency, job runs, activity
streaks, incident counts, commits, billing events, and other calendar-shaped
signals.

Use it when the pattern over days matters more than exact per-day comparison. If
users need precise values, pair it with hover details, a table, or a larger
chart.

## Import

```tsx
import { HeatmapCalendar } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
<HeatmapCalendar
  weeks={20}
  data={{
    "2026-05-01": 4,
    "2026-05-02": 9,
    "2026-05-03": 1,
  }}
  onHover={(date, value) => setHovered(date ? { date, value } : null)}
/>;
```

Use `max` when you want a stable scale across multiple heatmaps:

```tsx
<HeatmapCalendar data={deploysByDay} weeks={53} max={20} />
```

## Props

- **data** - `Record<string, number>`. Required. Keys must be ISO dates in
  `YYYY-MM-DD` format.
- **weeks** - `number`. Number of weeks to display. Default `20`.
- **max** - `number`. Optional maximum value used to calculate intensity.
- **className** - extra classes on the wrapper.
- **onHover** - `(date: string | null, value: number) => void`. Called when a
  cell is hovered and reset with `null` on leave.

## Calendar Model

The grid ends at the current week and renders `weeks * 7` cells. Internally,
Harbor moves the end date to the end of the week, then walks backward. Columns
represent weeks and rows represent Monday through Sunday.

Each value is mapped into five visual levels from empty to strongest. If `max`
is omitted, the peak is calculated from the provided data with a minimum fallback
of `1`.

## Accessibility

Each cell includes a native `title` with date and value, and hover can feed a
custom detail label. Still, a heatmap is a visual summary. Provide a text summary
or detail table when the values are important for decisions.

Do not use intensity alone to communicate severity. Add labels, legends, or
adjacent totals.

## Gotchas

- Dates are expected as ISO strings. Non-ISO keys will not match generated cells.
- The component uses `new Date()` at render time to decide the visible window.
- Hover uses pointer events only. If keyboard inspection is required, add a
  separate accessible detail list.
- The color scale is fixed to Harbor's fuchsia tones.

## Related

- `MetricHeatmap` for non-calendar heatmap grids.
- `Calendar` for date selection.
- `DataTable` for exact per-day records.
- `Sparkline` for compact trend direction.
