# RackDiagram

`RackDiagram` renders physical or logical rack units with host blocks, status
dots, labels, subtitles, and click callbacks. `DatacenterRow` composes multiple
racks side by side for aisle or region views.

Use it for infrastructure products, hosting dashboards, lab inventory, edge
device fleets, and internal operations tools where placement matters.

## Import

```tsx
import { RackDiagram, DatacenterRow } from "@infinibay/harbor/display";
```

## Basic Usage

Rack units are 1-based. By default numbering is bottom-up, matching physical rack
conventions.

```tsx
<RackDiagram
  name="rack-a7"
  units={42}
  hosts={[
    { u: 1, height: 2, name: "storage-01", status: "healthy", subtitle: "96 TB" },
    { u: 8, height: 4, name: "gpu-02", status: "warning", subtitle: "A100" },
  ]}
  onHostClick={(host) => openHost(host.name)}
/>
```

## Datacenter Rows

Use `DatacenterRow` when the user needs to compare several racks.

```tsx
<DatacenterRow
  racks={[
    { name: "A1", hosts: rackAHosts },
    { name: "A2", hosts: rackBHosts },
  ]}
  onHostClick={(rack, host) => openHost({ rack, host })}
/>
```

## Props

`RackDiagram` accepts `units`, `hosts`, `name`, `unitHeight`, `onHostClick`,
`bottomUp`, and `className`.

Host entries include `u`, optional `height`, `name`, optional `status`, optional
`subtitle`, and optional `color`.

`DatacenterRow` accepts `racks`, `unitHeight`, `onHostClick`, and `className`.

## Accessibility

The diagram is a spatial visual. Keep selected host details, alerts, and actions
available in text outside the rack. If host selection is central, provide a
keyboard-accessible host list or table beside the diagram.

Status dots should be supported by labels or details, not color alone.

## Gotchas

The component maps hosts by starting unit. It does not resolve overlapping host
blocks for you; validate rack data before rendering.

Short hosts may not have room for subtitles. Put important metadata in a side
panel or hover/detail view.

## Related

- `StatusDot` for host state.
- `ClusterView` for service topology.
- `HostCard` for individual host detail.
- `DataTable` for inventory lists.
