# TagInput

`TagInput` lets users build a small list of free-form labels inside one input
surface. It is useful for project tags, issue labels, filters, skills, domains,
recipients, and any workflow where the user needs to add several short tokens
without opening a separate picker.

The component supports controlled and uncontrolled usage, animated tag chips,
keyboard creation with `Enter` or comma, and quick deletion from both the chip
buttons and the keyboard.

## Import

```tsx
import { TagInput } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const [tags, setTags] = useState(["frontend", "react"]);

<TagInput
  label="Tags"
  value={tags}
  onChange={setTags}
  placeholder="Add tag"
/>;
```

Use the array directly in filters or form payloads:

```tsx
<TagInput value={filters.labels} onChange={(labels) => setFilters({ labels })} />
```

## Props

- **value** - `string[]`. Controlled tag list.
- **defaultValue** - `string[]`. Initial uncontrolled tag list. Default `[]`.
- **onChange** - `(value: string[]) => void`. Fires after add or remove.
- **placeholder** - `string`. Input placeholder shown only when there are no
  tags. Default `"Add tag..."`.
- **label** - `string`. Optional visible label above the input.
- **className** - extra classes on the wrapper.

## Interaction

Users can type a tag and press `Enter` or comma to commit it. Leading and
trailing whitespace is trimmed. Empty tags and exact duplicates are ignored.

When the input is empty, `Backspace` removes the last tag. Each chip also has a
small remove button for pointer users. Harbor animates chip add/remove with
Framer Motion so dense tag editing still feels understandable.

## Controlled State

Use `value` and `onChange` when tags belong to a form, URL filter, or server
payload. Use `defaultValue` for local-only widgets. In controlled mode, the
parent must update `value`; otherwise the visual list will not change after
`onChange`.

## Accessibility

The optional `label` gives users a visible field name. Keep it enabled in forms
unless a surrounding `FormField` already provides a label. The text input is
keyboard reachable, and tag removal is available through both `Backspace` and
chip buttons.

Use short tag names. Long tokens can wrap and make the input harder to scan.

## Gotchas

- Duplicate detection is exact and case-sensitive. Normalize in your app if
  `React` and `react` should be treated as the same tag.
- Tags are free text. Validate allowed characters, maximum count, and maximum
  length before saving when the backend has constraints.
- The internal input currently uses a fixed DOM id. Avoid rendering many
  `TagInput` instances in the same small form until that implementation detail
  is replaced with generated ids.

## Related

- `MultiSelect` for choosing from known options.
- `Combobox` for searchable option creation flows.
- `FormField` and `FieldSet` for labeled forms.
- `Badge` for read-only tag display.
