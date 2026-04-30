# IconTile

Tinted square wrapper for an icon — used as the leading element in
`<Card>`, `<FeatureCard>`, hosted dashboards, etc.

## Import

```tsx
import { IconTile } from "@infinibay/harbor/display";
```

## Example

```tsx
<IconTile icon={<RocketIcon />} tone="purple" size="md" />
<IconTile icon="🚀" tone="sky" size="lg" />
```

## Props

- **icon** — `ReactNode`. Required. Anything renderable.
- **tone** — `"neutral" | "sky" | "green" | "purple" | "amber" | "rose"`.
  Default `"neutral"`.
- **size** — `"sm" | "md" | "lg"`. Default `"md"`. Sizes: 32 / 40 / 48 px.
- **className** — extra classes on the tile.

## Notes

- `aria-hidden` — meant to decorate, not to label. Pair with text.
- Border radius scales with size (`rounded-md` / `lg` / `xl`).
