# LiveMigrationIndicator

`LiveMigrationIndicator` visualizes an in-progress migration from one host to
another. It combines source and destination labels, a directional SVG arrow,
progress percentage, optional ETA, and optional detail text in one compact row.

Use it in infrastructure consoles, VM managers, database failover views, storage
replication tools, and admin workflows where users need to see movement between
two concrete endpoints.

## Import

```tsx
import { LiveMigrationIndicator } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<LiveMigrationIndicator
  sourceHost="vm-prod-01"
  destHost="vm-prod-02"
  progress={0.62}
  etaMs={45_000}
  detail="Memory copying: 1.2 GiB / 2.0 GiB"
/>
```

Feed it live job state from your backend or polling layer:

```tsx
<LiveMigrationIndicator
  sourceHost={job.source.name}
  destHost={job.destination.name}
  progress={job.bytesCopied / job.totalBytes}
  etaMs={job.etaMs}
  detail={job.phaseLabel}
/>
```

## Props

- **sourceHost** - `ReactNode`. Required. Label shown at the left.
- **destHost** - `ReactNode`. Required. Label shown at the right.
- **progress** - `number`. Required. Expected range is `0` to `1`; Harbor clamps
  out-of-range values.
- **etaMs** - `number`. Optional estimated time remaining in milliseconds.
- **color** - `string`. CSS color used for the arrow and progress stroke.
  Default `rgb(168 85 247)`.
- **detail** - `ReactNode`. Optional secondary line under the progress row.
- **className** - extra classes on the wrapper.

## Behavior

The SVG track always points from source to destination. Progress is clamped to
the safe visual range, then rendered as a colored line with a moving dash overlay
to imply live transfer.

When `etaMs` is present, the component ticks once per second so formatted
duration text stays fresh while the migration is active. The component does not
decrement the ETA for you; pass updated values from your job state when accuracy
matters.

## Accessibility

The source, destination, percentage, ETA, and detail are rendered as text, so the
critical migration state is not encoded only in the animation. Include meaningful
host names or labels, not just internal IDs, when the operator needs to make a
decision.

For high-risk migration workflows, pair the indicator with status text such as
`copying`, `switchover`, `verifying`, or `failed`; the arrow alone should not be
the only state signal.

## Gotchas

- `progress` is visual progress, not a job controller. Your app owns polling,
  cancellation, retry, and failure states.
- The component uses an inline SVG marker id. Avoid rendering multiple isolated
  SVG systems that redefine the same marker styling in unexpected ways.
- Long host labels truncate. Put full host details in a drawer, tooltip, or
  adjacent metadata when operators need exact values.

## Related

- `Progress` and `ProgressRing` for generic progress.
- `StatusBar` for workspace-level job state.
- `Timeline` or `ActivityFeed` for migration history.
- `MetricCard` for source and destination health metrics.
