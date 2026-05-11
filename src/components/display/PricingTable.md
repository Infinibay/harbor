# PricingTable

`PricingTable` presents two or three product tiers with price, tagline, feature
list, optional badge, and a caller-owned CTA. It is designed for commercial
pages, account upgrade screens, internal plan comparison, and checkout
previews.

Use it when the user is comparing packages. Use `ComparisonTable` when the
feature matrix is the main content and pricing is secondary.

## Import

```tsx
import { PricingTable } from "@infinibay/harbor/display";
```

## Basic Usage

Each tier controls its own CTA, so you can use Harbor `Button`, a router link, or
a checkout component.

```tsx
<PricingTable
  tiers={[
    {
      id: "starter",
      name: "Starter",
      tagline: "For early product teams",
      price: 49,
      period: "mo",
      cta: <Button variant="secondary">Start trial</Button>,
      features: [
        { label: "5 projects", included: true },
        { label: "Email support", included: true },
        { label: "SAML SSO", included: false },
      ],
    },
  ]}
/>
```

## Highlighted Tier

Use `highlighted` and `badge` for the recommended plan.

```tsx
{
  id: "pro",
  name: "Pro",
  badge: "Most popular",
  highlighted: true,
  price: 149,
  period: "mo",
  cta: <Button>Upgrade</Button>,
  features,
}
```

## Feature Hints

Feature rows accept optional `hint` text for constraints, quotas, or commercial
details.

```tsx
{ label: "Commercial license", included: true, hint: "Includes private npm or tarball delivery." }
```

## Props

- `tiers`: required pricing tiers.
- `className`: grid wrapper class override.

Each tier includes `id`, `name`, optional `tagline`, `price`, optional `period`,
`features`, optional `cta`, optional `highlighted`, and optional `badge`.
Features include `label`, `included`, and optional `hint`.

## Accessibility

Feature inclusion is shown with both symbol and text treatment. Keep feature
labels explicit; do not depend on the checkmark alone.

CTA nodes are owned by the caller. Use real buttons or links with clear action
text such as "Start trial", "Contact sales", or "Upgrade to Pro".

## Gotchas

The component lays out two and three tiers automatically. For four or more
plans, compose your own responsive grid or use a comparison table.

Price is display-oriented. Pass strings such as `"Custom"` or `"$1,499"` when
the pricing logic is more complex than a simple number.

## Related

- `ComparisonTable` for detailed feature matrices.
- `BillingCard` for current subscription state.
- `Button` for tier CTAs.
- `Badge` for plan labels outside pricing tables.
