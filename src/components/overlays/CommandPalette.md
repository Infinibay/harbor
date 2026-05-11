# CommandPalette

`CommandPalette` gives product apps a keyboard-first action layer. It filters
commands by label and keywords, groups results by section, supports arrow-key
navigation, runs the highlighted command with Enter, and closes through the
controlled `open` state.

Use it for global actions, navigation, editor commands, admin workflows, and
power-user shortcuts.

## Import

```tsx
import { CommandPalette } from "@infinibay/harbor/overlays";
```

## Basic Usage

Control `open` from parent state. Most apps bind it to `Cmd+K` or `Ctrl+K`.

```tsx
const [paletteOpen, setPaletteOpen] = useState(false);

<CommandPalette
  open={paletteOpen}
  onOpenChange={setPaletteOpen}
  commands={[
    { id: "new-project", label: "Create project", section: "Projects", shortcut: "N", action: openNewProject },
    { id: "billing", label: "Open billing", section: "Account", keywords: ["plan", "invoice"], action: openBilling },
  ]}
/>
```

## Filtering

Matching is fuzzy and lightweight. `keywords` let commands match terms that do
not appear in the visible label.

```tsx
{
  id: "deployments",
  label: "View deployments",
  keywords: ["releases", "preview", "production"],
  action: () => navigate("/deployments"),
}
```

## Props

- `open`: controlled visibility.
- `onOpenChange`: visibility callback.
- `commands`: command definitions.
- `placeholder`: optional search placeholder.

Each command includes `id`, `label`, optional `section`, optional `icon`,
optional `shortcut`, optional `keywords`, and required `action`.

## Accessibility

The palette opens as a modal dialog, focuses the search input, supports keyboard
navigation, and exposes command rows as buttons. Keep command labels verb-first:
"Create project", "Open billing", "Retry deploy".

## Gotchas

The component does not register global hotkeys. Bind `Cmd+K` in your app shell
and pass `open`.

Actions run synchronously from the selected command. If an action starts async
work, handle loading, errors, and confirmations in your application.

## Related

- `Dialog` for focused decisions.
- `Menu` for local command groups.
- `ShortcutSheet` for documenting shortcuts.
- `SearchField` for ordinary page search.
