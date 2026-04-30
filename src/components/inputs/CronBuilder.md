# CronBuilder

Visual five-field POSIX cron builder. Preset chips for the common
schedules, per-field selectors (`Any` / `Every N` / `List`), live
expression readout, and a brute-force "next 3 runs" preview. Emits
the cron string via `onChange` so callers can drop it straight into
their schedule field.

## Import

```tsx
import { CronBuilder } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [cron, setCron] = useState("0 9 * * 1");

<CronBuilder value={cron} onChange={setCron} />
```

## Props

- **value** — `string`. Five-field cron expression. Required.
  Invalid / partial input falls back to `"* * * * *"` while parsing.
- **onChange** — `(next: string) => void`. Required.
- **hidePresets** — `boolean`. Hide the preset chips row. Default
  `false`.
- **className** — extra classes on the wrapper.

## Notes

- Five-field POSIX only — Quartz (six-field, with seconds) is a
  planned future `variant` prop.
- The "next runs" preview is a brute-force per-minute walk up to 7
  days ahead; expressions that fire less than once a week show fewer
  rows.
- Preset matching is exact-string after `.trim()`.
