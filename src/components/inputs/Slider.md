# Slider

`Slider` is a controlled or uncontrolled numeric range control with Harbor styling, animated
track fill, optional label, value display, drag tooltip, and snap markers.

Use it for tuning values where approximate adjustment is natural: volume, threshold, opacity,
sampling rate, budget percentage, zoom, quality, and simulation parameters. For exact numeric
entry, pair it with `NumberField`.

## Import

```tsx
import { Slider } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [threshold, setThreshold] = useState(70);

<Slider
  label="Alert threshold"
  value={threshold}
  min={0}
  max={100}
  step={5}
  snap={[50, 75, 90]}
  onChange={setThreshold}
/>
```

## Value Model

Pass `value` for controlled usage. Omit it and use `defaultValue` for local uncontrolled
state. Pointer movement is converted to a value between `min` and `max`, rounded to `step`,
then optionally snapped to the nearest value in `snap` when close enough.

The component calls `onChange` whenever the user drags or clicks the track. If `value` is
controlled, the parent must update it for the thumb to move.

## Props

- **value** - controlled value.
- **defaultValue** - initial uncontrolled value. Default `50`.
- **min** / **max** - numeric range. Defaults `0` and `100`.
- **step** - increment. Default `1`.
- **onChange** - `(value: number) => void`.
- **label** - optional label above the track.
- **showValue** - whether to display the current value. Default `true`.
- **snap** - optional snap points.
- **className** - extra classes on the wrapper.

## Accessibility

The current implementation is pointer-first and does not use a native `<input type="range">`.
Use it for visual tuning surfaces where pointer interaction is expected, and provide a
`NumberField` or preset controls when keyboard precision is required.

If you use only `Slider`, keep the visible `label` and value display enabled so the meaning
and current state are clear.

## Gotchas

- `max` must be greater than `min`; the component does not guard invalid ranges.
- `onChange` can fire frequently while dragging.
- Snap points use a proximity threshold based on the full range.
- Displayed values are raw numbers; format units in nearby copy or compose a custom label.

## Related

- `RangeSlider` for two-ended ranges.
- `NumberField` for exact values.
- `Knob` for compact rotary controls.
- `Scrubber` for media timelines.
