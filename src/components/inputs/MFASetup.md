# MFASetup

Three-step wizard for enrolling a user in TOTP-based MFA: scan QR,
enter a 6-digit code to verify, save recovery codes. Built on top of
`Wizard`. The shared secret and recovery codes are passed in (the
caller generates them server-side); QR rendering is delegated through
a `renderQR` slot so Harbor stays dependency-free.

## Import

```tsx
import { MFASetup } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<MFASetup
  user="andres@infinibay.dev"
  issuer="Infinibay"
  secret="JBSWY3DPEHPK3PXP"
  recoveryCodes={[
    "8h2k-a91f", "p3z9-x4mq", "2vlm-7rkb", "9qod-1tcj",
    "7eag-5wpu", "rfvy-bn3z", "j40k-cm8e", "u5sx-bv26",
  ]}
  renderQR={(uri) => <QRCode value={uri} size={160} />}
  onVerify={async (code) => verifyTotp(code)}
  onComplete={() => navigate("/settings/security")}
/>
```

## Props

- **user** — `string`. Required. Identifier baked into the
  `otpauth://` URI (typically email or username).
- **issuer** — `string`. Brand label shown in the authenticator app.
  Default `"Infinibay"`.
- **secret** — `string`. Required. Pre-generated base32 shared
  secret. Generate this on the server.
- **recoveryCodes** — `readonly string[]`. Required. Pre-generated
  one-time codes shown on the final step.
- **onVerify** — `(code: string) => Promise<true | false | string> | true | false | string`.
  Validates the 6-digit code. Return `true` to advance, a `string` to
  surface a custom error message, `false` for a generic "Invalid
  code". Defaults to a naive 6-digit length check — the caller
  should usually replace it with a server-side verify.
- **onComplete** — `() => void`. Fired when all three steps succeed.
- **renderQR** — `(uri: string) => ReactNode`. QR renderer. Without
  it, the user sees the raw `otpauth://` URI plus a copyable manual
  secret.
- **className** — extra classes on the wrapper.

## Notes

- Both the QR step and the recovery step include a copyable manual
  secret / "Copy all" button using `navigator.clipboard`.
- The recovery step's "I've saved these codes somewhere safe"
  checkbox is required to advance.
- Secrets are never generated client-side — caller-supplied only.
