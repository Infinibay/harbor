# CanvasPanel

Floating, draggable, collapsible panel for property inspectors,
layers, history, color pickers — anything you'd find floating over a
canvas app. Drag the header to move; click the chevron to collapse.
Positions itself in absolute viewport coordinates (drop it inside the
`<Canvas overlay={...}>` slot) so pan/zoom don't move it.

## Import

```tsx
import { CanvasPanel } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Canvas
  overlay={
    <CanvasPanel
      title="Inspector"
      defaultPosition={{ x: 16, y: 16 }}
      width={260}
      closable
    >
      <div className="space-y-2 text-sm text-white/70">
        <div>Width: 320</div>
        <div>Height: 200</div>
      </div>
    </CanvasPanel>
  }
>
  ...
</Canvas>
```

## Props

- **title** — `ReactNode`. Header label.
- **children** — `ReactNode`. Body content.
- **defaultPosition** — `{ x; y }`. Uncontrolled start. Default `{ 16, 16 }`.
- **position** / **onPositionChange** — controlled coords.
- **width** — `number`. Default `240`. Height fits content.
- **defaultCollapsed** — `boolean`.
- **closable** — `boolean`. Shows the × button.
- **onClose** — `() => void`.
- **className** — extra classes on the panel.

## Notes

- The panel doesn't read the Canvas context — it just lives in screen
  space. Use it inside `<Canvas overlay>` so it stays pinned during
  pan/zoom.
- Header drag is suppressed when the click target is a `<button>`,
  so the collapse / close controls work without hijacking.
