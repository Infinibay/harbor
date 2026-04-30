# Aside

Inline callout block for prose — think MDN-style note boxes. Use inside
long-form content (`<Prose>`, docs, articles) to flag tips, warnings,
or side notes without breaking the reading flow.

## Import

```tsx
import { Aside } from "@infinibay/harbor/sections";
```

## Example

```tsx
<Aside tone="tip" title="Pro tip">
  You can override any tone's accent by passing a custom <code>className</code>.
</Aside>

<Aside tone="warning">
  This API will be removed in v1.0.
</Aside>
```

## Props

- **tone** — `"note" | "tip" | "info" | "warning" | "danger"`. Default
  `"note"`. Picks the accent color, icon, and default label.
- **title** — `ReactNode`. Optional header. Falls back to the tone's
  default label (`"Note"`, `"Tip"`, `"Info"`, `"Warning"`, `"Danger"`).
- **children** — `ReactNode`. Required. Body content.
- **className** — extra classes on the wrapper `<aside>`.

## Notes

- The component renders a real `<aside>` element for assistive tech.
- Each tone has a fixed emoji marker (note, tip, info, warning, danger).
  If you need a different glyph, render your own header inside `title`.
