# MentionInput

Textarea with `@`-triggered user picker — type `@`, filter by name or
handle, arrow-keys to navigate, Enter/Tab to insert. Use this for
comment boxes, chat composers, or anywhere users address each other
by name. Cmd/Ctrl+Enter triggers `onSubmit`.

## Import

```tsx
import { MentionInput } from "@infinibay/harbor/inputs";
import type { MentionUser } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const users: MentionUser[] = [
  { id: "1", name: "Andrés Bermúdez", handle: "andres" },
  { id: "2", name: "Jules Lambert", handle: "jules" },
];

const [value, setValue] = useState("");

<MentionInput
  users={users}
  value={value}
  onChange={setValue}
  onSubmit={(text) => post(text)}
  placeholder="Comment…"
/>
```

## Props

- **users** — `MentionUser[]`. Required. Each user has
  `{ id, name, handle?, avatar? }`.
- **value** — `string`. Required. Controlled value.
- **onChange** — `(v: string) => void`. Required.
- **onSubmit** — `(v: string) => void`. Fired on Cmd/Ctrl+Enter.
- **placeholder** — `string`. Default `"Type @ to mention someone…"`.
- **rows** — `number`. Textarea rows. Default `3`.
- **className** — extra classes on the wrapper.

## Notes

- The picker portals to `document.body` and positions itself just
  below the textarea — so it escapes overflow-hidden parents.
- Inserted mentions use `@handle` if available, otherwise the name
  with whitespace stripped. The component does not parse mentions
  back out — store the raw string and parse server-side.
- Filtering matches on both `name` and `handle`, case-insensitive.
