# Alert

In-flow status block with an icon, title, body, and optional actions. Use
inside a page or card to call attention to a state. For full-bleed page-top
announcements use `<Banner>`; for one-off product tours use `<Callout>`; for
transient confirmations use `<Toast>`.

## Import

```tsx
import { Alert } from "@infinibay/harbor/feedback";
```

## Example

```tsx
<Alert
  tone="warning"
  title="Storage almost full"
  actions={<Button size="sm">Manage</Button>}
  onClose={() => setHidden(true)}
>
  92% of the volume is in use. New snapshots will fail soon.
</Alert>
```

## Props

- **tone** — `"info" | "success" | "warning" | "danger"`. Default: `"info"`.
- **size** — `"sm" | "md"`. `sm` is for field-level inline warnings. Default: `"md"`.
- **layout** — `"stack" | "inline"`. `inline` puts title, body, and actions on one truncated row. Default: `"stack"`.
- **title** — `ReactNode`. Bold heading.
- **children** — `ReactNode`. Body copy.
- **icon** — `ReactNode`. Overrides the default tone glyph.
- **actions** — `ReactNode`. Action row at the bottom (or right edge in `inline`).
- **onClose** — `() => void`. Renders a `×` dismiss button.
- **className** — extra classes on the root.

## Notes

- The root is `motion.div` and animates in on mount. There's no built-in
  `role="alert"` — wrap in a live region yourself if assistive tech needs
  to announce it.
- In `inline` layout, body and title both `truncate` — keep copy short or
  switch to `stack`.
