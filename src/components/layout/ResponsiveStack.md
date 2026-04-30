# ResponsiveStack

Flexbox stack whose `direction` and `gap` can change per
viewport breakpoint. Reach for it when a sidebar should sit
beside content on desktop and stack above it on mobile, or any
similar swap. Built on Tailwind utilities so framer-motion
`layout` animations on children pick up the direction change for
free.

## Import

```tsx
import { ResponsiveStack } from "@infinibay/harbor/layout";
```

## Example

```tsx
<ResponsiveStack
  direction={{ base: "col", md: "row" }}
  gap={{ base: 2, md: 4 }}
  align="center"
>
  <Sidebar />
  <Content />
</ResponsiveStack>
```

## Props

- **direction** — `"row" | "col" | "row-reverse" | "col-reverse"`,
  optionally per breakpoint. Default `"col"`.
- **gap** — `number` or per-breakpoint record. Tailwind gap
  scale. Default `3`.
- **align** — `"start" | "center" | "end" | "stretch"`. Maps to
  `items-*`.
- **justify** — `"start" | "center" | "end" | "between" | "around"`.
  Maps to `justify-*`.
- **wrap** — `boolean`. Adds `flex-wrap`.
- **className** — extra classes on the wrapper.
- **style** — passthrough inline styles.

## Notes

- Uses Tailwind breakpoint prefixes — the breakpoints come from
  your Tailwind config.
- For reflowing many siblings into / out of rows, prefer
  `ReflowList` which also animates inter-row movement.
