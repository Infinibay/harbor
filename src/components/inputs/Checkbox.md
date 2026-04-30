# Checkbox

Custom-styled checkbox with a gradient fill, spring tap, and animated
checkmark stroke. Renders a real `<input type="checkbox">` under the
hood (visually hidden) so forms, focus rings, and accessibility work
out of the box. Use `<Switch>` for binary on/off settings; reach for
`<Checkbox>` when the value joins a set (multi-select, terms
agreement, "remember me").

## Import

```tsx
import { Checkbox } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  label="Email me a weekly digest"
  description="Sent every Monday at 9am UTC."
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
```

## Props

Extends all native `<input>` attributes (minus `type` and `size`).

- **label** — `string`. Primary label rendered next to the box.
- **description** — `string`. Smaller helper line below the label.
- **checked** / **defaultChecked** — `boolean`. Controlled or
  uncontrolled state.
- **onChange** — `(e: ChangeEvent<HTMLInputElement>) => void`.
- **disabled** — `boolean`. Greys out and blocks pointer events.
- **id** — `string`. Auto-generated from `useId()` when omitted.

## Notes

- The off-state uses literal rgba (not a CSS var) because Framer
  Motion can't interpolate `rgb(var(...) / a)`.
- Wrap in `<label>` automatically — the entire row is clickable.
