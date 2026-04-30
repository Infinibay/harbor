# ArticleCard

Marketing/blog article tile — cover image, title, excerpt, tags, and a
byline strip. Renders as `<a>` when `href` is set, otherwise `<div>`.

## Import

```tsx
import { ArticleCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<ArticleCard
  title="How we shipped a 120-component library in two months"
  excerpt="A retrospective on velocity, tokens, and saying no to features."
  cover="https://images.example.com/cover.jpg"
  href="/blog/harbor-shipping"
  author={{ name: "Ana Pérez" }}
  date="Apr 28, 2026"
  readTime="6 min read"
  tags={["engineering", "design-systems"]}
/>
```

## Props

- **title** — `ReactNode`. Required.
- **excerpt** — `ReactNode`. Body teaser — clamped to 3 lines.
- **cover** — `string`. Image URL.
- **href** — `string`. When present the card becomes an `<a>`.
- **onClick** — `() => void`. Fires alongside navigation.
- **author** — `{ name, avatar? }`.
- **date** — `string`. Pre-formatted (no auto-formatting).
- **readTime** — `string`. e.g. `"6 min read"`.
- **tags** — `string[]`. Renders as a wrap row of `<Tag>` chips.
- **layout** — `"stacked" | "horizontal"`. Default `"stacked"`.
  Horizontal places the cover on the left in a 160px column.
- **className** — extra classes on the wrapper.

## Notes

- The cover scales subtly on hover — purely cosmetic.
- The byline strip is hidden entirely when no author/date/readTime is
  provided.
