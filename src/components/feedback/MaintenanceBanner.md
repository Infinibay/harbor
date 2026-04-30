# MaintenanceBanner

A `<Banner>` preset with a live countdown toward a scheduled window. Auto
promotes to `sticky` when the window is within an hour and switches tone to
`warning` once the window opens. For free-form announcements, use `<Banner>`
directly.

## Import

```tsx
import { MaintenanceBanner } from "@infinibay/harbor/feedback";
```

## Example

```tsx
<MaintenanceBanner
  scheduledAt="2026-05-01T02:00:00Z"
  duration={30 * 60_000}
  scope="API, console"
  onClose={() => setHidden(true)}
>
  Expect intermittent 502s during the rollout.
</MaintenanceBanner>
```

## Props

- **scheduledAt** — `Date | string | number`. Required. Window start.
- **duration** — `number`. Window length in ms. Used to render `start → end` and to know when the window has finished.
- **scope** — `string`. Affected systems, appended after the time range as `· affects <scope>`.
- **title** — `string`. Override the auto-generated header ("Maintenance starts in 2 h", "Maintenance in progress", "Maintenance window complete").
- **children** — `ReactNode`. Extra body copy under the time line.
- **onClose** — `() => void`. Renders the `×` dismiss button.
- **forceSticky** — pin to the top regardless of how far away the window is. Default: `false`.
- **actions** — `ReactNode`. Forwarded to `<Banner actions>`.
- **className** — extra classes on the root.

## Notes

- Re-renders every 30 s via an internal `setInterval`, so the countdown
  stays accurate without a wider tick provider.
- Tone is `"info"` before the window and `"warning"` while it's open. After
  the window ends, tone stays `"info"` and the title shows "complete".
