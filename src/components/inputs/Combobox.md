# Combobox

A searchable dropdown — anchor button opens a portal popover with a
filter input and the matching options. Use when the option set is
larger than ~7 entries or when keyword search helps users find the
right value. For short fixed lists prefer `<Select>`; for tag-style
multi-pick use `<MultiSelect>`.

## Import

```tsx
import { Combobox } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [region, setRegion] = useState("us-east-1");

<Combobox
  label="Region"
  value={region}
  onChange={setRegion}
  options={[
    { value: "us-east-1", label: "US East (N. Virginia)", keywords: ["virginia", "iad"] },
    { value: "us-west-2", label: "US West (Oregon)", keywords: ["oregon", "pdx"] },
    { value: "eu-central-1", label: "EU (Frankfurt)", keywords: ["fra", "germany"] },
  ]}
/>
```

## Props

- **options** — `ComboboxOption[]`. Each `{ value, label, keywords? }`.
  `keywords` join `label` for the search match.
- **value** — `string`. Current selection.
- **onChange** — `(v: string) => void`.
- **placeholder** — `string`. Anchor placeholder when nothing
  selected. Default `"Select or search…"`.
- **label** — `string`. Optional label above the anchor.
- **emptyText** — `string`. Shown when the filter has no matches.
  Default `"No matches"`.
- **className** — extra classes on the wrapper.

## Notes

- Popover is rendered through `<Portal>` and positioned with
  `useLayoutEffect` so the first frame doesn't flash at `{0,0}`.
- Position re-syncs on `scroll` (capture) and `resize`.
- Outside-click closes; the search input re-mounts each open.
