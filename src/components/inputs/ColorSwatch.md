# ColorSwatch

`ColorSwatch` renders a labelled palette of circular color buttons. Use it for theme accents, chart series colors, avatar colors, label colors, canvas object fills, dashboard customization, and any workflow where the available colors are intentionally constrained.

Harbor handles the visual selection state, hover/tap motion, cursor metadata, and checkmark. Your app owns the selected value and updates it through `onChange`.

## Import

```tsx
import { ColorSwatch } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const colors = ["#a855f7", "#38bdf8", "#34d399", "#fbbf24", "#fb7185"];
const [accent, setAccent] = useState(colors[0]);

<ColorSwatch
  label="Accent color"
  colors={colors}
  value={accent}
  onChange={setAccent}
/>
```

Use it beside a preview when color changes are visual:

```tsx
<FieldRow label="Chart color">
  <ColorSwatch colors={chartColors} value={seriesColor} onChange={setSeriesColor} />
</FieldRow>
```

## Props

- **colors** - required `string[]`. Each string is used as the CSS background and as the emitted value.
- **value** - optional selected color string.
- **onChange** - optional callback `(color: string) => void`.
- **label** - optional string rendered above the palette.
- **className** - optional string merged onto the root element.

## State Model

`ColorSwatch` is controlled. It does not store the selected color internally. Pass `value` from state and update it in `onChange`. If `value` does not match any color, no swatch appears selected.

The component accepts any valid CSS background string, including hex, rgb, named colors, and gradients. For predictable selection, use stable exact strings.

## Accessibility

Each swatch is a native button, but the current accessible name comes from cursor metadata rather than a dedicated `aria-label`. For production color pickers, wrap the control in a labelled field and consider adding explicit labels if colors have semantic names like `"Production"`, `"Warning"`, or `"Brand purple"`.

Do not rely on color alone for meaning. If color maps to status, show a text label or preview beside the swatch.

## Gotchas

- `onChange` is optional, but without it the user can click and nothing will persist.
- Exact string matching controls selection. `"#fff"` and `"#ffffff"` are different values.
- Very light colors can reduce checkmark contrast. Test your palette on the Harbor surface.
- For arbitrary color input, pair this with a text field or full color picker.

## Related

- `ColorPicker` for freeform color selection.
- `FieldRow` for labelled settings rows.
- `SegmentedControl` for small option sets that are not colors.
- `Badge` and `Tag` for showing selected labels.
