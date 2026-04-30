# TagInput

Compact input that collects an array of free-form string tags. Press
`Enter` or `,` to commit the current input as a tag, `Backspace` on an
empty input to remove the last one. Use this for ad-hoc lists (labels,
keywords, recipients); reach for `<MultiSelect>` instead when the set
of allowed values is fixed.

## Import

```tsx
import { TagInput } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [tags, setTags] = useState<string[]>(["frontend", "react"]);

<TagInput label="Tags" value={tags} onChange={setTags} />
```

## Props

- **value** — `string[]`. Controlled tag list.
- **defaultValue** — `string[]`. Initial tags in uncontrolled mode.
- **onChange** — `(v: string[]) => void`. Fires whenever the list
  changes (add or remove).
- **placeholder** — `string`. Default `"Add tag…"`. Only shown when
  the list is empty.
- **label** — `string`. Optional caption above the field.
- **className** — extra classes on the wrapper.

## Notes

- Duplicate tags (exact-match) are silently rejected.
- The chip add/remove animation is driven by Framer Motion's
  `AnimatePresence` + `layout`.
- The component does not enforce a max length — wrap it if you need
  validation.
