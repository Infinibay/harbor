# Section

`Section` is Harbor's standard titled content block. It gives a page rhythm: optional kicker,
heading, description, action slot, and then arbitrary body content.

Use it below the hero or page header to group related content: feature grids, settings
groups, pricing details, docs chapters, dashboard panels, and showcase examples. It is
semantic by default because it renders a real `<section>` and can receive an `id` for anchor
navigation.

## Import

```tsx
import { Section } from "@infinibay/harbor/sections";
```

## Basic Usage

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

## Composition Model

The header is optional. If you provide any of `kicker`, `title`, `description`, or `actions`,
Harbor renders the header above the children. With `align="left"`, text and actions share a
flex row that wraps on small widths. With `align="center"`, the header becomes a centered
stack and actions sit below the text.

Use `spacing` to control vertical rhythm between page blocks. `compact` works inside dense
docs or settings pages, `default` is the general page rhythm, and `loose` is for public pages
where sections need more breathing room.

## Props

- **id** - `string`. Forwarded to the `<section>` for anchor links and
  TOC scroll-spy.
- **kicker** - `ReactNode`. Tiny uppercase label above the title with
  a leading rule.
- **title** - `ReactNode`. Section heading, rendered as `<h2>`.
- **description** - `ReactNode`. Muted lead paragraph below the title.
- **actions** - `ReactNode`. Right-aligned slot, such as a "View all"
  button). Centered when `align="center"`.
- **align** - `"left" | "center"`. Default `"left"`.
- **spacing** - `"compact" | "default" | "loose"`. Default `"default"`.
  Vertical padding (`py-6 / py-12 / py-20`).
- **children** - `ReactNode`. Section body.
- **className** - extra classes on the `<section>`.

## Accessibility

`Section` renders `title` as an `h2`. Keep heading levels logical across the page; if your
route already uses nested headings differently, wrap a custom heading element in `title` only
when the page structure still makes sense.

Use `id` for anchor links and table-of-contents navigation. IDs should be stable, readable,
and unique within the page.

## Gotchas

- `Section` is not a card. Do not use it for every small repeated item; use `Card`, `FeatureCard`,
  or data components inside a single section instead.
- The action slot is layout-only. You own button behavior, links, permissions, and loading
  states.
- The header disappears when all header props are omitted, which is useful for layout-only
  bands but can surprise you if `title` is accidentally empty.
- `loose` spacing can feel too large inside authenticated app shells.

## Related

- `HeroSection` for the first viewport or page-level hero.
- `SplitSection` for text beside media or product visuals.
- `Prose` for long-form article content.
- `TOC` for section navigation.
