# ExpandingSearch

`ExpandingSearch` starts as a compact circular search button and expands into a
pill-shaped input when activated. It is designed for dense toolbars, morphing
command bars, mobile headers, and app chrome where search should be available
without permanently consuming horizontal space.

Use it for quick filtering inside an already visible surface. For full search
pages or complex query builders, use a dedicated search field and results layout.

## Import

```tsx
import { ExpandingSearch } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
const [query, setQuery] = useState("");
const [open, setOpen] = useState(false);

<ExpandingSearch
  open={open}
  onOpenChange={setOpen}
  value={query}
  onChange={setQuery}
  placeholder="Search files"
/>;
```

Filter nearby content from the controlled query:

```tsx
const visibleFiles = files.filter((file) => file.name.includes(query));
```

## Props

- **placeholder** - `string`. Input placeholder. Default `"Search"`.
- **open** - `boolean`. Controlled open state.
- **onOpenChange** - `(open: boolean) => void`. Fires when the search expands or
  collapses.
- **value** - `string`. Controlled query value.
- **onChange** - `(query: string) => void`. Fires as the user types or clears.
- **iconSize** - `number`. Magnifier icon size in pixels. Default `16`.
- **autoCollapseOnEmpty** - `boolean`. Collapse on blur when the query is empty.
- **className** - extra classes on the root.

## Behavior

Clicking the circular button toggles open state. When it opens, Harbor focuses
the input automatically. Pressing `Escape` collapses the field. If
`autoCollapseOnEmpty` is enabled, blur collapses the field only when the query is
empty.

The clear button appears when there is a query, clears the text, and returns
focus to the input.

## Controlled State

`open` and `value` are independently controllable. You can let Harbor manage one
and control the other, but most production search flows should control both so
the query can drive filters, URL state, or server requests.

When `open` is controlled, update it from `onOpenChange`; when `value` is
controlled, update it from `onChange`.

## Accessibility

The search affordance is a real button and the expanded field is a native input.
Provide a specific placeholder that names the target, such as `Search users` or
`Search commands`, not just `Search`.

If the field filters a visible list, make sure the list also communicates empty
results and result counts. The search input only captures the query.

## Gotchas

- This component does not debounce or fetch results. Debounce expensive work in
  your app.
- The icon button currently has visual meaning but no explicit text label prop.
  Put it in a toolbar where its purpose is clear, or wrap it with accessible
  labeling when needed.
- In tight flex layouts, give the container enough room for the expanded input
  or hide neighboring toolbar items while open.

## Related

- `SearchField` for a persistent search input.
- `CommandPalette` for global command search.
- `FilterBar` for structured data filters.
- `Toolbar` and `MorphBar` patterns for dense app chrome.
