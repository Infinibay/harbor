# Expandable

`Expandable` morphs between a collapsed node and an expanded node with shared
layout animation. It is useful for compact add forms, inline search, quick note
capture, small editors, and controls that should start minimal but expand into a
full surface when needed.

It only manages open state and transitions. Your collapsed and expanded content
define the actual UI.

## Import

```tsx
import { Expandable } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<Expandable
  collapsed={<Button variant="secondary">Add note</Button>}
  expanded={
    <Card title="New note">
      <Textarea autoFocus placeholder="Write a note..." />
    </Card>
  }
/>;
```

Controlled usage:

```tsx
<Expandable
  open={open}
  onOpenChange={setOpen}
  collapsed={<Button>Search</Button>}
  expanded={<input autoFocus placeholder="Search..." />}
/>;
```

## Props

- **open** - `boolean`. Controlled open state.
- **defaultOpen** - `boolean`. Initial uncontrolled open state.
- **onOpenChange** - `(open: boolean) => void`. Fires whenever the component
  requests an open-state change.
- **collapsed** - `ReactNode`. Required collapsed surface.
- **expanded** - `ReactNode`. Required expanded surface.
- **expandOn** - `"click" | "focus"`. Default `"click"`.
- **closeOnEscape** - `boolean`. Default `true`.
- **closeOnBlur** - `boolean`. Closes on outside mouse down. Default `true`.
- **className** - extra classes on the wrapper.
- **expandedClassName** - extra classes on the expanded wrapper.

## Behavior

In uncontrolled mode, `Expandable` stores open state internally. In controlled
mode, the parent must update `open` from `onOpenChange`.

When open, Escape can close the component and outside mouse down can close it,
depending on the close props. With `expandOn="focus"`, focusing inside the root
opens the expanded content.

## Accessibility

The component does not add button semantics to `collapsed`; provide an actual
button or focusable control when users should activate it. Expanded content
should manage focus, labels, and submit/cancel actions just like any other form
or panel.

If expansion reveals important content, make the trigger text explicit. Avoid
icon-only collapsed content without an accessible label.

## Gotchas

- The internal shared `layoutId` is fixed. Avoid rendering many `Expandable`
  instances that animate at the same time if layout animation collisions appear.
- `closeOnBlur` listens for outside mouse down, not focus-out semantics.
- `Expandable` does not trap focus or behave like a modal.
- Expanded content is whatever node you pass; `Expandable` does not add styling
  or form behavior to it.

## Related

- `ExpandingSearch` for a specialized search version.
- `Popover` for floating expanded content.
- `Drawer` and `Dialog` for larger workflows.
- `MorphBar` patterns for toolbar layouts that yield space.
