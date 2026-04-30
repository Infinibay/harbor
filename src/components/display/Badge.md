# Badge

Small pill for status, counts, or labels. Optional pulsing dot for
"live" indicators ("connected", "deploying").

## Import

```tsx
import { Badge } from "@infinibay/harbor/display";
```

## Example

```tsx
<Badge tone="success">Active</Badge>
<Badge tone="warning" pulse>Deploying</Badge>
<Badge tone="danger" icon={<XIcon />}>Failed</Badge>
```

## Props

- **children** — `ReactNode`. Required. The label content.
- **tone** — `"neutral" | "success" | "warning" | "danger" | "info" | "purple"`.
  Default `"neutral"`.
- **pulse** — `boolean`. Render a leading dot that pings outward.
- **icon** — `ReactNode`. Optional leading icon (rendered before the dot).
- **className** — extra classes on the wrapper.

## Notes

- All tones share the same translucent border/background pattern —
  switch `tone` to retint without visual jumps.
- The pulse animation uses `framer-motion` with a 1.6s loop.
