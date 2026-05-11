# RailSidebar

`RailSidebar` is a narrow icon-only navigation rail similar to an editor activity bar or compact workspace switcher. Use it for primary app areas such as files, search, branches, deployments, settings, notifications, and account spaces.

It is best when users recognize the icons through repeated use and can hover for labels.

## Import

```tsx
import { RailSidebar, type RailItem } from "@infinibay/harbor/navigation";
```

## Basic Usage

```tsx
import { useState } from "react";
import { RailSidebar, type RailItem } from "@infinibay/harbor/navigation";

const items: RailItem[] = [
  { id: "files", label: "Files", icon: <span aria-hidden>F</span> },
  { id: "search", label: "Search", icon: <span aria-hidden>S</span> },
  { id: "deploys", label: "Deploys", icon: <span aria-hidden>D</span> },
];

export function WorkbenchRail() {
  const [active, setActive] = useState("files");

  return <RailSidebar items={items} value={active} onChange={setActive} />;
}
```

## Props

- **items** - `RailItem[]`. Required navigation entries.
- **value** - `string`. Active item id.
- **onChange** - `(id: string) => void`. Called when an item is clicked.
- **header** - `ReactNode`. Optional content above the rail items.
- **footer** - `ReactNode`. Optional content pinned below the rail items.
- **className** - extra classes on the root `<aside>`.

## Item Model

```ts
type RailItem = {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
};
```

`label` is used for both the tooltip content and the button's accessible name. `badge` renders in the top-right corner of the item.

## Behavior

The active item gets a tinted background and a left indicator bar. Inactive items become brighter on hover. Labels are shown through Harbor `Tooltip` on the right side.

`RailSidebar` does not render the target panel. Your app switches the adjacent content based on `value`.

## Accessibility

Each item is a button with `aria-label`. Because the visible UI is icon-only, labels must be clear and stable. If an icon is not widely understood, consider a wider `Sidebar` with visible text.

## Gotchas

- This is a controlled navigation rail; update `value` in `onChange`.
- Icons should fit inside a 40px square button.
- Badges can overlap complex icons.
- Tooltips require pointer hover and should not be the only source of critical context.

## Related

- `Sidebar` for text-first navigation.
- `CollapsibleSidebar` for expandable app navigation.
- `AppShell` for composing app chrome.
