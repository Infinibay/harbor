# LinkPreviewCard

Open-Graph-style horizontal preview tile — site name + favicon, title,
description, URL, and an optional thumbnail on the right. Renders as a
`<a target="_blank">`.

## Import

```tsx
import { LinkPreviewCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<LinkPreviewCard
  url="https://infinibay.com/blog/harbor-shipping"
  title="How we shipped a 120-component library in two months"
  description="A retrospective on velocity, design tokens, and saying no to features."
  image="https://images.example.com/cover.jpg"
  favicon="https://infinibay.com/favicon.ico"
  siteName="Infinibay Blog"
/>
```

## Props

- **url** — `string`. Required. Becomes the `href` and is shown muted at the bottom.
- **title** — `ReactNode`. Required.
- **description** — `ReactNode`. Clamped to 2 lines.
- **image** — `string`. Right-side thumbnail (112px column).
- **favicon** — `string`. 16×16 leading icon. Falls back to a 🌐 glyph.
- **siteName** — `ReactNode`. Override the inferred domain.
- **className** — extra classes on the wrapper.

## Notes

- Opens in a new tab with `rel="noopener noreferrer"`.
- The domain is parsed from `url` (stripping `www.`) when `siteName` is
  not provided.
