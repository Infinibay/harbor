# InfiniteScroll

Sentinel-based loader: when the bottom marker enters the viewport,
calls `onLoadMore`. Use for paginated feeds where items have variable
height. For fixed-height rows over a known dataset, prefer
`<VirtualList>` (which renders only what's visible).

## Import

```tsx
import { InfiniteScroll } from "@infinibay/harbor/data";
```

## Example

```tsx
const [items, setItems] = useState<Item[]>(initial);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);

<InfiniteScroll
  onLoadMore={async () => {
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

## Props

- **onLoadMore** — `() => void`. Required. Fires when the sentinel
  enters the rootMargin band.
- **hasMore** — `boolean`. Required. Stops observing when `false` and
  shows the end message.
- **loading** — `boolean`. While true, renders a Spinner and skips
  observation. Default `false`.
- **threshold** — `number`. `rootMargin` in px around the viewport.
  Default `200`.
- **endMessage** — `ReactNode`. Default `"No more items"`.
- **children** — the rendered items.
- **className** — extra classes on the root.

## Notes

- Uses a single `IntersectionObserver` keyed on viewport, threshold,
  and the `loading`/`hasMore` flags.
- The component does not own the items array — the parent appends and
  re-renders.
- Pair with `<VirtualList>` if the list grows huge; this component
  alone keeps every child mounted.
