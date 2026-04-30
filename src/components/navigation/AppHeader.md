# AppHeader

Thin app chrome bar for the top of a page — a backdrop-blurred,
bordered sticky strip with a `left` slot (back button, breadcrumbs,
title) and a `right` slot (actions, notifications, user menu). Use
this for passive page chrome; reach for `<NavBar>` when you need
tabbed primary navigation.

## Import

```tsx
import { AppHeader } from "@infinibay/harbor/navigation";
```

## Example

```tsx
<AppHeader
  left={<span className="font-semibold">Project / Settings</span>}
  right={
    <div className="flex items-center gap-2 text-sm text-white/60">
      <span>v0.4.2</span>
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
    </div>
  }
/>
```

## Props

- **left** — `ReactNode`. Leading content; takes the remaining width
  and truncates.
- **right** — `ReactNode`. Trailing content; shrinks to its intrinsic
  width.
- **sticky** — `boolean`. Default `true`. Pins the header to the top
  of the scroll container with `z-index: Z.STICKY`.
- **className** — extra classes on the `<header>`.

## Notes

- This is a frame, not a layout — it does not render tabs, a brand,
  or a user menu by itself. Compose those into `left` / `right`.
- Background uses translucent `#0d0d14/80` with backdrop blur, so it
  reads as glass over any page surface.
