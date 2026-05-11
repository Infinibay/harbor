# APIKeyCard

`APIKeyCard` and `SSHKeyCard` present credentials as managed account objects:
label, fingerprint, scope, created date, last-used date, privileged warning, and
actions for reveal, copy, rotate, and revoke. They are built for developer
settings, admin security pages, billing portals, and desktop account panels.

Use these cards for non-secret identifiers and management actions. Never render
raw secret values unless the user has explicitly requested reveal in your app.

## Import

```tsx
import { APIKeyCard, SSHKeyCard } from "@infinibay/harbor/display";
```

## Basic Usage

The fingerprint is displayed as passed. Use it for masked keys, short ids, or
public fingerprints.

```tsx
<APIKeyCard
  label="Production deploy key"
  fingerprint="hbr_live_9f4c...82aa"
  scope="read:deploys, write:deploys"
  createdAt="2026-05-01T10:00:00Z"
  lastUsed="2026-05-10T18:20:00Z"
  onCopy={() => toast.push({ title: "Key copied" })}
  onRotate={() => openRotateDialog()}
  onRevoke={() => openRevokeDialog()}
/>
```

## Reveal Flow

`revealed` only changes the button label. Your parent owns the actual secret
fetching, masking, and audit trail.

```tsx
<APIKeyCard
  label="CI token"
  fingerprint={revealed ? secretValue : "hbr_live_••••••82aa"}
  revealed={revealed}
  onReveal={() => setRevealed((value) => !value)}
/>
```

## Privileged Keys

Set `privileged` for broad scopes, production access, or security-sensitive
credentials.

```tsx
<SSHKeyCard label="Release signer" fingerprint={fingerprint} privileged />
```

## Props

- `label`: human-readable key name.
- `fingerprint`: visible identifier or masked value.
- `scope`: comma-separated or free-form scope text.
- `lastUsed`: last usage timestamp.
- `createdAt`: creation timestamp.
- `privileged`: shows a warning strip.
- `revealed`: controls reveal button label.
- `onReveal`, `onCopy`, `onRotate`, `onRevoke`: optional actions.
- `extra`: extra content slot.
- `className`: wrapper class override.

## Accessibility

Actions render as real buttons. Keep destructive flows, such as revoke, behind a
confirmation dialog. The privileged label is visible text, not only color.

## Gotchas

Copy uses `navigator.clipboard` when available and still calls `onCopy`. Do not
assume clipboard success inside the parent callback.

The component does not fetch or mask secrets by itself. Treat reveal as a
security workflow owned by the application.

## Related

- `BillingCard` for subscription/account status.
- `Dialog` for revoke confirmation.
- `Toast` for copy and rotate confirmations.
- `Timestamp` for credential dates.
