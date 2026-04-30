# Pagination

Numbered page picker with prev/next arrows. For 7 or fewer pages,
every page renders; beyond that, the middle collapses into a
windowed range (`1 … 5 6 7 … 24`). The active page renders as a
filled white pill.

## Import

```tsx
import { Pagination } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const [page, setPage] = useState(1);

<Pagination page={page} total={24} onChange={setPage} />
```

## Props

- **page** — `number`. Required. Current page (1-indexed).
- **total** — `number`. Required. Total number of pages.
- **onChange** — `(p: number) => void`. Required. Fired when the
  user clicks a page or the prev/next arrow.
- **className** — extra classes on the wrapper.

## Notes

- Prev/next buttons are disabled at page `1` and page `total`
  respectively, with reduced opacity.
- Clicking a `…` ellipsis is a no-op — it's a span, not a button.
- The windowed range always shows page `1`, page `total`, and a
  ±1 window around the current page.
