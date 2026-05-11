# SnapshotTimeline

`SnapshotTimeline` shows backups, restore points, deployment snapshots, or saved
workspace states over time. It can render as a normal horizontal timeline for a
small set of snapshots or as a dense strip when history grows.

Use it when the user needs to choose a restore point. Use `Timeline` for
milestones and `ActivityFeed` for event history.

## Import

```tsx
import { SnapshotTimeline } from "@infinibay/harbor/display";
```

## Basic Usage

Pass snapshots with a stable id, timestamp, size in bytes, and optional label.

```tsx
<SnapshotTimeline
  snapshots={[
    {
      id: "snap-001",
      at: "2026-05-10T12:30:00Z",
      size: 48_000_000,
      label: "Before migration",
      kind: "pre-migration",
      locked: true,
    },
  ]}
  onSelect={(snapshot) => setSelectedSnapshot(snapshot)}
/>
```

## Restore And Delete

Restore and delete buttons appear on hover when the corresponding callbacks are
provided. Locked snapshots hide delete.

```tsx
<SnapshotTimeline
  snapshots={snapshots}
  onRestore={(snapshot) => confirmRestore(snapshot)}
  onDelete={(snapshot) => confirmDelete(snapshot)}
/>
```

## Dense Mode

Dense mode turns the timeline into a compact density strip. It activates
automatically above 50 snapshots, or you can force it.

```tsx
<SnapshotTimeline snapshots={snapshots} dense />
```

## Props

- `snapshots`: required snapshot list.
- `dense`: force compact strip mode.
- `onRestore`: optional restore action.
- `onDelete`: optional delete action.
- `onSelect`: optional snapshot selection callback.
- `className`: wrapper class override.

Each snapshot includes `id`, `at`, `size`, optional `label`, optional `kind`, and
optional `locked`.

## Accessibility

Snapshot dots are buttons with labels. Restore and delete are explicit buttons,
but hover-only actions are still harder to discover. For critical workflows,
mirror the selected snapshot actions in a detail panel or confirmation dialog.

## Gotchas

Sizes are bytes. Pass raw byte counts and let Harbor format them.

Dense mode is a navigation summary, not an exact inspection surface. Show
selected snapshot details elsewhere when users need confidence before restoring.

## Related

- `Timeline` for milestone sequences.
- `ActivityFeed` for restore and backup events.
- `Dialog` for restore/delete confirmation.
- `StatusBar` for backup job state.
