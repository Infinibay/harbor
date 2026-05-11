# InfiniteScroll

`InfiniteScroll` loads the next page of content when the reader reaches the end of a list.
It is intentionally small: Harbor owns the sentinel, spinner, and end state; your app owns
the records, pagination cursor, error handling, and request lifecycle.

Use it for activity feeds, inboxes, notifications, search results, changelogs, and content
streams where item height is variable and the user naturally keeps scrolling. For large,
fixed-height datasets where thousands of rows may exist at once, use `VirtualList` instead
or combine both patterns carefully.

## Import

```tsx
import { InfiniteScroll } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
const [items, setItems] = useState<Item[]>(initial);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);

<InfiniteScroll
  onLoadMore={async () => {
    if (loading) return;
    setLoading(true);
    const next = await fetchNext();
    setItems((cur) => [...cur, ...next.items]);
    setHasMore(next.hasMore);
    setLoading(false);
  }}
  hasMore={hasMore}
  loading={loading}
  endMessage={<>You're all caught up.</>}
>
  {items.map((it) => <Card key={it.id} item={it} />)}
</InfiniteScroll>
```

## How It Works

`InfiniteScroll` renders your children followed by a hidden sentinel area. When that sentinel
enters the viewport, an `IntersectionObserver` calls `onLoadMore`. The `threshold` prop is
used as `rootMargin`, so a threshold of `200` starts loading before the reader reaches the
physical end of the list.

The observer is not active while `loading` is true or `hasMore` is false. That makes repeated
loads easier to control, but it does not replace request deduping in your data layer. Keep
`loading`, cursor state, and abort behavior in the parent or query library.

## Props

- **onLoadMore** - `() => void`. Required. Fires when the sentinel
  enters the rootMargin band.
- **hasMore** - `boolean`. Required. Stops observing when `false` and
  shows the end message.
- **loading** - `boolean`. While true, renders a `Spinner` and skips
  observation. Default `false`.
- **threshold** - `number`. `rootMargin` in px around the viewport.
  Default `200`.
- **endMessage** - `ReactNode`. Default `"No more items"`.
- **children** - rendered list items, cards, timeline events, or rows.
- **className** - extra classes on the root flex column.

## Accessibility

The component does not announce loading by itself; it only renders a visual spinner. Add a
nearby `role="status"` message when loading more results is important to screen-reader users.
If the list updates many times, prefer one polite status region over announcing every item.

Keep keyboard access in mind. Infinite lists should still have clear item focus styles, stable
tab order, and a reachable end message. If important actions live below the feed, provide an
alternate route or a "Load more" fallback.

## Gotchas

- `onLoadMore` can fire again after the parent re-renders with `loading=false`; guard duplicate
  requests in the parent when the backend is slow.
- Every child remains mounted. Use `VirtualList` for long collections where memory or paint
  cost matters.
- The observer uses the viewport as its root. If you need a custom scroll container, wrap the
  behavior yourself or expose a dedicated root in a higher-level component.
- Errors are not rendered by `InfiniteScroll`; show retry UI in your list body.

## Related

- `VirtualList` for fixed-height lists with many rows.
- `DataTable` for sortable, filterable records.
- `ActivityFeed` and `Timeline` for event streams.
- `LoadingOverlay`, `Spinner`, and `EmptyState` for adjacent loading states.
