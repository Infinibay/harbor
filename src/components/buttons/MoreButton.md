# MoreButton

Standardized kebab (⋮) / meatball (⋯) trigger for "more actions" menus.
Use it instead of a generic `<IconButton>` whenever the affordance opens
an overflow menu — the glyph and `aria-label` are already correct.

## Import

```tsx
import { MoreButton } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<MoreButton onClick={openMenu} />

<MoreButton orientation="horizontal" size="sm" onClick={openMenu} />
```

## Props

- **orientation** — `"vertical" | "horizontal"`. `vertical` renders ⋮
  (kebab); `horizontal` renders ⋯ (meatball). Default: `"vertical"`.
- **size** — `"sm" | "md"`. Default: `"md"`.
- Inherits all standard `<button>` HTML attributes (forwarded via ref).

## Notes

- Always `type="button"` and `aria-label="More actions"`; spread your own
  attributes to override.
- It is only a trigger — pair with a `Menu`, `Popover`, or `DropdownMenu`
  to actually surface the actions.
- Carries `data-cursor="button"` for the global Harbor cursor.
