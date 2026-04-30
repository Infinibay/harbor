# Dialog

A modal surface that traps focus, blocks the page, and animates in. Uses
the global Z layer system (`Z.DIALOG`) so it always stacks above
tooltips, popovers, and toasts.

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

## Example (recommended composable API)

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onClose={() => setOpen(false)} size="sm">
  <DialogTitle>Delete project?</DialogTitle>
  <DialogDescription>
    This action cannot be undone.
  </DialogDescription>
  <DialogBody>
    <p>All members will lose access immediately.</p>
  </DialogBody>
  <DialogButtons align="end">
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
  </DialogButtons>
</Dialog>;
```

## Subcomponents

- **`<DialogTitle>`** — heading. Wires `aria-labelledby` automatically.
- **`<DialogDescription>`** — supporting copy under the title. Wires
  `aria-describedby`.
- **`<DialogBody>`** — main content slot with consistent padding.
- **`<DialogButtons>`** — action row with divider, gap, and alignment.
  Pass `align="start" | "center" | "end" | "between"`. Use `"between"`
  when a destructive action should sit to the far left, separated from
  safe actions on the right.

## Props (Dialog)

- **open** — controlled visibility.
- **onClose** — `() => void`. Fires on backdrop click and Escape.
- **size** — `"sm" | "md" | "lg"`. Default: `"md"`.
- **className** — extra classes on the dialog panel.

## Notes

- `<Dialog>` portals into `document.body` — its position in the React
  tree doesn't matter. Mount it where it's logically owned.
- For a non-modal slide-in (settings, filters), use `<Drawer>`.
- For a one-line "are you sure?" confirmation, use `<AlertDialog>`.
