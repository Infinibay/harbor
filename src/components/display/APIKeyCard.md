# APIKeyCard / SSHKeyCard

A credentials tile — label, fingerprint, scope, last-used time, and the
common Reveal / Copy / Rotate / Revoke action row. Two named exports
share one implementation: `<APIKeyCard>` (kind `"api"`, lock icon) and
`<SSHKeyCard>` (kind `"ssh"`, key icon).

## Import

```tsx
import { APIKeyCard, SSHKeyCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<APIKeyCard
  label="Deploy bot"
  fingerprint="prod_aB3f…7Q1"
  scope="read:events, write:deploys"
  createdAt="2026-02-12"
  lastUsed={Date.now() - 30 * 60 * 1000}
  privileged
  onReveal={() => unmask(id)}
  onCopy={() => track("copy", id)}
  onRotate={() => rotate(id)}
  onRevoke={() => revoke(id)}
/>
```

## Props

- **label** — `string`. Required. Human-readable name.
- **fingerprint** — `string`. Required. Visible identifier — **not the
  secret**. Mask secrets server-side.
- **scope** — `string`. Free-form scope list shown under the label.
- **createdAt** — `Date | string | number`.
- **lastUsed** — `Date | string | number`.
- **privileged** — `boolean`. Renders a red border + "privileged" chip.
- **revealed** — `boolean`. Toggles the Reveal button label between
  `"Reveal"` and `"Hide"`. The component never masks the fingerprint
  itself — swap the value you pass in alongside this flag.
- **onReveal** / **onRotate** / **onRevoke** — `() => void`. Each
  button is hidden when its callback is omitted.
- **onCopy** — `() => void`. Fires alongside the built-in
  `navigator.clipboard.writeText(fingerprint)` call.
- **extra** — `ReactNode`. Slot above the action row (e.g. usage stats).
- **className** — extra classes on the wrapper.

## Notes

- The Copy button shows a "✓ copied" confirmation for 1.5s after a
  successful clipboard write.
- The component never displays the actual secret — only the
  fingerprint/identifier passed in. Use `onReveal` to drive your own
  modal that decrypts and displays the secret.
- `<SSHKeyCard>` accepts the same props as `<APIKeyCard>`; only the
  leading icon changes.
