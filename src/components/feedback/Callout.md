# Callout

A spotlight overlay that dims the page, cuts a glowing hole around a target
element, and anchors a tip card next to it. Use for product tours and
first-run hints. For passive in-flow notices use `<Alert>`; for site-wide
announcements use `<Banner>`.

## Import

```tsx
import { Callout } from "@infinibay/harbor/feedback";
```

## Example

```tsx
<Callout
  open={step === 1}
  target="#new-vm-button"
  placement="bottom"
  step={1}
  total={3}
  title="Spin up your first VM"
  onNext={() => setStep(2)}
  onClose={() => setStep(0)}
>
  Click here to start. We'll walk through templates next.
</Callout>
```

## Props

- **open** — required. Visibility flag.
- **target** — `string | HTMLElement | null`. CSS selector or element to spotlight. If missing, the tip centers on the viewport with a flat dim.
- **onClose** — `() => void`. Fires on backdrop click and `Escape`.
- **title** — `ReactNode`. Tip heading.
- **children** — `ReactNode`. Tip body.
- **placement** — `"top" | "bottom" | "left" | "right"`. Tip side relative to the target. Default: `"bottom"`.
- **step** / **total** — `number`. When both are set, shows "Step X of Y", a dot indicator, and toggles the action label between "Next" and "Done".
- **onNext** — `() => void`. Wires the primary button. If omitted, the button calls `onClose`.
- **onPrev** — `() => void`. When set, renders a "Back" button.
- **className** — extra classes on the tip card.

## Notes

- Renders into a portal at `Z.DIALOG`, so it stacks above tooltips, popovers, and toasts.
- The spotlight is an SVG mask — the target element keeps full pointer access; only the dimmed area receives clicks (which call `onClose`).
- The ring around the target pulses via an inline `@keyframes callout-pulse` rule injected once with the component.
- Re-measures on `resize` and capture-phase `scroll`, so the tip tracks the target as the page moves.
