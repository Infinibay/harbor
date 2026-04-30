# ShortcutSheet

A modal cheat sheet of keyboard shortcuts, grouped and searchable.
Wraps `<Dialog>` internally — pair with a `?` keybinding for the
classic "press ? for shortcuts" pattern.

## Import

```tsx
import { ShortcutSheet } from "@infinibay/harbor/dev";
```

## Example

```tsx
const [open, setOpen] = useState(false);

<ShortcutSheet
  open={open}
  onClose={() => setOpen(false)}
  groups={[
    {
      title: "Global",
      items: [
        { keys: ["⌘", "K"], description: "Open command palette" },
        { keys: ["⌘", "/"], description: "Toggle this sheet" },
      ],
    },
    {
      title: "Navigation",
      items: [
        { keys: ["G", "H"], description: "Go home" },
        { keys: ["?"],      description: "Show help" },
      ],
    },
  ]}
/>;
```

## ShortcutGroup / ShortcutItem

```ts
ShortcutGroup { title: string; items: ShortcutItem[] }
ShortcutItem  { keys: string[]; description: string }
```

## Props

- **open** — `boolean`. Required.
- **onClose** — `() => void`. Required.
- **groups** — `ShortcutGroup[]`. Required.

## Notes

- The search box filters across both descriptions and key strings —
  empty groups are hidden when filtered.
- Renders a 2-column grid on `md+`; single column on small screens.
