# ColorPicker

`ColorPicker` is a controlled HSV color picker with a saturation/value pad, hue
track, hex input, RGB readout, copy action, and optional swatches. Use it when a
user needs to choose a custom color for a theme, label, chart series, workspace,
profile, or visual editor.

For fixed brand palettes or small option sets, use `ColorSwatch` instead. A full
picker is best when free choice is part of the product workflow.

## Import

```tsx
import { ColorPicker } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [accent, setAccent] = useState("#a855f7");

<ColorPicker
  value={accent}
  onChange={setAccent}
  swatches={["#a855f7", "#38bdf8", "#34d399", "#fb7185"]}
/>
```

A typical settings form stores the selected hex value and applies it to a theme
preview:

```tsx
<ColorPicker value={brandColor} onChange={setBrandColor} />
<Card style={{ borderColor: brandColor }} title="Workspace preview" />
```

## Props

- **value** - `string`. Hex color in `#rrggbb` format. Default `"#a855f7"`.
- **onChange** - `(hex: string) => void`. Fires on pad drag, hue drag, valid hex
  input, and swatch selection.
- **swatches** - `string[]`. Quick-pick colors shown below the picker. Pass an
  empty array to hide swatches. Defaults to Harbor's starter palette.
- **className** - extra classes on the outer card.

## Interaction Model

The component stores color internally as HSV. That keeps hue stable while users
drag through white, gray, or black areas where raw RGB would otherwise lose the
original hue. Every user action emits a normalized six-digit hex string.

Pointer capture keeps drags active after the pointer leaves the pad or hue track,
so the interaction feels continuous instead of cutting off at the component
edge.

## Input Rules

The text input accepts six-digit hex values with or without `#`. Invalid text is
ignored until it becomes a valid color. The component does not currently support
alpha, HSL input, RGB text input, named colors, or three-digit shorthand.

Swatches are compared by their lower-case hex value. Keep swatch values
normalized to avoid surprising selected-state mismatches.

## Accessibility

The hex input and swatch buttons are keyboard reachable. The visual color pad and
hue track are pointer-first controls, so keep the hex input visible for keyboard
and assistive-technology users.

Do not communicate meaning by color alone. When colors represent states, include
labels, icons, or text in the UI that uses the chosen color.

## Gotchas

- If `value` is invalid, Harbor falls back to its default purple HSV state.
- `onChange` fires frequently while dragging; debounce expensive persistence or
  network writes in your application.
- There is no alpha channel. Use a separate opacity control when users need
  translucent colors.

## Related

- `ColorSwatch` for fixed palettes.
- `ThemeProvider` / `HarborProvider` for applying selected colors to an app.
- `FieldSet` and `Form` for settings pages.
- `CopyButton` for copying color values outside the picker.
