# CountdownTimer

`CountdownTimer` renders a live, animated countdown to a timestamp. Use it when time remaining changes the user's next action: release windows, maintenance starts, offer expiry, incident response deadlines, challenge timers, trial periods, or workflow locks.

The component owns the ticking display, but your app owns the target time and the outcome when the countdown reaches zero. That separation matters: Harbor can animate the readout, while your product decides whether to refresh data, disable a button, advance a wizard, or show a final state.

## Import

```tsx
import { CountdownTimer } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
const maintenanceStartsAt = new Date("2026-06-01T02:00:00Z");

<Banner tone="warning">
  Maintenance starts in{" "}
  <CountdownTimer
    target={maintenanceStartsAt}
    onComplete={() => refetchStatus()}
  />
</Banner>
```

Use `compact` when the deadline is short or the timer sits inside a dense toolbar:

```tsx
<CountdownTimer target={Date.now() + 10 * 60 * 1000} compact />
```

## Props

- **target** - required `Date` or millisecond timestamp. The component counts down to this value.
- **onComplete** - optional callback fired when the countdown reaches `0`.
- **compact** - optional boolean. When true, the day segment is hidden unless there are days remaining.
- **className** - optional string merged onto the root element.

## Interaction Model

The timer updates once per second with an internal interval and clears that interval on unmount. It clamps negative values to zero, so expired targets render `00h 00m 00s` rather than counting below zero.

`onComplete` is an effect triggered from the computed remaining time. Keep it idempotent: refetch data, set a completed flag, or open a follow-up state. Avoid destructive actions that could run more than once if the parent re-renders around the same expired target.

## Display Behavior

The readout splits time into days, hours, minutes, and seconds. Digits are padded and animated with Framer Motion, which makes changes legible without causing layout jumps. The component uses tabular numerals and fixed-ish segment widths so it can sit inside banners, cards, and status bars.

## Accessibility

Do not announce every second with a live region; that is noisy. Put the timer near text that explains the deadline, and announce milestone changes in your app only when they matter.

For critical deadlines, also provide absolute time somewhere nearby:

```tsx
<p>Deploy lock expires at 14:30 UTC.</p>
<CountdownTimer target={lockExpiresAt} />
```

## Gotchas

- Make sure server and client clocks are acceptable for the workflow. Billing, security, and reservation logic should still be enforced server-side.
- Do not create a new `target={Date.now() + ...}` on every render unless that is intentional. Store the deadline in state or data.
- Keep `onComplete` stable or idempotent to avoid repeated work around zero.
- Use `compact` for dense surfaces; the full readout can feel too heavy in tables.

## Related

- `MaintenanceBanner` for planned downtime messaging.
- `StatusBar` for desktop-style time-sensitive state.
- `ProgressRing` for percentage progress.
- `Banner` and `Alert` for explaining what happens when time expires.
