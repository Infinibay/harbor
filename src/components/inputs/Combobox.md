# Combobox

`Combobox` is a controlled searchable picker for choosing one value from a list. The trigger
looks like a field, opens a portal popover, focuses a search input, and filters options by
label plus optional keywords.

Use it when the list is too long for a plain `Select`, when users know the value they want
and should type to narrow it, or when aliases matter. Regions, customers, repositories,
plans, environments, and assignees are good fits. For multiple values, use `MultiSelect`.

## Import

```tsx
import { Combobox } from "@infinibay/harbor/inputs";
```

## Basic Usage

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

## Selection Model

`value` is the selected option value. Harbor finds the matching option and displays its label
in the trigger. When a user selects a row, `onChange` receives the new value, the menu closes,
and the search query resets.

Filtering is case-insensitive. Each option is searched by `label` and every string in
`keywords`, so you can include internal IDs, airport codes, abbreviations, or localized names
without displaying them in the UI.

## Props

- **options** - `ComboboxOption[]`. Each `{ value, label, keywords? }`.
  `keywords` join `label` for the search match.
- **value** - `string`. Current selection.
- **onChange** - `(v: string) => void`.
- **placeholder** - `string`. Anchor placeholder when nothing
  selected. Default `"Select or search…"`.
- **label** - `string`. Optional label above the anchor.
- **emptyText** - `string`. Shown when the filter has no matches.
  Default `"No matches"`.
- **className** - extra classes on the wrapper.

## Accessibility

The trigger is a button and the search field receives focus when the menu opens. The current
implementation is optimized for pointer and text filtering, not for a complete ARIA combobox
pattern with active descendant and arrow-key option navigation. If this picker is used in a
keyboard-heavy workflow, keep a nearby explicit label and test the flow with your required
assistive technology.

Use descriptive option labels. Keywords are invisible helpers; they should not contain the
only human-readable name for an option.

## Gotchas

- `Combobox` does not fetch options. Debounce remote search in the parent and pass the current
  option array back in.
- The menu is rendered in a `Portal`, so it escapes clipped parents. Position is synced on
  scroll and resize.
- An unknown `value` displays the placeholder. Keep `options` and `value` in sync when data
  arrives asynchronously.
- Use `Select` for short fixed lists; a search input adds friction when there are only two or
  three choices.

## Related

- `Select` for short single-choice lists.
- `MultiSelect` for tag-style multi-pick.
- `SearchField` for free-form search without selection.
- `Popover` and `Menu` for custom command surfaces.
