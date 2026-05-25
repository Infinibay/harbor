# Dialog

`Dialog` renders a modal panel in a portal with backdrop, Escape close, backdrop click close,
ARIA dialog attributes, and composable title/body/action subcomponents.

Use it for focused decisions and short workflows: confirmations, destructive actions, invite
forms, API key reveal flows, upgrade prompts, and small editors. For non-modal side panels,
use `Drawer`.

## Import

```tsx
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
} from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
<Dialog open={open} onClose={() => setOpen(false)} size="sm">
  <DialogTitle>Delete project?</DialogTitle>
  <DialogDescription>This action cannot be undone.</DialogDescription>
  <DialogBody>
    <p>All deploy keys, environments, and logs will be removed.</p>
  </DialogBody>
  <DialogButtons align="end">
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={deleteProject}>Delete</Button>
  </DialogButtons>
</Dialog>
```

## Composition Model

The recommended API is subcomponent-based. `DialogTitle` and `DialogDescription` connect to
the dialog's `aria-labelledby` and `aria-describedby` ids through context. `DialogBody`
provides standard padding. `DialogButtons` creates the action row and supports
`start`, `center`, `end`, and `between` alignment.

The legacy prop API (`title`, `description`, `footer`, `footerAlign`) still works and forwards
to the same internals, but new examples should prefer subcomponents.

## Props

- **open** - controlled visibility.
- **onClose** - closes from backdrop click, close button, and Escape.
- **children** - dialog content or subcomponents.
- **size** - `"sm" | "md" | "lg"`. Default `"md"`.
- **title** / **description** / **footer** - legacy slots.
- **footerAlign** - `"start" | "center" | "end" | "between"`.
- **className** - extra classes on the panel.

## Accessibility

The panel renders `role="dialog"` and `aria-modal="true"`, and title/description ids are
wired automatically when the matching subcomponents are used. The close button is labeled via
Harbor i18n.

When opened, `Dialog` moves focus to the first focusable control, traps Tab navigation inside
the panel, dismisses on Escape or outside pointer interaction, and restores focus to the opener
when it closes.

## Gotchas

- `onClose` is called for backdrop clicks. If backdrop close is not allowed, guard it in your
  own wrapper.
- Keep dialogs short. Multi-step or inspect-heavy workflows usually belong in `Drawer`.
- Do not render `DialogTitle` or `DialogDescription` outside `Dialog`; they require context.
- The component portals to `document.body`, so local stacking context does not affect it.

## Related

- `Drawer` for non-modal side workflows.
- `Alert` for inline confirmation or warning copy.
- `CommandPalette` for keyboard command workflows.
- `Lightbox` for image-focused modal viewing.
