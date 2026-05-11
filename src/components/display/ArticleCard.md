# ArticleCard

`ArticleCard` presents a readable article, changelog, case study, or guide preview. It combines cover media, tags, title, excerpt, byline, date, and reading time into a single clickable surface.

Use it in blogs, documentation landing pages, resource libraries, changelog indexes, and product education surfaces. It is optimized for editorial content, not dense operational records.

## Import

```tsx
import { ArticleCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { ArticleCard } from "@infinibay/harbor/display";

export function GuidesGrid() {
  return (
    <ArticleCard
      title="How we shipped a 120-component library in two months"
      excerpt="A retrospective on velocity, design tokens, and saying no to features."
      cover="/picture.png"
      href="/blog/harbor-shipping"
      author={{ name: "Ana Perez" }}
      date="Apr 28, 2026"
      readTime="6 min read"
      tags={["engineering", "design systems"]}
    />
  );
}
```

## Props

- **title** - `ReactNode`. Required card heading.
- **excerpt** - `ReactNode`. Optional teaser text, visually clamped to three lines.
- **cover** - `string`. Cover image URL.
- **href** - `string`. When present, the wrapper renders as an anchor.
- **onClick** - `() => void`. Optional click handler.
- **author** - `{ name: string; avatar?: string }`. Author metadata. The current component renders the author's name and generates an avatar from that name.
- **date** - `string`. Pre-formatted publication date.
- **readTime** - `string`. Pre-formatted reading time.
- **tags** - `string[]`. Rendered as Harbor `Tag` chips.
- **layout** - `"stacked" | "horizontal"`. Default `"stacked"`.
- **className** - extra classes on the wrapper.

## Layouts

`stacked` places the cover above the content and works well in responsive grids. `horizontal` creates a 160px media column on the left and content on the right, which works best in wider lists.

If `cover` is omitted, the content block renders alone. If author, date, and read time are all omitted, the byline strip is not rendered.

## Accessibility

When `href` is present, the card is an anchor and receives native link behavior. The cover image uses an empty `alt` because the meaningful content should be in the title and excerpt. If the cover carries essential meaning, pass that meaning through the title, excerpt, or surrounding page copy.

## Gotchas

- `author.avatar` is accepted by the type but the current implementation only passes `author.name` to `Avatar`.
- `date` and `readTime` are display strings. Harbor does not format or localize them.
- Do not put interactive controls inside a card that is also an anchor.
- Horizontal layout expects enough width for the 160px cover column.

## Related

- `FeatureCard` for product feature tiles.
- `LinkPreviewCard` for unfurled external links.
- `EventCard` for event-style content.
