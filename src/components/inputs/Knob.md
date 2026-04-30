# Knob

Rotary control driven by vertical drag — pull up to increase, down to
decrease, hold Shift for fine-grained adjustment, double-click to
reset. Useful for dense control surfaces (audio mixers, generative-art
sliders, threshold tuners) where a rotary metaphor reads better than
a horizontal slider.

## Import

```tsx
import { Knob } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<Knob
  label="Gain"
  unit="dB"
  min={-24}
  max={24}
  defaultValue={0}
  onChange={(v) => console.log(v)}
/>
```

## Props

- **value** — `number`. Controlled value.
- **defaultValue** — `number`. Uncontrolled default. Default `50`.
- **onChange** — `(v: number) => void`.
- **min** — `number`. Default `0`.
- **max** — `number`. Default `100`.
- **step** — `number`. Default `1`.
- **size** — `number`. Pixel width/height of the dial. Default `54`.
- **arc** — `number`. Degrees covered by full range. Default `270`
  (i.e. -135° to +135°, leaving a gap at the bottom).
- **label** — `string`. Optional caption rendered below the dial.
- **unit** — `string`. Suffix shown in the drag tooltip.
- **className** — extra classes on the wrapper.

## Notes

- Drag uses pointer capture, so drags work even when the cursor leaves
  the dial — typical for knob UIs.
- Shift slows the speed by 4× for precision.
- Double-click resets to `defaultValue`.
- A live numeric tooltip appears above the dial only while dragging.
