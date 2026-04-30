# ResourceForecast

`TimeSeriesChart` with a dashed projection drawn past the last data point and an optional quota line. Default forecast is linear regression over the last `windowSize` points of each series; pass a custom `forecast` to plug in Holt-Winters / Prophet / a server-rendered projection.

## Import

```tsx
import { ResourceForecast } from "@infinibay/harbor/charts";
```

## Example

```tsx
const now = Date.now();
<ResourceForecast
  quota={100}
  steps={24}
  series={[
    {
      id: "disk",
      label: "Disk used (GB)",
      data: Array.from({ length: 30 }, (_, i) => ({
        t: now - (30 - i) * 3600_000,
        v: 40 + i * 1.6 + Math.random() * 2,
      })),
    },
  ]}
/>
```

## Props

Extends `TimeSeriesChartProps` (everything except `children`), plus:

- **quota** — `number`. Optional hard limit. When the projection crosses it, a solid red marker is drawn at the crossing time.
- **steps** — projection steps. Default: `30`.
- **stepMs** — interval per step. Default: derived from the cadence of the last two real points (or 60 000 ms).
- **forecast** — `(series, steps, stepMs) => TimeSeriesPoint[]`. Override the linear default.
- **windowSize** — points included in the linear regression. Default: `10`.

## Notes

- Each input series is rendered alongside a `<id>-forecast` series colored at 50 % opacity by default.
- Quota crossing is computed only from the first series and marked with `TimeSeriesMarker` on the underlying chart.
- The forecast model treats `t` as ms-since-epoch internally; `Date` and number timestamps work interchangeably.
