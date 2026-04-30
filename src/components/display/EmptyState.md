# EmptyState

The "nothing here yet" tile — title, description, optional icon, and
an action slot. Three sizes: `default` (page-level), `dashed` (smaller
panel inside a card), `inline` (one-line strip with action on the
right).

## Import

```tsx
import { EmptyState } from "@infinibay/harbor/display";
```

## Example

```tsx
<EmptyState
  icon={<RocketIcon />}
  title="No projects yet"
  description="Create your first project to get started."
  actions={<Button variant="primary">New project</Button>}
/>

<EmptyState
  variant="inline"
  icon={<InboxIcon />}
  title="Inbox is empty"
  actions={<Button size="sm" variant="ghost">Refresh</Button>}
/>
```

## Props

- **title** — `ReactNode`. Required.
- **description** — `ReactNode`.
- **icon** — `ReactNode`. Renders inside a tinted square.
- **actions** — `ReactNode`. Buttons / links — placement adapts to variant.
- **variant** — `"default" | "dashed" | "inline"`. Default `"default"`.
  - `default` — large vertical layout, icon floats up & down.
  - `dashed` — bordered panel, smaller icon, no float animation.
  - `inline` — single row with icon on the left, actions on the right.
- **className** — extra classes on the wrapper.

## Notes

- The default variant animates the icon vertically forever — use
  `dashed` or `inline` if you don't want the loop.
- Inline variant places `actions` at `margin-left: auto`; the action
  slot is right-aligned regardless of how much description is shown.
