# TimeRangePicker

Inline preset chips (`15m`, `1h`, `6h`, `24h`, `7d`, `30d`) plus a
"Custom…" popover for absolute `from`/`to` ranges. Shift-click a
preset to also emit a *previous-period* compare range via the
`onChange` second argument — the caller fetches both windows and can
overlay them on a chart. Use this on dashboards / metrics pages; for
a single date pick `<DatePicker>` instead.

## Import

```tsx
import {
  TimeRangePicker,
  resolveTimeRange,
} from "@infinibay/harbor/inputs";
import type {
  TimeRangeValue,
  TimeRangePreset,
  AbsoluteRange,
} from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [range, setRange] = useState<TimeRangeValue>({ preset: "24h" });

<TimeRangePicker
  value={range}
  onChange={(v, compare) => {
    setRange(v);
    if (compare) fetchCompareSeries(compare);
  }}
/>;

// resolve to concrete dates for fetching:
const { from, to } = resolveTimeRange(range);
```

## Props

- **value** — `TimeRangeValue`. Required. Either `{ preset:
  "15m" | "1h" | "6h" | "24h" | "7d" | "30d" }` or `{ from: Date; to:
  Date }`.
- **onChange** — `(v: TimeRangeValue, compare?: AbsoluteRange) => void`.
  Required. The optional `compare` arg fires when the user
  shift-clicks a preset.
- **presets** — `TimeRangePreset[]`. Subset / order of preset chips
  to render. Defaults to all six.
- **formatLabel** — `(v: TimeRangeValue) => ReactNode`. Override the
  custom-button label.
- **className** — extra classes on the wrapper.

## Helpers

- **resolveTimeRange(v, now?)** — collapses any `TimeRangeValue` to
  a concrete `{ from, to }` `AbsoluteRange`.

## Notes

- The custom range popover renders through `<Portal>` at
  `Z.POPOVER` so it escapes overflow-hidden parents.
- Apply is blocked when `from >= to` or either side is `NaN`.
