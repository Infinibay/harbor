# IncidentTimeline

Status-page-style incident list with collapsible update threads.
Ongoing incidents pulse their severity chip. For a flat audit log of
generic events use `<AuditLog>`.

## Import

```tsx
import { IncidentTimeline, type Incident } from "@infinibay/harbor/display";
```

## Example

```tsx
<IncidentTimeline
  incidents={[
    {
      id: "inc-42",
      title: "Elevated 5xx on auth-api",
      severity: "major",
      startedAt: Date.now() - 2 * 3600_000,
      affectedComponents: ["auth-api", "session-svc"],
      updates: [
        { at: Date.now() - 2 * 3600_000, status: "investigating", message: "Spike of 503s — paging on-call." },
        { at: Date.now() - 90 * 60_000,  status: "identified",    message: "Stale connection pool in session-svc." },
        { at: Date.now() - 10 * 60_000,  status: "monitoring",    message: "Pool reset; error rate dropping." },
      ],
    },
  ]}
/>
```

## Incident / IncidentUpdate

```ts
Incident {
  id: string;
  title: string;
  severity: "minor" | "major" | "critical";
  startedAt: Date | string | number;
  resolvedAt?: Date | string | number;       // omit → ongoing
  affectedComponents?: string[];
  updates: IncidentUpdate[];
}

IncidentUpdate {
  at: Date | string | number;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  message: string;
}
```

## Props

- **incidents** — `readonly Incident[]`. Required.
- **expandedByDefault** — `boolean`. Default `true`.
- **emptyState** — `ReactNode`. Default `"No incidents. Everything is operational."`
- **className** — extra classes on the wrapper.

## Notes

- Ongoing = `resolvedAt` not set; the severity chip animates with
  `animate-pulse`.
- Update statuses are independent of the incident's resolved/ongoing
  flag — the timeline just renders what you pass.
