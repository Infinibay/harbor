# StatusBar

`StatusBar` is a compact composition primitive for editor, desktop, console, and
workspace status lines. It provides the container, while `StatusItem` and
`StatusSeparator` provide small readable units for branch, sync state, selected
count, cursor position, warnings, encoding, environment, or connection state.

Use it when the information is persistent and lightweight. For important errors
or actions that require attention, use a more prominent `Alert`, `Banner`, or
toast.

## Import

```tsx
import { StatusBar, StatusItem, StatusSeparator } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<StatusBar>
  <StatusItem tone="success">main</StatusItem>
  <StatusSeparator />
  <StatusItem onClick={() => openChanges()}>3 changes</StatusItem>
  <StatusSeparator />
  <StatusItem tone="info">Ln 42, Col 18</StatusItem>
  <StatusSeparator />
  <StatusItem tone="warning">2 warnings</StatusItem>
</StatusBar>
```

Place it at the bottom of an app shell, editor pane, or desktop window:

```tsx
<AppShell footer={<StatusBar>{items}</StatusBar>}>{workspace}</AppShell>
```

## Props

`StatusBar`:

- **children** - `ReactNode`. Required. Usually `StatusItem` and
  `StatusSeparator`.
- **className** - extra classes on the wrapper.

`StatusItem`:

- **icon** - `ReactNode`. Optional leading icon.
- **children** - `ReactNode`. Required label.
- **tone** - `"success" | "warning" | "danger" | "info"`. Optional text tone.
- **onClick** - `() => void`. Makes the item interactive.
- **className** - extra classes on the item.

## Composition Model

`StatusBar` renders with `role="status"` and does not inspect its children.
`StatusItem` is always a button element, but it is disabled when `onClick` is not
provided. Use clickable items for drill-down actions such as opening diagnostics,
showing changes, or switching environments.

`StatusSeparator` renders a small visual dot between groups. It is intentionally
simple so dense status lines stay quiet.

## Accessibility

Use short, descriptive labels. A status item like `2 warnings` is useful because
it communicates state without depending on the amber tone. When a status item is
clickable, make the text describe the action target clearly enough for keyboard
users.

Because the whole bar has `role="status"`, avoid constantly changing noisy text
every few milliseconds. Reserve rapid live values for canvas-specific status or
visual-only readouts.

## Gotchas

- `StatusItem` without `onClick` is rendered as a disabled button. That preserves
  layout but means it is not focusable.
- The bar is intentionally compact. Do not put long prose, forms, or primary
  actions in it.
- Use `CanvasStatusBar` inside `Canvas` when you need live x/y/zoom values.

## Related

- `CanvasStatusBar` for canvas coordinates and zoom.
- `AppShell` for footer placement.
- `Toolbar` and `MenuBar` for command-heavy app chrome.
- `Alert` and `Banner` for important status messages.
