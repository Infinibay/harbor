# ButtonGroup

Lays out a row of `<Button>` siblings as a single segmented cluster. Use it
for toolbar-style choices (Day/Week/Month) where `<SplitButton>` would feel
too heavy and a plain row of buttons too loose.

## Import

```tsx
import { ButtonGroup } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<ButtonGroup size="sm">
  <Button variant="secondary">Day</Button>
  <Button variant="secondary">Week</Button>
  <Button variant="secondary">Month</Button>
</ButtonGroup>
```

## Props

- **children** — `ReactNode`. Button-like elements to cluster. Required.
- **size** — `"sm" | "md" | "lg"`. Forwarded to children that don't already
  set their own `size`.
- **attached** — `boolean`. Removes inner borders so children look segmented;
  set to `false` for a simple gap row. Default: `true`.
- **className** — extra classes for the wrapper.

## Notes

- The group only forwards `size`; other Button props stay on each child.
- When attached, the first/last children get rounded ends and `-ml-px`
  pulls borders together; hovered/focused items lift via `z-index`.
- Pair with `<Button>` for filled segments or `<ToggleButton>` if you want
  pressed-state semantics.
