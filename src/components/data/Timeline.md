# Timeline

`Timeline` renders a chronological event stream with a vertical rail, tone-coded markers, titles, descriptions, and time labels. Use it for deployments, lifecycle histories, incident updates, subscription activity, environment changes, and compact audit summaries.

It is a presentational timeline, not a data processor. Format dates, group events, and filter entries before passing them to the component.

## Import

```tsx
import { Timeline } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
import { Timeline } from "@infinibay/harbor/data";

export function DeploymentTimeline() {
  return (
    <Timeline
      events={[
        { id: "deploy", title: "Deployed v1.5.0", time: "2m ago", tone: "success" },
        {
          id: "migration",
          title: "Migration started",
          description: "schema_v3 to schema_v4",
          time: "10m ago",
          tone: "info",
        },
        {
          id: "disk",
          title: "Disk pressure on node-2",
          description: "85% used",
          time: "1h ago",
          tone: "warning",
        },
      ]}
    />
  );
}
```

## Props

- **events** - `TimelineEvent[]`. Required ordered list of events.
- **className** - extra classes on the root `<ol>`.

## Event Model

```ts
type TimelineEvent = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  time: string;
  icon?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};
```

`title` and `description` accept `ReactNode`, so you can include links, badges, or formatted values. `time` is already-rendered text. If you need relative time, use `Timestamp` upstream and pass the rendered result into `time` or title content.

## Behavior

Events render in the order you provide. Each item animates in with a small staggered offset. When `icon` is omitted, Harbor renders a small tone-colored dot inside the marker. The rail continues behind all items and fades at the bottom.

## Accessibility

The component uses an ordered list (`<ol>` and `<li>`), which gives assistive technology the correct reading order. Icons are visual only unless you pass semantic content yourself. Keep important state in the title or description, not only in marker color.

## Gotchas

- `Timeline` does not sort events.
- `time` is a string and is not parsed or localized.
- Tone colors are visual hints. Include the actual status text for critical events.
- For long operational logs, use `AuditLog`, `ActivityFeed`, or a virtualized list.

## Related

- `AuditLog` for actor/action/resource history.
- `ActivityFeed` for social or collaboration feeds.
- `Timestamp` for relative and absolute time formatting.
