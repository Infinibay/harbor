# VirtualList

`VirtualList` renders a large fixed-height list by mounting only the rows visible in the scroll viewport plus overscan. Use it for logs, queues, server lists, command results, event streams, search results, and large admin lists when every row has the same height.

For tables with sorting, columns, selection, and richer state, use `DataTable`.

## Import

```tsx
import { VirtualList } from "@infinibay/harbor/data";
```

## Basic Usage

```tsx
import { VirtualList } from "@infinibay/harbor/data";

type Host = { id: string; name: string; cpu: number };

export function HostList({ hosts }: { hosts: Host[] }) {
  return (
    <VirtualList
      items={hosts}
      itemHeight={36}
      height={400}
      keyFor={(host) => host.id}
      renderItem={(host) => (
        <div className="flex h-full items-center px-3">
          {host.name} - {host.cpu}% CPU
        </div>
      )}
    />
  );
}
```

## Props

- **items** - `T[]`. Required list data.
- **itemHeight** - `number`. Required fixed row height in pixels.
- **height** - `number`. Required viewport height in pixels.
- **overscan** - `number`. Extra rows rendered above and below. Default `6`.
- **renderItem** - `(item: T, index: number) => ReactNode`. Required row renderer.
- **keyFor** - `(item: T, index: number) => string | number`. Defaults to index.
- **className** - extra classes on the scroll container.

## Behavior

The component listens to scroll on its own container, calculates the start index from `scrollTop / itemHeight`, slices the visible window, and absolutely positions each mounted row inside a spacer with the full list height.

`overscan` reduces visible pop-in during fast scroll at the cost of rendering more rows.

## Accessibility

Only mounted rows exist in the DOM. For simple operational tools this is acceptable, but for searchable or screen-reader-heavy experiences, provide filtering, count summaries, and keyboard navigation that accounts for virtualization.

## Gotchas

- Every row must have the same height.
- Dynamic row heights are not supported.
- Default index keys can cause state reuse problems when items reorder. Prefer `keyFor`.
- Browser find cannot search unmounted rows.

## Related

- `DataTable` for structured tabular data.
- `InfiniteScroll` for loading more records.
- `CanvasVirtualized` for canvas item virtualization.
