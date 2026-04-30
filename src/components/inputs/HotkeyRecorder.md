# HotkeyRecorder

A click-to-record control for capturing keyboard shortcuts. Click
to enter recording mode, press a combo (modifiers + a primary
key), and the result is rendered as `<kbd>` chips with platform
glyphs (`⌘`, `⌃`, `⌥`, `⇧`, `↵`, …). Press `Escape` to abort
recording. Use it for command palette shortcuts, custom keymaps,
or any "set a shortcut" flow.

## Import

```tsx
import { HotkeyRecorder } from "@infinibay/harbor/inputs";
```

## Example

```tsx
const [combo, setCombo] = useState<string[]>(["Meta", "k"]);

<HotkeyRecorder
  label="Open palette"
  value={combo}
  onChange={setCombo}
/>
```

## Props

- **value** — `string[]`. Controlled key combo (e.g.
  `["Meta", "Shift", "p"]`). Modifiers are `"Meta" | "Control" | "Alt" | "Shift"`,
  in that order; the last entry is the primary key.
- **onChange** — `(combo: string[]) => void`. Fired when a new combo
  is captured or cleared.
- **label** — `string`. Caption above the control. Default
  `"Shortcut"`.
- **className** — extra classes on the wrapper.

## Notes

- Recording exits as soon as a non-modifier key is pressed.
- Pressing `Escape` cancels without modifying `value`.
- The "clear" button (visible when a combo is set) emits
  `onChange([])`.
- Modifier glyphs are rendered with the standard mac symbols even
  on non-mac platforms — translate at the consumer if you need OS-
  aware labels.
