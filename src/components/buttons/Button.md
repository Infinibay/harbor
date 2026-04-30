# Button

The primary interactive primitive in Harbor. Reacts to cursor proximity,
coordinates with `<ButtonGroup>`, and respects the global theme tokens.

## Import

```tsx
import { Button } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<Button onClick={() => console.log("clicked")}>
  Save changes
</Button>

<Button variant="ghost" size="sm">
  Cancel
</Button>

<Button variant="primary" loading>
  Deploying…
</Button>
```

## Props

- **variant** — `"primary" | "secondary" | "ghost" | "danger"`. Default: `"primary"`.
- **size** — `"sm" | "md" | "lg"`. Default: `"md"`.
- **loading** — show a spinner and disable interaction.
- **icon** — optional left-side icon node.
- **reactive** — opt-in cursor-proximity glow. Default: inherited from `<CursorProvider>`.
- All standard `<button>` attributes are forwarded.

## Notes

- For icon-only buttons, prefer `<IconButton>` — it ships with the right
  square geometry and a built-in tooltip slot.
- Inside `<ButtonGroup>`, the first and last buttons get rounded ends and
  shared borders automatically.
- The hover glow is driven by `--harbor-accent`. Override on a parent to
  re-skin a button cluster without forking.
