# ButtonGroup

`ButtonGroup` arranges related buttons horizontally and can make them feel like one segmented control by attaching their borders. Use it for toolbar actions, view switches, date granularity, editor commands, formatting controls, and compact groups of sibling actions.

It does not manage selection. If the group represents a single selected value, store that value in your app and style the active child button.

## Import

```tsx
import { Button, ButtonGroup } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
<ButtonGroup size="sm">
  <Button variant={range === "day" ? "primary" : "secondary"} onClick={() => setRange("day")}>
    Day
  </Button>
  <Button variant={range === "week" ? "primary" : "secondary"} onClick={() => setRange("week")}>
    Week
  </Button>
  <Button variant={range === "month" ? "primary" : "secondary"} onClick={() => setRange("month")}>
    Month
  </Button>
</ButtonGroup>
```

Use spaced mode for related actions that should remain visually separate:

```tsx
<ButtonGroup attached={false}>
  <Button variant="secondary">Cancel</Button>
  <Button>Save</Button>
</ButtonGroup>
```

## Props

- **children** - required `ReactNode`. Usually `Button` children.
- **size** - optional `"sm"`, `"md"`, or `"lg"`. Forwarded to child buttons that do not already define a size.
- **attached** - optional boolean. Defaults to `true`. When true, inner borders overlap and only the outer corners stay rounded.
- **className** - optional string merged onto the root container.

## Composition Model

When attached, `ButtonGroup` filters children to valid React elements and clones them to merge size and z-index classes. This keeps focus and hover borders above neighboring buttons. When `attached={false}`, it renders an inline flex row with a gap.

Child props still own behavior. Pass `onClick`, `disabled`, `aria-pressed`, and variants directly to each button.

## Accessibility

For toggle-like groups, add `aria-pressed` to each button or use a purpose-built segmented control if one better matches the workflow. The group itself does not create radio semantics.

Keep labels concise and visible. Icon-only button groups need accessible names on every child.

## Gotchas

- `ButtonGroup` is layout, not state management.
- Non-button children can be cloned in attached mode, but the visual assumptions are tuned for Harbor buttons.
- If a child already has a `size`, it wins over the group size.
- Do not use attached destructive and non-destructive actions together; separate dangerous actions visually.

## Related

- `SegmentedControl` for single-choice mode switching.
- `Toolbar` and `ToolbarGroup` for richer command bars.
- `SplitButton` for one primary action with variants.
- `Button` for individual actions.
