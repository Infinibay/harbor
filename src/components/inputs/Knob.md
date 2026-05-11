# Knob

`Knob` is a compact rotary-style numeric control for dense creative and technical interfaces. Use it for gain, mix, pan, opacity, threshold, radius, intensity, speed, and other values where a small vertical drag control is more efficient than a full slider.

It is especially useful in inspectors, audio tools, canvas property panels, color controls, and simulation settings.

## Import

```tsx
import { Knob } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { Knob } from "@infinibay/harbor/inputs";

export function GainControl() {
  const [gain, setGain] = useState(0);

  return (
    <Knob
      label="Gain"
      unit="dB"
      value={gain}
      onChange={setGain}
      min={-24}
      max={24}
      step={1}
      defaultValue={0}
    />
  );
}
```

## Props

- **value** - `number`. Controlled value.
- **defaultValue** - `number`. Uncontrolled initial value and double-click reset target. Default `50`.
- **onChange** - `(value: number) => void`. Called as the user drags or resets.
- **min** - `number`. Minimum value. Default `0`.
- **max** - `number`. Maximum value. Default `100`.
- **step** - `number`. Rounding increment. Default `1`.
- **size** - `number`. Control size in pixels. Default `54`.
- **label** - `string`. Optional label under the knob.
- **unit** - `string`. Optional unit shown in the drag tooltip.
- **arc** - `number`. Degrees covered by the range. Default `270`.
- **className** - extra classes on the wrapper.

## Behavior

Drag upward to increase and downward to decrease. Holding Shift uses finer movement. Double-click resets the value to `defaultValue`. The current value is clamped into `[min, max]`, rounded to `step`, and mapped onto the configured arc.

The SVG track uses a gradient fill for the active arc and a line indicator from the center to the current angle.

## Accessibility

The current implementation is pointer-first and does not expose slider roles, keyboard controls, or ARIA value attributes. For settings that must be keyboard accessible, provide a paired `NumberField`, shortcuts, or an alternate control.

## Gotchas

- `max` must be greater than `min`.
- `step` should be positive.
- Controlled usage requires updating `value` from `onChange`.
- The SVG gradient id is static, so many knobs on the same page share the same gradient definition.

## Related

- `Slider` for a horizontal single-value control.
- `RangeSlider` for intervals.
- `NumberField` for precise numeric entry.
