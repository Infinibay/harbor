# CanvasMarquee

Click-and-drag rubber-band selector for `<Canvas>`. Activates when the
user starts a left-drag on empty canvas (not on a `<CanvasItem>`) and
emits a world-space rect on every frame plus on release. If you pass
`items`, it also hit-tests them and streams the matching IDs.

## Import

```tsx
import { CanvasMarquee, rectContains } from "@infinibay/harbor/layout";
```

## Example

```tsx
const [selected, setSelected] = useState<string[]>([]);

<Canvas>
  {nodes.map((n) => (
    <CanvasItem key={n.id} id={n.id} x={n.x} y={n.y}>
      <NodeCard selected={selected.includes(n.id)} />
    </CanvasItem>
  ))}
  <CanvasMarquee
    items={nodes}
    onSelectionDrag={setSelected}
    onSelection={setSelected}
  />
</Canvas>
```

## Props

- **onDrag** — `(rect: CanvasMarqueeRect) => void`. Live world-space
  rect while dragging.
- **onSelect** — `(rect: CanvasMarqueeRect) => void`. Final rect on
  release (always normalized).
- **items** — `ReadonlyArray<{ id; x; y; width?; height? }>`. When
  provided, hit-tests against the marquee.
- **onSelectionDrag** — `(ids: string[]) => void`. Live IDs (requires
  `items`).
- **onSelection** — `(ids: string[]) => void`. Final IDs (requires
  `items`).
- **modifier** — `"none" | "shift" | "alt" | "ctrl"`. Default `"none"`.
  Modifier required to activate.
- **enabled** — `boolean`. Default `true`. Mute while another tool is
  active.
- **className** — extra classes on the visual rect.

## Notes

- The visual rect is portalled into the viewport so it sits in screen
  space regardless of where you placed the component in the tree.
- Mark elements with `data-canvas-no-marquee` to opt out (resize
  handles, panel headers, etc.).
- `rectContains()` is exported — handy if you want to reuse the same
  hit-test elsewhere.
- See [Canvas.md](./Canvas.md) for the surrounding context.
