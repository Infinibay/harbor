# ShortcutSheet

`ShortcutSheet` is a searchable keyboard-shortcut reference inside a Harbor
`Dialog`. It is useful for command palettes, editors, admin consoles, desktop
apps, and any product surface where power users can move faster with the
keyboard.

The component documents shortcuts; it does not bind them. Your app should own
the actual hotkey handlers and open this sheet from a help button, command
palette action, or `?` shortcut.

## Import

```tsx
import { ShortcutSheet } from "@infinibay/harbor/dev";
```

## Basic Usage

```tsx
const [open, setOpen] = useState(false);

return (
  <>
    <Button onClick={() => setOpen(true)}>Shortcuts</Button>

    <ShortcutSheet
      open={open}
      onClose={() => setOpen(false)}
      groups={[
        {
          title: "Global",
          items: [
            { keys: ["⌘", "K"], description: "Open command palette" },
            { keys: ["?"], description: "Show keyboard shortcuts" },
          ],
        },
        {
          title: "Editor",
          items: [
            { keys: ["⌘", "S"], description: "Save current file" },
            { keys: ["⌥", "Click"], description: "Place secondary cursor" },
          ],
        },
      ]}
    />
  </>
);
```

## Props

- **open** - `boolean`. Required. Controls the dialog visibility.
- **onClose** - `() => void`. Required. Called by the underlying `Dialog` close
  behavior.
- **groups** - `ShortcutGroup[]`. Required. Groups shortcuts into named
  sections.

## Data Model

```ts
type ShortcutGroup = {
  title: string;
  items: ShortcutItem[];
};

type ShortcutItem = {
  keys: string[];
  description: string;
};
```

Each key in `keys` renders as its own `kbd`, so pass combinations as arrays:
`["⌘", "K"]`, `["Shift", "Enter"]`, or `["G", "H"]`.

## Search Behavior

The sheet includes an autofocus search field. Harbor filters against both the
human description and the joined key sequence, so typing `save`, `cmd`, or `k`
can all narrow the list. Groups with no matching items are hidden while the
query is active.

On medium screens and above, groups render in two columns. On narrow screens,
the layout collapses to a single column so long descriptions remain readable.

## Accessibility

Because `ShortcutSheet` wraps `Dialog`, focus is contained while the sheet is
open and returned by the dialog layer when it closes. Keep shortcut descriptions
action-oriented and specific: `Save current file` is more useful than `Save`.

Do not rely on symbols alone for platform-specific commands. If a shortcut only
works on macOS, Windows, or Linux, mention that in the description or provide
separate groups.

## Gotchas

- This component does not register keyboard listeners. Pair it with your own
  hotkey hook or command system.
- Keep group sizes balanced. One group with 40 shortcuts is harder to scan than
  several groups named by workflow.
- Use stable shortcut data from the same source as your hotkey bindings when
  possible, so the reference does not drift from the product.

## Related

- `CommandPalette` for searchable actions.
- `Dialog` for custom help and reference modals.
- `Toolbar` and `MenuBar` for visible command surfaces.
