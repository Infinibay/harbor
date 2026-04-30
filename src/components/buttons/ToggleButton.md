# ToggleButton

A two-state, controlled button for binary settings (Bold on/off, mute
on/off, filter active/inactive). Use it when the value is *persistent*
state, not a one-shot action — reach for `<Button>` for actions and
`<ButtonGroup>` for mutually exclusive choices.

## Import

```tsx
import { ToggleButton } from "@infinibay/harbor/buttons";
```

## Example

```tsx
const [bold, setBold] = useState(false);

<ToggleButton pressed={bold} onChange={setBold} icon={<BoldIcon />}>
  Bold
</ToggleButton>
```

## Props

- **pressed** — `boolean`. Controlled pressed state. Required.
- **onChange** — `(pressed: boolean) => void`. Fires with the next state
  when the user clicks.
- **icon** — `ReactNode`. Optional leading glyph.
- **children** — `ReactNode`. Label content.
- **size** — `"sm" | "md" | "lg"`. Default: `"md"`.
- **disabled** — `boolean`.
- **className** — extra classes for the button.

## Notes

- Always controlled — there is no internal state. Wrap in your own
  `useState` (the playground does this for the demo).
- Sets `aria-pressed={pressed}` so assistive tech reports the toggle
  state correctly.
- Pressed style is a fuchsia tinted background plus a glowing ring;
  unpressed uses the standard translucent chip. Reacts to cursor
  proximity via `useCursorProximity`.
