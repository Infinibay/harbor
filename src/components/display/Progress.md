# Progress

Linear progress bar with optional label, value readout, shimmer, and
indeterminate animation. For circular dials use `<ProgressRing>`; for
quota meters use `<QuotaBar>`.

## Import

```tsx
import { Progress } from "@infinibay/harbor/display";
```

## Example

```tsx
<Progress value={60} label="Uploading" showValue />
<Progress indeterminate tone="sky" label="Syncing" />
<Progress value={80} tone="green" shimmer valueSlot={<span>4.8 / 6 GB</span>} />
```

## Props

- **value** — `number`. Default `0`. Current progress.
- **max** — `number`. Default `100`.
- **label** — `ReactNode`. Heading rendered above the bar.
- **showValue** — `boolean`. When `true`, renders `Math.round(pct)%`
  on the right.
- **valueSlot** — `ReactNode`. Custom right-side content. Takes
  precedence over `showValue`.
- **tone** — `"purple" | "green" | "amber" | "rose" | "sky"`.
  Default `"purple"`.
- **shimmer** — `boolean`. Animated highlight along the filled section
  (only when `pct < 100`).
- **indeterminate** — `boolean`. Renders a sliding chip instead of a
  fixed fill. Ignores `value`.
- **className** — extra classes on the wrapper.

## Notes

- The fill uses a `framer-motion` spring (`stiffness: 200, damping: 30`),
  so jumps in `value` ease in.
- When both `valueSlot` and `showValue` are set, `valueSlot` wins.
