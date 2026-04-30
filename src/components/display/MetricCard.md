# MetricCard

Stat tile with optional sparkline, percent-delta chip, and threshold
coloring. Designed for dashboards — pass `threshold` to make the card
border light up when the metric crosses warning/danger bands.

## Import

```tsx
import { MetricCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<MetricCard
  label="Active deploys"
  value="128"
  delta={12}
  series={[4, 6, 5, 8, 7, 9, 8, 11, 10, 13, 12, 15]}
/>

<MetricCard
  label="Error rate"
  value={4.2}
  unit="%"
  raw={4.2}
  threshold={[2, 5]}      /* warn ≥ 2, danger ≥ 5 */
/>

<MetricCard
  label="Cache hit rate"
  value="91"
  unit="%"
  raw={91}
  threshold={[95, 90]}
  inverseThreshold        /* lower is worse */
/>
```

## Props

- **label** — `string`. Required.
- **value** — `ReactNode`. Required. Pre-formatted.
- **unit** — `string`. Muted label after the value.
- **delta** — `number`. Percent change (`12` → `↑ 12%`, `-33` → `↓ 33%`).
- **series** — `number[]`. When length > 1, renders a `<Sparkline>` (96×36).
- **icon** — `ReactNode`. Small leading icon next to the label.
- **threshold** — `[warn, danger]`. Drives border tint and sparkline color.
- **raw** — `number`. Numeric value used for threshold comparison when
  `value` is a `ReactNode`. Falls back to `value` if `value` is a number.
- **inverseThreshold** — `boolean`. Reverse the comparison — lower is
  worse (cache hit rate, uptime %).
- **onClick** — `() => void`. Renders the card as a `<button>` with hover lift.
- **className** — extra classes on the wrapper.

## Notes

- Threshold tones (normal / warn / danger) drive both the border glow
  and the sparkline stroke + fill.
- The delta chip animates in on mount; sign is inferred from the
  number's sign.
