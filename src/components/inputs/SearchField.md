# SearchField

Async-aware search box with debounced result dropdown, inline match
highlighting, loading spinner, and a clear button. The caller resolves
results — the component handles debouncing (160ms), positioning
(portal-rendered, anchored), and click-outside dismissal. Use for
omnibox-style lookups; for a plain text input prefer `<TextField>`.

## Import

```tsx
import { SearchField, type SearchResult } from "@infinibay/harbor/inputs";
```

## Example

```tsx
<SearchField
  placeholder="Search docs…"
  onSearch={async (q) => {
    const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    return r.json();
  }}
  onPick={(item) => navigate(item.id)}
/>;
```

## Props

- **placeholder** — `string`. Default `"Search…"`.
- **onSearch** — `(q: string) => SearchResult[] | Promise<SearchResult[]>`.
  Called after the input settles for ~160ms; may be async.
- **onPick** — `(r: SearchResult) => void`. Fires when the user
  selects a result; the dropdown closes automatically.
- **className** — extra classes on the wrapper.

## Types

- **SearchResult** — `{ id: string; title: string; subtitle?: string; icon?: ReactNode }`.

## Notes

- Results are rendered through `<Portal>` so the dropdown can escape
  any clipping ancestor; positioning auto-updates on scroll/resize.
- Title matches are highlighted inline against the current query
  (case-insensitive substring).
- An empty `q` clears results without calling `onSearch`.
