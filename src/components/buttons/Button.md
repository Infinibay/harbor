# Button

Primary command primitive for Harbor interfaces. Use `Button` for actions that
change state, submit forms, open workflows, confirm decisions, or trigger app
commands. It is theme-aware, target-aware, cursor-reactive, and built on a
native button so it keeps standard keyboard behavior.

Use one primary button per region. Pair it with secondary, ghost, or link
buttons when the user needs alternatives. For icon-only commands, use
`IconButton`; for a primary action with adjacent alternatives, use
`SplitButton`.

## Import

```tsx
import { Button } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
<Button onClick={saveChanges}>Save changes</Button>

<Button variant="secondary" size="sm" onClick={preview}>
  Preview
</Button>

<Button variant="destructive" onClick={deleteProject}>
  Delete project
</Button>
```

## Props

- **variant** - `"primary" | "secondary" | "ghost" | "destructive" | "glass" | "link"`.
  Default `"primary"`.
- **size** - `"sm" | "md" | "lg"`. Sizes read target and density tokens.
- **loading** - shows a spinner, hides the label visually, and disables the
  button while the operation is pending.
- **disabled** - uses the native disabled state and disables motion feedback.
- **icon** / **iconRight** - render leading or trailing visual affordances.
- **fullWidth** - stretches the button to the width of its container.
- **align** - aligns content inside a full-width button: `"start"`,
  `"center"`, or `"end"`.
- **reactive** - enables the cursor-following inner glow and subtle lean.
  Default `true`.
- **magnetic** - increases the cursor pull distance and motion strength.
- **ripple** - emits a click ripple from the pointer position. Default `true`.

All normal button attributes such as `type`, `name`, `value`, `aria-*`, and
event handlers are forwarded.

## Interaction Model

`Button` renders a native `button` wrapped with Framer Motion. Pointer press
uses a small scale animation. When `reactive` is enabled, the button reads
cursor proximity and paints a soft inner glow. When `ripple` is enabled,
clicking adds a temporary radial ripple from the pointer position. `loading`
and `disabled` both block interaction.

For forms, pass `type="submit"` explicitly when the button should submit. Use
`type="button"` for incidental commands inside forms so they do not submit
accidentally.

## Composition Notes

Use `Button` at the command level, not as generic decoration. Common patterns:

- page action in `PageHeader`;
- confirmation action in `DialogButtons`;
- toolbar command inside `ToolbarGroup`;
- row or drawer action where the target object is clear;
- CTA inside onboarding or setup flows.

Choose variants semantically. `primary` means the main next action, `secondary`
means a safe alternative, `ghost` means low emphasis, `destructive` means a
dangerous mutation, `glass` is for glassy surfaces, and `link` is for text-like
commands.

## Accessibility

Because it is a native button, keyboard activation and disabled state work as
expected. Use clear visible text. If the visible label is only an icon, switch
to `IconButton` or provide an accessible name with `aria-label`. Do not use
`Button` for navigation; use your router link or Harbor navigation components.

## Gotchas

- The docs and source use `destructive`, not `danger`.
- `loading` disables the button, so keep pending state in your app code.
- `fullWidth` controls layout width, but `align` controls inner content
  alignment.
- Cursor-reactive motion is intentionally decorative; do not use it as the only
  state indicator.

## Related Components

`IconButton`, `CopyButton`, `SplitButton`, `ButtonGroup`, `ToggleButton`,
`FAB`, `SpeedDial`, `DialogButtons`, `Toolbar`.
