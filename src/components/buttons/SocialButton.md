# SocialButton

Branded "Continue with …" button for OAuth / SSO providers. Use it on
sign-in and sign-up surfaces; reach for `<Button>` for any non-provider
action.

## Import

```tsx
import { SocialButton } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<SocialButton provider="github" onClick={() => signIn("github")} />

<SocialButton provider="google" fullWidth onClick={() => signIn("google")} />
```

## Props

- **provider** — `"github" | "google" | "apple" | "microsoft" | "x" | "gitlab" | "discord" | "slack"`.
  Selects the brand colors, glyph, and default label. Required.
- **label** — `ReactNode`. Custom label; falls back to
  `"Continue with <Provider>"`.
- **onClick** — `() => void`.
- **fullWidth** — `boolean`. Stretches to fill the parent.
- **className** — extra classes for the button.

## Notes

- Each provider ships its own background, hover, text color, and inline
  SVG glyph — do not restyle via `className` unless you really need to.
- Provider names match the `SocialProvider` type exported from this file
  (also re-exported from `@infinibay/harbor/buttons`).
- Carries `data-cursor="button"` for the global Harbor cursor.
