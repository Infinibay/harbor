# CloseButton

`CloseButton` is the standardized Harbor dismiss control. Use it in dialogs, drawers, toasts, removable panels, inspectors, tabs, chips, banners, and floating surfaces where the user needs a compact way to close or remove something.

It renders a real button with a consistent hit area, focusable semantics, default accessible label, and Harbor hover treatment. Your app owns the actual close behavior through `onClick` or the surrounding component's state.

## Import

```tsx
import { CloseButton } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <header className="flex items-center justify-between">
    <DialogTitle>Invite teammate</DialogTitle>
    <CloseButton onClick={() => setOpen(false)} />
  </header>
</Dialog>
```

Use the solid variant when the button sits on a busy surface:

```tsx
<CloseButton variant="solid" size="sm" aria-label="Remove filter" />
```

## Props

`CloseButton` extends native `button` attributes and adds:

- **size** - optional `"sm"`, `"md"`, or `"lg"`. Defaults to `"md"`.
- **variant** - optional `"ghost"` or `"solid"`. Defaults to `"ghost"`.
- **className** - optional string merged onto the button.

You can pass `onClick`, `disabled`, `aria-label`, `title`, and other standard button props.

## Interaction Model

The component always renders `type="button"`, so it will not accidentally submit forms. It does not manage open state by itself. The parent dialog, toast, chip list, or panel should update its own state when the button is pressed.

For repeated removable items, pass an item-specific label:

```tsx
<CloseButton
  size="sm"
  aria-label={`Remove ${filter.label}`}
  onClick={() => removeFilter(filter.id)}
/>
```

## Accessibility

The default `aria-label` is `"Close"`. Override it when the action is more specific, such as `"Dismiss notification"`, `"Remove tag react"`, or `"Close inspector"`.

Do not hide the only close control behind hover. Dialogs and drawers should expose a visible close path and usually also support Escape through their overlay primitive.

## Gotchas

- `CloseButton` only calls the handler you provide; it does not close modals automatically.
- The ghost variant can be too subtle on image or gradient backgrounds. Use `solid` there.
- Repeated close buttons with identical labels are harder to navigate. Make labels specific.
- Avoid using it for destructive delete actions unless the context clearly means removal from the current view.

## Related

- `Dialog` and `Drawer` for dismissible overlays.
- `Toast` for temporary notifications.
- `Tag` for removable labels.
- `MoreButton` for overflow actions.
