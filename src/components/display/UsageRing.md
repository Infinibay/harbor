# UsageRing

Apple-Watch-style consumption ring built on top of `<ProgressRing>`
with Infinibay quota semantics — tone shifts amber past 75 %, rose
past 90 %. Use it for quota / budget displays where a single
fraction tells the story; reach for `<QuotaBar>` when you need a
linear bar with raw numbers.

## Import

```tsx
import { UsageRing } from "@infinibay/harbor/display";
```

## Example

```tsx
<UsageRing value={1840} max={5000} name="CPU hours" />
<UsageRing
  value={4500}
  max={5000}
  name="GB transfer"
  caption="Projected to cap on 22 Apr"
/>
```

## Props

- **value** — `number`. Required. Current consumption (any unit).
- **max** — `number`. Required. Quota / cap.
- **label** — `ReactNode`. Override the default percent label inside
  the ring.
- **name** — `string`. Resource name shown under the percent
  ("CPU hours", "GB transfer").
- **caption** — `ReactNode`. Small caption below the ring — useful
  for projections.
- **thresholds** — `[number, number]`. Warn / danger fractions in
  `0..1`. Default `[0.75, 0.9]`.
- **size** — `number`. Outer diameter in px. Default `112`.
- **stroke** — `number`. Ring stroke width. Default `10`.
- **className** — extra classes on the wrapper.

## Notes

- Tone is derived purely from `value / max` — there's no manual
  override; tweak `thresholds` if your domain wants different
  cutoffs.
- Values exceeding `max` still render at 100 % stroke (the ring
  doesn't overflow); pair with a `caption` to communicate over-use.
