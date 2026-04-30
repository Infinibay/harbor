# Tag

Compact, removable chip used for filters, keywords, and selected
items. Differs from `<Badge>` in posture: tags are interactive and
removable, badges are read-only status markers. The chip has a
subtle cursor-proximity glow and a spring layout animation when it
enters/exits a list.

## Import

```tsx
import { Tag } from "@infinibay/harbor/display";
```

## Example

```tsx
<Tag>frontend</Tag>
<Tag icon={<HashIcon />} onRemove={() => remove("react")}>
  react
</Tag>
```

## Props

- **children** — `ReactNode`. Required. The label content.
- **icon** — `ReactNode`. Optional leading icon.
- **onRemove** — `() => void`. When provided, renders a `×` button
  on the right that calls this on click.
- **className** — extra classes on the wrapper.

## Notes

- Wrap a list of `<Tag>` in `<AnimatePresence>` for clean exit
  animations when removing.
- The proximity glow follows the cursor within an 80px radius —
  expect mild GPU cost when rendering many at once.
