# SnapshotTimeline

Horizontal strip of VM/disk snapshots laid out chronologically.
Each snapshot is a colored marker keyed by `kind`
(manual / auto / pre-migration); hover surfaces age and size, click
emits `onSelect`. Restore / Delete actions show inline on hover.
Above ~50 snapshots the component automatically collapses into a
density bar to stay readable.

## Import

```tsx
import {
  SnapshotTimeline,
  type Snapshot,
} from "@infinibay/harbor/display";
```

## Example

```tsx
<SnapshotTimeline
  snapshots={[
    { id: "1", at: "2026-04-20T08:00", size: 2_400_000_000, kind: "auto" },
    { id: "2", at: "2026-04-22T14:30", size: 2_600_000_000, kind: "manual", label: "before upgrade" },
    { id: "3", at: "2026-04-28T09:12", size: 2_900_000_000, kind: "pre-migration", locked: true },
  ]}
  onRestore={(s) => console.log("restore", s.id)}
  onDelete={(s)  => console.log("delete",  s.id)}
  onSelect={(s)  => console.log("select",  s.id)}
/>
```

## Snapshot

```ts
{
  id: string;
  at: Date | string | number;
  size: number;          // bytes
  label?: string;
  kind?: "manual" | "auto" | "pre-migration";
  locked?: boolean;      // suppresses the Delete action
}
```

## Props

- **snapshots** — `readonly Snapshot[]`. Required. Sorted internally
  by `at` ascending.
- **dense** — `boolean`. Force the density-bar view. Auto-enabled
  past 50 snapshots.
- **onSelect** — `(snap: Snapshot) => void`. Click on a marker.
- **onRestore** — `(snap: Snapshot) => void`. Renders an inline
  "Restore" button on hover.
- **onDelete** — `(snap: Snapshot) => void`. Renders an inline
  "Delete" button on hover. Hidden when `snap.locked === true`.
- **className** — extra classes on the wrapper.

## Notes

- Empty arrays render an "No snapshots yet." placeholder.
- In dense mode the markers position by time, not by index — long
  gaps between snapshots stay visible.
- Marker color is fixed per `kind`; for custom palettes wrap the
  component or restyle via `className`.
