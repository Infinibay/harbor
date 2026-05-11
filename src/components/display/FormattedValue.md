# FormattedValue

Formatted value components turn raw numbers into consistent, tabular text atoms. They wrap
Harbor's pure formatting helpers for bytes, rates, generic numbers, and percentages, and add
the same `tabular-nums font-mono` styling everywhere.

Use them in dashboards, tables, quota cards, network panels, billing surfaces, and logs where
numbers need to align and remain readable. They are display primitives, not inputs.

## Import

```tsx
import {
  FormattedBytes,
  FormattedRate,
  FormattedNumber,
  FormattedPercent,
} from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<FormattedBytes value={12_400_000} />
<FormattedRate value={85_000_000} />
<FormattedNumber value={1_240_000} compact />
<FormattedPercent value={0.424} decimals={1} />
```

## Formatting Model

All components accept `number | null | undefined`. Invalid or missing values format as `—`
instead of throwing. By default, numeric spans expose the raw value in the native `title`
tooltip; set `showTitle={false}` when the raw value would be noisy or redundant.

`FormattedBytes` and `FormattedRate` support SI or binary units. `FormattedNumber` supports
compact notation and locale overrides. `FormattedPercent` expects a fraction, so `0.42`
renders as `42.0%`.

## Props

### Shared

- **value** - `number | null | undefined`.
- **className** - extra classes.
- **showTitle** - boolean. Default `true`, shows raw value in native tooltip.
- Other span attributes are forwarded.

### Bytes / Rate

- **decimals** - fractional digits. Default `1`.
- **binary** - use IEC suffixes (`KiB`, `MiB`) instead of SI (`kB`, `MB`).
- **unit** - suffix unit. Default `"B"`.

### Number / Percent

- **compact** - compact notation for `FormattedNumber`.
- **decimals** - fraction digits.
- **locale** - Intl locale override.

## Accessibility

Formatted values render as plain text spans. Make sure the surrounding label, column header,
or card title explains the unit. A screen reader can read `12.4 MB`, but it still needs to
know whether that means storage used, transfer remaining, or upload speed.

Native `title` tooltips are supplemental only. Do not put required information exclusively in
the tooltip.

## Gotchas

- `FormattedPercent` takes a fraction, not a whole percent. Use `0.25`, not `25`.
- `FormattedRate` always appends `/s` to the formatted bytes output.
- `binary` changes the base and suffixes; be consistent within a product surface.
- Compact number formatting is locale-aware and can vary by browser locale.

## Related

- `Stat` and `MetricCard` for headline numbers.
- `UsageRing`, `QuotaBar`, and `ResourceMeter` for resource usage.
- `DataTable` for aligned numeric columns.
- `@infinibay/harbor/lib/format` for non-React formatting helpers.
