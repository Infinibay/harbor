# Drawer

A slide-in panel anchored to one edge of the viewport. Use it for
non-blocking secondary UIs — filters, settings, details — where the
underlying page should stay visible. For a centered modal that demands
attention, use `<Dialog>`.

## Import

```tsx
import { Drawer } from "@infinibay/harbor/overlays";
```

## Example

```tsx
const [open, setOpen] = useState(false);

<Drawer
  open={open}
  onClose={() => setOpen(false)}
  side="right"
  size={420}
  title="Filters"
  footer={<Button onClick={apply}>Apply</Button>}
>
  <FilterForm />
</Drawer>;
```

## Props

- **open** — `boolean`. Controlled visibility.
- **onClose** — `() => void`. Fires on backdrop click, Escape, and the
  built-in close button.
- **side** — `"right" | "left" | "top" | "bottom"`. Default `"right"`.
- **size** — `number | string`. Width for left/right, height for
  top/bottom. Default `380`.
- **title** — `ReactNode`. Optional. Renders the header strip with a
  close button and wires `aria-labelledby`.
- **children** — `ReactNode`. Body content. Scrolls when overflowing.
- **footer** — `ReactNode`. Optional. Pinned action row.
- **className** — extra classes on the panel.

## Notes

- Portals to `document.body` at `Z.DRAWER`.
- The backdrop blurs and dims the page. Despite the blocking visual,
  the role is `dialog` with `aria-modal="true"` — treat it as modal
  for AT users.
- Animates from the chosen edge with a spring transition.
