# HeatmapCalendar

GitHub-style contribution heatmap. Renders the last N weeks of daily
activity as a column-per-week grid with five intensity levels. For
arbitrary 2-D matrices use a custom grid; for time series prefer
`<Sparkline>`.

## Import

```tsx
import { HeatmapCalendar } from "@infinibay/harbor/data";
```

## Example

```tsx
const data = {
  "2026-04-28": 12,
  "2026-04-27": 4,
  "2026-04-26": 0,
  "2026-04-22": 8,
};

<HeatmapCalendar
  data={data}
  weeks={20}
  onHover={(date, value) => setTip(date ? `${date}: ${value}` : null)}
/>
```

## Props

- **data** — `Record<string, number>`. Required. Keys are ISO dates
  (`YYYY-MM-DD`); missing dates render as zero.
- **weeks** — `number`. Columns shown, ending on the current week.
  Default `20`.
- **max** — `number`. Override the value mapped to the darkest cell.
  Defaults to `max(values)`.
- **onHover** — `(date: string | null, value: number) => void`. Fires
  with `null` on leave.
- **className** — extra classes on the root.

## Notes

- Cells are bucketed into 5 levels (0 + 4 fuchsia tints) by ratio of
  value to peak.
- The grid ends on the upcoming Sunday; Sunday-bound, not locale-aware.
- Cells animate-scale on hover and have a native `title` attribute for
  baseline accessibility.
