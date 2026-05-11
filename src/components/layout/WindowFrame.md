# WindowFrame

`WindowFrame` wraps content in desktop-style chrome: title bar, macOS traffic lights or
Windows controls, optional toolbar, scrollable body, and optional status bar.

Use it for demos, documentation examples, product shots, Tauri previews, and desktop-like
workbench surfaces. It is presentational chrome, not a native window manager. In a real Tauri
or Electron app, decide whether Harbor should draw the frame or the OS should draw it, but do
not show both.

## Import

```tsx
import { WindowFrame } from "@infinibay/harbor/layout";
```

## Basic Usage

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

## Chrome Model

`chromeStyle="macos"` renders traffic lights on the left and reveals their glyphs on hover.
`chromeStyle="windows"` renders labeled minimize, maximize, and close buttons on the right.
The control callbacks are optional; without handlers the buttons remain visual controls.

The title and subtitle are centered in the title bar. `toolbar` appears below the title bar,
`children` render in a scrollable body, and `statusBar` appears at the bottom edge.

## Props

- **title** - `ReactNode`. Centered window title.
- **subtitle** - `ReactNode`. Smaller text next to the title, such as a project or URL.
- **icon** - `ReactNode`. Rendered before the title.
- **children** - `ReactNode`. Window body; scrolls when overflow.
- **toolbar** - `ReactNode`. Strip rendered between title bar and body.
- **statusBar** - `ReactNode`. Strip rendered at the bottom edge.
- **chromeStyle** - `"macos" | "windows"`. Default `"macos"`. Picks
  traffic-lights vs. min/max/close hit-area buttons on the right.
- **onClose** / **onMinimize** / **onMaximize** - `() => void`. Wired
  into the chrome controls.
- **className** - extra classes on the outer frame.
- **bodyClassName** - extra classes on the scrollable body.

## Accessibility

Windows-style controls have accessible labels. macOS traffic-light controls are currently
visual buttons without accessible names, so provide adjacent controls or avoid relying on
them for critical actions in production workflows. The frame itself is a `motion.div`, not a
dialog or application landmark.

If the body contains a screenshot, give the image useful alt text. If it contains a live demo,
make the demo controls keyboard-accessible independently of the frame.

## Gotchas

- `WindowFrame` uses `motion.div layout`, so it can participate in Framer Motion layout
  animation.
- Do not wrap a real native window with a second visual frame unless the app is explicitly
  using custom titlebar mode.
- The frame does not manage drag-to-move, resize, or native window APIs.
- Title content is centered with an absolute overlay; keep titles short enough to avoid
  clipping.

## Related

- `AppShell` for real authenticated app chrome.
- `MenuBar`, `Toolbar`, `BrowserTabs`, and `StatusBar` for desktop-like workspaces.
- `MacScape` for decorative macOS-style presentation.
- `SplitPane` for resizable panes inside the frame.
