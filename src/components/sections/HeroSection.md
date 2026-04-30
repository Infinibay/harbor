# HeroSection

The top-of-page hero — eyebrow pill, large gradient headline, optional
second-line "highlight" in the brand gradient, description, two CTAs,
and a media slot. Use as the first section of a marketing page; for
inner-page banners reach for `<Section>` instead.

## Import

```tsx
import { HeroSection } from "@infinibay/harbor/sections";
```

## Example

```tsx
<HeroSection
  eyebrow="v0.4 · just shipped"
  title="Build interfaces that feel"
  highlight="alive"
  description="120 React components that respond to the cursor and coordinate with their siblings."
  primaryCta={<Button variant="primary">Get started</Button>}
  secondaryCta={<Button variant="ghost">Read the docs</Button>}
  layout="split"
  media={<img src="/picture.png" alt="" />}
/>
```

## Props

- **title** — `ReactNode`. Required. Main headline (rendered with a
  light-to-translucent gradient).
- **highlight** — `ReactNode`. Optional. Rendered on its own line below
  `title` with the fuchsia → sky → pink brand gradient.
- **eyebrow** — `ReactNode`. Small pill above the headline with a
  pulsing emerald dot.
- **description** — `ReactNode`. Muted paragraph below the headline.
- **primaryCta** / **secondaryCta** — `ReactNode`. Action slots,
  typically `<Button>` elements.
- **media** — `ReactNode`. Image, illustration, or component shown
  beside (`split`) or below (`centered`) the text.
- **layout** — `"centered" | "split"`. Default `"centered"`.
- **className** — extra classes on the `<section>`.

## Notes

- Entrance animation is built in (`framer-motion`): text fades up,
  media fades in from the side (`split`) or below (`centered`).
- `highlight` is a separate line, not an inline span — the line break
  is added automatically.
