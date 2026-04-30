# Expandable

Two-state shared-layout container that morphs from a collapsed trigger
into an expanded surface (e.g. icon → form, chip → detail panel). Use
when the collapsed and expanded states share visual identity. For the
specific search idiom use `<ExpandingSearch>` instead.

## Import

```tsx
import { Expandable } from "@infinibay/harbor/layout";
```

## Example

```tsx
<Expandable
  collapsed={<button className="px-3 h-9 rounded-full">+ Add note</button>}
  expanded={
    <textarea
      autoFocus
      placeholder="Type and press Esc to close"
      className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
    />
  }
/>
```

## Props

- **collapsed** — `ReactNode`. Required. Trigger view.
- **expanded** — `ReactNode`. Required. Open view.
- **open** — `boolean`. Controlled open state.
- **defaultOpen** — `boolean`. Initial state when uncontrolled.
- **onOpenChange** — `(v: boolean) => void`. Fired on state change.
- **expandOn** — `"click" | "focus"`. Default `"click"`.
- **closeOnEscape** — `boolean`. Default `true`.
- **closeOnBlur** — `boolean`. Closes on outside click. Default `true`.
- **className** — extra classes on the wrapper.
- **expandedClassName** — extra classes on the expanded surface.

## Notes

- Collapsed and expanded share the `expandable-content` `layoutId` so
  framer-motion can morph between them.
- Drop inside a `<MorphBar>` and pair with siblings flagged `hidden` to
  reflow neighbours when expanded.
