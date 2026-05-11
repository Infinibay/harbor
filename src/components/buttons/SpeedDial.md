# SpeedDial

`SpeedDial` is a floating action button that expands into a small set of related actions. Use it when the screen has one dominant creation affordance with a few variants: new document, upload image, invite teammate, create folder.

If there is only one action, use `FAB`. If there are many actions or they need descriptions, use `Menu` or `CommandPalette`.

## Import

```tsx
import { SpeedDial, type SpeedDialAction } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
import { SpeedDial } from "@infinibay/harbor/buttons";

export function CreateDial() {
  return (
    <SpeedDial
      icon={<PlusIcon />}
      actions={[
        { id: "doc", label: "New document", icon: <FileIcon />, onSelect: createDocument },
        { id: "image", label: "Upload image", icon: <ImageIcon />, onSelect: uploadImage },
        { id: "invite", label: "Invite teammate", icon: <UsersIcon />, onSelect: inviteUser },
      ]}
    />
  );
}
```

## Inline Usage

```tsx
<SpeedDial
  position="none"
  direction="right"
  icon={<PlusIcon />}
  actions={quickCreateActions}
/>
```

Use `position="none"` inside an existing toolbar, panel, or preview. The default positions the dial fixed to the viewport.

## Props

- **icon**: `ReactNode`. Required trigger icon.
- **actions**: `SpeedDialAction[]`. Required action list.
- **direction**: `"up" | "down" | "left" | "right"`. Defaults to `"up"`.
- **position**: `"bottom-right" | "bottom-left" | "top-right" | "top-left" | "none"`. Defaults to `"bottom-right"`.
- **className**: custom class on the wrapper.

`SpeedDialAction` is `{ id: string; label: string; icon: ReactNode; onSelect?: () => void }`.

## Accessibility

The trigger is a `FAB` with a label that changes between `Open menu` and `Close menu`. Each action is a button with `aria-label` from its `label`.

Keep action count low and labels specific. Hover tooltips are helpful visually, but the label must still make sense without hovering.

## Gotchas

- Selecting an action closes the dial after calling `onSelect`.
- Direction changes both placement and tooltip side.
- Fixed positions are viewport-based. Use `position="none"` when composing inside scrollable containers.
- The component does not close on outside click; selecting an action or pressing the trigger toggles it.

## Related

- [`FAB`](./FAB.md) for one primary floating action.
- [`Menu`](../overlays/Menu.md) for longer action lists.
- [`CommandPalette`](../overlays/CommandPalette.md) for searchable command sets.
