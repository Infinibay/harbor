# CanvasShortcuts

Declarative keyboard layer for a canvas. Every prop is a callback;
only the ones you pass get bound. Renders nothing — drop it as a
sibling (or descendant) of your `<Canvas>` and the standard editor
keymap (`Cmd/Ctrl+Z`, `Cmd/Ctrl+D`, `Delete`, arrow nudges, bracket
z-order, etc.) lights up.

## Import

```tsx
import { CanvasShortcuts } from "@infinibay/harbor/layout";
```

## Example

```tsx
<>
  <CanvasShortcuts
    onDelete={deleteSelection}
    onDuplicate={duplicateSelection}
    onSelectAll={selectAll}
    onEscape={() => setSelection([])}
    onUndo={undo}
    onRedo={redo}
    onNudge={({ dx, dy, big }) => nudge(dx, dy, big ? 10 : 1)}
  />
  <Canvas>...</Canvas>
</>
```

## Props

- **onDelete** — `() => void`. `Delete` and `Backspace`.
- **onDuplicate** — `() => void`. `Cmd/Ctrl+D`.
- **onSelectAll** — `() => void`. `Cmd/Ctrl+A`.
- **onEscape** — `() => void`. `Escape`.
- **onNudge** — `({ dx, dy, big }) => void`. Arrow keys nudge by 1
  world unit; `Shift+arrow` nudges by 10 (and sets `big: true`).
- **onUndo** — `() => void`. `Cmd/Ctrl+Z`.
- **onRedo** — `() => void`. `Cmd/Ctrl+Shift+Z` and `Cmd/Ctrl+Y`.
- **onCopy** / **onPaste** / **onCut** — `Cmd/Ctrl+C / V / X`.
- **onBringForward** — `]` and `Cmd/Ctrl+]`.
- **onSendBackward** — `[` and `Cmd/Ctrl+[`.
- **options** — `HotkeyOptions`. Forwarded to `useHotkey` (scope,
  enabled, etc.).

## Notes

- `mod` resolves to `Cmd` on macOS and `Ctrl` elsewhere.
- The component itself doesn't read the Canvas context — wire your
  selection / clipboard / undo state in the parent and pass the
  callbacks here. Keeps the keymap a one-line addition to any canvas
  you build.
