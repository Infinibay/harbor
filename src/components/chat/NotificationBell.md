# NotificationBell

`NotificationBell` is a compact notification trigger with unread count, animated
bell state, anchored popover, mark-all-read action, and clickable notification
rows. It belongs in app headers, desktop chrome, admin shells, and customer
portals where background events need a visible home.

Use it for notifications that can be reviewed later. Use `Toast` for immediate
feedback after the user's current action.

## Import

```tsx
import { NotificationBell } from "@infinibay/harbor/chat";
```

## Basic Usage

Pass notifications and handlers. Harbor owns the popover state; your app owns
read state.

```tsx
<NotificationBell
  notifications={[
    {
      id: "deploy-ready",
      title: "Preview deployment ready",
      description: "docs-preview-42 is available for review.",
      time: "2m ago",
      unread: true,
    },
  ]}
  onRead={(id) => markNotificationRead(id)}
  onReadAll={() => markAllRead()}
/>
```

## Icons

Use `icon` for source or category context.

```tsx
{
  id: "invoice",
  title: "Invoice paid",
  time: "1h ago",
  icon: <CreditCardIcon />,
}
```

## Props

- `notifications`: required notification array.
- `onRead`: called when a row is selected.
- `onReadAll`: optional mark-all-read callback.
- `className`: trigger class override.

Notifications include `id`, `title`, optional `description`, `time`, optional
`unread`, and optional `icon`.

## Accessibility

The trigger is a button with expanded state. Notification rows are keyboard
activatable. Keep titles descriptive, because they are the fastest way to scan
the popover.

Do not use the unread badge as the only critical alert. For blocking issues, add
a `Banner`, `Alert`, or page-level status.

## Gotchas

The popover is positioned from the trigger and listens to scroll and resize. If
the trigger lives inside aggressively transformed containers, test placement in
the real shell.

`time` is display text. Format relative or absolute time before passing it.

## Related

- `Toast` for immediate confirmations.
- `ActivityFeed` for longer event history.
- `AppHeader` for header composition.
- `Popover` for custom anchored overlays.
