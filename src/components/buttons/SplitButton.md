# SplitButton

`SplitButton` combines one primary command with a secondary menu of related variants. The
left side executes the default action immediately. The caret opens a portal menu for less
common alternatives.

Use it when a workflow has one obvious action plus variants: "Deploy" and "Deploy preview",
"Save" and "Save as", "Export CSV" and other formats, "Create" and create-from-template.
If every action is equally important, use `ButtonGroup` or `Menu` instead.

## Import

```tsx
import { SplitButton } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
<SplitButton
  primary={{ id: "deploy", label: "Deploy", onSelect: deploy }}
  options={[
    { id: "preview", label: "Deploy preview", description: "Create an isolated URL.", onSelect: deployPreview },
    { id: "canary", label: "Deploy canary", description: "Roll out to 10% first.", onSelect: deployCanary },
  ]}
/>
```

## Action Model

`primary` and every item in `options` use the same option shape: `id`, `label`, optional
`description`, optional `icon`, and `onSelect`. Clicking the primary side calls
`primary.onSelect`. Clicking an option calls that option's `onSelect` and closes the menu.

The menu is rendered through `Portal`, positioned from the caret button, and repositions on
scroll and resize while open.

## Props

- **primary** - `SplitButtonOption`. Main action.
- **options** - `SplitButtonOption[]`. Menu actions.
- **variant** - `"primary" | "secondary"`. Default `"primary"`.
- **className** - extra classes.

### SplitButtonOption

- **id** - stable key.
- **label** - visible label.
- **description** - optional secondary line in the menu.
- **icon** - optional leading icon.
- **onSelect** - command callback.

## Accessibility

The primary action and caret are separate buttons. The caret has an accessible label and the
menu options are buttons. Keep labels command-oriented: "Deploy preview" is clearer than
"Preview" when read out of context.

The current menu is pointer-friendly but does not implement full menu keyboard navigation.
For command-heavy experiences that need robust keyboard behavior, use `Menu` or
`CommandPalette`.

## Gotchas

- Do not hide dangerous alternatives behind a split menu without confirmation.
- The primary action should be the safest and most common action.
- `options` are not grouped; if you need separators or sections, compose a custom menu.
- The component does not manage loading or disabled states. Wrap command callbacks in your
  own state when actions are async.

## Related

- `Button` for a single command.
- `ButtonGroup` for equal sibling commands.
- `Menu` for richer command menus.
- `CommandPalette` for keyboard-first command surfaces.
