# RangeSlider

Two-thumb numeric range input — pick a minimum and maximum on a
continuous scale. Use for price brackets, resource bounds, date-like
ranges already projected to numbers. For a single value reach for
`<Slider>`; for a labelled value with a number field beside it use
`<SliderField>`.

## Import

```tsx
import { RangeSlider } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [bounds, setBounds] = useState<[number, number]>([20, 80]);

<RangeSlider
  label="Price range"
  min={0}
  max={500}
  step={5}
  value={bounds}
  onChange={setBounds}
/>;
```

## Props

- **value** — `[number, number]`. Controlled lower/upper pair.
- **defaultValue** — `[number, number]`. Default `[20, 80]`.
- **onChange** — `(v: [number, number]) => void`.
- **min** — `number`. Default `0`.
- **max** — `number`. Default `100`.
- **step** — `number`. Default `1`. Snap increment.
- **label** — `string`. Optional caption above the track.
- **showValue** — `boolean`. Default `true`. Renders `lo – hi` to the
  right of the label.
- **className** — extra classes on the wrapper.

## Notes

- The thumbs can't cross — the lower thumb is clamped to the upper's
  current value and vice versa.
- Pointer-down on the track grabs the thumb closest to the cursor, so
  users can also click-and-drag from anywhere on the bar.
- A small tooltip with the live value floats above the dragging thumb.
