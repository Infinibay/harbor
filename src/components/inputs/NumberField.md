# NumberField

`NumberField` is a compact numeric stepper with decrement/increment buttons,
optional label, optional unit, min/max clamping, and animated value transitions.
Use it for quantities, memory size, retry counts, replicas, timeouts, limits, and
other small numeric settings where stepping is safer than free typing.

## Import

```tsx
import { NumberField } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [replicas, setReplicas] = useState(3);

<NumberField
  label="Replicas"
  value={replicas}
  min={1}
  max={12}
  step={1}
  onChange={setReplicas}
/>;
```

With units:

```tsx
<NumberField label="Memory" value={memoryGb} unit="GB" step={2} onChange={setMemoryGb} />
```

## Props

- **value** - `number`. Controlled value.
- **defaultValue** - `number`. Initial uncontrolled value. Default `0`.
- **min** - `number`. Minimum allowed value. Default `-Infinity`.
- **max** - `number`. Maximum allowed value. Default `Infinity`.
- **step** - `number`. Amount added or subtracted per click. Default `1`.
- **onChange** - `(value: number) => void`. Fires with the clamped next value.
- **label** - `string`. Optional visible label.
- **unit** - `string`. Optional suffix rendered beside the value.
- **className** - extra classes on the wrapper.

## Behavior

Clicking `-` or `+` computes the next value, clamps it between `min` and `max`,
updates internal state in uncontrolled mode, and calls `onChange`. The displayed
number animates up or down based on the previous value.

## Accessibility

Use `label` or an external `FormField` so users understand what the number
controls. The component uses buttons, so pointer and keyboard activation work,
but it is not a native text input and does not support manual typing.

## Gotchas

- This is a stepper, not a numeric text field.
- In controlled mode, the parent must update `value`.
- `step` should match the domain; avoid allowing invalid values that the backend
  later rejects.
- Very large values may not fit the compact center display.

## Related

- `Slider` and `RangeSlider` for continuous numeric adjustment.
- `TextField` for typed numeric input.
- `FormField` for labels, hints, and errors.
- `InspectorNumber` for canvas/editor property panels.
