# HostCard

`HostCard` summarizes a compute host, VM, server, or node. It combines operational status, identity, resource usage, tags, optional OS icon, actions, click handling, and context-menu handling in one dense tile.

Use it in infrastructure dashboards, cluster grids, provisioning tools, and admin surfaces where users scan many machines before opening details.

## Import

```tsx
import { HostCard, type HostStatus } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { HostCard } from "@infinibay/harbor/display";

export function HostTile({ host, openHost }) {
  return (
    <HostCard
      name="vm-prod-01"
      subtitle="10.0.4.11 · Ubuntu 24.04"
      status="online"
      cpu={42}
      ram={{ used: 6, total: 16, unit: "GiB" }}
      disk={{ used: 84, total: 256, unit: "GiB" }}
      tags={["api", "eu-west"]}
      actions={<HostMenu host={host} />}
      onClick={() => openHost(host.id)}
    />
  );
}
```

## Status And Resources

`status` accepts `"online"`, `"degraded"`, `"offline"`, and `"provisioning"`. CPU is a percentage. RAM and disk accept `{ used, total, unit? }` and are converted into resource percentages for `ResourceMeter`.

```tsx
<HostCard
  name="worker-07"
  status="degraded"
  cpu={91}
  ram={{ used: 29.4, total: 32 }}
  disk={{ used: 180, total: 256 }}
/>
```

## Props

- **name**: `string`. Required host name.
- **subtitle**: `string`. Address, OS, region, or instance type.
- **status**: `HostStatus`. Required.
- **cpu**: `number`. CPU usage from `0` to `100`.
- **ram**: `{ used: number; total: number; unit?: string }`.
- **disk**: `{ used: number; total: number; unit?: string }`.
- **tags**: `string[]`. Small uppercase chips.
- **actions**: `ReactNode`. Top-right actions slot.
- **leadingIcon**: `ReactNode`. Small icon beside the status dot.
- **onClick**: `() => void`. Makes the card keyboard-focusable and clickable.
- **onContextMenu**: `(e: MouseEvent<HTMLDivElement>) => void`. Right-click hook.
- **className**: custom class on the card.

## Accessibility

When `onClick` is set, the card receives `role="button"`, `tabIndex=0`, and supports `Enter`/`Space`. Keep actions in the action slot as real buttons or menu triggers, and make sure the host detail route is also reachable from a non-pointer workflow.

Status is shown with text as well as a dot, so the tile does not rely only on color.

## Gotchas

- `provisioning` applies a pulse animation to the whole card.
- Resource usage is optional. Passing only CPU, only RAM, or only disk is valid.
- `ram.total` and `disk.total` should be positive for useful percentages.
- If the whole card is clickable and the action slot contains buttons, stop propagation in those action controls if they should not also open the host.

## Related

- [`ResourceMeter`](./ResourceMeter.md) for the embedded resource bars.
- [`StatusDot`](./StatusDot.md) for standalone status indicators.
- [`ClusterView`](./ClusterView.md) for larger host grids.
