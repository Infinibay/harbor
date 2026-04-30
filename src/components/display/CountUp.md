# CountUp

Animated numeric ticker — eases from the previously-rendered value to
the new `value` whenever it changes. Uses `requestAnimationFrame`, so
it pauses when the tab is hidden.

## Import

```tsx
import { CountUp } from "@infinibay/harbor/display";
```

## Example

```tsx
<CountUp value={12_540} />
<CountUp value={12_540} prefix="$" />
<CountUp value={99.4} suffix="%" duration={1200} />
<CountUp value={42_000} format={(v) => v.toFixed(0) + " req/s"} />
```

## Props

- **value** — `number`. Required. Target value.
- **duration** — `number`. Animation length in ms. Default `600`.
- **format** — `(v: number) => string`. Default rounds and adds locale
  thousand separators.
- **prefix** / **suffix** — `string`. Rendered around the formatted value.
- **className** — extra classes on the wrapper. Defaults inherit `tabular-nums font-mono`.

## Notes

- Uses easeOutCubic.
- Subsequent value changes ease from the *current* displayed value, not
  from `0` — looks natural in dashboards that update live.
