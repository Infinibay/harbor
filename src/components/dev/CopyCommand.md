# CopyCommand

Copy-to-clipboard snippet with tabbed variants (e.g. npm / pnpm / yarn,
or macOS / Linux / Windows). Remembers the last-picked tab in
`localStorage`.

## Import

```tsx
import { CopyCommand } from "@infinibay/harbor/dev";
```

## Example

```tsx
<CopyCommand
  variants={[
    { label: "npm",  code: "npm install @infinibay/harbor" },
    { label: "pnpm", code: "pnpm add @infinibay/harbor" },
    { label: "yarn", code: "yarn add @infinibay/harbor" },
  ]}
/>
```

## CommandVariant

```ts
{
  label: string;        // tab label
  code: string;         // command text (multi-line ok)
  language?: string;    // optional, cosmetic hint
}
```

## Props

- **variants** — `readonly CommandVariant[]`. Required.
- **storageKey** — `string`. localStorage key used to remember the
  selected tab. Default: derived from variant labels.
- **showPrompt** — `boolean`. Render a leading `$` per line. Default `true`.
  Lines starting with `#` are treated as comments and never get a prompt.
- **className** — extra classes on the wrapper.

## Notes

- A single-variant call still works — the tab row collapses to just a
  Copy button.
- "Copied" feedback resets after 1.5s.
