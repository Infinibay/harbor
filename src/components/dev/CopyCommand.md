# CopyCommand

`CopyCommand` presents one or more shell commands with a reliable copy action.
It is built for documentation pages, onboarding checklists, release notes, and
CLI-heavy product flows where users need to choose the command for their package
manager, platform, or install method.

When multiple variants are provided, Harbor renders compact tabs and remembers
the selected tab in `localStorage`. When a single variant is provided, the tabs
disappear and the component behaves like a clean copyable command block.

## Import

```tsx
import { CopyCommand } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
<CopyCommand
  storageKey="harbor-install-command"
  variants={[
    {
      label: "Git tag",
      code: "npm install git+ssh://git@github.com:infinibay/harbor.git#v0.8.0",
    },
    {
      label: "Local path",
      code: "npm install ../harbor/releases/infinibay-harbor-0.8.0.tgz",
    },
  ]}
/>
```

Use labels that describe the user's decision, not implementation details. For
example, prefer `Git tag`, `Local tgz`, or `Tauri app` over `Option A`.

## Props

- **variants** - `readonly CommandVariant[]`. Required. Empty arrays render
  nothing.
- **storageKey** - `string`. Key used to remember the selected variant in
  `localStorage`. If omitted, Harbor derives one from the variant labels.
- **showPrompt** - `boolean`. Adds a `$` prompt to command lines. Default `true`.
  Lines starting with `#` are treated as comments and do not receive a prompt.
- **className** - extra classes on the wrapper.

## CommandVariant

```ts
type CommandVariant = {
  label: string;
  code: string;
  language?: string;
};
```

`code` may contain multiple lines. `language` is a semantic hint for consumers
and examples; the current component does not run syntax highlighting from it.

## Behavior

The active variant is controlled internally. On first render, Harbor tries to
restore the last selected label from `localStorage`. If that label is missing or
no longer exists, it falls back to the first variant.

Clicking `Copy` writes the active variant's raw `code` to
`navigator.clipboard.writeText`. The copied state lasts for 1.5 seconds, which
is long enough to confirm the action without leaving stale success UI on screen.

## Accessibility

Tabs are rendered as buttons, so they are keyboard focusable and announce their
selected state visually through Harbor styling. Keep variant labels short enough
to scan, and make sure adjacent prose explains what the command does before the
user copies it.

The copy action depends on the browser Clipboard API. In locked-down browsers or
non-secure contexts, clipboard writes may fail; keep the command text visible so
users can still select and copy manually.

## Gotchas

- The command copied is the raw string, without visual `$` prompts.
- `showPrompt` applies per line. Comment lines beginning with `#` stay unprefixed
  so multi-line setup blocks remain readable.
- If you reuse the same `storageKey` for unrelated command groups, the restored
  tab may be surprising. Give important install flows a stable, unique key.

## Related

- `CodeBlock` for longer source snippets.
- `CopyButton` for copying arbitrary values.
- `ShortcutSheet` for command-heavy interfaces that need keyboard help.
