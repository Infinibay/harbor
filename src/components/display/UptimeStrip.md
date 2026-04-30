# UptimeStrip

Status-page-style horizontal strip of colored squares — one per day
— summarizing service uptime over a window. Hover reveals a day's
incident summary; click delegates to `onDayClick`. Use it on status
dashboards alongside `<HealthPing>` or `<MetricCard>`.

## Import

```tsx
import { UptimeStrip } from "@infinibay/harbor/display";
```

## Example

```tsx
<UptimeStrip
  label="api.infinibay.com"
  length={90}
  days={[
    { date: "2026-04-25", status: "operational" },
    { date: "2026-04-26", status: "degraded", label: "p95 spike" },
    { date: "2026-04-27", status: "down", label: "DB failover" },
  ]}
  onDayClick={(d) => openIncident(d)}
/>
```

## Props

- **days** — `readonly UptimeDay[]`. Required. Oldest first. Each
  day:
  - **date** — `Date | string | number`. Time-of-day ignored.
  - **status** — `"operational" | "degraded" | "down" |
    "maintenance" | "no-data"`.
  - **label** — `string`. Short summary for the hover line.
  - **detail** — `ReactNode`. Extra detail (currently used in the
    hover row alongside `label`).
- **length** — `number`. Target square count. Default `90`. Shorter
  arrays are left-padded with `no-data` entries.
- **size** — `number`. Square width in px (height is `size * 2`).
  Default `8`.
- **onDayClick** — `(day: UptimeDay) => void`. Click handler.
- **label** — `ReactNode`. Title above the strip.
- **className** — extra classes on the wrapper.

## Notes

- Uptime percent in the header counts only known days
  (operational / known) — `no-data` is excluded from the denominator.
- Each square is a `<button>` with a native `title` attribute, so
  the tooltip works even on touch devices via long-press.
