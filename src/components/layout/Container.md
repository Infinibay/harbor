# Container

`Container` centers page content and constrains its maximum width with Harbor layout tokens. Use it for documentation pages, marketing-adjacent sections, settings pages, articles, checkout flows, and any view where full-width content would become hard to read.

It is a structural primitive: it does not create a card, background, border, or section by itself. It only controls width and optional responsive horizontal padding.

## Import

```tsx
import { Container } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Container size="xl">
  <PageHeader
    title="Documentation"
    description="Install Harbor and build your first app shell."
  />
  <DocumentationContent />
</Container>
```

Use `prose` for long-form reading:

```tsx
<Container size="prose">
  <Article />
</Container>
```

Use `full` when the content should own its width:

```tsx
<Container size="full" padded={false}>
  <AppShell>{workspace}</AppShell>
</Container>
```

## Props

- **children** - required `ReactNode`.
- **size** - optional `"sm"`, `"md"`, `"lg"`, `"xl"`, `"2xl"`, `"prose"`, or `"full"`. Defaults to `"xl"`.
- **padded** - optional boolean. Defaults to `true`. Adds responsive horizontal padding.
- **className** - optional string merged onto the root.

## Layout Model

The root always uses `mx-auto w-full`. Size presets map to CSS variables such as `--harbor-container-xl` and `--harbor-container-prose`. `size="full"` removes the max width. Padding uses `px-4 sm:px-6 lg:px-8`.

Use one main container per page band. Nesting containers usually creates unexpected double padding.

## Usage Guidance

Choose `prose` for text, `lg` or `xl` for forms and documentation, `2xl` for dashboards with multiple columns, and `full` for app shells, editors, and canvases.

When a parent layout already supplies padding, set `padded={false}` so the content aligns with the rest of the shell.

## Accessibility

Container has no semantic role. Pair it with real landmarks, headings, and sections where needed. Width constraints improve readability, but they do not replace content structure.

## Gotchas

- Do not use `Container` as a visual card.
- Avoid nested containers unless you intentionally want a narrower subsection.
- `padded={false}` can make content touch the viewport edge on mobile.
- `size` controls max width, not grid columns.

## Related

- `Page` for page-level padding and sizing.
- `Section` for full-width page bands.
- `ResponsiveGrid` for columns inside a container.
- `AppShell` for full-height application chrome.
