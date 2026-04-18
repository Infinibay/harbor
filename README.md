# Harbor

A living UI component library for [Infinibay](https://infinibay.com).

~120 components that react to the cursor, coordinate with their siblings,
and compose into real application chrome — IDEs, design tools, dashboards,
music players, chat, email, file managers, and more.

All components are built with React 19 + TypeScript + Tailwind v3 + Framer
Motion. No external UI dependency. Everything is portable, typed, and
designed to be production-ready.

---

## Install

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the showcase is a real
app with React Router, one route per category.

## Usage

Import from the root barrel:

```tsx
import { Button, Dialog, DataTable, LineChart } from "./components";
```

Or target a specific category for finer control:

```tsx
import { Button } from "./components/buttons";
import { Dialog } from "./components/overlays";
```

## Structure

Components are grouped by intent, not by visual similarity:

```
src/
  components/
    buttons/         Button · IconButton · SplitButton · CopyButton
    inputs/          25 form inputs + creative (Knob, ColorPicker, Wizard, …)
    display/         Card · Stat · Avatar · Badge · Pricing · Comparison · …
    data/            DataTable · Kanban · TreeView · VirtualList · Diff · JSON · …
    charts/          Sparkline · LineChart · BarChart · Donut · Gauge
    feedback/        Alert · Toast · Banner · Callout · ActivityFeed
    overlays/        Tooltip · Popover · Dialog · Drawer · Menu · CommandPalette · …
    navigation/      Tabs · Breadcrumbs · Pagination · Stepper · NavBar · Sidebar · …
    layout/          Accordion · ScrollArea · SplitPane · MorphBar · WindowFrame · …
    chat/            ChatBubble · ChatInput · EmojiPicker · NotificationBell · …
    collab/          Presence · CommentThread · ReactionsBar
    media/           Carousel · Scrubber · CompareSlider · SignaturePad
    dev/             CodeBlock · Terminal · LogViewer · Markdown · FindBar · …
    index.ts         root barrel (re-exports all categories)
  lib/
    cn.ts            class-name helper (clsx-lite)
    cursor.tsx       global cursor motion values + useCursorProximity hook
    Portal.tsx       <Portal> wrapper around createPortal
    z.ts             layer system — Z.TOOLTIP, Z.DIALOG, Z.POPOVER, …
  pages/             showcase pages, one per category
  showcase/          Demo card wrapper + shared icons
```

### Design tokens

All colors, spacing, typography, radii, shadows, motion and breakpoints
are CSS custom properties declared in `src/tokens.css`. Components read
them either via Tailwind utilities (`bg-accent`, `rounded-lg`, `text-fg-muted`)
or directly via `var(--harbor-*)`.

**Theme at runtime** by overriding a token on any subtree:

```tsx
<div style={{ "--harbor-accent": "34 211 238" }}>
  {/* everything inside uses cyan as the accent */}
</div>
```

Color values are stored as space-separated RGB triplets so the modern
`rgb(var(--harbor-accent) / 0.5)` slash-alpha syntax works. That's also
what Tailwind's `<alpha-value>` placeholder expands to in
`tailwind.config.js`.

Exposed Tailwind utilities include:

- Colors: `accent`, `accent-2`, `accent-3`, `success`, `warning`, `danger`,
  `info`, `surface`, `surface-1`, `surface-2`, `surface-3`, `fg`,
  `fg-muted`, `fg-subtle`
- Radius: `rounded-sm/md/lg/xl/2xl`
- Shadows: `shadow-harbor-sm/md/lg/glow`
- Duration: `duration-fast/base/slow/slower/instant`
- Easing: `ease-out`, `ease-in-out`, `ease-spring`

See `/foundations/responsive` in the app for a live token editor.

### Responsive system

```tsx
import {
  useBreakpoint, useIsAbove, useDevice, useOrientation,
  useIsPhone, useIsTablet, useIsDesktop,
  useIsTouch, useHasHover, usePrefersReducedMotion,
  Show, Hide, ResponsiveSwap, Container, ResponsiveStack,
} from "./components";
```

**Hooks** (from `lib/responsive.ts`):

- `useMediaQuery(q)` · `useBreakpoint()` · `useIsAbove(bp)` · `useIsBelow(bp)`
- `useDevice()` → `"phone" | "tablet" | "desktop"`
- `useIsPhone/Tablet/Desktop()`
- `useOrientation()` / `useIsPortrait/Landscape()` — rotates with the device
- `useIsTouch()` (pointer: coarse) / `useHasHover()` (hover: hover)
- `usePrefersReducedMotion()` — respect and skip animations
- `useResponsiveValue({ base, sm, md, lg, xl, 2xl })` — inherits up

**Components** (in `layout/`):

- `Show` / `Hide` — conditional render by breakpoint, device, orientation
  or touch capability. Animated transitions when the condition flips:

  ```tsx
  <Show above="md" animate="slide">Desktop-only card</Show>
  <Show device={["tablet", "desktop"]}>Hidden on phone</Show>
  <Show orientation="landscape">Rotate to portrait</Show>
  <Show touch={false}>Hover me</Show>
  ```
- `ResponsiveSwap` — cross-fade between a mobile and desktop variant at a
  breakpoint. Both mount lazily.
- `Container` — centered max-width wrapper; sizes mapped to
  `--harbor-container-*` tokens.
- `ResponsiveStack` — flex stack whose direction and gap change per
  breakpoint:

  ```tsx
  <ResponsiveStack direction={{ base: "col", md: "row" }} gap={{ base: 2, md: 4 }}>
  ```

### Layer system

All overlays import z-indexes from `src/lib/z.ts`. Ranges:

| Range         | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `-10..-1`     | `BACKGROUND` — decorative (mesh, blobs)                      |
| `0..9`        | `BASE` — normal flow                                         |
| `10..39`      | `RAISED` / `STICKY` / `CHROME` — sticky nav, progress bar    |
| `1000..1199`  | `POPOVER` / `SUBMENU` — content-anchored dropdowns           |
| `2000..2199`  | `CONTEXT_MENU` / `HOVER_CARD`                                |
| `4000`        | `DRAWER`                                                     |
| `5000`        | `DIALOG`                                                     |
| `6000`        | `COMMAND_PALETTE`                                            |
| `7000`        | `TOAST`                                                      |
| `9000`        | `TOOLTIP` — always on top                                    |

Never hard-code a z-index. Import from `"./lib/z"` and use `Z.X`.

### Cursor reactivity

A single global cursor provider exposes `cursor.x` / `cursor.y` as Framer
Motion values. Components subscribe via `useCursorProximity(ref, radius)` to
get local motion values (`nx`, `ny`, `proximity`, `inside`) they can map
into transforms. No per-element mousemove listener — scales cleanly to
hundreds of components on a page.

Visual cursor effects:

- **Spotlight**: `.spotlight` class draws a radial gradient at `--mx/--my`
  (set via `onMouseMove`). Radius animates in/out using an `@property`
  registered CSS variable (`--spot-size`).
- **Glow border**: `.glow-border` uses the same `--mx/--my` for a masked
  border that lights up near the cursor.
- **Magnetic / lean**: components like `Button`, `IconButton`, `Switch`
  translate slightly toward the cursor when it's within a radius.

## Scripts

```bash
npm run dev       # vite dev server
npm run build     # tsc --build + vite build
npm run lint      # eslint
npm run preview   # preview a prod build
```

## License

[AGPL-3.0-or-later](./LICENSE) — Infinibay.

If you use Harbor as part of a network service, you must make the modified
source code available to your users under the same license.
