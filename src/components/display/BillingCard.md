# BillingCard

The "your plan" tile for billing pages — plan name, price, current
period, usage `<QuotaBar>`, and the next-invoice line. Pure layout: the
parent computes segments, period, and totals.

## Import

```tsx
import { BillingCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<BillingCard
  plan="Team"
  price="$49 / mo"
  period={{
    start: "2026-04-01",
    end: "2026-04-30",
  }}
  usage={{
    label: "API calls",
    total: 1_000_000,
    segments: [
      { value: 620_000, label: "Used", color: "rgb(168 85 247)" },
      { value: 80_000,  label: "Reserved", color: "rgba(255,255,255,0.25)" },
    ],
  }}
  nextInvoice="$64.12"
  cta={<Button variant="primary" size="sm">Upgrade</Button>}
/>
```

## Props

- **plan** — `string`. Required. Plan name shown in the title.
- **price** — `string`. Pre-formatted price label (e.g. `"$49 / mo"`).
- **period** — `{ start, end }`. Date-like values; rendered as a
  `<Timestamp>` range with the `"date"` preset.
- **usage** — `{ segments: QuotaSegment[]; total: number; label?: string }`.
  Pass-through to `<QuotaBar>`.
- **nextInvoice** — `string`. Pre-formatted amount.
- **cta** — `ReactNode`. Top-right slot — typically an Upgrade button.
- **footer** — `ReactNode`. Bottom slot for invoices links, payment-method
  swap, etc.
- **className** — extra classes on the wrapper.

## Notes

- The component never formats currency — pass already-localized strings.
- See `<QuotaBar>` for the segment shape.
