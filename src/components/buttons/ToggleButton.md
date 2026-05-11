# ToggleButton

`ToggleButton` is a pressable on/off button for binary modes. It is useful for
editor formatting, view modes, filter toggles, drawing tools, inspector switches,
and compact toolbar controls where a normal checkbox would feel too heavy.

It is controlled by design: pass `pressed`, update it from `onChange`, and use
the resulting state to drive the product behavior.

## Import

```tsx
import { ToggleButton } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
const [bold, setBold] = useState(false);

<ToggleButton pressed={bold} onChange={setBold}>
  Bold
</ToggleButton>
```

With an icon:

```tsx
<ToggleButton
  pressed={snapToGrid}
  onChange={setSnapToGrid}
  icon={<GridIcon />}
>
  Snap
</ToggleButton>
```

## Props

- **pressed** - `boolean`. Required. Current on/off state.
- **onChange** - `(pressed: boolean) => void`. Called with the next state.
- **icon** - `ReactNode`. Optional leading icon.
- **children** - `ReactNode`. Optional text label.
- **size** - `"sm" | "md" | "lg"`. Default `"md"`.
- **disabled** - `boolean`. Disables interaction and dims the button.
- **className** - extra classes on the button.

## Behavior

Clicking the button calls `onChange(!pressed)`. The component does not update
itself internally, so the parent must pass the new `pressed` value back in.

The pressed state changes the tone, border, and focus ring treatment. The button
also has subtle cursor-proximity motion via Framer Motion to match other Harbor
controls.

## Accessibility

`ToggleButton` sets `aria-pressed`, which is the correct semantic for a toggle
button. Keep a visible text label when the icon is not universally clear. For
icon-only toolbar controls, provide accessible labeling through surrounding
toolbar patterns or wrapper attributes.

Use `disabled` only when the mode is genuinely unavailable. If the user needs to
know why, explain it nearby.

## Gotchas

- This is not a checkbox replacement for long forms. Use `Checkbox` or `Switch`
  when the control is a setting with explanatory label text.
- `onChange` is optional for read-only displays, but without it the button will
  not change state.
- Avoid mixing too many toggle buttons with unrelated actions in the same group;
  mode state should stay visually obvious.

## Related

- `ButtonGroup` for grouped toolbar controls.
- `Switch` for settings toggles.
- `Checkbox` for form booleans.
- `Toolbar` for editor and canvas command surfaces.
