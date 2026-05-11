# EmptyState

`EmptyState` explains why a region has no content yet and gives the user the next reasonable action. It is the right primitive for first-run screens, filtered lists with no matches, empty folders, missing integrations, and setup steps that have not been completed.

Good empty states are specific. Say what is empty, why it matters, and what the user can do next. Avoid vague copy such as "Nothing here".

## Import

```tsx
import { EmptyState } from "@infinibay/harbor/display";
```

## Basic Usage

```tsx
import { Button } from "@infinibay/harbor/buttons";
import { EmptyState } from "@infinibay/harbor/display";

export function ProjectsEmptyState() {
  return (
    <EmptyState
      icon={<span aria-hidden>+</span>}
      title="No projects yet"
      description="Create your first project to connect repositories, environments, and deploy targets."
      actions={<Button size="sm">New project</Button>}
    />
  );
}
```

## Props

- **title** - `ReactNode`. Required headline.
- **description** - `ReactNode`. Supporting explanation.
- **icon** - `ReactNode`. Optional icon rendered inside a Harbor-styled icon box.
- **actions** - `ReactNode`. Buttons or links for the next step.
- **variant** - `"default" | "dashed" | "inline"`. Default `"default"`.
- **className** - extra classes on the wrapper.

## Variants

`default` is a centered page or panel state with a larger icon box and a subtle floating icon animation. Use it when the whole view is empty.

`dashed` is smaller and framed, useful inside upload zones, cards, settings panels, and optional sections.

`inline` is a compact row with the icon on the left and actions pushed to the right. Use it inside lists, sidebars, and table-adjacent panels where vertical space is tight.

## Accessibility

The component is presentational and does not create a landmark or alert. That is usually correct for static empty content. If the empty state appears after a user action, announce the result from the surrounding workflow with a toast, live region, or focused heading.

Use semantic buttons or links inside `actions`. If the icon is decorative, mark the icon itself with `aria-hidden`.

## Gotchas

- The default variant animates the icon forever. Use `dashed` or `inline` for dense screens or reduced visual motion.
- `actions` accepts any node. Keep it to one primary action plus, at most, one secondary action.
- `inline` assumes enough horizontal room for the action slot.

## Related

- `ErrorState` for recoverable failures.
- `LoadingOverlay` for pending content.
- `Button` for primary empty-state actions.
