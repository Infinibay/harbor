# A11y Primitives

Shared interaction primitives for focus management, dismissable layers, roving tabindex, live announcements, and reduced motion.

## Import

```tsx
import {
  DismissableLayer,
  LiveRegion,
  RovingFocusGroup,
  focusFirst,
  getFocusableElements,
  trapFocus,
  useDismissableLayer,
  useLiveRegion,
  useReducedMotionPreference,
  useRovingFocusItem,
  prefersReducedMotion,
  reducedMotionTransition,
} from "@infinibay/harbor/a11y";
```

## Focus Trap

Use `focusFirst` when a dialog, drawer, popover, or command surface opens. Use `trapFocus` from the surface `onKeyDown` handler to keep Tab navigation inside the active layer.

```tsx
function DialogContent({ onClose }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) focusFirst(ref.current);
  }, []);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onKeyDown={(event) => trapFocus(ref.current!, event)}
    >
      <button type="button" onClick={onClose}>Close</button>
    </div>
  );
}
```

Restore focus to the trigger when closing modal surfaces. Harbor overlays such as `Dialog`, `Drawer`, and `DataWorkspace` detail drawers use this pattern internally.

## Dismissable Layer

Use `DismissableLayer` or `useDismissableLayer` for Escape and outside-pointer dismissal. Pass `ignoreRefs` for triggers or nested controls that should not close the layer.

```tsx
<DismissableLayer onDismiss={closeMenu} ignoreRefs={[triggerRef]}>
  <div role="menu">...</div>
</DismissableLayer>
```

## Roving Tabindex

Use `RovingFocusGroup` and `useRovingFocusItem` for composite widgets where only one item belongs in the Tab order: tabs, menus, segmented controls, toolbars, and listbox-like controls.

```tsx
function ToolbarButton({ id, children }) {
  const roving = useRovingFocusItem({ id });
  return <button type="button" {...roving}>{children}</button>;
}

<RovingFocusGroup orientation="horizontal">
  <ToolbarButton id="bold">Bold</ToolbarButton>
  <ToolbarButton id="italic">Italic</ToolbarButton>
</RovingFocusGroup>;
```

## Live Regions

Use `LiveRegion` or `useLiveRegion` for status updates that are not tied to focus movement: autosave, export completion, inline validation, background sync, and async errors.

```tsx
const live = useLiveRegion();

async function save() {
  await saveSettings();
  live.announce("Settings saved");
}

<LiveRegion message={live.message} />;
```

Use `politeness="assertive"` only for urgent failures that need immediate announcement.

## Reduced Motion

Use `useReducedMotionPreference`, `prefersReducedMotion`, or `reducedMotionTransition` to replace movement-heavy transitions with instant or subtle alternatives.

```tsx
const reduced = useReducedMotionPreference();
const transition = reduced ? { duration: 0 } : { type: "spring", bounce: 0.18 };
```

## Keyboard Flows

Harbor components should use these primitives for keyboard-first behavior:

- Modal surfaces trap Tab and restore focus on close.
- Menus, tabs, segmented controls, and toolbar-like widgets use arrow-key roving focus.
- Escape closes dismissable overlays.
- Live regions announce background state changes.
- Motion respects the user's reduced-motion preference.

## Gotchas

These primitives do not replace semantic markup. Keep correct roles, labels, `aria-modal`, `aria-selected`, `aria-expanded`, and disabled states on the component using the primitive.

Do not trap focus in non-modal content. For inline panels and persistent sidebars, keep normal document Tab order.
