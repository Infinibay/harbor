# UsageRing

`UsageRing` is a quota-focused ring built on top of `ProgressRing`. It turns `value / max`
into a percent label and changes tone as usage approaches the cap: purple by default, amber
after the warning threshold, and rose after the danger threshold.

Use it for account limits, storage, bandwidth, CPU hours, seats, budgets, API calls, or any
resource where a single fraction tells the story. Use `QuotaBar` when users need a linear
comparison with raw numbers.

## Import

```tsx
import { UsageRing } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<UsageRing value={1840} max={5000} name="CPU hours" />
<UsageRing
  value={4500}
  max={5000}
  name="GB transfer"
  caption="Projected to cap on 22 Apr"
/>
```

## Quota Model

`value` and `max` can use any unit as long as they share the same unit. Harbor computes the
fraction internally and passes a `0..100` value to `ProgressRing`. The default center label is
the formatted percent plus the optional resource `name`.

Pass a custom `label` when the center should show a raw count, plan name, or compact
projection instead of a percentage. `caption` is rendered below the ring and works well for
renewal dates, projected cap dates, or upgrade hints.

## Props

- **value** - `number`. Required. Current consumption in any unit.
- **max** - `number`. Required. Quota or cap in the same unit.
- **label** - `ReactNode`. Override the default percent label inside
  the ring.
- **name** - `string`. Resource name shown under the percent
  ("CPU hours", "GB transfer").
- **caption** - `ReactNode`. Small caption below the ring, useful
  for projections.
- **thresholds** - `[number, number]`. Warn / danger fractions in
  `0..1`. Default `[0.75, 0.9]`.
- **size** - `number`. Outer diameter in px. Default `112`.
- **stroke** - `number`. Ring stroke width. Default `10`.
- **className** - extra classes on the wrapper.

## Accessibility

The visual ring is useful at a glance, but the label and caption should make the same state
understandable without color. Include the resource name and, when usage is critical, add text
such as "90% used" or "Projected to cap on Friday".

Do not rely only on purple, amber, and rose. The label, caption, or surrounding copy should
explain warning and danger states.

## Gotchas

- Tone is derived only from `value / max`; there is no manual tone override.
- If `max` is `0`, the displayed fraction is treated as `0` to avoid division errors.
- Values above `max` are passed as a percent above `100`; `ProgressRing` controls the visual
  clamping behavior. Use `caption` to explain overage.
- Very long `name` text can crowd the center label. Keep it short or provide a custom label.

## Related

- `ProgressRing` for generic circular progress.
- `QuotaBar` for linear quotas with numeric comparison.
- `ResourceMeter` for compact resource rows.
- `Stat` and `MetricCard` for headline metrics.
