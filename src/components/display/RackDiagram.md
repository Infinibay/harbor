# RackDiagram

Vertical rack visualization with numbered units (U) and host blocks
that span 1..N units. Hover highlights the slot, click emits
`onHostClick`. Pair with `<DatacenterRow>` to lay out an aisle of
racks side by side. For an aerial host overview use `<ClusterView>`.

## Import

```tsx
import {
  RackDiagram,
  DatacenterRow,
  type RackHost,
} from "@infinibay/harbor/display";
```

## Example

```tsx
<RackDiagram
  name="rack-a1"
  units={24}
  hosts={[
    { u: 1,  name: "switch-01",   status: "online", height: 1 },
    { u: 3,  name: "node-01",     status: "online", height: 2, subtitle: "compute" },
    { u: 6,  name: "node-02",     status: "degraded", height: 2 },
    { u: 12, name: "storage-01",  status: "online", height: 4, subtitle: "ceph osd" },
  ]}
  onHostClick={(h) => console.log(h.name)}
/>

<DatacenterRow racks={[rackA, rackB, rackC]} />
```

## RackHost

```ts
{
  u: number;            // starting rack unit (1-based)
  height?: number;      // U height. Default 1
  name: string;
  status?: Status;      // from StatusDot — online / degraded / offline / ...
  subtitle?: string;    // shown under name when height >= 2
  color?: string;       // background CSS override
}
```

## Props (`<RackDiagram>`)

- **hosts** — `readonly RackHost[]`. Required.
- **units** — `number`. Total U in the rack. Default `42`.
- **name** — `string`. Title rendered above the rack.
- **unitHeight** — `number`. Pixels per U. Default `14`.
- **bottomUp** — `boolean`. When `true` (default) U1 is at the
  bottom; flip to `false` for top-down numbering.
- **onHostClick** — `(host: RackHost) => void`.
- **className** — extra classes on the wrapper.

## Props (`<DatacenterRow>`)

- **racks** — `{ name; units?; hosts }[]`. Required.
- **unitHeight** — `number`. Forwarded to each rack.
- **onHostClick** — `(rackName: string, host: RackHost) => void`.
- **className** — extra classes on the row.

## Notes

- Hosts collide silently — if two hosts overlap U-ranges only the
  one matched by starting U is rendered.
- `subtitle` is only shown when the host occupies `>= 2` units;
  there isn't enough vertical room otherwise.
