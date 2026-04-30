# HealthPing

A pulsing dot — purely decorative "this thing is alive" indicator.
Distinct from `<StatusDot>` which is a labeled, semantic status. Cheap
to render hundreds of times (pure CSS animations, no Framer).

## Import

```tsx
import { HealthPing } from "@infinibay/harbor/display";
```

## Example

```tsx
<HealthPing tone="success" />
<HealthPing tone="warn" rings={2} speed={1.2} />
<HealthPing tone="danger" size={10} />
```

## Props

- **tone** — `"success" | "warn" | "danger" | "info" | "neutral"`. Default `"success"`.
- **size** — `number`. Dot size in pixels. Default `8`.
- **rings** — `1 | 2`. Number of expanding rings. Default `1`.
- **speed** — `number`. Cycle duration in seconds. Default `1.6`.
- **className** — extra classes on the wrapper.

## Notes

- `aria-hidden` — purely decorative; pair with text labels for screen readers.
- For semantic status with a label, use `<StatusDot>`.
