# Select

Single-choice dropdown with portal-rendered menu, keyboard navigation,
optional per-option icon + description, and a cursor-proximity
highlight on the trigger. Reach for it whenever a native `<select>`
would clip context (icons, descriptions) or visually clash with the
rest of the surface. For free-text + filtering use `<Combobox>`; for
multi-select use `<MultiSelect>`.

## Import

```tsx
import { Select, type SelectOption } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const regions: SelectOption[] = [
  { value: "us-east", label: "US East (N. Virginia)" },
  { value: "eu-west", label: "EU West (Ireland)", description: "Lowest latency in EU" },
  { value: "ap-south", label: "Asia Pacific (Mumbai)" },
];

<Select
  label="Region"
  options={regions}
  value={region}
  onChange={setRegion}
  placeholder="Pick a region"
/>;
```

## Props

- **options** — `SelectOption[]`. Required.
- **value** — `string`. Controlled selected value.
- **defaultValue** — `string`. Uncontrolled initial selection.
- **onChange** — `(v: string) => void`.
- **placeholder** — `string`. Defaults to the i18n key
  `harbor.select.placeholder`.
- **label** — `string`. Optional label above the trigger.
- **size** — `"sm" | "md"`. Default `"md"` (44px). Use `"sm"` (28px)
  in toolbars / pagination bars where a full-size input would
  overwhelm chrome.
- **menuWidth** — `"trigger" | "auto" | number | string`. Default `"trigger"`.
  - `"trigger"` — dropdown matches the trigger width exactly.
  - `"auto"` — at least the trigger width, grows with the longest
    option (capped at `min(90vw, 480px)`).
  - number or CSS length — fixed width, never narrower than the trigger.
- **disabled** — `boolean`.
- **className** — extra classes on the wrapper.

## Types

- **SelectOption** — `{ value; label; description?; icon?; disabled? }`.

## Notes

- Keyboard: `↑/↓` move focus, `Enter` opens (or commits when open),
  `Esc` closes.
- The menu is rendered through `<Portal>` and pinned via
  `position: fixed` — it escapes overflow-clipping ancestors. Position
  recalculates on scroll/resize.
- The selected row gets a layout-animated fuchsia indicator bar (uses
  `motion.span` with `layoutId`).
