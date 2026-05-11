# ClusterView

`ClusterView` renders an infrastructure cluster as filter chips plus a responsive grid of `HostCard`s. It is pure DOM, not canvas, so it works well for admin consoles, monitoring pages, fleet dashboards, and deployment tools.

Use it when the user needs to scan many hosts, filter by status/region/tag, and open a host detail panel.

## Import

```tsx
import {
  ClusterView,
  type ClusterHost,
} from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { ClusterView, type ClusterHost } from "@infinibay/harbor/display";

const hosts: ClusterHost[] = [
  {
    id: "api-01",
    name: "api-01",
    status: "online",
    subtitle: "10.0.4.11 · Ubuntu 24.04",
    region: "us-east-1",
    tags: ["api", "prod"],
    cpu: 42,
    ram: { used: 6, total: 16, unit: "GiB" },
    disk: { used: 84, total: 256, unit: "GiB" },
  },
];

export function Fleet() {
  return (
    <ClusterView
      hosts={hosts}
      header={<h2>Production fleet</h2>}
      onHostClick={(host) => openHostDrawer(host.id)}
    />
  );
}
```

## Filtering Model

`ClusterView` derives filter options from the host list:

- status chips from host status counts
- region chips from `host.region`
- tag chips from every value in `host.tags`
- density toggle between comfortable and compact

Compact density hides CPU/RAM/disk meters and lowers the card minimum width.

## Props

- **hosts**: `readonly ClusterHost[]`. Required fleet data.
- **header**: `ReactNode`. Optional slot above filters.
- **onHostClick**: `(host: ClusterHost) => void`. Passed to each `HostCard`.
- **renderHost**: `(host, card) => ReactNode`. Wraps or replaces each rendered card.
- **minCardWidth**: `number`. Comfortable grid card minimum. Defaults to `280`.
- **className**: custom class on the wrapper.

## Accessibility

Filter chips and density controls expose pressed state. Host cards become keyboard-activatable when `onHostClick` is provided. If filtering changes operational risk visibility, keep counts visible in the status labels, as the component does.

## Gotchas

- Filters are internal state. If filters need to sync with URL params, compose your own filter bar and pass a filtered `hosts` array.
- `renderHost` is the escape hatch for context menus, links, or custom wrappers.
- Empty results render a dashed empty state, not a reset button.
- Compact mode intentionally hides resource meters to prioritize density.

## Related

- [`HostCard`](./HostCard.md) for individual hosts.
- [`FluidGrid`](../layout/FluidGrid.md) for the responsive card layout.
- [`StatusDot`](./StatusDot.md) for status semantics.
