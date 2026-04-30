# PasswordStrength

Four-segment strength meter with a short label ("Weak" → "Very
strong"). The score is computed from the password value — length,
case mix, digits, symbols — with light penalties for obvious
patterns (`123abc`, `password`, repeat-only strings). Drop it under
a password field as the user types.

## Import

```tsx
import { PasswordStrength } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [pw, setPw] = useState("");

<TextField type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
<PasswordStrength value={pw} />
```

## Props

- **value** — `string`. Required. The password to score.
- **labelOverride** — `ReactNode`. Replace the computed text label —
  use this when you have a stronger scorer (e.g. `zxcvbn`) and want
  to keep the bar UI but show your own label.
- **showLabel** — `boolean`. Hide the label and render bars only.
  Default `true`.
- **className** — extra classes on the wrapper.

## Notes

- Built-in scoring is deliberately lightweight — it gives helpful
  feedback as the user types, but for real policy enforcement run a
  proper estimator server-side.
- The bar tone (rose / amber / sky / green) tracks the level. Empty
  string maps to level 0; any typed value is at least "Weak".
- Marked `role="status"` with `aria-live="polite"` so screen readers
  announce the level change.
