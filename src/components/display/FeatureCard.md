# FeatureCard

Marketing tile — accent-tinted icon square, title, description, and an
optional "Learn more →" link. For interactive product/dashboard cards
use `<Card>`.

## Import

```tsx
import { FeatureCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<FeatureCard
  icon={<span>✦</span>}
  title="Reacts to the cursor"
  description="A global cursor-proximity hook lets components respond to nearby motion."
  href="/docs/cursor"
  linkLabel="Read more →"
  accent="fuchsia"
/>
```

## Props

- **icon** — `ReactNode`. Optional. Rendered inside a 40×40 accent square.
- **title** — `ReactNode`. Required.
- **description** — `ReactNode`. Required.
- **href** — `string`. When set, renders the link CTA.
- **linkLabel** — `string`. Default `"Learn more →"`.
- **accent** — `"fuchsia" | "sky" | "emerald" | "amber" | "rose"`. Default `"fuchsia"`.
- **className** — extra classes on the wrapper.

## Notes

- The accent only colors the icon square and link — the body keeps the
  neutral card surface.
- This is a static marketing card; for click-to-navigate dashboard
  cards use `<Card interactive onClick={…}>`.
