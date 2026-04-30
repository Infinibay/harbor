# ProgressRing

Circular progress dial with a gradient stroke and a centered label.
Use for compact percent indicators (storage gauges, score wheels). For
linear bars use `<Progress>`.

## Import

```tsx
import { ProgressRing } from "@infinibay/harbor/display";
```

## Example

```tsx
<ProgressRing value={64} />
<ProgressRing value={75} tone="green" size={120} />
<ProgressRing value={42} label={<span className="text-sm">42 / 100</span>} />
```

## Props

- **value** — `number`. Required. Current progress.
- **max** — `number`. Default `100`.
- **size** — `number`. Default `96`. Total px diameter.
- **stroke** — `number`. Default `8`. Stroke width in px.
- **label** — `ReactNode`. Custom centre label. Default
  `${Math.round(pct * 100)}%`.
- **tone** — `"purple" | "green" | "amber" | "rose"`. Default `"purple"`.

## Notes

- The stroke fills clockwise via `strokeDashoffset` animated with a
  `framer-motion` spring.
- The gradient ID is suffixed with `tone` so multiple rings on a page
  don't collide.
