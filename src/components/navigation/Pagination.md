# Pagination

`Pagination` lets users move through a known number of pages. Use it for server-paginated tables, audit logs, search results, billing history, inboxes, and any dataset where loading everything at once would be slow or noisy.

The component is controlled. Harbor renders page buttons, previous/next controls, ellipses, active state, disabled edge buttons, and small press/hover motion. Your app owns the current page and data fetching.

## Import

```tsx
import { Pagination } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
const [page, setPage] = useState(1);
const invoices = useInvoices({ page });

<DataTable rows={invoices.rows} columns={columns} />
<Pagination
  page={page}
  total={invoices.pageCount}
  onChange={setPage}
/>
```

Use it with URL state when pages should be shareable:

```tsx
<Pagination
  page={Number(searchParams.get("page") ?? 1)}
  total={pageCount}
  onChange={(next) => setSearchParams({ page: String(next) })}
/>
```

## Props

- **page** - required number. Current page, 1-indexed.
- **total** - required number. Total number of pages.
- **onChange** - required callback `(page: number) => void`.
- **className** - optional string merged onto the root container.

## Range Model

When `total <= 7`, Harbor renders every page. For longer ranges, it keeps the first page, last page, current page, one neighbor on each side, and ellipses where pages are omitted. Previous is disabled on page `1`; next is disabled on the last page.

The component does not clamp invalid `page` values. Keep state in range before passing it in.

## Data Model

Use pagination when the backend can answer "page N of total M." For infinite feeds or cursor APIs, prefer `InfiniteScroll`, a "Load more" button, or cursor-specific controls.

Reset `page` to `1` when filters, search terms, or page size changes unless your product has a reason to preserve the current page.

## Accessibility

Pagination buttons are native buttons. The current implementation does not add page-specific `aria-label` values, so surrounding context matters. Put it near the table or result list it controls, and consider extending labels in high-accessibility surfaces.

## Gotchas

- `total` is page count, not item count.
- `page` is 1-indexed.
- The component triggers `onChange`; it does not fetch data itself.
- Do not use pagination for very small lists where all items fit comfortably.

## Related

- `DataTable` for paginated records.
- `FilterBar` and `SearchField` for narrowing results.
- `InfiniteScroll` for feed-style loading.
- `EmptyState` for no results after filtering.
