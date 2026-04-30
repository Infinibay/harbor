# ProfileCard

User profile tile — banner, avatar with status dot, name/handle/role
line, bio, and a row of stats. For compact in-list rows use
`<Avatar>` directly with a `<Stat>` cluster.

## Import

```tsx
import { ProfileCard } from "@infinibay/harbor/display";
```

## Example

```tsx
<ProfileCard
  name="Ana Pérez"
  handle="ana"
  role="Engineer · Infrastructure"
  bio="Builds the things that build the things."
  status="online"
  stats={[
    { label: "Repos", value: 24 },
    { label: "Followers", value: "1.2k" },
    { label: "Following", value: 89 },
  ]}
  actions={<Button size="sm">Follow</Button>}
/>
```

## Props

- **name** — `string`. Required. Drives both the heading and the
  avatar's initials.
- **handle** — `string`. Rendered as `@handle` in the meta line.
- **role** — `ReactNode`. Rendered alongside the handle.
- **bio** — `ReactNode`. Free-form description block.
- **banner** — `string`. Background image URL for the header strip.
  Falls back to a fuchsia/sky/pink gradient.
- **status** — `"online" | "away" | "busy" | "offline"`. Forwarded to
  the avatar's status dot.
- **stats** — `ProfileStat[]`. Three-column grid below the bio.
- **actions** — `ReactNode`. Slot anchored to the right of the avatar.
- **className** — extra classes on the wrapper.

## `ProfileStat`

- **label** — `string`. Required. Uppercase caption.
- **value** — `ReactNode`. Required. Rendered with tabular-nums.

## Notes

- The avatar uses initials from `name` — there is no `avatar` URL prop.
- Stats overflow gracefully but are best kept to three for the
  even-grid layout.
