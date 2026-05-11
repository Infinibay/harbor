# ResourceForecast

`ResourceForecast` extends `TimeSeriesChart` with projected future points. It appends a
forecast series for every input series and can mark the first projected quota crossing.

Use it for capacity planning, quota burn-down, usage prediction, budget monitoring, storage
growth, and infrastructure dashboards where operators need to know not just current usage but
where the trend is going.

## Import

```tsx
import { ResourceForecast } from "@infinibay/harbor/charts";
```

## Basic Usage

```tsx
<ResourceForecast
  height={220}
  quota={10_000}
  steps={14}
  series={[
    {
      id: "storage",
      label: "Storage",
      data: dailyStoragePoints,
    },
  ]}
/>
```

## Forecast Model

By default, Harbor runs a simple linear regression over the last `windowSize` points of each
series. It then projects `steps` future points using the detected cadence from the first
series, unless `stepMs` is provided.

For production forecasting, you can pass a custom `forecast` function. That lets you use a
server-calculated model, seasonality-aware forecast, or domain-specific cap logic while
keeping Harbor's chart presentation.

## Props

`ResourceForecastProps` extends `TimeSeriesChartProps`.

- **series** - input time series passed through to `TimeSeriesChart`.
- **quota** - optional threshold used to add a projected crossing marker.
- **steps** - number of projected points. Default `30`.
- **stepMs** - interval between projected points. Default is inferred from data cadence.
- **forecast** - custom forecast function.
- **windowSize** - number of tail points used by default regression. Default `10`.

## Accessibility

As with other charts, pair the visual with a textual summary for screen-reader users and for
operators scanning incident notes. Forecasts should explain assumptions: "linear projection
from the last 10 daily points" is more honest than a silent line.

If quota crossing drives an action, repeat the projected date outside the chart in text.

## Gotchas

- Default forecasting is intentionally simple. It is not a statistical guarantee.
- Cadence is inferred from the first series only.
- Series with fewer than two points produce no forecast data.
- `quota` only creates a marker when projected points cross it.

## Related

- `TimeSeriesChart` for raw historical time series.
- `MetricCard` and `Stat` for headline capacity numbers.
- `UsageRing` and `QuotaBar` for current quota state.
- `LineChart` for simpler trend displays.
