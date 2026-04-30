# Presence

A stacked avatar row showing who is currently on a page or document,
with a tooltip per user and an overflow `+N` chip. Pair it with
`<CollabCursor>` to render live pointers on a shared canvas.

## Import

```tsx
import {
  Presence,
  PresenceUser,
  CollabCursor,
} from "@infinibay/harbor/collab";
```

## Example (recommended composable API)

```tsx
<Presence max={4} size="sm">
  <PresenceUser name="Ana" status="editing" />
  <PresenceUser name="Bruno" status="viewing" />
  <PresenceUser name="Cinto" status="idle" />
  <PresenceUser name="Diego" />
  <PresenceUser name="Elena" />
</Presence>

// Live cursor overlay (absolute-positioned inside a relative parent):
<CollabCursor x={120} y={48} name="Ana" color="#a855f7" />;
```

## Subcomponents

- **`<PresenceUser>`** — one user pip. Reads `size` from the parent
  `<Presence>` via context.

## Props

### `<Presence>`

- **max** — `number`. Maximum avatars rendered before the `+N` chip
  appears. Default: `4`.
- **size** — `"sm" | "md" | "lg"`. Avatar size, applied to all
  `<PresenceUser>` children. Default: `"sm"`.
- **className** — extra classes on the root flex container.

### `<PresenceUser>`

- **name** — `string`. Required. Used for the avatar fallback and
  tooltip.
- **status** — `"viewing" | "editing" | "idle"`. Optional. Drives
  tooltip suffix and the dot indicator (see Notes).
- **color** — `string`. Optional. Reserved for future per-user color;
  not currently consumed by `<Presence>` (pass to `<CollabCursor>` to
  keep colors consistent).

### `<CollabCursor>`

- **x**, **y** — `number`. Pixel offsets applied via `translate`.
  Position the cursor's owner with `position: relative`.
- **name** — `string`. Label rendered next to the arrow.
- **color** — `string`. CSS color for the arrow fill and label
  background. Default: `"#a855f7"`.

## Notes

- Tooltip content is `"<name> · <status>"` when `status` is set, else
  just the name. `status: "idle"` maps to the avatar's `away` dot;
  everything else maps to `online`.
- `status: "editing"` adds a pulsing fuchsia dot in the top-right of
  the avatar to flag active typing.
- The trailing label uses singular/plural correctly: `1 person` vs
  `N people`. It reflects total count, not `max`.
- `<CollabCursor>` is `pointer-events: none` and uses `z-index: 1000`;
  it must sit inside an element with non-static positioning.
