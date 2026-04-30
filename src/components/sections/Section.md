# Section

Titled content block — the standard building block of a page. Renders
an optional header (kicker label, large title, muted description, and
right-aligned actions) above arbitrary children. Reach for
`<HeroSection>` for the page hero and `<SplitSection>` for
media-beside-text feature blocks.

## Import

```tsx
import { Section } from "@infinibay/harbor/sections";
```

## Example

```tsx
<Section
  id="features"
  kicker="Why Harbor"
  title="A UI library shaped like a product."
  description="Most libraries hand you flat building blocks. Harbor hands you a system."
  actions={<Button variant="ghost">Read more →</Button>}
  spacing="default"
>
  <CardGrid cols={3}>{/* ... */}</CardGrid>
</Section>
```

## Props

- **id** — `string`. Forwarded to the `<section>` for anchor links and
  TOC scroll-spy.
- **kicker** — `ReactNode`. Tiny uppercase label above the title with
  a leading rule.
- **title** — `ReactNode`. Section heading (rendered as `<h2>`).
- **description** — `ReactNode`. Muted lead paragraph below the title.
- **actions** — `ReactNode`. Right-aligned slot (e.g. a "View all"
  button). Centered when `align="center"`.
- **align** — `"left" | "center"`. Default `"left"`.
- **spacing** — `"compact" | "default" | "loose"`. Default `"default"`.
  Vertical padding (`py-6 / py-12 / py-20`).
- **children** — `ReactNode`. Section body.
- **className** — extra classes on the `<section>`.

## Notes

- The header is omitted entirely when `kicker`, `title`, `description`,
  and `actions` are all empty — useful for layout-only sections.
- `id` lets you link a `<TOC>` item to this section.
