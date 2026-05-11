# Callout

`Callout` highlights a target element and positions an onboarding tip around it.
It is built for guided tours, feature announcements, first-run education, and
small product walkthroughs where the user needs to understand one UI element at
a time.

Use it sparingly. A good callout explains a workflow moment; it should not patch
unclear product design.

## Import

```tsx
import { Callout } from "@infinibay/harbor/feedback";
```

## Basic Usage

Pass a selector, `HTMLElement`, or ref target. The overlay dims the page and cuts
out the target rectangle.

```tsx
<Callout
  open={tourStep === 1}
  target="#deploy-button"
  title="Create your first deployment"
  step={1}
  total={3}
  onNext={() => setTourStep(2)}
  onClose={() => setTourStep(null)}
>
  This button opens the deployment wizard with the current project selected.
</Callout>
```

## Placement

Choose the side where the tip should appear.

```tsx
<Callout target={toolbarRef.current} placement="right" open={open}>
  Pick a tool before editing the canvas.
</Callout>
```

If no target is found, the callout falls back to the center of the viewport.

## Step Controls

Use `step`, `total`, `onNext`, and `onPrev` for tour flows. Without `onNext`,
the primary button closes the callout.

```tsx
<Callout step={2} total={4} onPrev={previousStep} onNext={nextStep} />
```

## Props

- `target`: selector, element, or null.
- `open`: controlled visibility.
- `onClose`: close callback.
- `title`: heading content.
- `children`: body content.
- `step`, `total`: progress display.
- `onNext`, `onPrev`: tour navigation callbacks.
- `placement`: `top`, `bottom`, `left`, or `right`.
- `className`: tip class override.

## Accessibility

Escape closes the callout. Navigation buttons are real buttons. Keep callout copy
short and action-oriented so users can continue their task.

For complex tours, preserve focus intentionally in the parent flow; this
component highlights the target but does not manage a full focus trap.

## Gotchas

Target geometry is measured from the viewport and updates on resize and scroll.
If the target is inside a transformed or virtualized region, test placement in
the real page.

Avoid chaining many callouts on first load. Let users dismiss the tour and
reopen it from help or command palette.

## Related

- `Tooltip` for lightweight hover hints.
- `Dialog` for decisions that block progress.
- `Banner` for page-level announcements.
- `Wizard` for full setup flows.
