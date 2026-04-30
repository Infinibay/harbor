# DiskAllocator

Horizontal slab bar for laying out disk allocations across a fixed
total. Each slab is colored by tone (used / reserved / backup /
warn / custom), drag-across-free-space reserves a new chunk, and
hovering a slab reveals an inline delete affordance. Used for
storage planners, partition layouts, quota distributions.

## Import

```tsx
import { DiskAllocator } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const TB = 1024 ** 4;
const GB = 1024 ** 3;
const [allocs, setAllocs] = useState<DiskAllocation[]>([
  { id: "os",   label: "OS",     size: 64 * GB,  tone: "used" },
  { id: "data", label: "Data",   size: 800 * GB, tone: "reserved" },
  { id: "snap", label: "Backup", size: 128 * GB, tone: "backup" },
]);

<DiskAllocator
  total={2 * TB}
  allocations={allocs}
  onChange={setAllocs}
  header={<span className="text-sm font-medium">Volume layout</span>}
/>
```

## Props

- **total** — `number`. Total capacity in bytes. Required.
- **allocations** — `readonly DiskAllocation[]`. Each:
  `{ id, label?, size, tone?, color? }`. `tone` ∈ `"used" |
  "reserved" | "backup" | "warn" | "custom"`. `color` overrides the
  tone palette.
- **onChange** — `(allocations: DiskAllocation[]) => void`. Fires
  when the user reserves a new chunk or removes one.
- **onCreate** — `(size: number) => DiskAllocation`. Customise how
  drag-created slabs are constructed (id, label, tone).
- **minSize** — `number`. Minimum chunk size in bytes. Default
  `1 GB`. Drags shorter than this are discarded.
- **height** — `number`. Bar height in px. Default `32`.
- **header** — `ReactNode`. Optional title slot above the bar; when
  set, the right side shows `consumed / total · free`.
- **className** — extra classes on the wrapper.

## Notes

- Drag starts on free space — clicks on existing slabs are caught by
  `data-slab` and ignored.
- Slab labels render only when the slab is wider than 6% of the bar
  to avoid overflowing tiny chunks.
- Free-space label flips to the danger color when remaining capacity
  is below `minSize`.
