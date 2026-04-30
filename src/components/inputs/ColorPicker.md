# ColorPicker

Full-fat HSV color picker — saturation/value pad, hue track, hex
input, RGB readout, copy button, and an optional swatch grid. Use
when the user needs free choice; reach for `<ColorSwatch>` when the
choices are constrained to a brand palette.

## Import

```tsx
import { ColorPicker } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [color, setColor] = useState("#a855f7");

<ColorPicker
  value={color}
  onChange={setColor}
  swatches={["#a855f7", "#38bdf8", "#34d399", "#fb7185"]}
/>
```

## Props

- **value** — `string`. Hex (`#rrggbb`). Default `"#a855f7"`.
- **onChange** — `(hex: string) => void`. Fires on drag, hex input,
  or swatch click.
- **swatches** — `string[]`. Quick-pick row at the bottom. Pass `[]`
  to hide it. Defaults to a 9-color palette.
- **className** — extra classes on the outer card.

## Notes

- Internally state is HSV, not hex, so dragging at full-white
  saturation doesn't lose the hue.
- `pointerCapture` is used so a drag started inside the component
  keeps emitting until pointer-up, even if it leaves the surface.
- The hex input commits only on a valid 6-digit match (with or
  without leading `#`).
