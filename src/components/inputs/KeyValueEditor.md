# KeyValueEditor

Inline editable table for key/value pairs — env vars, HTTP headers,
metadata, query params. Keys whose name suggests a secret (matches
`/secret|token|key|password|apikey/i` by default) automatically render
their value cell as a `SecretsInput`. Rows can be reordered by
drag-and-drop. Use this instead of a `TagInput` when you need named
fields, and instead of a hand-rolled `<table>` when you want add /
remove / reorder for free.

## Import

```tsx
import { KeyValueEditor } from "@infinibay/harbor/inputs";
import type { KeyValuePair } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [pairs, setPairs] = useState<KeyValuePair[]>([
  { id: "1", key: "API_URL", value: "https://api.example.com" },
  { id: "2", key: "API_TOKEN", value: "sk_live_..." },
]);

<KeyValueEditor value={pairs} onChange={setPairs} />
```

## Props

- **value** — `readonly KeyValuePair[]`. Required. Each pair has
  `{ id, key, value }`. The caller owns the `id`s.
- **onChange** — `(next: KeyValuePair[]) => void`. Required.
- **secret** — `(key: string) => boolean`. Predicate that decides when
  to render the value cell as a `SecretsInput`. Defaults to a regex
  match on common secret-y key names.
- **keyPlaceholder** — `string`. Default `"KEY"`.
- **valuePlaceholder** — `string`. Default `"value"`.
- **hideAddButton** — `boolean`. Hide the built-in "Add pair" button
  when you want to drive additions externally.
- **header** — `ReactNode`. Slot rendered above the rows.
- **className** — extra classes on the wrapper.

## Notes

- Reordering uses plain pointer events plus Framer Motion `layout` for
  the settle animation — no `react-dnd` dependency.
- Empty state shows a dashed "No pairs yet" placeholder.
- The component is fully controlled; the caller mints new ids when
  appending externally.
