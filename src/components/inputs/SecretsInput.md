# SecretsInput

Sensitive-value input — API keys, passwords, tokens — with a
reveal/mask toggle, a copy button, an inline "value visible" warning,
and an optional auto-remask timer. Drop in anywhere a regular
`<TextField>` would expose secrets in plain sight (settings dialogs,
onboarding flows, integration setup).

## Import

```tsx
import { SecretsInput } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<SecretsInput
  label="API key"
  value={key}
  onChange={(e) => setKey(e.target.value)}
  autoReveal={10}
  caption="Rotate every 30 days"
/>;
```

## Props

Extends all native `<input>` attributes except `type` (the component
controls that to switch between password and text).

- **label** — `string`. Optional label above the field.
- **caption** — `string`. Helper text shown below when not revealed.
- **autoReveal** — `number`. Seconds before auto-remasking after a
  reveal. Default `0` (off).
- **copyable** — `boolean`. Default `true`. Shows a Copy button.
- **mask** — `string`. Default `"•"`. Glyph used for the side mask
  preview.
- **onCopy** — `() => void`. Fires after a successful clipboard write.

## Notes

- Reveal flips the underlying `<input>` from `type="password"` to
  `type="text"`. The border tints amber while visible to make it
  obvious.
- Copy uses `navigator.clipboard.writeText` and is silently a no-op
  if the API isn't available (insecure context, denied permission).
- The component is uncontrolled-friendly via `defaultValue`; pass
  `value` + an `onChange` handler for controlled mode.
