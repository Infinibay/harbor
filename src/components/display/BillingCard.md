# BillingCard

`BillingCard` is a composed plan summary tile for billing pages. It shows the
current plan, price, billing period, usage quota bar, next invoice, top-right CTA,
and optional footer content.

Use it in account settings, workspace billing pages, admin subscription views,
and commercial-license portals.

## Import

```tsx
import { BillingCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<BillingCard
  plan="Team"
  price="$49 / mo"
  period={{ start: "2026-04-01", end: "2026-04-30" }}
  nextInvoice="$64.12"
  usage={{
    label: "API calls",
    total: 1_000_000,
    segments: [{ value: 620_000, label: "Used", color: "rgb(168 85 247)" }],
  }}
  cta={<Button>Upgrade</Button>}
/>;
```

## Props

- **plan** - `string`. Required plan name.
- **price** - `string`. Optional formatted price label.
- **period** - `{ start; end }`. Optional billing cycle dates.
- **nextInvoice** - `string`. Optional formatted invoice amount.
- **usage** - `{ segments: QuotaSegment[]; total: number; label?: string }`.
- **cta** - `ReactNode`. Top-right action slot.
- **footer** - `ReactNode`. Bottom slot for links or invoice details.
- **className** - extra classes on the card.

## Behavior

The component composes `QuotaBar` for usage and `Timestamp` for period dates.
Amounts are passed in already formatted; Harbor does not calculate invoices or
currency.

## Accessibility

All key billing details render as text. Keep CTA copy explicit, such as
`Upgrade plan` or `Manage billing`, and include billing-period context when
usage can reset.

## Gotchas

- This is display only. Billing state, checkout, invoices, and entitlement logic
  belong to your application.
- `nextInvoice` and `price` are strings, so format them before rendering.
- Usage segments should be validated to match your product's quota model.

## Related

- `QuotaBar` for usage visualization.
- `CostBreakdown` for spend composition.
- `MetricCard` for billing KPIs.
- `Button` for upgrade and manage-billing actions.
