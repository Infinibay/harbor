# IncidentTimeline

`IncidentTimeline` renders a list of operational incidents with collapsible update threads.
It is built for status pages, incident reviews, support consoles, and reliability dashboards.

Use it when users need to understand what happened, what state the incident is in, which
components were affected, and how the response evolved over time.

## Import

```tsx
import { IncidentTimeline } from "@infinibay/harbor/display";
import type { Incident } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
const incidents: Incident[] = [
  {
    id: "inc-42",
    title: "Elevated API latency",
    severity: "major",
    startedAt: "2026-05-11T12:30:00Z",
    affectedComponents: ["API", "Workers"],
    updates: [
      { at: "2026-05-11T12:34:00Z", status: "investigating", message: "On-call is reviewing traces." },
      { at: "2026-05-11T12:51:00Z", status: "identified", message: "Queue saturation found in us-east." },
    ],
  },
];

<IncidentTimeline incidents={incidents} />;
```

## Interaction Model

Each incident renders as a clickable header. Expanded incidents show their update list with a
vertical status rail. `expandedByDefault` controls the initial set; after mount, the component
keeps expanded ids in local state.

Incidents without `resolvedAt` are considered ongoing and their severity chip pulses. The
empty state is customizable through `emptyState`.

## Props

- **incidents** - readonly `Incident[]`.
- **expandedByDefault** - expands all incidents on first render. Default `true`.
- **emptyState** - slot rendered when the list is empty.
- **className** - extra classes on the wrapper.

### Incident

- **id** - stable id.
- **title** - incident title.
- **severity** - `"minor" | "major" | "critical"`.
- **startedAt** / **resolvedAt** - date-like values.
- **affectedComponents** - optional component names.
- **updates** - `{ at, status, message }[]`.

## Accessibility

Incident headers are buttons, so they are reachable by keyboard. Keep titles clear and
include affected components in text, not only color. The timeline uses visual dots and rails;
the update status label is also rendered as text.

If incident updates arrive live, announce changes outside the component with a polite live
region or status summary.

## Gotchas

- Expanded state is local and keyed by incident id. If ids change, expansion resets.
- Updates are rendered in the order you pass them. Sort them before rendering.
- The component does not calculate incident duration; include duration in copy if needed.
- Ongoing incidents pulse, so avoid using it in reduced-motion-sensitive contexts without a
  page-level mitigation.

## Related

- `StatusPage` for the full public status layout.
- `UptimeStrip` for historical daily health.
- `Timestamp` for consistent date display.
- `ActivityFeed` and `Timeline` for general event history.
