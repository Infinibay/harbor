# Avatar

`Avatar` renders a person or account identity with an image, initials fallback, deterministic gradient, optional status dot, and optional cursor-reactive motion. `AvatarStack` renders overlapping groups for reviewers, assignees, presence, and collaboration surfaces.

Use avatars to identify people, not as decorative circles. Pair them with visible names in dense enterprise UI whenever the identity matters.

## Import

```tsx
import { Avatar, AvatarStack } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { Avatar, AvatarStack } from "@infinibay/harbor/display";

export function Reviewers() {
  return (
    <div className="flex items-center gap-3">
      <Avatar name="Ana Perez" status="online" />
      <Avatar
        name="Mika Stone"
        src="https://i.pravatar.cc/150?img=12"
        status="busy"
        interactive
      />
      <AvatarStack
        size="sm"
        max={3}
        people={[
          { name: "Ana Perez", status: "online" },
          { name: "Bruno Silva", status: "away" },
          { name: "Ciro Vega", status: "offline" },
          { name: "Dana Ray", status: "busy" },
        ]}
      />
    </div>
  );
}
```

## Initials And Color

When `src` is missing, the avatar uses the first letter of the first two words in `name`. The background gradient is hashed from the name, so the same person keeps the same color across renders.

If `name` is missing, the fallback initial is `?`.

## Props

### Avatar

- **name**: `string`. Drives initials, fallback color, alt text, and accessibility label.
- **src**: `string`. Image URL.
- **status**: `"online" | "busy" | "away" | "offline"`.
- **size**: `"sm" | "md" | "lg" | "xl"`. Defaults to `"md"`.
- **interactive**: `boolean`. Enables hover lift and cursor-proximity glow.
- **className**: custom class on the wrapper.

### AvatarStack

- **people**: `{ name: string; src?: string; status?: Status }[]`.
- **size**: same size options as `Avatar`. Defaults to `"md"`.
- **max**: `number`. Number of visible avatars before the `+N` chip. Defaults to `4`.
- **className**: custom class on the stack.

## Accessibility

The avatar wrapper exposes an image role and label. Image `alt` uses `name` when present. The status dot is visual only, so show status text elsewhere when online state affects product behavior.

For icon-only collaboration controls, combine avatars with tooltips or adjacent labels so users can identify the person without relying on the image.

## Gotchas

- The component does not handle image load failure beyond the browser's broken image behavior. Provide reliable URLs or omit `src` for initials.
- `interactive` is decorative motion; avoid it in dense tables where many avatars move at once.
- `AvatarStack` keys by `name`, so names should be unique inside one stack.

## Related

- [`Presence`](../collab/Presence.md) for live collaboration indicators.
- [`ProfileCard`](./ProfileCard.md) for richer identity summaries.
- [`Tooltip`](../overlays/Tooltip.md) for naming avatar-only controls.
