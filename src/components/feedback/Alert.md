# Alert

`Alert` displays an inline status message inside the page flow. It combines tone, icon,
title, body copy, optional actions, and optional dismiss control in one surface.

Use it when the message should remain visible until the user understands or resolves it:
validation summaries, billing warnings, deployment notices, destructive-action warnings,
maintenance notices, and post-save confirmations. Use `Toast` for temporary feedback that
does not need to occupy layout.

## Import

```tsx
import { Alert } from "@infinibay/harbor/feedback";
```

## Basic Usage

```tsx
<Alert
  tone="warning"
  title="Storage almost full"
  actions={<Button size="sm">Manage storage</Button>}
  onClose={() => setHidden(true)}
>
  92% of the volume is in use. New snapshots will fail soon.
</Alert>
```

## Message Model

`tone` controls border color and default icon. `layout="stack"` is the default for normal
messages: title above body, actions below. `layout="inline"` compresses the message into one
row and truncates long content, which is useful for field-level warnings or dense admin
screens.

The action area is a slot, not a decision system. Put `Button`, `Link`, or custom controls in
`actions` when the user can resolve the alert directly.

## Props

- **tone** - `"info" | "success" | "warning" | "danger"`. Default `"info"`.
- **size** - `"sm" | "md"`. Default `"md"`. Use `sm` for compact inline notices.
- **layout** - `"stack" | "inline"`. Default `"stack"`.
- **title** - `ReactNode`. Optional strong headline.
- **children** - `ReactNode`. Body text.
- **actions** - `ReactNode`. Action row or inline action slot.
- **onClose** - `() => void`. When provided, renders a dismiss button.
- **icon** - `ReactNode`. Overrides the default tone icon.
- **className** - extra classes on the root.

## Accessibility

`Alert` is rendered as a visual container, not an ARIA live region. That is appropriate for
alerts already present in the page. If the alert appears after an async action and must be
announced, wrap it in a parent with `role="status"` or `role="alert"` based on urgency.

Do not rely on color alone. Keep the title and body explicit: "Payment failed" is stronger
than "Warning". The default icons also help communicate tone without color.

## Gotchas

- `onClose` only notifies you. The parent must remove the alert from state.
- Inline layout truncates content. Use stack layout for messages that must be read fully.
- Actions should be concise. If the resolution needs a complex flow, link to a page or open a
  `Dialog` or `Drawer`.
- Use `Toast` for transient save confirmations; persistent success alerts can make pages feel
  stale.

## Related

- `Toast` for temporary feedback.
- `Banner` and `MaintenanceBanner` for page-wide notices.
- `Callout` for documentation emphasis.
- `Dialog` and `Drawer` for actions that need a focused workflow.
