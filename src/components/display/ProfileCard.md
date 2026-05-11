# ProfileCard

`ProfileCard` presents a person or account summary with banner, avatar, name, handle, role,
bio, stats, presence status, and action slot.

Use it for team directories, account sidebars, collaborator previews, user detail drawers,
customer contacts, and community profiles. It is a compact identity surface, not a full user
management form.

## Import

```tsx
import { ProfileCard } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
<ProfileCard
  name="Ana Torres"
  handle="ana"
  role="Infrastructure"
  bio="Builds the deployment paths that keep production boring."
  avatar="/team/ana.png"
  status="online"
  stats={[
    { label: "Deploys", value: 42 },
    { label: "Reviews", value: 18 },
    { label: "Uptime", value: "99.9%" },
  ]}
  actions={<Button size="sm">Message</Button>}
/>
```

## Composition Model

The top banner is either an image URL or a Harbor gradient fallback. The avatar overlaps the
banner and uses `Avatar`, so it can show an image, initials fallback, and presence status.
The action slot is aligned opposite the avatar and is intended for short commands such as
"Message", "Invite", "Follow", or "View profile".

Stats render in a three-column grid. Keep them short and comparable, because the component
does not virtualize or wrap complex stat content.

## Props

- **name** - display name.
- **handle** - shown with `@`.
- **role** - role, title, or plan.
- **bio** - short biography.
- **avatar** - avatar image URL.
- **banner** - banner image URL. Falls back to gradient.
- **status** - `"online" | "away" | "busy" | "offline"`.
- **stats** - `{ label, value }[]`.
- **actions** - action slot.
- **className** - extra classes.

## Accessibility

The avatar image receives the profile name as alt text through `Avatar`. Keep action labels
explicit, especially if you use icon-only buttons. A profile card should usually appear
inside a list, drawer, or section with a clear heading so users know why the person is being
shown.

Do not rely only on the presence dot. If presence affects workflow, add text nearby or expose
it in the profile details.

## Gotchas

- Stats are laid out as three columns. More than three stats can make the card dense.
- Long bios are not clamped by the component. Trim or clamp in the parent for grid layouts.
- `actions` is just a slot; permissions, loading, and disabled states belong to the controls
  you render there.
- Banner images use CSS background cover, so important image details may be cropped.

## Related

- `Avatar` and `AvatarStack` for identity primitives.
- `Presence` for richer online state.
- `Card` for custom profile layouts.
- `Drawer` for expandable profile details.
