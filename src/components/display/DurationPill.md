# DurationPill

Small pill that renders an elapsed duration. With `auto` set, it ticks
to stay live — drop one in your VM list and it animates the uptime
without parent state.

## Import

```tsx
import { DurationPill } from "@infinibay/harbor/display";
```

## Example

```tsx
<DurationPill from={vm.bootedAt} prefix="uptime" auto />

<DurationPill
  from={run.startedAt}
  to={run.finishedAt}
  prefix="ran for"
  tone="success"
/>

<DurationPill from={incident.openedAt} auto={5000} tone="danger" prefix="open" />
```

## Props

- **from** — `Date | string | number`. Required. Start of the interval.
- **to** — `Date | string | number`. End. Omit + use `auto` for live elapsed.
- **auto** — `number | boolean`. Re-render interval ms. `true` = `30_000`.
  Default `false` (no ticking).
- **options** — `FormatDurationOptions`. Pass-through to `lib/format.formatDuration`.
- **prefix** — `string`. Small label rendered before the duration ("uptime").
- **tone** — `"default" | "success" | "warn" | "danger" | "info"`. Default `"default"`.
- **className** — extra classes on the pill.

## Notes

- Live mode uses a `setInterval`; pick a sensible interval (30s default
  is appropriate for uptime cards — `1000` only when you really need
  per-second precision).
- The duration is recomputed every render, so manual re-renders also
  refresh it without relying on `auto`.
