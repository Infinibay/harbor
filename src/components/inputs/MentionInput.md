# MentionInput

`MentionInput` is a controlled textarea with an `@` picker. Type `@`, continue typing a name
or handle, navigate the suggestions, and insert a mention with Enter or Tab.

Use it for comments, chat composers, review notes, incident updates, and collaborative tools
where users need to address people without leaving the keyboard. It stores plain text; your
application decides how mentions are parsed, persisted, linked, and notified.

## Import

```tsx
import { MentionInput } from "@infinibay/harbor/inputs";
import type { MentionUser } from "@infinibay/harbor/inputs";
```

## Basic Usage

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

## Mention Behavior

The picker opens when the text immediately before the caret matches `@query`. Suggestions are
filtered by `name` and `handle`, case-insensitively. Arrow Down and Arrow Up move the active
suggestion, Enter or Tab inserts it, Escape closes the picker, and Cmd/Ctrl+Enter calls
`onSubmit` when the picker is not handling a mention.

Inserted text uses `@handle` when available. If a user has no handle, Harbor inserts the name
with spaces removed. The popup is rendered through a `Portal` and positioned below the
textarea, so it can appear above panels with `overflow: hidden`.

## Props

- **users** - `MentionUser[]`. Required. Each user has
  `{ id, name, handle?, avatar? }`.
- **value** - `string`. Required. Controlled value.
- **onChange** - `(v: string) => void`. Required.
- **onSubmit** - `(v: string) => void`. Fired on Cmd/Ctrl+Enter.
- **placeholder** - `string`. Default `"Type @ to mention someone…"`.
- **rows** - `number`. Textarea rows. Default `3`.
- **className** - extra classes on the wrapper.

## Accessibility

The textarea remains the primary input and keeps keyboard focus while the picker is open.
Suggestion buttons can be clicked, and keyboard insertion works through the textarea
`onKeyDown` handler. The current implementation does not expose a full ARIA combobox/listbox
relationship or active descendant announcement, so avoid using it as the only way to discover
critical people in accessibility-sensitive flows.

Provide a visible label around the field when it appears in forms. Mention suggestions should
use clear names and handles so users can distinguish people with similar names.

## Gotchas

- `avatar` exists on `MentionUser`, but the component currently renders `Avatar` from the
  user's name rather than the image URL.
- Popup positioning is intentionally simple: it appears below the textarea, not at the exact
  caret coordinate.
- The component does not tokenize mentions. Store the raw string or parse it in your own
  submit pipeline.
- If the users list is remote, load and filter it in the parent before passing it down.

## Related

- `ChatInput` for richer chat composition.
- `Textarea` for plain long-form input.
- `Avatar`, `Presence`, and `CommentThread` for collaborative surfaces.
- `Combobox` for selecting a user outside free-form text.
