# VirtualList

Windowed scroll container for huge fixed-height lists — only the rows
in / near the viewport are mounted. Use when the dataset is known and
items are uniformly tall. For incremental fetch on scroll, use
`<InfiniteScroll>` (which mounts everything but defers loading).

## Import

```tsx
import { VirtualList } from "@infinibay/harbor/data";
```

## Example

```tsx
const items = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}));

<VirtualList
  items={items}
  itemHeight={36}
  height={400}
  keyFor={(it) => it.id}
  renderItem={(it) => (
    <div style={{ padding: "8px 12px" }}>{it.name}</div>
  )}
/>
```

## Props

- **items** — `T[]`. Required.
- **itemHeight** — `number`. px per row. Required. All rows must be
  the same height — measurement is not done.
- **height** — `number`. px viewport height. Required.
- **renderItem** — `(item: T, index: number) => ReactNode`. Required.
- **overscan** — `number`. Rows rendered above + below the viewport
  to mask scroll pop-in. Default `6`.
- **keyFor** — `(item: T, index: number) => string | number`. Default
  uses the index. Provide a stable key when items can reorder.
- **className** — extra classes on the scroll container.

## Notes

- Rows render absolutely-positioned inside a sized spacer — total
  height is `items.length * itemHeight`.
- Variable-height rows aren't supported. For those, use
  `<InfiniteScroll>` and accept the cost of mounting everything.
