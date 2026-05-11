# MoreButton

`MoreButton` is Harbor's standard overflow-action trigger. It renders a compact kebab (`...` vertical) or meatball (`...` horizontal) icon button with consistent size, hover treatment, cursor metadata, and accessible default label. Use it when a row, card, tab, file, notification, or toolbar item has secondary actions that should not compete with the primary workflow.

It is only the trigger. Pair it with `Menu`, `Popover`, `ContextMenu`, or your own anchored overlay to render the actual actions.

## Import

```tsx
import { MoreButton } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
function ProjectRow({ project }: { project: Project }) {
  return (
    <div className="flex items-center justify-between">
      <span>{project.name}</span>
      <Popover
        trigger={<MoreButton aria-label={`Actions for ${project.name}`} />}
      >
        <Menu>
          <MenuItem>Rename</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuSeparator />
          <MenuItem tone="danger">Delete</MenuItem>
        </Menu>
      </Popover>
    </div>
  );
}
```

Use the horizontal orientation for dense cards or mobile-style overflow:

```tsx
<MoreButton orientation="horizontal" size="sm" />
```

## Props

`MoreButton` extends native `button` attributes and adds:

- **orientation** - optional `"vertical"` or `"horizontal"`. Defaults to `"vertical"`.
- **size** - optional `"sm"` or `"md"`. Defaults to `"md"`.
- **className** - optional string merged onto the button.

You can pass `onClick`, `disabled`, `aria-label`, `aria-haspopup`, `aria-expanded`, and any other standard button props.

## Interaction Model

The component renders a real `<button type="button">`. Harbor handles the visual trigger only; your overlay component should own open state, focus management, menu item behavior, and dismissal.

For controlled menus, wire the trigger like any other button:

```tsx
<MoreButton
  aria-haspopup="menu"
  aria-expanded={open}
  onClick={() => setOpen((value) => !value)}
/>
```

## Accessibility

The default label is `"More actions"`, which is acceptable for generic toolbar buttons. In repeated lists, override it with a specific label:

```tsx
<MoreButton aria-label={`More actions for invoice ${invoice.number}`} />
```

When the button opens a menu, expose `aria-haspopup="menu"` and `aria-expanded` if your menu primitive does not already add them.

## Gotchas

- Do not put primary actions behind `MoreButton`. Keep the main action visible and reserve overflow for secondary or destructive commands.
- A repeated list of identical `"More actions"` labels is hard to navigate with assistive technology. Provide row-specific labels.
- `orientation="horizontal"` rotates the same glyph. It is visual only; it does not change interaction.
- The component does not render a menu by itself.

## Related

- `Menu`, `MenuItem`, and `MenuSeparator` for action lists.
- `Popover` for anchored panels.
- `ContextMenu` for right-click surfaces.
- `SplitButton` when there is one primary action plus related variants.
