# Radio

Single-select option card. Use `<Radio>` inside a `<RadioGroup>` for
exclusive choices where each option deserves a label and short
description (instance sizes, plan tiers, region picks). For terse
inline choices prefer `<ToggleGroup>`; for many options prefer
`<Select>`.

## Import

```tsx
import { Radio, RadioGroup } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [size, setSize] = useState("medium");

<RadioGroup value={size} onChange={setSize}>
  <Radio value="small" label="Small (1 vCPU, 2GB)" description="Free tier" />
  <Radio value="medium" label="Medium (2 vCPU, 4GB)" description="Standard" />
  <Radio value="large" label="Large (4 vCPU, 8GB)" description="Memory-bound" />
</RadioGroup>
```

## Props (`<RadioGroup>`)

- **value** — `string`. Required. Currently selected option value.
- **onChange** — `(v: string) => void`. Required.
- **name** — `string`. Form field name; auto-generated via `useId` if
  omitted.
- **orientation** — `"vertical" | "horizontal"`. Default `"vertical"`.
  Horizontal wraps with `flex-wrap`.
- **className** — extra classes on the wrapper.
- **children** — `<Radio>` nodes.

## Props (`<Radio>`)

- **value** — `string`. Required. Identifier this option commits when picked.
- **label** — `string`. Required.
- **description** — `string`. Optional secondary line.
- **disabled** — `boolean`.
- **className** — extra classes on the option card.

## Notes

- `<Radio>` throws if rendered outside `<RadioGroup>` — the group
  owns the selected value and the shared `name`.
- The selected card animates a gradient dot in via `framer-motion`
  spring; non-interactive content is fully accessible (uses a real
  `<input type="radio">` under the hood).
