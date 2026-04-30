# Switch

Animated on/off toggle with optional label and description text.
Supports both controlled (`checked`) and uncontrolled (`defaultChecked`)
modes, and reacts to cursor proximity with a subtle nudge + glow on
the track. Reach for `Switch` for binary preferences ("Email digest",
"Auto-update"); use `<Checkbox>` for items that participate in form
submissions or multi-select lists.

## Import

```tsx
import { Switch } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<Switch
  label="Email notifications"
  description="Receive a digest every Monday."
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

## Props

- **label** — `string`. Optional label rendered next to the track.
- **description** — `string`. Smaller helper text below the label.
- **size** — `"sm" | "md"`. Default `"md"`.
- **checked** / **defaultChecked** — `boolean`. Controlled / uncontrolled
  state.
- **onChange** — `(e: ChangeEvent<HTMLInputElement>) => void`. Native
  checkbox change event.
- Plus all standard `HTMLInputElement` attributes except `size` and
  `type` (the type is fixed to `checkbox`).

## Notes

- The visible track is a `<motion.span>` over a hidden `<input
  type="checkbox">` — the input is the source of truth for keyboard,
  forms, and accessibility.
- A `useCursorProximity` hook drives a tiny knob nudge and track glow
  when the pointer is within ~60px.
