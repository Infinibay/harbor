# SliderField

Composite control: leading icon tile + `<Slider>` + trailing
`<NumberField>`. Use for any labelled resource picker where the user
benefits from both drag-to-adjust and exact-entry — vCPU count, RAM,
disk size, concurrency limits. For a bare slider primitive use
`<Slider>`; for a two-thumb range use `<RangeSlider>`.

## Import

```tsx
import { SliderField } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [cores, setCores] = useState(4);

<SliderField
  value={cores}
  onChange={setCores}
  min={1}
  max={64}
  unit="cores"
  icon={<CpuIcon />}
  tone="sky"
  limit={32}
  limitLabel="Max available"
/>;
```

## Props

- **value** — `number`. Required. Controlled value.
- **onChange** — `(v: number) => void`. Required.
- **min** — `number`. Default `0`.
- **max** — `number`. Required. Upper bound of the slider.
- **step** — `number`. Default `1`.
- **unit** — `string`. Suffix shown inside the NumberField (e.g.
  `"GB"`, `"cores"`).
- **tone** — `"sky" | "green" | "purple" | "amber" | "rose" | "neutral"`.
  Default `"purple"`. Colors the leading IconTile.
- **icon** — `ReactNode`. Optional leading icon (rendered inside an
  `<IconTile>`).
- **limit** — `number`. Optional cap that clamps the effective max
  below `max` and surfaces a hint line under the slider.
- **limitLabel** — `string`. Label for the limit hint
  (e.g. `"Max available"`). Only shown when `limit` is set.
- **numberFieldWidth** — `number | string`. Width of the trailing
  NumberField. Default `144` (no unit) / `160` (with unit). Bump this
  for longer values or unit strings.
- **className** — extra classes on the row.

## Notes

- Drag and number entry stay in sync — both edit the same `value` via
  `onChange`.
- When `limit < max` the slider becomes shorter visually (its `max`
  is clamped to `limit`); use `limit` for soft caps like quota
  remaining.
- `tone` only affects the IconTile color — the slider track gradient
  is fixed.
