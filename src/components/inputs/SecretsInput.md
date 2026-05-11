# SecretsInput

`SecretsInput` is an input for sensitive values such as API keys, tokens, passwords, webhook secrets, and license keys. It adds reveal/hide behavior, copy support, masking, and a visible warning while the value is exposed.

Use it in settings and admin screens where users need to inspect or copy a secret without leaving it visible longer than necessary.

## Import

```tsx
import { SecretsInput } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { SecretsInput } from "@infinibay/harbor/inputs";

export function ApiKeyField() {
  const [key, setKey] = useState("sk_live_redacted");

  return (
    <SecretsInput
      label="API key"
      value={key}
      onChange={(event) => setKey(event.target.value)}
      autoReveal={10}
      caption="Rotate this key every 90 days."
      onCopy={() => console.log("copied")}
    />
  );
}
```

## Props

- **autoReveal** - `number`. Seconds before auto-remasking after reveal. Default `0`.
- **copyable** - `boolean`. Shows the copy button. Default `true`.
- **mask** - `string`. Character used for the visual mask. Default `"•"`.
- **onCopy** - `() => void`. Called after successful clipboard write.
- **label** - `string`. Optional label above the input.
- **caption** - `string`. Optional caption shown while hidden.
- Inherits standard input props except `type`, which Harbor controls.

## Behavior

The underlying input switches between `type="password"` and `type="text"`. While hidden, Harbor also renders a visual masked string beside the input using the chosen mask character. Reveal changes the border to amber and shows an inline warning. If `autoReveal` is greater than zero, a timer hides the value again.

Copy uses `navigator.clipboard.writeText(value)` and briefly changes the button label to `copied`.

## Accessibility

Reveal and copy are buttons with native button behavior and titles. The visible warning is text, so users are not relying only on color. For stricter security flows, announce copy/reveal changes with a toast or live region.

## Gotchas

- Clipboard copy works only when the browser allows `navigator.clipboard`.
- `onCopy` fires only after a successful write.
- The component ignores clipboard errors.
- `type` cannot be overridden.

## Related

- `TextField` for normal text entry.
- `PasswordStrength` for password creation.
- `CopyButton` and `CopyCommand` for non-input copy flows.
