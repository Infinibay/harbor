# HeroSection

`HeroSection` is the top-of-page introduction block for public pages and high-level product
sections. It combines eyebrow copy, title, optional highlighted line, description, calls to
action, and optional media.

Use it when a page needs a clear first impression: product overview, docs landing, feature
page, release announcement, or showcase route. It is not a dashboard header; app screens
should usually use `PageHeader` or custom shell chrome instead.

## Import

```tsx
import { HeroSection } from "@infinibay/harbor/sections";
```

## Basic Usage

```tsx
<HeroSection
  eyebrow="Harbor Cloud"
  title="Build product interfaces"
  highlight="that feel alive"
  description="A React component system for dashboards, editors, consoles, and SaaS apps."
  primaryCta={<Button>Start building</Button>}
  secondaryCta={<Button variant="ghost">View components</Button>}
  layout="split"
  media={<WindowFrame>{/* product preview */}</WindowFrame>}
/>
```

## Layout Model

`layout="centered"` centers the text and places `media` below it inside a wide container.
`layout="split"` creates a two-column hero on medium screens and above: content on the left,
media on the right. The text and media animate in with Framer Motion on mount.

`highlight` is rendered as a second line inside the `h1` with Harbor's gradient treatment.
Use it for a short phrase, not an entire sentence.

## Props

- **eyebrow** - small pill above the title.
- **title** - main heading. Required.
- **highlight** - optional second-line gradient emphasis.
- **description** - lead paragraph.
- **primaryCta** / **secondaryCta** - action slots.
- **media** - screenshot, window frame, diagram, or product surface.
- **layout** - `"centered" | "split"`. Default `"centered"`.
- **className** - extra classes on the root section.

## Accessibility

`HeroSection` renders the title as `h1`. Use only one primary `h1` per page unless your route
has a deliberate document outline. CTA slots should contain accessible `Button`, `Link`, or
custom controls with clear labels.

If `media` is an image, provide meaningful alt text. If it is a live product preview, ensure
the controls inside that preview are keyboard-accessible or mark the preview as decorative
when it is only illustrative.

## Gotchas

- The component is opinionated for dark Harbor marketing surfaces. Dense app screens should
  use smaller headers.
- Split layout only changes at medium widths; test media sizing on mobile.
- Long highlights make the title hard to scan. Keep highlight short and literal.
- Motion runs on mount. If you need reduced-motion handling, wrap at the page level or use a
  simpler section.

## Related

- `Section` for standard page blocks after the hero.
- `SplitSection` for text plus media feature rows.
- `WindowFrame` for product previews.
- `PageHeader` for authenticated app pages.
