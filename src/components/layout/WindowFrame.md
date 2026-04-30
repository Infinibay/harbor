# WindowFrame

Decorative OS window chrome — title bar with traffic-light or Windows
controls, optional toolbar / status bar, and a scrollable body. Use it
to frame demos, screenshots, and product shots in marketing pages.
For real application chrome reach for `<AppShell>` instead.

## Import

```tsx
import { WindowFrame } from "@infinibay/harbor/layout";
```

## Example

```tsx
<WindowFrame
  title="harbor — showcase"
  subtitle="localhost:3000"
  chromeStyle="macos"
  toolbar={<Toolbar variant="flat">{/* ... */}</Toolbar>}
  onClose={() => {}}
  onMinimize={() => {}}
  onMaximize={() => {}}
>
  <img src="/picture.png" alt="" />
</WindowFrame>
```

## Props

- **title** — `ReactNode`. Centered window title.
- **subtitle** — `ReactNode`. Smaller text next to the title (e.g. URL).
- **icon** — `ReactNode`. Rendered before the title.
- **children** — `ReactNode`. Window body (scrolls when overflow).
- **toolbar** — `ReactNode`. Strip rendered between title bar and body.
- **statusBar** — `ReactNode`. Strip rendered at the bottom edge.
- **chromeStyle** — `"macos" | "windows"`. Default `"macos"`. Picks
  traffic-lights vs. min/max/close hit-area buttons on the right.
- **onClose** / **onMinimize** / **onMaximize** — `() => void`. Wired
  into the chrome controls.
- **className** — extra classes on the outer frame.
- **bodyClassName** — extra classes on the scrollable body.

## Notes

- The frame uses `motion.div layout`, so animating it inside an
  `<AnimatePresence>` or alongside layout-id siblings works out of
  the box.
- Traffic-light glyphs (× — +) reveal on hover, matching native macOS.
