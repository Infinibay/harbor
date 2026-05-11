# HotkeyRecorder

`HotkeyRecorder` lets users record a keyboard shortcut by clicking a field and pressing a key combination. It is designed for command palettes, editor settings, desktop-style preferences, canvas tools, and power-user workflows where shortcuts are configurable.

The component records the combo. Your app is responsible for validating conflicts, persisting the shortcut, and binding it to an action.

## Import

```tsx
import { HotkeyRecorder } from "@infinibay/harbor/inputs";
```

## Basic Usage

```tsx
import { useState } from "react";
import { HotkeyRecorder } from "@infinibay/harbor/inputs";

export function ShortcutSetting() {
  const [combo, setCombo] = useState(["Meta", "k"]);

  return (
    <HotkeyRecorder
      label="Open command palette"
      value={combo}
      onChange={setCombo}
    />
  );
}
```

## Props

- **value** - `string[]`. Controlled shortcut keys.
- **onChange** - `(combo: string[]) => void`. Called when a new shortcut is recorded or cleared.
- **label** - `string`. Small label above the recorder. Default `"Shortcut"`.
- **className** - extra classes on the wrapper.

## Behavior

Clicking the recorder enters recording mode and focuses the button. Pressing Escape cancels recording. Pressing a primary key records all active modifiers plus that key, calls `onChange`, and exits recording mode.

Modifiers are ordered as Meta, Control, Alt, Shift. Common keys are rendered as symbols such as `⌘`, `⌃`, `⌥`, `⇧`, `↵`, and arrow glyphs. The clear button calls `onChange([])`.

## Accessibility

The recorder is a button and can receive focus. Recording mode intercepts keydown events and prevents default behavior so browser shortcuts do not accidentally fire while recording. Provide nearby help text when shortcut conflicts or platform differences matter.

## Gotchas

- Recording requires a non-modifier primary key.
- Space is currently not recorded as a primary key because of the primary-key guard.
- The component does not detect duplicate shortcuts.
- Persist combos as arrays, then normalize them in your shortcut registry.

## Related

- `ShortcutSheet` for showing available shortcuts.
- `CommandPalette` for keyboard-first commands.
- `KeyValueEditor` for editable settings maps.
