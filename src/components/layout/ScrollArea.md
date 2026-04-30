# ScrollArea

Vertically scrollable region with a hidden native scrollbar and a
custom thumb that fades in on hover or while scrolling. Use it inside
fixed-height regions (sidebars, panels, modals) when you want clean
overflow without browser scrollbar chrome.

## Import

```tsx
import { ScrollArea } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ScrollArea maxHeight={320} thumbTone="purple">
  <ul className="flex flex-col gap-2">
    {items.map((it) => <li key={it.id}>{it.label}</li>)}
  </ul>
</ScrollArea>
```

## Props

- **children** — `ReactNode`. Required.
- **maxHeight** — `number | string`. Caps the visible area. A number
  is treated as pixels. Default `280`.
- **thumbTone** — `"purple" | "white"`. Thumb fill: brand gradient or
  translucent white. Default `"purple"`.
- **className** — extra classes on the wrapper.
- Plus all standard `HTMLDivElement` attributes.

## Notes

- The thumb visibility is a simple state machine — visible on hover,
  visible while scrolling, then fades out 600ms after both stop.
- Native scrollbar is hidden via `scrollbar-width: none` plus a
  `-webkit-scrollbar` rule, so the layout never reflows when the
  thumb appears.
- Vertical-only by design — for horizontal overflow handle it on the
  inner content.
