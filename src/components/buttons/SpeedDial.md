# SpeedDial

A `<FAB>` that fans out a small set of related actions when toggled. Use
it when one screen has 2–5 closely related "create" affordances that
shouldn't each occupy a permanent slot; reach for a plain `<FAB>` if there
is only one action.

## Import

```tsx
import { SpeedDial } from "@infinibay/harbor/buttons";
```

## Example

```tsx
<SpeedDial
  icon={<PlusIcon />}
  actions={[
    { id: "doc", label: "New document", icon: <DocIcon />, onSelect: createDoc },
    { id: "img", label: "Upload image", icon: <ImgIcon />, onSelect: uploadImg },
    { id: "team", label: "Invite teammate", icon: <UsersIcon />, onSelect: invite },
  ]}
/>
```

## Props

- **icon** — `ReactNode`. Glyph for the trigger FAB. Rotates 45° when
  open. Required.
- **actions** — `SpeedDialAction[]`. Items to fan out. Required.
  - **id** — `string`. Stable key.
  - **label** — `string`. Used as `aria-label` and the hover tooltip.
  - **icon** — `ReactNode`.
  - **onSelect** — `() => void`. Fires on click; the dial closes
    automatically afterwards.
- **direction** — `"up" | "down" | "left" | "right"`. Where the actions
  fan out from the trigger. Default: `"up"`.
- **position** — `"bottom-right" | "bottom-left" | "top-right" | "top-left" | "none"`.
  Viewport anchor for the whole dial; `"none"` keeps it inline.
  Default: `"bottom-right"`.
- **className** — extra classes for the wrapper.

## Notes

- Composes `<FAB>` internally for the trigger and animates each action in
  with a small staggered framer-motion spring.
- Selecting an action calls `onSelect` and then closes the dial.
- The trigger's `aria-label` toggles between `"Open menu"` and
  `"Close menu"` based on state.
