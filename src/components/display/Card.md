# Card

The workhorse container — header / leading icon / title / description /
body / footer slots, three variants, and optional cursor effects (tilt,
spotlight, glow). Pair with `<CardGrid>` for responsive grids.

## Import

```tsx
import { Card, CardGrid } from "@infinibay/harbor/display";
```

## Example

```tsx
<Card
  variant="default"
  interactive
  spotlight
  leadingIcon={<RocketIcon />}
  leadingIconTone="purple"
  title="harbor-site"
  description="Marketing site + showcase for the Harbor component library."
  footer={<Button size="sm">Open</Button>}
  onClick={() => navigate("/projects/harbor-site")}
>
  Last deploy 2h ago — production v0.4.2.
</Card>

<CardGrid cols={3}>
  <Card title="A" />
  <Card title="B" />
  <Card title="C" />
</CardGrid>
```

## Props (`<Card>`)

- **variant** — `"default" | "glass" | "solid"`. Default `"default"`.
- **interactive** — `boolean`. Adds hover lift and cursor styling.
- **tilt** — `boolean`. 3D tilt that follows the cursor (uses
  `transform-style: preserve-3d` and a `perspective` wrapper).
- **spotlight** — `boolean`. Cursor-following radial highlight. Default `true`.
- **spotlightStrength** — `"quiet" | "soft" | "strong"`. Default `"strong"`.
  - `quiet` — barely there, for prose / article cards.
  - `soft` — dialed back, for text-heavy interactive surfaces (forms, tables, chat).
  - `strong` — full intensity, for buttons / charts / decorative cards.
- **glow** — `boolean`. Accent border glow. Default `true`.
- **selected** — `boolean`. Renders the accent border + ring + tint.
- **disabled** — `boolean`. Lowers opacity and disables hover/click.
- **fullHeight** — `boolean`. Stretches to the parent's height (useful
  inside `<CardGrid>`).
- **title** / **description** / **header** / **footer** — `ReactNode` slots.
- **leadingIcon** / **leadingIconTone** — passed through to `<IconTile>`.
- **children** — body content.
- Plus all standard `HTMLDivElement` attributes (`onClick`, `id`, etc.).

## Props (`<CardGrid>`)

- **cols** — `1 | 2 | 3 | 4`. Default `2`. Grid breakpoint is `md`.
- **className** — extra classes on the grid.

## Notes

- The spotlight uses two CSS variables (`--mx`, `--my`) updated on
  `mousemove` — keep heavy backdrop filters off if you nest many.
- Disabled cards are non-interactive (`pointer-events: none`).
