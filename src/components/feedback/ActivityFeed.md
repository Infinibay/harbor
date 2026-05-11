# ActivityFeed

`ActivityFeed` renders a chronological stream of product events: deployments,
comments, approvals, sync jobs, workflow transitions, user actions, and system
updates. It gives each event a tone, timestamp, actor, verb, target, optional
description, and timeline connector.

Use it when customers need to answer "what happened recently?" without opening a
full audit table. For compliance-grade history with sorting and filtering, use
`AuditLog` or `DataTable`.

## Import

```tsx
import { ActivityFeed } from "@infinibay/harbor/feedback";
```

## Basic Usage

Pass an ordered list of events. The component expects the order you provide; most
apps pass newest-first data from an API.

```tsx
<ActivityFeed
  events={[
    {
      id: "deploy-42",
      actor: "Maya",
      verb: "deployed",
      target: "billing-api",
      description: "Production rollout completed in 3m 18s.",
      time: new Date(),
      tone: "success",
    },
    {
      id: "check-17",
      actor: "Harbor CI",
      verb: "flagged",
      target: "migration drift",
      time: "14:08",
      tone: "warning",
    },
  ]}
/>
```

## Grouping

Set `groupBy="day"` to add day headers such as Today and Yesterday. Use
`groupBy="none"` when the feed sits inside a compact drawer or sidebar and the
date is already clear from the surrounding page.

```tsx
<ActivityFeed events={events} groupBy="day" />
```

## Props

- `events`: required ordered event array.
- `groupBy`: `"day"` or `"none"`; use day grouping for longer feeds.
- `className`: wrapper class override.

## Event Shape

Each event uses these fields:

- `id`: stable key for React rendering.
- `avatar`: optional custom avatar node.
- `actor`: person, team, integration, or service name.
- `verb`: action text such as "approved", "deployed", or "commented".
- `target`: object affected by the event.
- `description`: secondary detail below the main sentence.
- `time`: `Date`, timestamp, or already-formatted string.
- `tone`: `info`, `success`, `warning`, `danger`, or `neutral`.
- `icon`: optional icon node inside the timeline marker.

## How It Works

The component builds timeline groups, renders one row per event, and draws a
connector between events in the same group. Tone controls the marker color. If
you provide `avatar`, it replaces the generic marker content; if you provide
`icon`, the icon appears inside the marker.

## Accessibility

Keep event copy readable as a sentence. Screen reader users should understand
the row without interpreting color or icon shape. Include actor, action, target,
and useful detail in text.

If the feed updates live, announce new items outside the component with your app
state pattern, for example a toast or polite live region.

## Gotchas

Date strings are displayed as passed. Use `Date` objects when you want Harbor to
format the time consistently.

Avoid putting destructive actions directly inside every feed row. Use the feed
for history; put record actions in a drawer, context menu, or detail panel.

## Related

- `AuditLog` for dense, filterable compliance history.
- `Timeline` for planned or milestone-based events.
- `ChangelogFeed` for versioned release notes.
- `Toast` for immediate confirmations after user actions.
