# Popover

A click-anchored panel for arbitrary rich content next to a trigger —
small forms, color pickers, info cards. Compared to `<Tooltip>` it can
hold interactive children; compared to `<HoverCard>` it's
click-triggered, so it's safe for elements that need keyboard input.
For a list of actions use `<Menu>`.

## Import

```tsx
import { Popover } from "@infinibay/harbor/overlays";
```

## Example

```tsx
<Popover
  side="bottom"
  align="end"
  content={
    <div className="w-64">
      <Input label="Email" />
      <Button onClick={invite}>Invite</Button>
    </div>
  }
>
  <Button>Invite teammate</Button>
</Popover>
```

## Props

- **children** — `ReactElement`. The trigger. Must accept a forwarded
  `ref` and `onClick`.
- **content** — `ReactNode`. Panel body.
- **side** — `"top" | "bottom" | "left" | "right"`. Default
  `"bottom"`.
- **align** — `"start" | "center" | "end"`. Default `"center"`. Only
  applies to top/bottom; left/right are always centered on the
  trigger.
- **className** — extra classes on the panel.

## Notes

- Toggles on trigger click and closes on outside click. There is no
  built-in Escape handler — wrap with your own keydown if needed.
- Repositions on scroll and resize. Portals at `Z.POPOVER`.
- The popover does not trap focus; for a true modal experience use
  `<Dialog>`.
