# TextField

`TextField` is Harbor's styled single-line input with floating label, hint text, error state, valid state, icon slot, suffix slot, and `FormField` integration. Use it for names, emails, slugs, URLs, search-like form fields, short settings, and inline credential metadata.

It wraps a native `<input>`, so standard input props still work.

## Import

```tsx
import { TextField } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { TextField } from "@infinibay/harbor/inputs";

export function EmailField() {
  const [email, setEmail] = useState("");
  const invalid = email.length > 0 && !email.includes("@");

  return (
    <TextField
      label="Email"
      placeholder="you@company.com"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      error={invalid ? "Enter a valid email address." : undefined}
      valid={email.includes("@")}
      hint="We'll send a verification link."
    />
  );
}
```

## Props

- **label** - `string`. Floating label.
- **hint** - `string`. Helper text shown when there is no error.
- **error** - `string`. Error message and invalid border.
- **valid** - `boolean`. Shows success border and check icon when no error exists.
- **icon** - `ReactNode`. Leading icon slot.
- **suffix** - `ReactNode`. Trailing slot for units, buttons, or badges.
- Inherits standard input props except the native `size` prop.

## Behavior

The label floats when the input is focused or has a value. Placeholder text appears only after the label has floated, which prevents the label and placeholder from overlapping. Error state wins over valid state. Hint text is replaced by the error message while `error` is present.

The component supports controlled and uncontrolled input usage and forwards refs to the underlying input.

## FormField Integration

When used inside `FormField`, `TextField` reads the generated id, described-by id, required state, and invalid state from context. That keeps labels and descriptions wired consistently in larger forms.

## Accessibility

The label uses `htmlFor` and the input receives the same id. `aria-describedby`, `aria-invalid`, and `aria-required` are set from `FormField` context when available. If you pass an error directly, the input is marked invalid.

## Gotchas

- The floating label uses absolute positioning; avoid very long labels.
- `suffix` should be compact so it does not squeeze the input text.
- `valid` is ignored visually when `error` is present.
- Use `Textarea` for multi-line content.

## Related

- `FormField` for full label, description, and error wiring.
- `Textarea` for long input.
- `SearchField` for search-specific interactions.
