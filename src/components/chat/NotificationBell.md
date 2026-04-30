# NotificationBell

A bell icon button with an unread counter badge that opens a portaled
dropdown listing recent notifications. Use in app headers/toolbars.

## Import

```tsx
import { NotificationBell, type Notification } from "@infinibay/harbor/chat";
```

## Example

```tsx
const items: Notification[] = [
  { id: "1", title: "Build finished", description: "main · 2m 14s", time: "now", unread: true },
  { id: "2", title: "Ana commented on your PR", time: "10m" },
];

<NotificationBell
  notifications={items}
  onRead={(id) => markRead(id)}
  onReadAll={() => markAllRead()}
/>
```

## Props

- **notifications** — `Notification[]`. Required. List rendered top-to-bottom.
- **onRead** — `(id: string) => void`. Fires when a row is clicked.
- **onReadAll** — `() => void`. Wires the "Mark all read" link in the header. The link only renders when there are unread items AND this prop is provided.
- **className** — extra classes on the bell button.

### `Notification` shape

- **id** — `string`. Required, used as React key and passed to `onRead`.
- **title** — `string`. Required.
- **description** — `string`. Clamped to two lines.
- **time** — `string`. Required. Free-form label (e.g. `"10m"`, `"now"`).
- **unread** — `boolean`. Shows a fuchsia dot and contributes to the badge count.
- **icon** — `ReactNode`. Optional avatar/icon on the left of the row.

## Notes

- The button carries `aria-label="Notifications"`. The bell wiggles on a 4s loop while there are unread items.
- The badge shows the unread count, capped to `9+`.
- The dropdown renders into a `<Portal>` at `Z.POPOVER`, fixed-positioned 8px below the button and right-aligned (clamped to 8px from the viewport's left edge). Position recomputes on scroll/resize.
- Click-outside closes the menu (mousedown on anything outside the trigger or menu). There is no Escape handler today.
- Empty list renders the placeholder `"You're all caught up"`.
