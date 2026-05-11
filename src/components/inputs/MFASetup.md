# MFASetup

`MFASetup` is a three-step wizard for enabling authenticator-app based
multi-factor authentication: scan or enter the secret, verify a six-digit code,
then save recovery codes. Harbor supplies the UI flow; your server supplies the
secret, recovery codes, and final verification.

Use it in account security pages, admin onboarding, and high-trust product
workflows.

## Import

```tsx
import { MFASetup } from "@infinibay/harbor/inputs";
```

## Basic Usage

Generate the shared secret and recovery codes on the server, then pass them into
the component.

```tsx
<MFASetup
  user="maya@example.com"
  issuer="Harbor Cloud"
  secret={setup.secret}
  recoveryCodes={setup.recoveryCodes}
  onVerify={(code) => api.security.verifyMFA(code)}
  onComplete={() => navigate("/account/security")}
/>
```

## QR Rendering

Harbor stays dependency-free, so QR rendering is a slot. Without `renderQR`, the
component shows the `otpauth://` URI and manual secret.

```tsx
<MFASetup
  {...setup}
  renderQR={(uri) => <QRCode value={uri} size={160} />}
/>
```

## Verification

`onVerify` may return `true`, `false`, or a string error. Returning a string lets
you show server-specific messages.

```tsx
onVerify={async (code) => {
  const result = await verify(code);
  return result.ok || "That code has expired. Try the next one.";
}}
```

## Props

- `user`: user identifier in the otpauth label.
- `issuer`: authenticator issuer label; defaults to `Infinibay`.
- `secret`: pre-generated base32 shared secret.
- `recoveryCodes`: generated one-time recovery codes.
- `onVerify`: validation callback.
- `onComplete`: called after recovery codes are confirmed.
- `renderQR`: QR rendering slot.
- `className`: wrapper class override.

## Accessibility

The verification input has a numeric keyboard hint and accessible label. Recovery
codes are rendered as text so they can be copied and saved.

Do not auto-complete setup until the user confirms the recovery codes are saved.

## Gotchas

Never generate the MFA secret in the browser for production. Generate and store
it server-side, then enable it only after verification succeeds.

Copy buttons use the Clipboard API when available. Still provide manual text for
fallback.

## Related

- `Wizard` for the underlying step flow.
- `OTPInput` for standalone one-time-code entry.
- `Alert` for security warnings.
- `Dialog` for disabling or rotating MFA.
