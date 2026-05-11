# CountUp

`CountUp` animates numeric changes with a short ease-out transition. Use it for dashboard metrics, totals, revenue, usage, queue length, build counts, and any number that should feel live when it updates.

The component is intentionally display-only. Your app owns the data source, refresh cadence, formatting rules, and semantic label. Harbor handles the animated interpolation and stable tabular number rendering.

## Import

```tsx
import { CountUp } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<MetricCard
  label="Monthly recurring revenue"
  value={<CountUp value={12540} prefix="$" />}
/>
```

Use `format` for decimals, compact notation, or locale-specific output:

```tsx
<CountUp
  value={99.42}
  suffix="%"
  format={(value) => value.toFixed(1)}
/>
```

## Props

- **value** - required number. The target value to render.
- **duration** - optional number in milliseconds. Defaults to `600`.
- **format** - optional function `(value: number) => string`. Defaults to rounded locale formatting.
- **prefix** - optional string rendered before the formatted value.
- **suffix** - optional string rendered after the formatted value.
- **className** - optional string merged onto the root `<span>`.

## Animation Model

On mount, the internal display state starts at the initial `value`. When `value` changes, Harbor cancels any in-flight animation and interpolates from the currently displayed number to the new target using `requestAnimationFrame` and an ease-out cubic curve.

This makes frequent metric updates feel smooth without requiring parent components to manage animation state.

## Formatting Guidance

Use `format` for anything beyond whole numbers. Currency, percentages, compact notation, and fixed decimals should be explicit:

```tsx
<CountUp
  value={1264000}
  format={(value) =>
    Intl.NumberFormat("en", { notation: "compact" }).format(value)
  }
/>
```

Keep prefixes and suffixes short. If the unit needs explanation, put it in the surrounding label or description.

## Accessibility

Do not use `CountUp` as the only label. Place it inside a labelled metric, table cell, or sentence. If the value updates from live data, decide whether the surrounding region should announce changes; many fast dashboard updates should not be live regions because they become noisy.

## Gotchas

- Very long durations make dashboards feel laggy when data refreshes often.
- `format` receives intermediate values during animation, so it must handle decimals.
- The component animates display only; it does not debounce network updates.
- Rapid `value` changes restart from the current displayed value, not from the previous prop.

## Related

- `MetricCard` for KPI cards.
- `FormattedValue` for static number formatting.
- `Sparkline` for showing recent movement.
- `ProgressRing` for bounded numeric progress.
