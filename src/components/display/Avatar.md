# Avatar

User avatar with initials fallback, deterministic color from the name,
optional status dot, and an optional cursor-reactive lean. Pair with
`<AvatarStack>` for overlapping groups (e.g. PR reviewers).

## Import

```tsx
import { Avatar, AvatarStack } from "@infinibay/harbor/display";
```

## Example

```tsx
<Avatar name="Ana Pérez" status="online" size="md" />

<Avatar src="https://i.pravatar.cc/150?img=12" name="Ana" status="busy" />

<AvatarStack
  size="sm"
  max={3}
  people={[
    { name: "Ana" },
    { name: "Bruno" },
    { name: "Cinto" },
    { name: "Diego" },
  ]}
/>
```

## Props (`<Avatar>`)

- **name** — `string`. Drives initials and the deterministic gradient.
- **src** — `string`. Image URL — falls back to initials on missing/load fail.
- **status** — `"online" | "busy" | "away" | "offline"`. Renders a
  ring-2 dot in the bottom-right.
- **size** — `"sm" | "md" | "lg" | "xl"`. Default `"md"`. Sizes:
  28 / 36 / 44 / 60 px.
- **interactive** — `boolean`. Adds a hover lean + cursor-following glow.
- **className** — extra classes on the wrapper.

## Props (`<AvatarStack>`)

- **people** — `{ name, src?, status? }[]`. Required.
- **size** — same options as `<Avatar>`. Default `"md"`.
- **max** — `number`. Default `4`. Excess collapses into a `+N` chip.
- **className** — extra classes on the wrapper.

## Notes

- Initials = first letter of the first two words, uppercased.
- Color palette is hashed from the name so the same name always maps
  to the same gradient.
- The cursor-reactive glow uses `mix-blend-soft-light` and is purely
  decorative — disable with `interactive={false}` if it conflicts with
  your background.
