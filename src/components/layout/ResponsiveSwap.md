# ResponsiveSwap

`ResponsiveSwap` mounts one of two React subtrees based on a viewport breakpoint. Use it when mobile and desktop versions are structurally different: a drawer versus sidebar, compact card versus table, stacked form versus split form, or simplified mobile editor versus full desktop workbench.

Unlike CSS-only hiding, the inactive subtree is not mounted. This prevents duplicate effects, duplicate form fields, duplicated ids, and hidden expensive components.

## Import

```tsx
import { ResponsiveSwap } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<ResponsiveSwap
  above="md"
  mobile={<MobileProjectCards projects={projects} />}
  desktop={<ProjectDataTable projects={projects} />}
/>
```

Use slide animation for view changes that should feel directional:

```tsx
<ResponsiveSwap
  above="lg"
  animate="slide"
  mobile={<CompactInspector />}
  desktop={<SplitInspector />}
/>
```

## Props

- **above** - optional breakpoint where `desktop` takes over. Defaults to `"md"`.
- **mobile** - required `ReactNode` rendered below the breakpoint.
- **desktop** - required `ReactNode` rendered at or above the breakpoint.
- **animate** - optional `"fade"`, `"slide"`, or `false`. Defaults to `"fade"`.
- **className** - optional string applied to the wrapper.

## Mounting Model

`ResponsiveSwap` uses Harbor's `useIsAbove` breakpoint hook. It chooses a key of `"mobile"` or `"desktop"`, then renders that child through `AnimatePresence`. With animation disabled, it renders the active child directly inside the wrapper.

Because only one subtree mounts, local state inside the inactive variant is lost when switching breakpoints.

## Usage Guidance

Use `ResponsiveSwap` when two variants are truly different. If the same content only needs different columns, spacing, or order, use CSS, `ResponsiveGrid`, or responsive utility classes instead.

Avoid putting long-running requests independently inside both variants. Fetch data above the swap and pass it down.

## Accessibility

Only the active variant is present in the accessibility tree, which is usually better than hiding duplicate content with CSS. Make sure both variants expose equivalent controls and labels so resizing does not remove functionality.

## Gotchas

- Breakpoints are viewport-based.
- Switching breakpoints remounts the active child.
- Animated swaps can be distracting for frequently resizing containers; use `animate={false}` there.
- Do not use it to hide security-sensitive content; unmounted UI is not an authorization boundary.

## Related

- `ResponsiveGrid` for responsive columns.
- `ResponsiveStack` for stack direction changes.
- `ResponsiveSwap` pairs well with `DataTable` plus mobile card lists.
- `Drawer` and `Sidebar` for mobile/desktop navigation variants.
