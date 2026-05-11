# CopyButton

One-click clipboard command with built-in success feedback. Use `CopyButton`
next to code snippets, install commands, API tokens, object IDs, share links,
theme tokens, and any short value where the user's next step is copying a
string exactly.

`CopyButton` owns the clipboard write and temporary `Copied` label. Your app
still owns whether the copied value is safe to expose, whether a secret should
be masked, and whether a failed copy needs stronger recovery UI.

## Import

```tsx
import { CopyButton } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
<CopyButton value="npm install github:Infinibay/harbor#v0.1.1" />

<CopyButton value={apiToken} size="sm">
  Copy token
</CopyButton>
```

## Props

- **value** - required string written to the clipboard on click.
- **children** - optional button label. Defaults to `"Copy"`.
- **size** - `"sm" | "md"`. Default `"md"`.
- **className** - applies to the button wrapper for local layout tweaks.

## Interaction Model

Clicking the button calls `navigator.clipboard.writeText(value)`. On success,
the visible label animates to a green `Copied` state for about 1.5 seconds, then
returns to the original label. The button uses a native click handler and a
Framer Motion press animation.

Clipboard failures are swallowed silently by the component. That keeps the
control lightweight for snippets and docs, but product flows that require copy
guarantees should add surrounding instructions or a fallback.

## Composition Notes

Use `CopyButton` inside `CodeBlock` headers, detail panels, account settings,
developer tools, release pages, and setup documentation. Place it close to the
exact value being copied so there is no ambiguity about what enters the
clipboard.

For long values, keep the value in adjacent text or code and let the button
stay compact. For dangerous values such as secrets, pair it with masking,
permission checks, or an audit event in the parent workflow.

## Accessibility

The button has visible text before and after copy. If you pass custom children,
make the label clear enough to identify the copied value, such as `Copy token`
or `Copy install command`. Do not rely on the icon alone. The `Copied` state is
visual feedback; add external status messaging if a workflow requires screen
reader announcement of the copy result.

## Gotchas

- Clipboard APIs require a secure context in most browsers.
- The component does not expose an `onCopied` callback today.
- Failed writes do not show an error. Wrap the surrounding flow if copy failure
  must be recoverable.
- `value` should be the exact string to copy, not a formatted React node.

## Related Components

`Button`, `CodeBlock`, `CopyCommand`, `TextField`, `SecretsInput`, `Tooltip`,
`Toast`.
