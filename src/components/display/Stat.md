# Stat

Headline metric with label, animated count-up, and optional
percent-change chip. Use `<Stat>` for dashboard hero numbers; reach
for `<MetricCard>` when you need richer chrome (sparkline, footer).

## Import

```tsx
import { Stat } from "@infinibay/harbor/display";
```

## Example

```tsx
<Stat label="Active deploys" value={128} change={12} />
<Stat label="Revenue" value={12_540} prefix="$" suffix="USD" />
<Stat label="Errors" value={24} change={-33} variant="plain" />
```

## Props

- **label** — `string`. Required. Uppercase caption above the value.
- **value** — `number`. Required. Target number; counts up from 0
  when the stat scrolls into view.
- **prefix** — `string`. Rendered before the number (e.g. `"$"`).
- **suffix** — `string`. Rendered after the number in muted text
  (e.g. `"USD"`, `"req/s"`).
- **change** — `number`. Percent delta vs prior period. Positive
  renders an emerald `↑`, negative a rose `↓`. Omit to hide the chip.
- **icon** — `ReactNode`. Optional leading icon next to the label.
- **variant** — `"bordered" | "plain"`. Default `"bordered"`. Pick
  `plain` when nesting inside another card to avoid doubled borders.
- **format** — `(n: number) => string`. Override the default
  `toLocaleString()` formatter (e.g. for byte sizes).
- **className** — extra classes on the wrapper.

## Notes

- The count-up only fires once per mount via `useInView`, so values
  scrolled past won't re-animate when they re-enter.
- Numbers are rendered in `font-mono tabular-nums` so digits don't
  jitter as they tick.
