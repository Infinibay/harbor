# ActivityFeed

A vertical timeline of who-did-what events, optionally grouped by day. Use for
audit trails, recent activity panels, and shared logs. For release notes —
versioned bullet lists organized by kind — use `<ChangelogFeed>` instead.

## Import

```tsx
import { ActivityFeed } from "@infinibay/harbor/feedback";
```

## Example

```tsx
<ActivityFeed
  events={[
    {
      id: "1",
      actor: "Ana",
      verb: "deployed",
      target: "api v0.4.2",
      time: new Date(),
      tone: "success",
    },
    {
      id: "2",
      actor: "Bruno",
      verb: "updated",
      target: "billing template",
      description: "CPU bumped from 2 → 4 vCPU",
      time: new Date(Date.now() - 3600_000),
      tone: "info",
    },
  ]}
/>
```

## Props

- **events** — `ActivityEvent[]`. Required. Each event has `id`, `time`, and any of `actor`, `verb`, `target`, `description`, `avatar`, `icon`, `tone`.
- **groupBy** — `"day" | "none"`. Bucket events under "Today", "Yesterday", or a date label. Default: `"day"`.
- **className** — extra classes on the outer container.

### `ActivityEvent`

- **id** — `string`. Required, unique key.
- **time** — `string | Date`. Required. `Date` values render as a localized time; strings render verbatim.
- **actor**, **verb**, **target** — `string`. Compose into the headline `<actor> <verb> <target>`.
- **description** — `ReactNode`. Secondary line under the headline.
- **avatar** — `ReactNode`. Shown in the marker bubble unless `icon` is set.
- **icon** — `ReactNode`. Overrides `avatar`. Falls back to `•`.
- **tone** — `"info" | "success" | "warning" | "danger" | "neutral"`. Marker color. Default: `"neutral"`.

## Notes

- The marker rail is drawn between adjacent events automatically; the last
  event in a group has no trailing line.
- Non-parseable `time` strings still render — they just skip day grouping.
