# ColorSwatch

Constrained palette picker — a row of round swatches, the selected
one ringed and checked. Use when the choices are a small fixed
palette (theme accent, tag color, label color); use `<ColorPicker>`
for arbitrary values.

## Import

```tsx
import { ColorSwatch } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [accent, setAccent] = useState("#a855f7");

<ColorSwatch
  label="Accent"
  value={accent}
  onChange={setAccent}
  colors={["#a855f7", "#38bdf8", "#34d399", "#fbbf24", "#fb7185"]}
/>
```

## Props

- **colors** — `string[]`. The palette. Required.
- **value** — `string`. Currently selected color (matched by string
  equality).
- **onChange** — `(c: string) => void`.
- **label** — `string`. Optional small label above the row.
- **className** — extra classes on the wrapper.

## Notes

- Swatches use `motion.button` for spring hover/tap; the cursor
  label (used by Harbor's custom cursor) shows the hex on hover.
- The check mark uses a text shadow so it stays legible on light
  swatches like `#ffffff`.
