# HoverCard

`HoverCard` shows rich contextual content when the user hovers a trigger. It is useful for profiles, entity previews, link previews, glossary terms, repository metadata, team members, and compact explainers that should not interrupt the page flow.

Use `Tooltip` for short text. Use `HoverCard` when the preview needs structure, multiple lines, actions, or metadata.

## Import

```tsx
import { HoverCard } from "@infinibay/harbor/overlays";
```

## Basic Usage

```tsx
import { HoverCard } from "@infinibay/harbor/overlays";

export function UserMention() {
  return (
    <HoverCard
      content={
        <div>
          <div className="font-medium">@ana</div>
          <div className="text-white/60">Engineer, Infrastructure</div>
        </div>
      }
    >
      <a href="/users/ana">@ana</a>
    </HoverCard>
  );
}
```

## Props

- **children** - `ReactElement`. Required trigger element. Harbor clones it to attach hover handlers and a ref.
- **content** - `ReactNode`. Required card body.
- **side** - `"top" | "bottom"`. Default `"bottom"`.
- **delay** - `number`. Open delay in milliseconds. Default `300`.
- **className** - extra classes on the floating card.

## Behavior

The trigger opens after `delay` on mouse enter. Leaving the trigger schedules a short close, and entering the floating card cancels that close so users can move into the preview. The card renders in a portal at `Z.HOVER_CARD` and repositions on scroll and resize.

Placement is fixed width, centered against the trigger, and clamped horizontally to the viewport.

## Accessibility

The current component is hover-driven and does not open on keyboard focus. Do not hide critical information only inside a `HoverCard`. For keyboard-accessible disclosure, use `Popover`, `Dialog`, or an explicit details button.

## Gotchas

- `children` must accept a ref and mouse handlers.
- Only `top` and `bottom` sides are supported.
- Position uses a fixed estimated card height for top placement.
- The card width is fixed at 280px.

## Related

- `Tooltip` for short labels.
- `Popover` for click-triggered rich content.
- `LinkPreviewCard` for URL preview content.
