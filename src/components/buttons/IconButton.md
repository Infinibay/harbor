# IconButton

`IconButton` is a square, icon-only button with Harbor sizing, variants, focus styles, and optional cursor-reactive motion. Use it for compact commands in toolbars, table rows, card headers, inspectors, canvas controls, and dense app chrome.

Use a text `Button` when the action is not obvious from the icon. Use `CloseButton` or `MoreButton` for those specific actions because they already carry the expected shape and semantics.

## Import

```tsx
import { IconButton } from "@infinibay/harbor/buttons";
```

## Basic Usage

```tsx
import { IconButton } from "@infinibay/harbor/buttons";

function SettingsIcon() {
  return <span aria-hidden>⚙</span>;
}

export function ToolbarAction() {
  return (
    <IconButton
      icon={<SettingsIcon />}
      label="Open settings"
      onClick={() => console.log("open settings")}
    />
  );
}
```

## Props

- **icon** - `ReactNode`. Required visual glyph.
- **label** - `string`. Required accessible name. Also becomes the native `title`.
- **size** - `"sm" | "md" | "lg"`. Default `"md"`.
- **variant** - `"solid" | "ghost" | "glass"`. Default `"solid"`.
- **reactive** - `boolean`. Enables or disables cursor-proximity lean and glow.
- **quiet** - `boolean`. Convenience option for dense contexts. Defaults to `true` when `size="sm"`.
- Inherits standard `<button>` attributes such as `disabled`, `type`, `onClick`, and `aria-*`.

## Variants

`solid` gives the button a visible filled surface and border. Use it for standalone icon actions.

`ghost` is quieter and works well in table rows, headers, and toolbars where many actions appear together.

`glass` uses Harbor's glass surface styling and fits floating controls, overlay actions, and media tooling.

## Behavior

Medium and large buttons are reactive by default. They lean slightly toward the cursor, rotate the icon a little, and render an inner radial glow. Small buttons default to quiet behavior to avoid jitter in dense rows. Tap uses a spring scale and rotate animation.

## Accessibility

`label` is required because the visible content is only an icon. Keep the label action-oriented: "Edit project", "Open filters", "Delete row". If the icon itself contains decorative SVG or text, mark that icon content as `aria-hidden`.

## Gotchas

- `quiet` and `reactive={false}` both disable the magnetic feel.
- Do not rely on `title` as the only explanation for unfamiliar icons. Add adjacent text or a proper tooltip when needed.
- Always set `type="button"` when placing `IconButton` inside a form unless submit behavior is intended.

## Related

- `Button` for text or icon-plus-text actions.
- `CloseButton` for dismiss controls.
- `MoreButton` for overflow menus.
