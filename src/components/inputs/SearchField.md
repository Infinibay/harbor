# SearchField

`SearchField` is a searchable input with async-capable result loading and a
portal-rendered result menu. It is useful for global search, entity lookup,
member pickers, command-like page search, and quick navigation where the parent
can return matching results from local data or a remote API.

The component owns the query text, loading state, popup placement, and result
highlighting. Your app owns the search implementation and what happens after a
result is picked.

## Import

```tsx
import { SearchField, type SearchResult } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
const results: SearchResult[] = [
  { id: "dashboard", title: "Dashboard", subtitle: "Page" },
  { id: "billing", title: "Settings / Billing", subtitle: "Page" },
];

<SearchField
  placeholder="Search pages"
  onSearch={(query) =>
    results.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()),
    )
  }
  onPick={(result) => navigate(`/search/${result.id}`)}
/>;
```

`onSearch` may also return a promise:

```tsx
<SearchField onSearch={(query) => api.searchUsers(query)} onPick={openUser} />
```

## Props

- **placeholder** - `string`. Input placeholder. Default `"Search..."`.
- **onSearch** - `(query: string) => SearchResult[] | Promise<SearchResult[]>`.
  Called after a short debounce when the query is non-empty.
- **onPick** - `(result: SearchResult) => void`. Called when a result is chosen.
- **className** - extra classes on the root.

## SearchResult

```ts
type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
};
```

`title` is used for match highlighting. `subtitle` is secondary metadata. `icon`
is rendered before the result copy.

## Behavior

Typing starts a 160 ms debounce, then calls `onSearch`. If the query changes
before the search resolves, the previous result is ignored. The menu is rendered
through a portal and positioned from the input's viewport rectangle, updating on
scroll and resize.

The clear button resets the query. Clicking outside the input and menu closes
the menu.

## Accessibility

The input is native, but the result menu is a custom popup and does not currently
implement full combobox keyboard semantics. Use it for lightweight product
search; if your workflow requires arrow-key result navigation and ARIA combobox
behavior, extend the component or use a dedicated combobox.

Keep result titles and subtitles descriptive enough that users can identify the
destination before picking.

## Gotchas

- There is no built-in caching or request cancellation beyond ignoring stale
  results.
- Empty query clears results and does not call `onSearch`.
- `onPick` closes the menu but does not clear the query.
- Result matching and ranking are entirely your app's responsibility.

## Related

- `ExpandingSearch` for toolbar search that collapses when unused.
- `Combobox` for option selection with stronger input semantics.
- `CommandPalette` for global commands.
- `FilterBar` for structured filtering.
