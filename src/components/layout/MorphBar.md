# MorphBar

Flex container whose `<MorphItem>` children declare how they behave when
layout changes — hide, collapse to zero, grow, shrink. Framer Motion
`layout` smoothly interpolates sizes and positions when visibility or
grow factors flip. Use for adaptive toolbars, expanding search rows, and
any bar whose contents reshuffle in response to state.

## Import

```tsx
import { MorphBar, MorphItem } from "@infinibay/harbor/layout";
```

## Example

```tsx
const [searching, setSearching] = useState(false);

<MorphBar gap={8}>
  <MorphItem hidden={searching}>
    <Button>Filter</Button>
  </MorphItem>
  <MorphItem hidden={searching}>
    <Button>Sort</Button>
  </MorphItem>
  <MorphItem grow={searching ? 1 : 0}>
    <ExpandingSearch open={searching} onOpenChange={setSearching} />
  </MorphItem>
</MorphBar>
```

## Props (`<MorphBar>`)

- **children** — `ReactNode`. Should be `<MorphItem>` elements.
- **gap** — `number | string`. Default `8`.
- **align** — `"start" | "center" | "end" | "stretch"`. Default `"center"`.
- **transition** — `Transition`. Override the spring used by children.
- **className** — extra classes on the wrapper.

## Props (`<MorphItem>`)

- **id** — `string`. Stable key for layout animation. Falls back to `useId()`.
- **children** — `ReactNode`.
- **hidden** — `boolean`. Remove entirely with exit animation.
- **collapsed** — `boolean`. Keep mounted but shrink to width 0.
- **grow** — `number`. `flex-grow`. Default `0`.
- **shrink** — `number`. `flex-shrink`. Default `1`.
- **minWidth** / **maxWidth** — `number | string`. Bounds.
- **className** — extra classes on the item.
- **onClick** — `() => void`.

## Notes

- Use stable `id`s when you flip `hidden` to keep enter/exit clean.
- `collapsed` items keep `pointer-events: none` while shrunk.
- Pair with `<Expandable>` / `<ExpandingSearch>` for the canonical
  expand-and-reflow pattern.
