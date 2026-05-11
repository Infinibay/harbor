# DiskAllocator

`DiskAllocator` visualizes capacity as horizontal slabs and lets users reserve
free space by dragging. It is useful for infrastructure consoles, database
storage settings, backup planning, VM provisioning, and desktop tools where
capacity needs to feel tangible.

Use it when allocation size matters visually. Use `SliderField` for a single
numeric capacity value.

## Import

```tsx
import { DiskAllocator } from "@infinibay/harbor/inputs";
```

## Basic Usage

Pass total capacity and existing allocations in bytes.

```tsx
<DiskAllocator
  total={512 * 1024 ** 3}
  allocations={[
    { id: "data", label: "Data", size: 240 * 1024 ** 3, tone: "used" },
    { id: "backup", label: "Backup", size: 120 * 1024 ** 3, tone: "backup" },
  ]}
  onChange={setAllocations}
/>
```

## Creating Allocations

Dragging on free space creates a new allocation. Use `onCreate` to shape the new
record.

```tsx
<DiskAllocator
  total={total}
  allocations={allocations}
  minSize={10 * 1024 ** 3}
  onCreate={(size) => ({ id: crypto.randomUUID(), label: "Reserved", size, tone: "reserved" })}
  onChange={setAllocations}
/>
```

## Props

- `total`: total capacity in bytes.
- `allocations`: required allocation slabs.
- `onChange`: called when allocations change.
- `onCreate`: custom record factory for drag-created slabs.
- `minSize`: minimum created chunk; defaults to 1 GB.
- `height`: bar height in pixels.
- `header`: optional title/status slot.
- `className`: wrapper class override.

Allocations include `id`, optional `label`, `size`, optional `tone`, and optional
`color`.

## Accessibility

The allocator is pointer-first. Mirror important capacity changes in numeric
fields, summary text, or a details panel so keyboard users can understand and
adjust the allocation.

Removal buttons include accessible labels when visible.

## Gotchas

`total`, `size`, and `minSize` are bytes. Keep units consistent.

The component clamps new drag-created chunks to available free space, but parent
state should still validate quotas and server constraints.

## Related

- `SliderField` for simple capacity values.
- `QuotaBar` for read-only quota status.
- `ResourceMeter` for utilization summaries.
- `NumberField` for exact capacity entry.
