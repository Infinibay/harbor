# Prose

`Prose` is a readable typographic container for long-form content. It constrains
line length, sets comfortable leading, and styles natural HTML elements such as
headings, paragraphs, links, lists, blockquotes, inline code, horizontal rules,
and code blocks.

Use it for documentation articles, changelog entries, release notes, legal text,
help content, and any screen where the user is primarily reading instead of
scanning controls.

## Import

```tsx
import { Prose } from "@infinibay/harbor/sections";
```

## Basic Usage

```tsx
<Prose>
  <h1>Install Harbor</h1>
  <p>
    Harbor ships as a TypeScript React library. Install it from a local release
    artifact or a Git tag, then import the provider and stylesheet once.
  </p>
  <h2>Next step</h2>
  <p>
    Wrap your app with <code>HarborProvider</code> before rendering components.
  </p>
</Prose>
```

`Prose` styles HTML descendants. It does not rewrite custom Harbor components,
so you can place callouts, code blocks, or interactive examples between prose
sections when needed.

## Props

- **children** - `ReactNode`. Required. Usually headings, paragraphs, lists, and
  other article content.
- **size** - `"sm" | "md" | "lg"`. Controls line length and base font size.
  Default `"md"`.
- **className** - extra classes on the wrapper.

## Size Guidance

- `sm` works for sidebars, drawers, release-note cards, and compact help text.
- `md` is the default for documentation and product education.
- `lg` is best for article pages, onboarding chapters, and editorial content
  where reading comfort matters more than density.

All sizes keep text within a comfortable measure, roughly 54 to 72 characters per
line depending on the size.

## Accessibility

`Prose` preserves the document structure you pass in. Use real headings in order
and real list elements for lists. Do not use bold paragraphs as fake headings;
screen-reader and keyboard users rely on semantic structure to navigate long
pages.

Links are visibly underlined and inline code has a distinct background, but your
content still needs descriptive link text and clear examples.

## Gotchas

- `Prose` centers itself with `mx-auto` and has a max width. If you need prose in
  a left-aligned split layout, pass a class such as `mx-0`.
- It styles direct natural HTML descendants. Deeply nested custom markup may need
  its own classes.
- It is not a markdown renderer. Use your markdown pipeline first, then wrap the
  rendered content with `Prose`.

## Related

- `Section` for marketing or documentation sections with headings.
- `CodeBlock` for highlighted examples.
- `Callout` and `Banner` for important notes inside reading flows.
- `Page` for route-level content width and vertical rhythm.
