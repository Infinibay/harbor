# ContentSwap

`ContentSwap` animates one piece of content replacing another. It is useful for
tabs, route bodies, wizard steps, drawers, inspectors, empty-state changes, and
any UI where a discriminator changes and the user should understand that the
content changed intentionally.

Use it for state transitions. Do not use it for decorative motion that distracts
from reading or data entry.

## Import

```tsx
import { ContentSwap } from "@infinibay/harbor/motion";
```

## Basic Usage

Pass a stable `id` for the currently rendered content. When the id changes,
Harbor animates the old content out and the new content in.

```tsx
<ContentSwap id={activeTab} variant="fade-up">
  {activeTab === "logs" ? <LogTailer entries={logs} /> : <SettingsPanel />}
</ContentSwap>
```

## Modes

`mode="wait"` is the default: old content exits before new content enters.
`mode="sync"` mounts both briefly in normal flow. `mode="crossfade"` stacks both
frames absolutely inside a relative wrapper.

```tsx
<ContentSwap id={route.pathname} mode="crossfade" className="min-h-[24rem]">
  <RouteBody />
</ContentSwap>
```

## Variants

Use `fade`, `fade-up`, `fade-down`, `scale`, `blur`, `slide-left`,
`slide-right`, or `none`.

```tsx
<ContentSwap id={step.id} variant="slide-left" duration={200}>
  <StepContent step={step} />
</ContentSwap>
```

## Props

- `id`: required discriminator.
- `variant`: named animation preset.
- `mode`: `wait`, `sync`, or `crossfade`.
- `duration`: single-side duration in milliseconds.
- `respectReducedMotion`: disables motion for reduced-motion users by default.
- `customVariants`: Framer Motion variants override.
- `animateInitial`: animate first mount.
- `className`, `style`, `children`: wrapper content.

## Accessibility

Reduced motion is respected by default. Keep focus management in the parent
workflow; `ContentSwap` animates content but does not decide where focus should
move after a tab, route, or wizard step changes.

## Gotchas

`crossfade` absolutely positions frames. The wrapper needs a stable height or the
content can collapse.

Changing `id` too often can make a page feel unstable. Use stable route, tab, or
step ids rather than timestamps.

## Related

- `Tabs` uses content transitions for active panels.
- `Wizard` uses it for step bodies.
- `MorphBar` for animated navigation bars.
- `ReflowList` for animated list layout changes.
