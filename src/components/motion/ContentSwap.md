# ContentSwap

Generic transition wrapper for content that gets replaced when a
discriminator changes — route pathnames, tab ids, drawer views,
wizard steps. Framework-agnostic: the caller decides what `id` means.

## Import

```tsx
import { ContentSwap } from "@infinibay/harbor/motion";
```

## Example

```tsx
<ContentSwap id={pathname} variant="fade-up" duration={160}>
  {pageContent}
</ContentSwap>

<ContentSwap id={tabId} variant="slide-left" mode="crossfade" className="min-h-[320px]">
  {tabPanel}
</ContentSwap>
```

## Variants

`fade` (default), `fade-up`, `fade-down`, `scale`, `blur`,
`slide-left`, `slide-right`, `none`.

## Modes

- `wait` (default) — old content fully exits before new content
  mounts. Clean rhythm; leaves a brief blank frame during the gap
  (good while a code-split chunk loads).
- `sync` — new content mounts immediately while old is still exiting.
  Snappier; old and new can visibly stack.
- `crossfade` — both render simultaneously via `position: absolute`
  inside the wrapper. No blank-frame flash; **requires the wrapper to
  have a defined size** (pass `className`/`style` with `min-height`
  or flex constraints).

## Props

- **id** — `string | number`. Required. Discriminator — when it
  changes, the transition fires.
- **variant** — `ContentSwapVariant`. Default `"fade"`.
- **mode** — `"wait" | "sync" | "crossfade"`. Default `"wait"`.
- **duration** — `number`. Single-side duration in ms. Default `160`.
- **respectReducedMotion** — `boolean`. Default `true`. Collapses
  to an instant swap when `prefers-reduced-motion: reduce`.
- **customVariants** — `Variants` (framer-motion). Escape hatch —
  overrides `variant`.
- **animateInitial** — `boolean`. Default `true`. Run the enter
  animation on the first mount; set `false` for SSR-driven first paints.
- **className** / **style** — applied to the motion wrapper.
- **children** — `ReactNode`. The current content.

## Notes

- `wait` is the right default for route swaps where overlap looks
  jarring; `crossfade` is the right pick for tabs / drawer views
  where the wrapper has a known size.
- Reduced-motion users get an instant swap (zero duration, no
  transform) — no need to special-case CSS yourself.
- Framer-motion's `AnimatePresence` is what drives the lifecycle, so
  you can stack a `<ContentSwap>` inside another for nested transitions.
