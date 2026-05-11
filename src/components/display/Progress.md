# Progress

`Progress` displays task completion as a horizontal bar with optional label,
value text, custom value slot, color tone, shimmer, and indeterminate mode. Use
it for uploads, imports, migrations, setup steps, quota usage, deployment
progress, and background jobs.

Use determinate progress when you know the total work. Use indeterminate
progress when work has started but the system cannot estimate completion yet.

## Import

```tsx
import { Progress } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<Progress
  label="Uploading release"
  value={42}
  max={100}
  showValue
  tone="sky"
/>;
```

With a custom value slot:

```tsx
<Progress
  label="Storage"
  value={usedGb}
  max={limitGb}
  valueSlot={`${usedGb} GB / ${limitGb} GB`}
  tone={usedGb > limitGb * 0.8 ? "amber" : "green"}
/>;
```

## Props

- **value** - `number`. Current value. Default `0`.
- **max** - `number`. Maximum value. Default `100`.
- **label** - `ReactNode`. Optional label shown above the bar.
- **showValue** - `boolean`. Shows the rounded percentage.
- **valueSlot** - `ReactNode`. Replaces the percentage with custom content.
- **tone** - `"purple" | "green" | "amber" | "rose" | "sky"`. Default
  `"purple"`.
- **shimmer** - `boolean`. Adds a shimmer overlay while progress is below 100%.
- **indeterminate** - `boolean`. Shows an animated traveling segment instead of
  determinate width.
- **className** - extra classes on the wrapper.

## Behavior

Determinate progress is calculated as `(value / max) * 100` and clamped between
0 and 100. The filled bar animates toward the latest percentage with a spring
transition.

When `indeterminate` is true, `value` and `max` no longer drive the visual bar.
The component renders a looping segment to indicate ongoing work.

## Accessibility

Always provide nearby text that names the operation. The visual bar itself does
not currently set ARIA progressbar attributes, so the label and value text are
the accessible communication. If a workflow requires formal progressbar
semantics, wrap or extend the component with `role="progressbar"` and
`aria-valuenow` values in your app.

Do not use color alone to indicate danger or success. Pair warning tones with
copy such as `Storage almost full`.

## Gotchas

- `max={0}` would produce an invalid percentage. Keep `max` above zero.
- `valueSlot` wins over `showValue`.
- Shimmer is decorative and only appears in determinate mode while progress is
  below 100%.
- Indeterminate mode should not be used when an accurate percentage is known.

## Related

- `ProgressRing` for radial progress.
- `LoadingOverlay` for blocking loading states.
- `MetricCard` for quota and usage summaries.
- `LiveMigrationIndicator` for source-to-destination progress.
