# DurationPill

`DurationPill` displays an elapsed duration between two timestamps inside a
compact status chip. It can render a fixed interval or tick live for uptime,
running jobs, active sessions, deploy duration, incident age, and processing
time.

Use it when duration is supporting metadata rather than the main content.

## Import

```tsx
import { DurationPill } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<DurationPill
  prefix="uptime"
  from={service.startedAt}
  auto={30_000}
  tone="success"
/>;
```

For a completed job:

```tsx
<DurationPill
  prefix="ran for"
  from={job.startedAt}
  to={job.finishedAt}
  tone={job.failed ? "danger" : "default"}
/>;
```

## Props

- **from** - `Date | string | number`. Required interval start.
- **to** - `Date | string | number`. Optional interval end. Omit it for elapsed
  time through now.
- **auto** - `number | boolean`. Re-renders periodically. `true` uses 30 seconds;
  a number is interpreted as milliseconds. Default `false`.
- **options** - `FormatDurationOptions`. Passed to `formatDuration`.
- **prefix** - `string`. Optional label before the duration.
- **tone** - `"default" | "success" | "warn" | "danger" | "info"`. Default
  `"default"`.
- **className** - extra classes on the chip.

## Behavior

The component converts `from` and `to` through JavaScript `Date`, subtracts start
from end, and formats the resulting milliseconds. When `to` is omitted, the end
time is `Date.now()` on each render.

When `auto` is enabled, Harbor starts an interval that triggers re-rendering so
live elapsed time stays fresh.

## Accessibility

The chip renders text, so the duration is available to screen readers. Use
`prefix` to explain what the duration means; `2h 14m` alone is less useful than
`uptime 2h 14m` or `ran for 2h 14m`.

Do not use tone alone to communicate failure or urgency. Pair danger/warn tones
with explicit status text nearby.

## Gotchas

- Invalid date strings produce invalid durations. Normalize timestamps before
  passing them.
- A `to` earlier than `from` produces a negative duration if `formatDuration`
  allows it; validate intervals in your app.
- Very short auto intervals can create unnecessary re-renders.

## Related

- `Timestamp` for absolute or relative timestamps.
- `Badge` for status text.
- `Progress` for running job completion.
- `StatusBar` for compact workspace state.
