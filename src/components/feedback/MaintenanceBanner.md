# MaintenanceBanner

`MaintenanceBanner` is a preset over `Banner` for scheduled maintenance windows. It formats
start and end times, shows affected scope, updates the countdown every 30 seconds, and
automatically becomes sticky near or during the maintenance window.

Use it on dashboards, status pages, admin portals, and authenticated apps where users need
advance warning about service disruption.

## Import

```tsx
import { MaintenanceBanner } from "@infinibay/harbor/feedback";
```

## Basic Usage

```tsx
<MaintenanceBanner
  scheduledAt="2026-05-12T03:00:00Z"
  duration={60 * 60 * 1000}
  scope="API, webhooks, background jobs"
  actions={<Button size="sm">View status</Button>}
  onClose={() => setDismissed(true)}
>
  Webhook delivery may be delayed during database failover.
</MaintenanceBanner>
```

## Timing Model

Before the window starts, the title defaults to "Maintenance starts in ..." using
`formatDuration`. During the window, it becomes "Maintenance in progress". After the window,
it becomes "Maintenance window complete".

The banner becomes sticky when `forceSticky` is true, when the current time is within the
maintenance window, or when start time is less than one hour away.

## Props

- **scheduledAt** - date-like start time. Required.
- **duration** - duration in milliseconds.
- **scope** - affected systems text.
- **title** - override the generated title.
- **children** - extra detail below the formatted window.
- **onClose** - forwarded to `Banner`.
- **forceSticky** - make the banner sticky immediately.
- **actions** - action slot.
- **className** - extra classes on the banner.

## Accessibility

The component uses `Banner` for the visible notice. If the banner appears dynamically after
page load and must be announced, wrap it in a live region at the page level. Include concrete
times and affected systems in text so users do not have to infer urgency from color.

Actions should lead to a status page, maintenance detail, or support contact when disruption
is significant.

## Gotchas

- Time formatting uses the browser locale and timezone.
- `onClose` only notifies you; the parent decides whether to hide the banner.
- The countdown ticks every 30 seconds, not every second.
- If `duration` is omitted, the component cannot know when the window ends.

## Related

- `Banner` for general page-wide notices.
- `StatusPage` for public service health.
- `Alert` for inline maintenance details.
- `Toast` for transient operational feedback.
