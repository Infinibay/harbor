# StatusDot

A colored dot (with optional pulsing ring + label) indicating the
state of a service, VM, or job. Shared primitive used by `<HostCard>`,
status pages, and list rows. Pick `<Badge pulse>` instead when you
want the label inside a pill rather than next to a glow.

## Import

```tsx
import { StatusDot } from "@infinibay/harbor/display";
```

## Example

```tsx
<StatusDot status="online" />
<StatusDot status="degraded" labelOverride="Latency high" />
<StatusDot status="maintenance" pulse={false} size={12} />
```

## Props

- **status** — `"online" | "degraded" | "offline" | "provisioning" |
  "maintenance" | "unknown"`. Required.
- **pulse** — `boolean`. Toggle the ping ring. Defaults to `true`
  for `online`, `degraded`, `provisioning`; `false` otherwise.
- **size** — `number`. Dot size in pixels. Default `10`.
- **label** — `ReactNode`. Custom label node next to the dot. Pass
  `null` to suppress the default status label entirely.
- **labelOverride** — `string`. Replace the auto-derived label
  ("Online", "Degraded", …) without changing color.
- **className** — extra classes on the wrapper.

## Notes

- Each status carries its own glow color via Tailwind shadow utility
  classes — colors are baked in, not theme-driven.
- The ping uses Tailwind's `animate-ping`; if you render many at
  once, consider disabling pulse on offline rows to reduce repaint.
