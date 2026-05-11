# PasswordStrength

`PasswordStrength` renders a four-segment password strength meter with a short text label. Use it beside password creation fields, account setup forms, reset flows, and security settings where users benefit from immediate feedback.

The scoring is intentionally simple. It is a UX hint, not a security policy or breach-password detector.

## Import

```tsx
import { PasswordStrength } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { PasswordStrength, TextField } from "@infinibay/harbor/inputs";

export function PasswordField() {
  const [password, setPassword] = useState("");

  return (
    <div className="grid gap-2">
      <TextField
        type="password"
        label="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <PasswordStrength value={password} />
    </div>
  );
}
```

## Props

- **value** - `string`. Required password text to score.
- **labelOverride** - `ReactNode`. Replaces the computed label while keeping computed bar fill and tone.
- **showLabel** - `boolean`. Default `true`. Pass `false` for bars only.
- **className** - extra classes on the wrapper.

## Scoring Model

The component awards points for length, mixed case, digits, and symbols. Repeated characters and obvious prefixes such as `123`, `abc`, `qwerty`, and `password` cap the score at weak.

Levels are `Empty`, `Weak`, `Fair`, `Strong`, and `Very strong`. Four visible bars represent levels 1 through 4.

## Behavior

The component recomputes the score with `useMemo` whenever `value` changes. Bars animate their opacity and scale when strength changes. The label color follows the computed tone: rose, amber, sky, or green.

## Accessibility

The wrapper uses `role="status"` and `aria-live="polite"`, so label changes can be announced. Keep `showLabel` enabled when this feedback matters. If you hide the label, provide equivalent text elsewhere.

## Gotchas

- This is not a replacement for server-side password policy.
- `labelOverride` changes only the displayed label, not the computed bars.
- Empty values render the `Empty` label with no filled bars.
- Do not expose the password value in logs or analytics while wiring this component.

## Related

- `TextField` for password input.
- `MFASetup` for second-factor setup.
- `SecretsInput` for secret-style inputs.
