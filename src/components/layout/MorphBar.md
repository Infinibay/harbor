# MorphBar

`MorphBar` is a motion-aware flex row for toolbars whose contents change shape. Its children, `MorphItem`, can hide, collapse, grow, shrink, and animate layout changes with a shared spring.

Use it for adaptive editor toolbars, expanding search rows, responsive command bars, and any surface where controls appear or reflow in response to state.

## Import

```tsx
import { MorphBar, MorphItem } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Button } from "@infinibay/harbor/buttons";
import { ExpandingSearch, MorphBar, MorphItem } from "@infinibay/harbor/layout";

export function FilesToolbar() {
  const [searching, setSearching] = useState(false);

  return (
    <MorphBar gap={8}>
      <MorphItem hidden={searching}>
        <Button variant="secondary">Filter</Button>
      </MorphItem>
      <MorphItem hidden={searching}>
        <Button variant="secondary">Sort</Button>
      </MorphItem>
      <MorphItem grow={searching ? 1 : 0} minWidth={searching ? 260 : 0}>
        <ExpandingSearch open={searching} onOpenChange={setSearching} />
      </MorphItem>
    </MorphBar>
  );
}
```

## Item Behavior

- `hidden` removes an item with exit animation.
- `collapsed` keeps an item mounted but shrinks it to zero width.
- `grow` and `shrink` map to flex behavior.
- `minWidth` and `maxWidth` constrain the item's animated size.

## Props

### MorphBar

- **children**: `ReactNode`. Usually `MorphItem` elements.
- **gap**: `number | string`. CSS gap. Defaults to `8`.
- **align**: `"start" | "center" | "end" | "stretch"`. Defaults to `"center"`.
- **transition**: Framer Motion `Transition`. Overrides the shared spring.
- **className**: custom class on the flex row.

### MorphItem

- **id**: `string`. Stable animation key. Falls back to `useId()`.
- **children**: `ReactNode`.
- **hidden**: `boolean`.
- **collapsed**: `boolean`.
- **grow** / **shrink**: flex values. Defaults to `0` and `1`.
- **minWidth** / **maxWidth**: size bounds.
- **onClick**: optional click handler. Adds button semantics and keyboard activation.
- **className**: custom class on the item.

## Accessibility

Animation should not be the only cue that a tool appeared or disappeared. Keep labels, pressed states, or focus movement clear when a mode changes.

If an item is clickable through `onClick`, it receives button semantics. For complex controls, prefer placing a real Harbor `Button` inside the item.

## Gotchas

- Use stable `id` values when items appear/disappear in changing arrays.
- `collapsed` keeps children mounted. Effects inside the child continue running.
- `hidden` removes the child, so local state inside it is lost unless lifted.
- Avoid using `MorphBar` for ordinary static button rows; `Toolbar` or `ActionRow` is simpler.

## Related

- [`Toolbar`](./Toolbar.md) for static toolbars.
- [`ExpandingSearch`](./ExpandingSearch.md) for search-in-toolbar interactions.
- [`ActionRow`](../inputs/ActionRow.md) for form and dialog footers.
