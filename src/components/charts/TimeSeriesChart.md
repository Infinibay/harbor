# TimeSeriesChart

Multi-series chart over real timestamps with hover crosshair, optional brushing for range selection, stacked areas, and `<TimeSeriesMarker>` annotations. Use for metrics over time. For categorical x prefer `LineChart`; for forecast overlays use `ResourceForecast`.

## Import

```tsx
import { TimeSeriesChart, TimeSeriesMarker } from "@infinibay/harbor/charts";
```

## Example

```tsx
const now = Date.now();
const points = (offset: number) =>
  Array.from({ length: 30 }, (_, i) => ({
    t: now - (30 - i) * 60_000,
    v: 50 + offset + Math.sin(i / 3) * 12 + Math.random() * 4,
  }));

<TimeSeriesChart
  height={260}
  series={[
    { id: "cpu", label: "CPU %",  data: points(0) },
    { id: "mem", label: "Mem %",  data: points(20) },
  ]}
  onRangeSelect={(r) => console.log("zoom", r)}
  formatY={(v) => `${v.toFixed(0)}%`}
>
  <TimeSeriesMarker at={now - 10 * 60_000} label="deploy" color="#f43f5e" />
</TimeSeriesChart>
```

## Props

- **series** — `readonly TimeSeries[]`. Each `{ id, label?, color?, data }` where data is `{ t: Date | number, v: number }[]`.
- **xDomain** — `{ from: Date, to: Date }`. Default: inferred.
- **yDomain** — `[min, max]`. Default: inferred with 10 % padding.
- **area** — fill under each line. Default: `true`.
- **stacked** — stack series on top of each other (assumes shared timestamps). Default: `false`.
- **yTicks** — number of horizontal gridlines. Default: `4`.
- **height** — chart height in px. Default: `240`.
- **formatY** — y-tick + tooltip formatter. Default: 2-decimal rounding.
- **onRangeSelect** — `(range) => void`. Fires after a drag of more than ~1 s of x.
- **brushEnabled** — force-enable brushing (defaults to `true` when `onRangeSelect` is set).
- **children** — `<TimeSeriesMarker>` elements only; non-markers are ignored.
- **className** — wrapper class.

### `<TimeSeriesMarker>`

- **at** — `Date | number` (ms).
- **label** — short text drawn at the top of the line.
- **color** — stroke + label color. Default: pink-ish.
- **stroke** — `"solid" | "dashed"`. Default: `"dashed"`.

## Notes

- Brushing uses pointer + window listeners; releases shorter than 1 s of x are ignored to avoid accidental zooms.
- The hover tooltip snaps to the nearest point per series and shows an absolute date-time on the left.
- Internal SVG viewBox is 720 × `height`, stretched to the container — preserveAspectRatio is `none`, so very wide containers stretch ticks.
