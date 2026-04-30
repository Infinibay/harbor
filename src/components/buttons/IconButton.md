# IconButton

Square, icon-only button with a built-in cursor-reactive lean and inner
glow. Prefer it over `<Button>` whenever the affordance is a glyph alone;
use `<CloseButton>` / `<MoreButton>` for those specific shapes since they
ship with the correct semantics.

## Import

```tsx
import { IconButton } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<IconButton
  icon={<SettingsIcon />}
  label="Settings"
  onClick={() => openSettings()}
/>

<IconButton variant="ghost" size="sm" icon={<EditIcon />} label="Edit" />
```

## Props

- **icon** — `ReactNode`. The glyph. Required.
- **label** — `string`. Used as both `aria-label` and `title` (tooltip).
  Required.
- **size** — `"sm" | "md" | "lg"`. Default: `"md"`.
- **variant** — `"solid" | "ghost" | "glass"`. Default: `"solid"`.
- **reactive** — `boolean`. Opt out of the cursor-proximity lean + glow.
  Default: derived (on for `md`/`lg`, off for `sm`).
- **quiet** — `boolean`. Alias for `reactive={false}` for dense contexts
  (tables, toolbars). Defaults to `true` when `size="sm"`.
- Inherits all standard `<button>` HTML attributes (forwarded via ref).

## Notes

- Focus ring uses `focus-visible:ring-fuchsia-400/60`; tap animation is a
  small spring scale + rotate.
- `reactive`/`quiet` can be set independently — `quiet` mainly exists for
  ergonomics in dense layouts where the magnetic effect feels jumpy.
- The internal radial-gradient glow follows the cursor and uses
  `mix-blend-soft-light`.
