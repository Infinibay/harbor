# CanvasShortcuts

`CanvasShortcuts` is a renderless keyboard layer for design tools, diagram editors, workflow builders, and any Harbor canvas surface. Drop it near your canvas and pass callbacks for the shortcuts your app supports.

It deliberately does not read canvas state. Selection, undo history, clipboard state, and z-order live in your product model; `CanvasShortcuts` only binds the common keymap to those product actions.

## Import

```tsx
import { CanvasShortcuts } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
import { Canvas, CanvasItem, CanvasShortcuts } from "@infinibay/harbor/layout";

export function DiagramEditor() {
  return (
    <>
      <CanvasShortcuts
        onDelete={deleteSelection}
        onDuplicate={duplicateSelection}
        onSelectAll={selectAllNodes}
        onEscape={clearSelection}
        onUndo={undo}
        onRedo={redo}
        onCopy={copySelection}
        onPaste={pasteSelection}
        onCut={cutSelection}
        onNudge={({ dx, dy, big }) => moveSelection(dx, dy, big)}
      />

      <Canvas>
        {nodes.map((node) => (
          <CanvasItem key={node.id} id={node.id} x={node.x} y={node.y}>
            <NodeCard node={node} />
          </CanvasItem>
        ))}
      </Canvas>
    </>
  );
}
```

## Keymap

- **Delete / Backspace**: `onDelete`.
- **Cmd/Ctrl+D**: `onDuplicate`.
- **Cmd/Ctrl+A**: `onSelectAll`.
- **Escape**: `onEscape`.
- **Arrow keys**: `onNudge({ dx, dy, big: false })`.
- **Shift+Arrow keys**: `onNudge({ dx, dy, big: true })` with 10-unit deltas.
- **Cmd/Ctrl+Z**: `onUndo`.
- **Cmd/Ctrl+Shift+Z** and **Cmd/Ctrl+Y**: `onRedo`.
- **Cmd/Ctrl+C / V / X**: `onCopy`, `onPaste`, `onCut`.
- **]** and **Cmd/Ctrl+]**: `onBringForward`.
- **[** and **Cmd/Ctrl+[**: `onSendBackward`.

## Props

- **onDelete**, **onDuplicate**, **onSelectAll**, **onEscape**: selection lifecycle callbacks.
- **onNudge**: `({ dx, dy, big }) => void`. Plain arrows send 1-unit deltas; shifted arrows send 10-unit deltas.
- **onUndo** / **onRedo**: history callbacks.
- **onCopy** / **onPaste** / **onCut**: clipboard callbacks.
- **onBringForward** / **onSendBackward**: z-order callbacks.
- **options**: `HotkeyOptions`. Forwarded to `useHotkey` for enabling, disabling, and scoping.

## Accessibility

Keyboard shortcuts should be discoverable. Pair this component with visible toolbar actions, menu items, or a shortcut sheet so the same operations are available without memorizing keys.

Do not trap keyboard focus in the canvas unless the surrounding app also provides a clear way to leave the workspace. Use `options` to disable shortcuts while dialogs, text fields, command palettes, or popovers are active.

## Gotchas

- `mod` means `Cmd` on macOS and `Ctrl` on Windows/Linux.
- The component renders `null`. If nothing happens, inspect the callbacks and `options.enabled`; there is no visible DOM node to debug.
- Text inputs and editors may need scoped hotkey handling so typing does not trigger canvas actions.
- `big` already tells you whether the user held Shift. Do not multiply the delta twice unless your app intentionally wants larger jumps.

## Related

- [`Canvas`](./Canvas.md) for the main interactive surface.
- [`CanvasMarquee`](./CanvasMarquee.md) for rubber-band selection.
- [`ShortcutSheet`](../dev/ShortcutSheet.md) for documenting available shortcuts.
