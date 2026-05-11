# SliderField

`SliderField` combines a draggable `Slider` with an exact `NumberField`. It is
for settings where users need both speed and precision: CPU cores, memory size,
budget caps, opacity, retry count, timeout, volume, or model temperature.

Use it inside a labelled `FormField` or settings section. The component itself
focuses on the control pair, not the field label.

## Import

```tsx
import { SliderField } from "@infinibay/harbor/inputs";
```

## Basic Usage

Control the value from state and pass the same bounds you would give a slider.

```tsx
const [cores, setCores] = useState(8);

<FormField label="CPU allocation">
  <SliderField
    value={cores}
    min={1}
    max={64}
    unit="cores"
    onChange={setCores}
  />
</FormField>
```

## Limits

`limit` clamps the effective maximum without losing the configured maximum. Use
it when availability changes by plan, region, account quota, or runtime state.

```tsx
<SliderField
  value={memory}
  min={1}
  max={128}
  limit={32}
  limitLabel="Max available"
  unit="GB"
  onChange={setMemory}
/>
```

## Icons And Width

Pass `icon` and `tone` to add a leading `IconTile`. Adjust
`numberFieldWidth` when values or units are long.

```tsx
<SliderField
  value={timeout}
  max={300}
  unit="seconds"
  icon={<ClockIcon />}
  tone="sky"
  numberFieldWidth={180}
  onChange={setTimeout}
/>
```

## Props

- `value`: controlled numeric value.
- `min`: minimum; defaults to `0`.
- `max`: required maximum.
- `step`: numeric step; defaults to `1`.
- `onChange`: controlled value callback.
- `unit`: displayed in the number field and limit hint.
- `tone`: icon tile tone.
- `icon`: optional leading icon.
- `limit`: effective maximum clamp.
- `limitLabel`: label for the limit hint.
- `numberFieldWidth`: width of the numeric input area.
- `className`: wrapper class override.

## Accessibility

Use `SliderField` inside `FormField` so the pair has a visible and accessible
label. The slider and number input give users two input methods for the same
value.

When limit changes dynamically, explain why in surrounding text or helper copy.

## Gotchas

`limit` clamps the slider and number field max. If the current value is above the
new effective max, clamp it in parent state to avoid a confusing display.

Keep units short. Very long unit strings need a larger `numberFieldWidth`.

## Related

- `Slider` for slider-only controls.
- `NumberField` for exact numeric input.
- `FormField` for labels, helper text, and errors.
- `IconTile` for the leading icon treatment.
