# CloseButton

Standardized × dismiss control for dialog headers, toast cards, removable
chips, and similar affordances. Prefer it over `<IconButton>` whenever the
sole action is "dismiss" — it ships with the right geometry, glyph, and
`aria-label="Close"` baked in.

## Import

```tsx
import { CloseButton } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<CloseButton onClick={() => setOpen(false)} />

<CloseButton variant="solid" size="lg" onClick={dismiss} />
```

## Props

- **size** — `"sm" | "md" | "lg"`. Square dimension of the hit target.
  Default: `"md"`.
- **variant** — `"ghost" | "solid"`. `ghost` is transparent until hover;
  `solid` carries a subtle bordered chip. Default: `"ghost"`.
- Inherits all standard `<button>` HTML attributes (forwarded via ref).

## Notes

- Always rendered with `type="button"` so it never accidentally submits a
  surrounding form.
- `aria-label="Close"` is set automatically; override via the spread props
  if you need a localized label.
- Carries `data-cursor="button"` so the global Harbor cursor reacts.
