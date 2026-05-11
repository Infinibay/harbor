# ContextMenu

`ContextMenu` adds right-click actions to any region. It is useful in editor canvases, file explorers, tables, diagrams, tabs, kanban cards, terminal output, and desktop-style surfaces where users expect secondary actions at the pointer location.

Harbor owns the right-click capture, portal positioning, viewport collision correction, entrance animation, click-outside dismissal, and Escape dismissal. Your app owns the menu content and the command behavior.

## Import

```tsx
import { ContextMenu, Menu, MenuItem, MenuSeparator } from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
<ContextMenu
  menu={
    <Menu>
      <MenuItem onSelect={() => renameFile(file.id)}>Rename</MenuItem>
      <MenuItem onSelect={() => duplicateFile(file.id)}>Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem tone="danger" onSelect={() => deleteFile(file.id)}>
        Delete
      </MenuItem>
    </Menu>
  }
>
  <FileRow file={file} />
</ContextMenu>
```

The wrapped child can be a single row, a whole panel, or a canvas:

```tsx
<ContextMenu menu={<CanvasActions selection={selection} />}>
  <GraphCanvas nodes={nodes} edges={edges} />
</ContextMenu>
```

## Props

- **children** - required `ReactNode`. The interactive region that receives the `contextmenu` event.
- **menu** - required `ReactNode`. Rendered in a portal at the pointer position.
- **className** - optional string merged onto the wrapper.

## Interaction Model

When the user right-clicks inside the wrapped region, `ContextMenu` prevents the browser menu, stores the pointer coordinates, opens the Harbor menu, then measures the rendered menu and nudges it back inside the viewport if needed. It closes when the user clicks outside the menu or presses `Escape`.

The component does not interpret menu items. Use Harbor `MenuItem`, buttons, or links inside `menu` and call your app commands from those items.

## Menu Content

Prefer action labels that match the object under the pointer. For example, a file row might expose `"Rename"`, `"Duplicate"`, `"Copy path"`, and `"Delete"`, while a canvas background might expose `"Paste"`, `"Add frame"`, and `"Reset view"`.

Disable or omit actions that do not apply to the current selection. If the same context menu can open on different objects, compute the menu from the selected object type before rendering.

## Accessibility

Right-click menus are a power-user affordance, not the only way to operate the UI. Every command in a context menu should also be reachable from a visible toolbar, row action, command palette, keyboard shortcut, or details panel.

If the wrapped region has keyboard focus behavior, provide a keyboard path for opening equivalent actions. `ContextMenu` itself listens to pointer context menu events and Escape dismissal.

## Gotchas

- Do not put critical commands only in a context menu.
- The browser's native context menu is suppressed inside the wrapped region.
- Menu content is rendered in a portal, so avoid CSS selectors that depend on DOM ancestry.
- If a command closes the menu indirectly, make sure it also updates the selected object or surface state clearly.

## Related

- `Menu` and `MenuItem` for structured action lists.
- `Popover` for click-triggered secondary panels.
- `CommandPalette` for keyboard-first global commands.
- `MoreButton` for visible overflow actions.
