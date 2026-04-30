# HostCard

Summary tile for a VM / server / compute host — status dot, optional
OS icon, name, subtitle, resource bars (CPU / RAM / disk), tag chips,
and an actions slot. Drop several into a `<FluidGrid>` or use
`<ClusterView>` for the full filterable grid experience.

## Import

```tsx
import { HostCard, type HostStatus } from "@infinibay/harbor/display";
```

## Example

```tsx
<HostCard
  name="vm-prod-01"
  subtitle="10.0.4.11 · ubuntu 24.04"
  status="online"
  cpu={42}
  ram={{ used: 6, total: 16, unit: "GiB" }}
  disk={{ used: 84, total: 256, unit: "GiB" }}
  tags={["api", "eu-west"]}
  leadingIcon={<UbuntuIcon />}
  actions={<MenuButton />}
  onClick={() => navigate("/hosts/prod-01")}
/>
```

## Props

- **name** — `string`. Required.
- **subtitle** — `string`. Address / OS line under the name.
- **status** — `"online" | "degraded" | "offline" | "provisioning"`. Required.
- **cpu** — `number`. CPU usage 0–100.
- **ram** — `{ used, total, unit? }`. Defaults `unit` to `"GB"`.
- **disk** — `{ used, total, unit? }`. Defaults `unit` to `"GB"`.
- **tags** — `string[]`. Small uppercase chips.
- **actions** — `ReactNode`. Top-right slot (menu, buttons).
- **leadingIcon** — `ReactNode`. Small icon next to the status dot
  (typically an OS logo).
- **onClick** — `() => void`. When set, the card is keyboard-focusable
  (Enter/Space activate).
- **onContextMenu** — `(e) => void`. Right-click handler.
- **className** — extra classes on the wrapper.

## Notes

- `provisioning` adds the Tailwind `animate-pulse` class to the whole card.
- Resource bars are rendered via `<ResourceMeter>`; CPU / RAM / disk are
  collapsed to a single block — pass any subset.
