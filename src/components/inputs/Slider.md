# Slider

Single-thumb numeric slider — a primitive for picking one value on a
continuous scale. Use it directly when you only need the slider
(e.g. a volume or opacity control); reach for `<SliderField>` when you
also want a labelled icon tile and an exact-entry NumberField beside
it. For two-thumb ranges use `<RangeSlider>`.

## Import

```tsx
import { Slider } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [volume, setVolume] = useState(50);

<Slider
  label="Volume"
  min={0}
  max={100}
  step={1}
  value={volume}
  onChange={setVolume}
/>

<Slider min={0} max={10} step={1} snap={[0, 2.5, 5, 7.5, 10]} />
```

## Props

- **value** — `number`. Controlled value.
- **defaultValue** — `number`. Default `50`. Uncontrolled initial value.
- **onChange** — `(v: number) => void`.
- **min** — `number`. Default `0`.
- **max** — `number`. Default `100`.
- **step** — `number`. Default `1`. Snap increment.
- **label** — `string`. Optional caption above the track.
- **showValue** — `boolean`. Default `true`. Renders the live numeric
  value to the right of the label.
- **snap** — `number[]`. Optional list of "magnetic" stops; the thumb
  jumps to a snap point when within ~3% of it.
- **className** — extra classes on the wrapper.

## Notes

- The track click-and-drag works anywhere on the bar (not just the
  thumb).
- A floating tooltip with the live value appears above the thumb
  while dragging.
- `snap` only nudges values near a stop — it doesn't restrict the
  slider to discrete values; use `step` for that.
