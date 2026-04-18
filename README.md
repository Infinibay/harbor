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
