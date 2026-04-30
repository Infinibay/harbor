# OTPInput

Segmented numeric input for one-time passcodes — N boxes, one digit
each, auto-advance, paste-to-fill, arrow-key navigation, and a
green "complete" highlight when every slot is filled. Pair with
`MFASetup` for end-to-end TOTP enrollment, or use standalone for
email/SMS verification flows.

## Import

```tsx
import { OTPInput } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [code, setCode] = useState("");

<OTPInput
  length={6}
  value={code}
  onChange={setCode}
  onComplete={(v) => verify(v)}
/>
```

## Props

- **length** — `number`. Number of slots. Default `6`.
- **value** — `string`. Controlled value (digits only).
- **onChange** — `(v: string) => void`.
- **onComplete** — `(v: string) => void`. Fires once all slots are
  filled.
- **className** — extra classes on the wrapper.

## Notes

- Non-digit input is stripped silently — paste a "123-456" from an
  SMS and you get `123456`.
- Backspace on a filled slot clears it; backspace on an empty slot
  jumps to the previous slot. Arrow keys move without editing.
- Border / background animate purple while typing, green once the
  code is complete.
