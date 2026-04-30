# MasonryGrid

Pinterest-style column layout with a fixed number of columns. Children
are distributed round-robin across columns, so each column packs
tightly without aligning row baselines.

## Import

```tsx
import { MasonryGrid } from "@infinibay/harbor/data";
```

## Example

```tsx
<MasonryGrid columns={3} gap={16}>
  {photos.map((p) => (
    <img key={p.id} src={p.url} style={{ width: "100%", borderRadius: 8 }} />
  ))}
</MasonryGrid>
```

## Props

- **columns** — `number`. Default `3`.
- **gap** — `number`. px between columns and between cards within a
  column. Default `12`.
- **children** — items to lay out. Any ReactNode.
- **className** — extra classes on the root.

## Notes

- Distribution is round-robin (`i % columns`), not greedy-shortest.
  Order is preserved within each column but not across columns.
- The component is not responsive on its own — set `columns` based on
  a parent breakpoint hook if you need per-viewport tuning.
