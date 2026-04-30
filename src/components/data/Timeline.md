# Timeline

Vertical event stream with a left rail and tone-coded markers. Use for
generic chronological feeds (deployments, lifecycle events). For
actor / verb / target audit trails with grouping and diffs use
`<AuditLog>`.

## Import

```tsx
import { Timeline } from "@infinibay/harbor/data";
```

## Example

```tsx
<Timeline
  events={[
    { id: "1", title: "Deployed v1.5.0", time: "2m ago", tone: "success" },
    { id: "2", title: "Migration started", description: "schema_v3",
      time: "10m ago", tone: "info" },
    { id: "3", title: "Disk pressure on node-2", time: "1h ago",
      tone: "warning" },
    { id: "4", title: "API down",
      description: "/v1/health returned 503", time: "yesterday",
      tone: "danger" },
  ]}
/>
```

## Props

- **events** — `TimelineEvent[]`. Required. Each event:
  `{ id, title: ReactNode, description?: ReactNode, time: string,
  icon?: ReactNode, tone?: "neutral" | "success" | "warning" | "danger" | "info" }`.
- **className** — extra classes on the root `<ol>`.

## Notes

- `time` is a pre-formatted string — the component does no date
  formatting. Use `<Timestamp>` upstream if you want relative time
  rendering.
- Without `icon`, a small dot is rendered using the tone color.
- Each event animates in with a small staggered offset.
- Renders as `<ol>` with `<li>` items for natural reading order.
