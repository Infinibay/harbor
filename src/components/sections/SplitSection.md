# SplitSection

`SplitSection` creates a two-column content section with copy on one side and media on the other. Use it for feature pages, product walkthroughs, docs landing pages, changelog announcements, case-study highlights, and progressive explanation pages.

It gives marketing or educational pages a consistent structure without forcing a specific media type.

## Import

```tsx
import { SplitSection } from "@infinibay/harbor/sections";
```

## Basic Usage

```tsx
import { Button } from "@infinibay/harbor/buttons";
import { SplitSection } from "@infinibay/harbor/sections";

export function ThemingSection() {
  return (
    <SplitSection
      kicker="Theming"
      title="Re-skin everything by overriding one variable."
      description="Every Harbor component reads visual decisions through CSS custom properties."
      media={<img src="/picture.png" alt="Theme editor preview" />}
    >
      <Button>Try the playground</Button>
    </SplitSection>
  );
}
```

## Props

- **kicker** - `ReactNode`. Small uppercase intro label.
- **title** - `ReactNode`. Required heading.
- **description** - `ReactNode`. Supporting paragraph.
- **children** - `ReactNode`. Optional action row or extra content below the description.
- **media** - `ReactNode`. Required visual or interactive media block.
- **reverse** - `boolean`. Flips the content and media order from the `md` breakpoint up.
- **className** - extra classes on the root section.

## Layout

The section uses a single-column mobile layout and switches to two equal columns at `md`. Vertical spacing is built in with `py-12 md:py-16`; use `className` to adjust spacing when composing several sections.

`reverse` changes only desktop order. Mobile order remains copy first, media second, which keeps the reading flow predictable.

## Accessibility

`SplitSection` renders a semantic `<section>` and an `h2`. Media accessibility is your responsibility. Images need useful alt text when meaningful. Decorative media should use `alt=""` or `aria-hidden`.

## Gotchas

- Avoid putting huge interactive applications inside `media`; use a dedicated app surface for that.
- The component does not constrain media aspect ratio.
- Multiple adjacent split sections can feel repetitive unless copy and media are genuinely distinct.
- `reverse` depends on child ordering CSS and applies only from `md`.

## Related

- `HeroSection` for page introductions.
- `Section` for simpler text-first blocks.
- `FeatureCard` for repeated feature grids.
