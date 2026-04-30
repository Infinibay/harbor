# RoleBadge

Pill chip for a user's role — owner / admin / editor / viewer /
guest / custom. Designed to sit next to usernames in member lists,
audit logs, and headers. For generic status pills use `<Badge>`.

## Import

```tsx
import { RoleBadge } from "@infinibay/harbor/display";
```

## Example

```tsx
<RoleBadge role="owner" icon />
<RoleBadge role="admin" />
<RoleBadge role="viewer" size="sm" />
<RoleBadge role="custom" label="Billing" />
```

## Props

- **role** — `"owner" | "admin" | "editor" | "viewer" | "guest" | "custom"`.
  Required. Drives the color and default label.
- **label** — `string`. Override the role's default label (e.g. for
  `"custom"` you'll usually want to pass a real name).
- **icon** — `boolean`. Render the role's glyph (👑/🛡️/✎/👁/·/◆)
  before the label.
- **size** — `"xs" | "sm" | "md"`. Default `"md"`.
- **className** — extra classes on the wrapper.

## Notes

- The label is uppercased and tracked-out via CSS — pass it in any
  case.
- Each role has a fixed tone; if you need bespoke colors, use
  `<Badge>` instead.
