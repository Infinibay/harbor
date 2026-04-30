# QuoteCard

Decorated `<figure>` for testimonials and pull-quotes — a large
quote glyph, the quote body, and an optional author row with avatar
and role. For longer prose blocks, use `<ArticleCard>` instead.

## Import

```tsx
import { QuoteCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<QuoteCard
  accent="sky"
  quote="Harbor cut our setup time in half. We shipped the dashboard rewrite in two sprints."
  author={{
    name: "Ana Pérez",
    role: "Engineering Lead, Acme",
  }}
/>
```

## Props

- **quote** — `ReactNode`. Required. The quote body.
- **author** — `{ name: string; role?: ReactNode; avatar?: string }`.
  Optional caption row. When omitted no `<figcaption>` is rendered.
- **accent** — `"fuchsia" | "sky" | "emerald" | "amber"`. Tints the
  decorative quote glyph. Default `"fuchsia"`.
- **className** — extra classes on the figure.

## Notes

- The author avatar uses `<Avatar>` with `size="sm"`. If
  `author.avatar` is omitted the avatar falls back to initials.
