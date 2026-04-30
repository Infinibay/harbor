# ResponsiveSwap

Renders one of two subtrees depending on viewport breakpoint and
cross-fades between them when the viewport crosses the
threshold. Use it when the mobile and desktop versions of a
region diverge enough that hiding one with CSS would mean
mounting heavy components you don't need. For simple show/hide,
use `Show` / `Hide`.

## Import

```tsx
import { ResponsiveSwap } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ResponsiveSwap
  above="md"
  mobile={<MobileNav />}
  desktop={<DesktopNav />}
/>
```

## Props

- **above** — `"sm" | "md" | "lg" | "xl" | "2xl"`. Breakpoint at
  which `desktop` takes over. Default `"md"`.
- **mobile** — `ReactNode`. Rendered below the breakpoint.
- **desktop** — `ReactNode`. Rendered at and above.
- **animate** — `"fade" | "slide" | false`. Transition style.
  Default `"fade"`.
- **className** — extra classes on the wrapper.

## Notes

- Only the active subtree mounts — switching swaps unmounts the
  other side, which is the point.
- Built on `AnimatePresence` with `mode="wait"` so the outgoing
  variant finishes its exit before the incoming one mounts.
