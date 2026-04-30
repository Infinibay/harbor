# CommandPalette

A keyboard-first action launcher (⌘K). Fuzzy-matches a flat list of
`Command` objects against the user's query, groups them by section,
and runs the selected command's `action`. Use it as the global "go
anywhere, do anything" shortcut. For a click-anchored dropdown of
actions on a specific element use `<Menu>`; for a right-click region
use `<ContextMenu>`.

## Import

```tsx
import { CommandPalette } from "@infinibay/harbor/overlays";
```

## Example

```tsx
const [open, setOpen] = useState(false);

const commands = [
  { id: "new-doc", label: "New document", section: "Workspace",
    shortcut: "⌘N", action: () => createDoc() },
  { id: "go-home", label: "Go to home", section: "Navigate",
    keywords: ["dashboard"], action: () => navigate("/") },
];

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={commands}
/>;
```

## Props

- **open** — `boolean`. Controlled visibility.
- **onOpenChange** — `(open: boolean) => void`. Fires on open and on
  every close path (Esc, backdrop click, or running a command).
- **commands** — `Command[]`. Flat list. Each command groups under its
  `section` (default `"Actions"`). Order is preserved within a section.
- **placeholder** — `string`. Defaults to the i18n string
  `harbor.commandPalette.placeholder`.

### `Command`

- **id** — `string`. Stable identity for animation.
- **label** — `string`. Visible name used for matching.
- **section** — `string`. Optional group header.
- **icon** — `ReactNode`. Optional leading glyph.
- **shortcut** — `string`. Optional trailing hint (e.g. `"⌘N"`).
- **keywords** — `string[]`. Extra match terms not shown in the UI.
- **action** — `() => void`. Runs on Enter or click; the palette closes
  and clears the query afterwards.

## Notes

- Filtering is a simple subsequence-fuzzy score across `label` and
  `keywords`. Results are capped at 12.
- `↑` `↓` move the active row, `Enter` runs it, `Esc` closes. Bind
  `⌘K` / `Ctrl+K` yourself in the parent.
- Portals to `document.body` at `Z.COMMAND_PALETTE`, above tooltips,
  popovers, and dialogs.
