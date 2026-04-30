# FormattedValue (FormattedBytes / FormattedRate / FormattedNumber / FormattedPercent)

Tabular-nums monospaced spans that wrap the `lib/format` helpers as
visual atoms. All four share the same `<span>`-with-tooltip output —
swap the import to switch the format. For dynamic counters use
`<CountUp>`.

## Import

```tsx
import {
  FormattedBytes,
  FormattedRate,
  FormattedNumber,
  FormattedPercent,
} from "@infinibay/harbor/display";
```

## Example

```tsx
<FormattedBytes value={12_400_000} />              {/* 12.4 MB */}
<FormattedBytes value={2 ** 30} binary />          {/* 1 GiB */}
<FormattedRate value={1_250_000} />                {/* 1.25 MB/s */}
<FormattedNumber value={1_240_000} compact />      {/* 1.2M */}
<FormattedPercent value={0.424} />                 {/* 42.4% */}
```

Each component renders a `<span class="tabular-nums font-mono">` and
sets the raw numeric value on the native `title` tooltip by default.

## Props (shared)

- **value** — `number | null | undefined`. `null`/`undefined` → `"—"`
  (delegated to the underlying formatter).
- **showTitle** — `boolean`. Default `true`. Set the tooltip to the raw
  numeric value.
- **className** — extra classes on the span.
- Plus all standard `HTMLSpanElement` attributes except `children`.

## Per-component options

- `<FormattedBytes>` / `<FormattedRate>` — `decimals`, `binary`, `unit`.
- `<FormattedNumber>` — `compact`, `decimals`, `locale`.
- `<FormattedPercent>` — `decimals` (default `1`), `locale`. `value` is
  expected as a fraction (`0.424` → `"42.4%"`).

## Notes

- All four components are pure styling shells — pass identical options
  to the underlying `formatBytes` / `formatRate` / `formatNumber` /
  `formatPercent` helpers from `@infinibay/harbor/lib/format`.
- `font-mono tabular-nums` keeps numbers vertically aligned in tables.
