# Divider / Kbd

`<Divider>` — a 1px horizontal rule, optionally with centered label
("OR", "More options"). `<Kbd>` — small inline keyboard-key chip,
useful in shortcut docs.

## Import

```tsx
import { Divider, Kbd } from "@infinibay/harbor/display";
```

## Example

```tsx
<Divider />

<Divider>OR</Divider>

<p>
  Press <Kbd>⌘</Kbd>+<Kbd>K</Kbd> to open the palette.
</p>
```

## Props (`<Divider>`)

- **children** — `ReactNode`. Optional. When set, renders a centered
  label with gradient lines on both sides.
- **className** — extra classes on the wrapper.

## Props (`<Kbd>`)

- **children** — `ReactNode`. Required. Key glyph.

## Notes

- Plain `<Divider />` is `role="separator"`.
- The labelled form uses two flexed gradient bars and is meant for
  full-width contexts (forms, page sections).
