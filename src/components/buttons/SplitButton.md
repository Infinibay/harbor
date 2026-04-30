# SplitButton

A primary action paired with a caret that opens a menu of related
variants ("Save" + "Save and continue", "Save as draft", …). Prefer it
over `<ButtonGroup>` when the secondary options are *alternatives* to the
primary action rather than independent buttons.

## Import

```tsx
import { SplitButton } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<SplitButton
  primary={{ id: "save", label: "Save", onSelect: save }}
  options={[
    { id: "continue", label: "Save and continue", onSelect: saveContinue },
    { id: "draft", label: "Save as draft", onSelect: saveDraft },
    { id: "close", label: "Save and close", onSelect: saveClose },
  ]}
/>
```

## Props

- **primary** — `SplitButtonOption`. The main action shown on the left
  half. Required.
  - **id** — `string`.
  - **label** — `ReactNode`.
  - **description** — `ReactNode`. Optional secondary line (only used in
    the dropdown rows).
  - **icon** — `ReactNode`.
  - **onSelect** — `() => void`. Required.
- **options** — `SplitButtonOption[]`. Items rendered in the dropdown
  menu. Required.
- **variant** — `"primary" | "secondary"`. `primary` is a white/black
  pill; `secondary` is a translucent bordered chip. Default: `"primary"`.
- **className** — extra classes for the inline-flex wrapper.

## Notes

- The dropdown is rendered through `<Portal>` at `Z.POPOVER` and
  positioned with `getBoundingClientRect`; it tracks scroll and resize.
- Outside-click and selecting an option both close the menu.
- Click the main label to fire `primary.onSelect`; click the caret to
  open the menu of `options`.
