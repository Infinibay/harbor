# Gauge

Half-circle gauge with threshold-driven color and a needle. Use for a single bounded scalar (CPU %, queue depth vs. capacity, SLO budget); for trend over time pair with a `Sparkline` instead.

## Import

```tsx
import { Gauge } from "@infinibay/harbor/charts";
```

## Example

```tsx
<Gauge
  value={72}
  min={0}
  max={100}
  label="CPU"
  unit="%"
  thresholds={[
    { at: 0,    color: "#34d399" },
    { at: 0.6,  color: "#fbbf24" },
    { at: 0.85, color: "#f87171" },
  ]}
/>
```

## Props

- **value** — current reading.
- **min** — scale floor. Default: `0`.
- **max** — scale ceiling. Default: `100`.
- **label** — small uppercase caption under the value.
- **unit** — short suffix shown next to the value (e.g. `"%"`, `"ms"`).
- **size** — diameter in px. Default: `180`.
- **thresholds** — `{ at, color }[]` where `at` is a fraction `[0,1]`. The highest passed threshold wins. Default: green / amber / red at 0 / 0.6 / 0.85.
- **className** — wrapper class.

## Notes

- Sweep is exactly 180°, so the filled arc never picks the long way around (the SVG `large-arc-flag` is forced to 0).
- Value clamps to `[min, max]` before rendering.
- The numeric readout shows `Math.round(value)` followed by `unit`.
