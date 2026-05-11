# StatusPage

`StatusPage` assembles a complete service-health view: overall system banner, optional global
uptime strip, grouped components, per-component uptime strips, and recent incidents.

Use it for public status routes, internal reliability dashboards, region health pages, and
customer-facing uptime summaries.

## Import

```tsx
import { StatusPage } from "@infinibay/harbor/layout";
import type { StatusComponent } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<StatusPage
  header={<PageHeader title="Status" description="Production service health." />}
  system={{ status: "degraded", message: "API latency is elevated" }}
  uptime={overallDays}
  components={[
    { id: "api", name: "API", status: "warning", group: "Core", uptime: apiDays },
    { id: "webhooks", name: "Webhooks", status: "ok", group: "Core" },
  ]}
  incidents={recentIncidents}
/>
```

## Page Model

The component groups `components` by their optional `group` field. Each component row shows a
`StatusDot`, name, optional description, and optional `UptimeStrip`. When `incidents` are
provided, they render below the component list with `IncidentTimeline`.

`system.status` controls the top banner tone and default label. You can override the banner
text with `system.message`.

## Props

- **system** - `{ status, message? }` overall health.
- **components** - readonly `StatusComponent[]`.
- **incidents** - optional readonly incident list.
- **uptime** - optional global `UptimeDay[]`.
- **header** - optional header slot.
- **className** - extra classes on the page wrapper.

### StatusComponent

- **id** - stable id.
- **name** - service or region name.
- **status** - `StatusDot` status.
- **uptime** - optional per-component uptime days.
- **group** - optional grouping label.
- **description** - optional secondary text.

## Accessibility

Status text is rendered visibly, not just as color. Keep custom messages specific and clear:
"API latency is elevated" is more useful than "Degraded". If status data updates live, announce
summary changes at the route level.

The component is a layout surface, so the surrounding route should provide the page heading,
subscribe controls, and any skip links.

## Gotchas

- `StatusPage` does not fetch or poll data. Pass fresh arrays from your app.
- Component grouping preserves input order within each group.
- Per-component uptime strips can make rows wide; test narrow layouts.
- `incidents` only renders when the array is present and non-empty.

## Related

- `UptimeStrip` for daily health history.
- `IncidentTimeline` for incident update threads.
- `StatusDot` for compact component state.
- `MaintenanceBanner` for scheduled maintenance notices.
