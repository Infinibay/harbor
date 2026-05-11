# OTPInput

`OTPInput` renders a multi-slot numeric one-time-code input. Use it for two-factor authentication, email verification, phone verification, recovery codes, invite confirmation, and other short numeric token workflows.

It supports controlled and uncontrolled usage, digit-only input, paste handling, arrow navigation, backspace behavior, completion styling, and an `onComplete` callback.

## Import

```tsx
import { OTPInput } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [code, setCode] = useState("");

<OTPInput
  length={6}
  value={code}
  onChange={setCode}
  onComplete={(value) => verifyCode(value)}
/>
```

Shorter code:

```tsx
<OTPInput length={4} onComplete={submitPin} />
```

## Props

- **length** - optional number. Defaults to `6`.
- **value** - optional string. Controlled value.
- **onChange** - optional callback `(value: string) => void`.
- **onComplete** - optional callback `(value: string) => void`, fired when all slots are filled.
- **className** - optional string merged onto the root.

## Input Model

Every slot is a single-character input. Non-digits are stripped. Typing a digit updates that slot and moves focus forward. Backspace deletes the current digit; when the slot is empty, it moves back and deletes the previous digit. Left and right arrows move focus between slots.

Pasting text extracts digits, truncates to `length`, fills the value, and focuses the final filled slot.

## State And Verification

For server verification, keep `onComplete` idempotent. It is called from an effect whenever the current value length equals `length`, so parent re-renders around a complete value can call verification more than once if the callback is not stable.

Disable or ignore repeated verification attempts in the parent while a request is pending.

## Accessibility

The component uses numeric inputs with `inputMode="numeric"`, but the slots do not currently have individual labels. Place the input under a visible form label and provide clear instructions such as `"Enter the 6-digit code we sent to your email"`.

Show validation errors outside the component with `Alert`, `FormField`, or local error text.

## Gotchas

- Only digits are accepted.
- `onComplete` should be idempotent.
- The component does not include resend-code, timeout, or verification loading UI.
- Password managers and SMS autofill behavior can vary by browser and platform.

## Related

- `MFASetup` for broader multi-factor setup flows.
- `TextField` for fallback manual code entry.
- `Alert` for verification errors.
- `Button` for resend and submit actions.
