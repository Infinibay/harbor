# CanvasPresenceCursor

Renders one remote user's cursor at their world-space position inside
a `<Canvas>`. The position follows pan/zoom; the cursor *glyph* stays
pixel-accurate via inverse zoom scaling. Movement is smoothed with a
per-cursor spring so remote pointers feel silky-laggy rather than
jittery.

## Import

```tsx
import { CanvasPresenceCursor } from "@infinibay/harbor/layout";
```

## Example

```tsx
const presence = useCanvasPresence({ users });

<Canvas>
  {/* world content */}
  {presence.users.map((u) => (
    <CanvasPresenceCursor key={u.id} user={u} />
  ))}
</Canvas>
```

## Props

- **user** — `PresenceUser`. `{ id, name?, color, cursor?, selection?, meta? }`.
  Omit `cursor` to mark the user as away.
- **stiffness** — `number`. Spring stiffness for smoothing. Default `260`.
- **damping** — `number`. Spring damping. Default `28`.
- **showLabel** — `boolean`. Render `user.name` next to the cursor.
  Default `true`.
- **awayOpacity** — `number`. Opacity when `cursor` is undefined.
  Default `0.35`.

## Notes

- Place as a child of `<Canvas>` (not in `overlay`) so it lives inside
  the world transform.
- Pair with `useCanvasPresence(...)` from `@infinibay/harbor` to fan
  out a `users[]` stream from your realtime backend.
- The cursor opts into `data-canvas-bounds` so `Canvas.fit()` can keep
  remote users in frame if you choose.
- See [Canvas.md](./Canvas.md) for the host's transform model.
