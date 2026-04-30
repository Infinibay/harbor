# InlineEdit

A text value that becomes an input on click — for renaming a
project, editing a heading, or any "click the title to change it"
affordance. `Enter` (or blur) commits, `Escape` cancels.

## Import

```tsx
import { InlineEdit } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [name, setName] = useState("Untitled project");

<InlineEdit value={name} onChange={setName} as="heading" />
```

## Props

- **value** — `string`. Current value (controlled).
- **onChange** — `(v: string) => void`. Called on commit, only when
  the trimmed draft differs from `value`.
- **placeholder** — `string`. Shown when `value` is empty. Default
  `"Click to edit"`.
- **as** — `"text" | "heading"`. Typography preset. `"heading"`
  uses `text-xl font-semibold`. Default `"text"`.
- **className** — extra classes on the wrapper.

## Notes

- Whitespace-only drafts are trimmed before commit; if the trimmed
  value matches the current `value`, no `onChange` fires.
- The pencil icon appears on hover.
- Both states share a `layoutId="inline-edit"`, so Framer Motion
  cross-fades between view and edit modes.
