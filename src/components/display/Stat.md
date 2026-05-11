# Stat

`Stat` is a compact headline metric with a label, animated count-up, optional prefix or
suffix, and optional percentage change. It is built for dashboard hero rows, summary panels,
and landing-page proof points where the number is the content.

Use `Stat` when you need a strong number without extra chart chrome. Use `MetricCard` when
the metric needs a footer, sparkline, richer trend context, or a more substantial card
surface.

## Import

```tsx
import { Stat } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<Stat label="Active deploys" value={128} change={12} />
<Stat label="Revenue" value={12_540} prefix="$" suffix="USD" />
<Stat label="Errors" value={24} change={-33} variant="plain" />
```

## Formatting Model

The value counts from `0` to `value` once the component enters the viewport. By default, the
displayed number uses `toLocaleString()`. Pass `format` when the raw number needs domain
formatting, such as bytes, currency rounding, compact notation, or durations.

`variant="bordered"` gives the stat its own elevated surface. Use `variant="plain"` when the
stat already lives inside a `Card`, metric strip, or custom grid.

## Props

- **label** - `string`. Required. Uppercase caption above the value.
- **value** - `number`. Required. Target number; counts up from 0
  when the stat scrolls into view.
- **prefix** - `string`. Rendered before the number, for example `"$"`.
- **suffix** - `string`. Rendered after the number in muted text,
  (e.g. `"USD"`, `"req/s"`).
- **change** - `number`. Percent delta vs prior period. Positive
  renders an emerald `↑`, negative a rose `↓`. Omit to hide the chip.
- **icon** - `ReactNode`. Optional leading icon next to the label.
- **variant** - `"bordered" | "plain"`. Default `"bordered"`. Pick
  `plain` when nesting inside another card to avoid doubled borders.
- **format** - `(n: number) => string`. Override the default
  `toLocaleString()` formatter (e.g. for byte sizes).
- **className** - extra classes on the wrapper.

## Accessibility

`Stat` renders text, not an ARIA progress or meter role. That is correct for a single numeric
fact. Make sure the `label` gives enough context for the number when read on its own. Avoid
communicating trend direction by color alone; the component includes an arrow in the change
line for this reason.

If a stat updates live after load, announce the surrounding region intentionally rather than
making every animation frame a live update.

## Gotchas

- The count-up only fires once per mount via `useInView`; it does not replay every time the
  stat scrolls back into view.
- The animation rounds intermediate values. Do not use it for precision readouts where every
  decimal matters.
- `change` is displayed as a percent with fixed copy, "vs last week". For other comparison
  periods, compose your own text or use `MetricCard`.
- Large prefixes and suffixes can make a dense metric grid uneven; keep labels short.

## Related

- `MetricCard` for richer dashboard cards.
- `UsageRing` and `ProgressRing` for quota or completion percentages.
- `FormattedValue` for reusable numeric formatting.
- `Sparkline` for compact trend context.
