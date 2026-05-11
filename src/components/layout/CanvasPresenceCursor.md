# CanvasPresenceCursor

`CanvasPresenceCursor` renders one remote collaborator cursor inside a Harbor
`Canvas`. It smooths world-space cursor movement with springs, fades away users
without a cursor, and inverse-scales the cursor glyph so it stays pixel-accurate
while the canvas zooms.

Use it for collaborative editors, whiteboards, diagram tools, and canvas-based
workspaces.

## Import

```tsx
import { CanvasPresenceCursor } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Canvas grid="dots">
  {presence.users.map((user) => (
    <CanvasPresenceCursor key={user.id} user={user} />
  ))}
</Canvas>
```

## Props

- **user** - `PresenceUser`. Required user object with id, color, optional name,
  and optional cursor position.
- **stiffness** - `number`. Spring stiffness. Default `260`.
- **damping** - `number`. Spring damping. Default `28`.
- **showLabel** - `boolean`. Shows the user's name label. Default `true`.
- **awayOpacity** - `number`. Opacity when `user.cursor` is missing. Default
  `0.35`.

## Behavior

The cursor position is animated toward `user.cursor.x/y`. If the cursor is
missing, the marker fades but keeps its last position. The glyph scale is
derived from the canvas zoom so the cursor does not become huge or tiny while
zooming.

## Accessibility

Presence cursors are visual collaboration cues. Important collaboration state,
such as who is editing or locking an object, should also appear in a list,
presence bar, or inspector.

## Gotchas

- Render inside `Canvas` to get correct inverse zoom. Outside a canvas, it uses a
  fallback zoom of `1`.
- Pointer events are disabled; cursors cannot be clicked.
- Network presence updates, throttling, and identity color assignment belong to
  your app.

## Related

- `Canvas` for the workspace context.
- `Presence` for non-canvas user presence.
- `CanvasSelectionBox` and `CanvasItem` for local selection state.
- `useCanvasPresence` for presence data modeling.
