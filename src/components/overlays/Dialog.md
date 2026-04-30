# Dialog

A modal surface that traps focus, blocks the page, and animates in from
the cursor. Uses the global Z layer system (`Z.DIALOG`) so it always
stacks above tooltips, popovers, and toasts.

## Import

```tsx
import { Dialog } from "@infinibay/harbor/overlays";
```

## Example

```tsx
const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Delete project</Button>

  <Dialog open={open} onOpenChange={setOpen} title="Delete project?">
    <p>This action cannot be undone.</p>
    <div className="mt-4 flex justify-end gap-2">
      <Button variant="ghost" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="danger" onClick={confirmDelete}>
        Delete
      </Button>
    </div>
  </Dialog>
</>;
```

## Props

- **open** — controlled visibility. Use with `onOpenChange`.
- **onOpenChange** — `(open: boolean) => void`. Fires on backdrop click and Escape.
- **title** — heading rendered inside the dialog.
- **size** — `"sm" | "md" | "lg" | "fullscreen"`. Default: `"md"`.
- **dismissible** — when `false`, backdrop clicks and Escape are ignored. Default: `true`.

## Notes

- Mount once per app — `<Dialog>` portals into `document.body` so its
  position in the React tree doesn't matter.
- For a non-modal slide-in (e.g. settings or filters), prefer `<Drawer>`.
- For a quick confirmation, the lighter `<AlertDialog>` skips the
  body/footer slots and just shows a question + two buttons.
