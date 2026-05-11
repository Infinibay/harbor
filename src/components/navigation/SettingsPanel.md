# SettingsPanel

`SettingsPanel` renders a grouped left navigation panel for preferences and account screens. Use it beside a detail pane where the active item controls which settings form appears on the right.

It is a navigation component, not a complete settings page. Your app owns the active section content.

## Import

```tsx
import {
  SettingsPanel,
  type SettingsPanelSection,
} from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
import { useState } from "react";
import { SettingsPanel, type SettingsPanelSection } from "@infinibay/harbor/navigation";

const sections: SettingsPanelSection[] = [
  {
    label: "General",
    items: [
      { id: "profile", label: "Profile", description: "Name, avatar, contact" },
      { id: "appearance", label: "Appearance", description: "Theme and density" },
    ],
  },
];

export function SettingsLayout() {
  const [active, setActive] = useState("profile");

  return <SettingsPanel sections={sections} value={active} onChange={setActive} />;
}
```

## Props

- **sections** - `SettingsPanelSection[]`. Required grouped item data.
- **value** - `string`. Controlled active item id.
- **onChange** - `(id: string) => void`. Called when an item is clicked.
- **header** - `ReactNode`. Optional header above the grouped list.
- **className** - extra classes on the root aside.

## Data Model

Sections have `{ id?, label, items }`. Items have `{ id, label, icon?, description? }`. Section `id` is optional because labels are used as fallback keys. Item ids should be stable because they drive selection and content switching.

## Behavior

If `value` is not provided, the first item in the first section becomes active internally. Clicking an item updates internal state and calls `onChange`. Active items get a tinted background; descriptions are truncated to keep the panel compact.

## Accessibility

Items are native buttons. The panel does not set nav roles, `aria-current`, or tab semantics. For settings pages with route-backed navigation, consider wrapping the pattern in router links or adding current-page semantics.

## Gotchas

- This component does not render the right-side settings content.
- Duplicate item ids will break selection clarity.
- Long labels and descriptions truncate.
- Uncontrolled state does not sync with route changes.

## Related

- `Sidebar` for general app navigation.
- `RailSidebar` for icon-only navigation.
- `SplitPane` for composing settings nav plus content.
