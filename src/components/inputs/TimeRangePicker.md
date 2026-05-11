# TimeRangePicker

`TimeRangePicker` is the compact range control for dashboards, observability pages, admin analytics, billing usage, and any screen that fetches data for a recent time window. It combines preset chips with a custom absolute-range popover.

The component stores only popover UI state. Your app owns the selected value, fetches data, and decides how to render comparison ranges.

## Import

```tsx
import {
  TimeRangePicker,
  resolveTimeRange,
  type AbsoluteRange,
  type TimeRangePreset,
  type TimeRangeValue,
} from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useEffect, useState } from "react";
import { TimeRangePicker, resolveTimeRange, type TimeRangeValue } from "@infinibay/harbor/inputs";

export function MetricsToolbar() {
  const [range, setRange] = useState<TimeRangeValue>({ preset: "24h" });
  const [compare, setCompare] = useState<AbsoluteRange | undefined>();

  useEffect(() => {
    const absolute = resolveTimeRange(range);
    fetchSeries({ from: absolute.from, to: absolute.to, compare });
  }, [range, compare]);

  return (
    <TimeRangePicker
      value={range}
      onChange={(next, previousPeriod) => {
        setRange(next);
        setCompare(previousPeriod);
      }}
    />
  );
}
```

## Value Model

```ts
type TimeRangePreset = "15m" | "1h" | "6h" | "24h" | "7d" | "30d";

type AbsoluteRange = {
  from: Date;
  to: Date;
};

type TimeRangeValue = AbsoluteRange | { preset: TimeRangePreset };
```

Use `resolveTimeRange(value, now?)` before fetching. Presets become `{ from, to }` based on `now`; absolute values pass through unchanged.

## Props

- **value**: `TimeRangeValue`. Required controlled value.
- **onChange**: `(v: TimeRangeValue, compare?: AbsoluteRange) => void`. Required. `compare` is emitted when the user shift-clicks a preset.
- **presets**: `TimeRangePreset[]`. Controls which chips render and in what order. Defaults to all presets.
- **formatLabel**: `(v: TimeRangeValue) => ReactNode`. Overrides the custom-range trigger label.
- **className**: custom class on the wrapper.

## Accessibility

Preset chips expose pressed state. The custom trigger exposes expanded state while the popover is open. Keep the chart or table caption synchronized with the resolved date range so the selected window is visible outside the control.

The custom range editor uses native `datetime-local` inputs, so labels are explicit and keyboard editing remains browser-native.

## Gotchas

- Shift-clicking a preset emits a previous-period compare range; it does not store comparison state internally.
- The popover is portalled at `Z.POPOVER`, so it escapes overflow-hidden toolbars.
- Apply is ignored when either date is invalid or `from >= to`.
- `datetime-local` values use the browser's local timezone. Convert to the timezone your API expects before fetching.

## Related

- [`DatePicker`](./DatePicker.md) for single dates.
- [`LineChart`](../charts/LineChart.md) and [`TimeSeriesChart`](../charts/TimeSeriesChart.md) for range-driven charts.
- [`Toolbar`](../layout/Toolbar.md) for placing range controls beside filters.
