# SocialButton

`SocialButton` renders a branded authentication or connection button for common providers. Use it on sign-in pages, account linking flows, integration setup, workspace invitations, and onboarding screens where users authenticate through an external service.

It is a UI trigger only. Harbor provides the brand styling, icon, default label, and button shape; your app owns OAuth, redirects, popup handling, loading state, errors, and security checks.

## Import

```tsx
import { SocialButton } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
<SocialButton
  provider="github"
  onClick={() => startOAuth("github")}
/>
```

Use `fullWidth` for stacked auth forms:

```tsx
<div className="grid gap-3">
  <SocialButton provider="google" fullWidth onClick={() => startOAuth("google")} />
  <SocialButton provider="github" fullWidth onClick={() => startOAuth("github")} />
</div>
```

## Props

- **provider** - required provider: `"github"`, `"google"`, `"apple"`, `"microsoft"`, `"x"`, `"gitlab"`, `"discord"`, or `"slack"`.
- **label** - optional `ReactNode`. Defaults to `"Continue with {Provider}"`.
- **onClick** - optional callback.
- **fullWidth** - optional boolean. Adds `w-full`.
- **className** - optional string merged onto the button.

## Auth Model

`SocialButton` does not know whether the action is login, signup, connect, or invite acceptance. Choose label copy that matches the flow:

```tsx
<SocialButton provider="slack" label="Connect Slack workspace" />
<SocialButton provider="github" label="Import from GitHub" />
```

Put loading and disabled behavior in the parent until the component supports those states directly.

## Accessibility

The visible label is the accessible text. Avoid icon-only social buttons for auth flows; users should not need to recognize a provider logo to understand the action.

Because the current component does not set `type="button"`, be careful when placing it inside forms. If needed, wrap the flow so pressing it does not accidentally submit another form action.

## Gotchas

- No OAuth is implemented by the component.
- Provider icons are inline SVGs and brand colors are built in.
- There is no `disabled` prop today.
- Use explicit labels for non-auth flows such as `"Connect Discord"` or `"Import from GitLab"`.

## Related

- `Button` for regular app actions.
- `Alert` for OAuth failures.
- `Form` and `TextField` for email/password fallback.
- `Card` for auth panels.
