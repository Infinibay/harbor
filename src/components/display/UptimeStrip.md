# UptimeStrip

`UptimeStrip` renders a horizontal run of colored day cells that summarize service health over
time. It calculates a simple uptime percentage from known operational days and shows details
for the hovered day.

Use it in status pages, service cards, region health dashboards, SLA views, and component
rows where users need a fast historical read.

## Import

```tsx
import { UptimeStrip } from "@infinibay/harbor/display";
import type { UptimeDay } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<UptimeStrip
  label="API"
  days={[
    { date: "2026-05-09", status: "operational" },
    { date: "2026-05-10", status: "degraded", label: "Elevated latency" },
    { date: "2026-05-11", status: "operational" },
  ]}
  length={30}
  onDayClick={(day) => openIncident(day)}
/>
```

## Data Model

Pass days oldest first. If the array is shorter than `length`, Harbor pads the beginning with
`no-data` cells. If it is longer than `length`, the current implementation renders all passed
days despite the prop description, so trim input yourself when you need a strict count.

The uptime percentage is `operational / knownDays`, where known days exclude `no-data`.

## Props

- **days** - readonly `UptimeDay[]`, oldest first.
- **length** - target count of cells. Default `90`.
- **size** - square width in px. Default `8`.
- **onDayClick** - `(day: UptimeDay) => void`.
- **label** - compact label above the strip.
- **className** - extra classes on the wrapper.

## Accessibility

Each day cell is a button with an accessible label containing date, status, and optional
summary. The hover detail is visual support; do not make it the only way to discover incident
details. If day clicks open incidents, ensure the destination has a clear heading.

Do not rely on color alone. Pair strips with visible status labels or summaries.

## Gotchas

- Extra days are not currently clamped. Slice the array before passing it if needed.
- `detail` exists on `UptimeDay` but is not rendered by the current component.
- The uptime calculation treats degraded, down, and maintenance as non-operational.
- Cells become narrow in constrained containers; adjust `length` or layout on mobile.

## Related

- `StatusPage` for full service-health layouts.
- `IncidentTimeline` for incident details.
- `StatusDot` for current state.
- `MaintenanceBanner` for upcoming maintenance windows.
