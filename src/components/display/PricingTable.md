# PricingTable

Side-by-side pricing tiers with feature checklists, an optional
highlighted plan, and a CTA slot per tier. Use for marketing pages and
plan-picker dialogs. For internal billing summaries use
`<BillingCard>`.

## Import

```tsx
import { PricingTable } from "@infinibay/harbor/display";
```

## Example

```tsx
<PricingTable
  tiers={[
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "mo",
      features: [
        { label: "1 project", included: true },
        { label: "Community support", included: true },
        { label: "Custom domains", included: false },
      ],
      cta: <Button variant="ghost">Start free</Button>,
    },
    {
      id: "pro",
      name: "Pro",
      tagline: "For growing teams",
      price: 29,
      period: "mo",
      highlighted: true,
      badge: "Most popular",
      features: [
        { label: "Unlimited projects", included: true },
        { label: "Priority support", included: true, hint: "24h SLA" },
        { label: "SAML SSO", included: false },
      ],
      cta: <Button>Upgrade</Button>,
    },
  ]}
/>
```

## Props

- **tiers** — `PricingTier[]`. Required. One column per entry.
- **className** — extra classes on the grid.

## `PricingTier`

- **id** — `string`. Required. React key.
- **name** — `string`. Required. Tier label (uppercased).
- **tagline** — `ReactNode`. Optional one-liner.
- **price** — `number | string`. Numbers render with a `$` prefix;
  strings render verbatim (e.g. `"Custom"`).
- **period** — `string`. Suffix after the price (e.g. `"mo"`).
- **features** — `PricingFeature[]`. Required.
- **cta** — `ReactNode`. Slot for the action button.
- **highlighted** — `boolean`. Renders the fuchsia gradient border.
- **badge** — `ReactNode`. Pill anchored to the top edge.

## `PricingFeature`

- **label** — `ReactNode`. Required.
- **included** — `boolean`. Required. `false` strikes the label.
- **hint** — `string`. Small text under the label.

## Notes

- Two- and three-tier tables get `md:grid-cols-{n}` automatically;
  any other count stacks vertically.
