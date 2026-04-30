# Container

Centers and constrains content width with breakpoint-aware horizontal
padding. Use it as the outermost wrapper for any page-level content
that should track the standard Harbor max-widths. For
container-query-driven layouts (responding to the wrapper's own size),
reach for `<ContainerBox>` instead.

## Import

```tsx
import { Container } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Container size="xl">
  <h1>Dashboard</h1>
  <p>Content centered and padded for any viewport.</p>
</Container>
```

## Props

- **children** — `ReactNode`. Required.
- **size** — `"sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "full"`.
  Max-width preset, mapped to `--harbor-container-*` CSS variables.
  Default `"xl"`. Use `"prose"` for long-form text and `"full"` to
  remove the cap entirely.
- **padded** — `boolean`. Adds `px-4 sm:px-6 lg:px-8`. Default `true`.
- **className** — extra classes on the wrapper.

## Notes

- The widths come from CSS variables, so you can globally retune them
  in your theme without touching the component.
- For typical pages prefer `<Page>`, which wraps Container + a
  vertical stack in one go.
