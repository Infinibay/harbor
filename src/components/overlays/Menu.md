# Menu

`Menu` renders an anchored command menu with items, labels, separators,
shortcuts, danger styling, disabled state, and hover submenus. It is the right
primitive for local actions: row menus, toolbar dropdowns, account menus,
contextual card actions, and editor commands.

Use `CommandPalette` for global search-driven commands and `Dialog` for
decisions that need confirmation.

## Import

```tsx
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@infinibay/harbor/overlays";
```

## Basic Usage

Pass a trigger element. Harbor clones it to attach refs and toggle behavior.

```tsx
<Menu trigger={<Button variant="secondary">Actions</Button>} align="end">
  <MenuLabel>Project</MenuLabel>
  <MenuItem shortcut="E" onClick={editProject}>Edit</MenuItem>
  <MenuItem onClick={duplicateProject}>Duplicate</MenuItem>
  <MenuSeparator />
  <MenuItem danger onClick={archiveProject}>Archive</MenuItem>
</Menu>
```

## Submenus

Use the `submenu` slot for nested options.

```tsx
<MenuItem
  submenu={
    <>
      <MenuItem onClick={() => setRole("admin")}>Admin</MenuItem>
      <MenuItem onClick={() => setRole("viewer")}>Viewer</MenuItem>
    </>
  }
>
  Change role
</MenuItem>
```

## Props

`Menu` accepts `trigger`, `children`, `side`, `align`, and `className`.

`MenuItem` accepts `children`, `onClick`, `icon`, `shortcut`, `danger`,
`disabled`, `submenu`, and `className`.

`MenuLabel` and `MenuSeparator` provide visual grouping.

## Accessibility

Items are real buttons and disabled state is native. Escape closes the open menu.
Use clear action labels and keep destructive commands visually marked and backed
by confirmation when needed.

## Gotchas

The trigger is cloned. If your trigger needs its own ref, Harbor preserves
function and object refs, but test custom trigger components.

Submenus open on hover. For complex keyboard-first menus, consider a dedicated
menu system with roving focus.

## Related

- `CommandPalette` for global command search.
- `ContextMenu` for right-click surfaces.
- `Popover` for arbitrary anchored content.
- `MoreButton` as a compact menu trigger.
