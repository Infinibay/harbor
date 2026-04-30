# NumberField

Compact stepper input — minus / number / plus — with an animated
digit roll on change. Use this for bounded integer quantities (memory
GB, replica count, retention days) where dragging or typing freely
would be overkill. For continuous values use `Slider`; for unbounded
free typing use a `TextField` with `type="number"`.

## Import

```tsx
import { NumberField } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [count, setCount] = useState(8);

<NumberField
  label="Memory"
  unit="GB"
  min={1}
  max={64}
  step={1}
  value={count}
  onChange={setCount}
/>
```

## Props

- **value** — `number`. Controlled value.
- **defaultValue** — `number`. Uncontrolled default. Default `0`.
- **onChange** — `(v: number) => void`.
- **min** — `number`. Default `-Infinity`.
- **max** — `number`. Default `Infinity`.
- **step** — `number`. Default `1`.
- **label** — `string`. Optional caption above the field.
- **unit** — `string`. Suffix shown next to the number.
- **className** — extra classes on the wrapper.

## Notes

- The number itself is read-only — to allow typing wrap a `TextField`
  in your own form. Keeping it pure-stepper avoids edge cases like
  partial input ("1." or "-").
- The roll-up / roll-down direction follows the trend of the change,
  driven by Framer Motion `popLayout`.
