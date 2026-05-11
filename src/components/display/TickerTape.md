# TickerTape

`TickerTape` displays a looping horizontal strip of compact metrics. It is
useful for market-style dashboards, ops walls, live product KPIs, system health
summaries, and demo surfaces where high-level signals should stay visible.

Use it as ambient context, not as the only way to inspect important numbers.

## Import

```tsx
import { TickerTape } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<TickerTape
  items={[
    { id: "mrr", label: "MRR", value: "$12,540", change: 2.1 },
    { id: "p95", label: "p95", value: "184ms", change: -3.4 },
    { id: "errors", label: "Errors", value: 24, change: -33 },
  ]}
/>;
```

## Props

- **items** - `TickerItem[]`. Required. Items are duplicated internally to create
  a seamless loop.
- **speed** - `number`. Seconds for a full loop. Default `40`.
- **gap** - `number`. Pixel gap between items. Default `28`.
- **className** - extra classes on the wrapper.

## TickerItem

```ts
type TickerItem = {
  id: string;
  label: ReactNode;
  value?: ReactNode;
  change?: number;
};
```

`change` renders as a signed percentage with positive, negative, or neutral tone.

## Behavior

The component uses CSS keyframes to translate the doubled item row by 50 percent.
It does not fetch data, pause on hover, or virtualize content.

## Accessibility

Ticker content is visible text, but moving text is hard to read. Keep values
duplicated in a stable dashboard card or table when users need exact inspection.
Avoid using fast speeds for production data-heavy screens.

## Gotchas

- Motion is continuous and currently does not check reduced-motion preferences.
- Very few items can make the duplicated loop obvious.
- Use stable `id` values to avoid remounting items.

## Related

- `MetricCard` for stable headline values.
- `Sparkline` for compact trend context.
- `StatusBar` for app status.
- `DataTable` for inspectable metrics.
