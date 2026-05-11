# Presence

`Presence` shows who is currently in a workspace, document, canvas, issue,
thread, or live session. It renders stacked avatars, a count, optional statuses,
overflow summary, and companion cursor primitives for collaborative surfaces.

Use it when collaboration is active context. Use `Avatar` for one person and
`ActivityFeed` for historical collaboration.

## Import

```tsx
import { Presence, PresenceUser, CollabCursor } from "@infinibay/harbor/collab";
```

## Basic Usage

The legacy `users` prop is compact and convenient.

```tsx
<Presence
  users={[
    { id: "maya", name: "Maya", status: "editing" },
    { id: "leo", name: "Leo", status: "viewing" },
  ]}
  max={4}
/>
```

## Composable Usage

Use subcomponents when you want explicit React composition.

```tsx
<Presence size="md">
  <PresenceUser name="Maya" status="editing" />
  <PresenceUser name="Leo" status="viewing" />
  <PresenceUser name="Ana" status="idle" />
</Presence>
```

## Cursors

`CollabCursor` renders a named pointer at absolute coordinates. Use it inside a
positioned canvas or document surface.

```tsx
<CollabCursor x={cursor.x} y={cursor.y} name="Maya" color="#a855f7" />
```

## Props

`Presence` accepts `users`, `max`, `size`, `className`, and `children`.

`PresenceUser` accepts `name`, optional `color`, and optional status:
`viewing`, `editing`, or `idle`.

`CollabCursor` accepts `x`, `y`, `name`, and optional `color`.

## Accessibility

Presence avatars have tooltips with names and statuses. Keep meaningful
collaboration state available in text elsewhere, especially in audit logs,
comments, or active-user panels.

Animated editing status should not be the only signal that someone is modifying
content.

## Gotchas

`PresenceUser` must be rendered inside `Presence` because it reads size from
context.

`CollabCursor` is absolutely positioned and pointer-transparent. Its coordinates
must already be translated into the containing surface.

## Related

- `Avatar` for individual users.
- `CommentThread` for collaboration history.
- `ActivityFeed` for recent events.
- `CanvasPresenceCursor` for canvas-specific presence.
