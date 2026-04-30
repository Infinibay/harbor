# ClusterView

Aerial cluster view — filter chips (status / region / tag), density
toggle, and a responsive `<FluidGrid>` of `<HostCard>`s. Pure DOM, no
canvas. For per-host cards in isolation use `<HostCard>` directly.

## Import

```tsx
import { ClusterView, type ClusterHost } from "@infinibay/harbor/display";
```

## Example

```tsx
<ClusterView
  hosts={hosts}
  header={<h1 className="text-xl">Cluster · prod-eu</h1>}
  onHostClick={(h) => navigate(`/hosts/${h.id}`)}
/>
```

## ClusterHost

```ts
{
  id: string;
  name: string;
  status: "online" | "degraded" | "offline" | "provisioning";
  subtitle?: string;
  cpu?: number;                                       // 0..1
  ram?:  { used: number; total: number; unit?: string };
  disk?: { used: number; total: number; unit?: string };
  tags?: string[];
  region?: string;
  osIcon?: ReactNode;
}
```

## Props

- **hosts** — `readonly ClusterHost[]`. Required.
- **header** — `ReactNode`. Slot above the filter row.
- **onHostClick** — `(host: ClusterHost) => void`. Fires when a card
  is clicked.
- **renderHost** — `(host, card) => ReactNode`. Wrap each card with
  custom chrome — e.g. a `<ContextMenu>` trigger.
- **minCardWidth** — `number`. FluidGrid minimum card width. Default `280`
  (drops to `200` automatically in compact density).
- **className** — extra classes on the wrapper.

## Notes

- Filters are local state — the component is fully uncontrolled. To
  link filters to URL state, render your own filters above and pass a
  pre-filtered `hosts` array.
- The status filter chip shows running counts (`Online · 12`).
- Compact density hides cpu / ram / disk on each card and tightens the
  grid; tags + leading icon stay visible.
- Filter chips are only rendered when there is at least one matching
  region / tag in the data.
