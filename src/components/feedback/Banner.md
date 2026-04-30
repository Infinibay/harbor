# Banner

Full-width announcement strip pinned across the top of a page or layout. Use
for system-wide messages (incidents, promos, account state). For an in-flow
status block use `<Alert>`; for scheduled downtime with a countdown use
`<MaintenanceBanner>`.

## Import

```tsx
import { Banner } from "@infinibay/harbor/feedback";
```

## Example

```tsx
<Banner
  tone="warning"
  title="Read-only mode"
  sticky
  onClose={() => setOpen(false)}
  actions={<Button size="sm" variant="ghost">Status page</Button>}
>
  We're investigating elevated latency on the API.
</Banner>
```

## Props

- **open** — controlled visibility. Wrapped in `<AnimatePresence>` for height collapse on close. Default: `true`.
- **tone** — `"info" | "success" | "warning" | "danger" | "promo"`. `promo` uses a fuchsia/sky/emerald gradient. Default: `"info"`.
- **icon** — `ReactNode`. Leading glyph.
- **title** — `ReactNode`. Bold lead text. Joined to `children` with a `·` separator.
- **children** — `ReactNode`. Trailing description.
- **actions** — `ReactNode`. Right-aligned action row.
- **onClose** — `() => void`. Renders a `×` dismiss button with `aria-label="Dismiss"`.
- **sticky** — pins the banner to the top of its scroll container with `z-20`. Default: `false`.
- **className** — extra classes on the root.

## Notes

- The collapse-on-close animation uses framer-motion's height-auto trick, so
  the banner doesn't leave a layout gap when dismissed.
- `sticky` only works if the banner is mounted inside a scrolling ancestor
  with no transformed parents (sticky's usual caveats).
