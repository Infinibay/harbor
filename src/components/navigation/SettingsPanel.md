# SettingsPanel

Two-pane-style left rail for settings/preferences screens. Groups items
under labeled sections, with each item showing icon + label + optional
description. Pair with a content pane on the right that reacts to the
selected `value`. Use this when entries need extra context per row;
otherwise reach for `<Sidebar>`.

## Import

```tsx
import { SettingsPanel } from "@infinibay/harbor/navigation";
```

## Example

```tsx
const sections = [
  {
    label: "General",
    items: [
      { id: "profile", label: "Profile", description: "Name, avatar, contact" },
      { id: "appearance", label: "Appearance", description: "Theme and density" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "members", label: "Members", description: "Invitations and roles" },
      { id: "billing", label: "Billing", description: "Plan and invoices" },
    ],
  },
];

<SettingsPanel sections={sections} value={page} onChange={setPage} />
```

## Props

- **sections** — `SettingsPanelSection[]`. Required. Each section is
  `{ id?, label, items }`. Items are
  `{ id, label, icon?, description? }`.
- **value** — `string`. Controlled selected item id.
- **onChange** — `(id: string) => void`.
- **header** — `ReactNode`. Optional header rendered above the list.
- **className** — extra classes on the `<aside>`.

## Notes

- Fixed width (`w-64`) and full height — place inside a flex parent.
- Section labels use the same uppercase tracking style as `<Sidebar>`.
- Long descriptions truncate to one line; keep them short.
