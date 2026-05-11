# ProgressRing

`ProgressRing` shows bounded progress as an animated circular meter. Use it for completion, quota, sync progress, health scores, utilization, onboarding steps, and compact dashboard readouts where a linear progress bar would consume too much horizontal space.

The component receives the raw `value` and `max`, clamps the displayed percentage between `0` and `100`, and animates the SVG stroke with Framer Motion. You can let Harbor render the computed percent or provide a custom center label.

## Import

```tsx
import { ProgressRing } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<ProgressRing value={64} max={100} tone="purple" />
```

Use a custom label when the user needs the real unit instead of a percentage:

```tsx
<ProgressRing
  value={18}
  max={24}
  tone="amber"
  label={<span>18h</span>}
/>
```

## Props

- **value** - required number. Current progress value.
- **max** - optional number. Defaults to `100`.
- **size** - optional number in pixels. Defaults to `96`.
- **stroke** - optional stroke width in pixels. Defaults to `8`.
- **label** - optional `ReactNode` rendered in the center. Defaults to the rounded computed percent.
- **tone** - optional `"purple"`, `"green"`, `"amber"`, or `"rose"`. Defaults to `"purple"`.

## Display Model

The ring computes `value / max`, clamps the result, then maps it to `strokeDashoffset`. The track is a low-contrast circle, while the progress stroke uses a tone-specific gradient. The whole SVG is rotated so progress starts at the top, which matches common dashboard expectations.

Choose `size` and `stroke` together. Large rings can handle thicker strokes; small rings need lighter strokes so the center label remains readable.

## Accessibility

`ProgressRing` is visual. If the value matters, wrap it with text or a labelled region:

```tsx
<div role="meter" aria-label="Storage used" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100}>
  <ProgressRing value={64} />
</div>
```

Do not rely on ring color alone for dangerous or degraded states. Pair `rose` or `amber` with copy, an alert, or a status badge.

## Gotchas

- `max` should be greater than zero. A zero max produces invalid percentage math.
- Custom `label` replaces the percent. Include units if the value is not obvious.
- The gradient id is based on tone. Avoid rendering conflicting custom SVG gradient ids with the same names nearby.
- Use `Progress` or a linear meter for long labels and detailed progress descriptions.

## Related

- `Progress` for horizontal progress bars.
- `UsageRing` for usage-specific dashboard treatment.
- `Gauge` for score or threshold displays.
- `MetricCard` for numeric KPI context.
