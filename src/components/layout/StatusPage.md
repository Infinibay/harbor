# StatusPage

Opinionated system-status page: overall-status banner, optional global
uptime strip, grouped component list with per-component uptime, and
an incident timeline. Drop it onto any `/status` route and you're 90%
of the way there. Composes `<StatusDot>`, `<UptimeStrip>`, and
`<IncidentTimeline>` from `display`.

## Import

```tsx
import { StatusPage } from "@infinibay/harbor/layout";
```

## Example

```tsx
<StatusPage
  system={{ status: "operational" }}
  uptime={last90Days}
  components={[
    { id: "api", name: "API", status: "operational", group: "Core" },
    { id: "db", name: "Database", status: "operational", group: "Core" },
    { id: "eu", name: "EU-west", status: "degraded", group: "Regions" },
  ]}
  incidents={recentIncidents}
/>
```

## Props

- **system** — `{ status: SystemStatus; message?: string }`. Required.
  `SystemStatus` is `"operational" | "degraded" | "partial-outage" |
  "major-outage" | "maintenance"`. The banner picks a label and tone
  from `status` unless `message` overrides the copy.
- **components** — `readonly StatusComponent[]`. Required. Each has
  `id`, `name`, `status` (a `Status` from `<StatusDot>`), and optional
  `uptime`, `group`, `description`. Components are grouped by `group`.
- **incidents** — `readonly Incident[]`. Forwarded to
  `<IncidentTimeline>` when non-empty.
- **uptime** — `readonly UptimeDay[]`. Optional global uptime strip
  rendered above the component list.
- **header** — `ReactNode`. Title row, subscribe button, etc.
- **className** — extra classes on the wrapper.

## Notes

- Components are bucketed into groups in insertion order; components
  without a `group` go into an unlabeled top bucket.
- Each banner tone (operational / degraded / partial / major /
  maintenance) is a fixed translucent palette — no theming knobs.
