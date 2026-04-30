# Tabs

Composable tabs with three visual variants (`pill`, `underline`,
`card`) and animated active indicators. Use for switching between
panels of related content within the same view. For a compact, flat
option picker without panels, use `<SegmentedControl>`. The active
panel fades up on mount via `<ContentSwap>`.

## Import

```tsx
import { Tabs, TabList, Tab, TabPanel } from "@infinibay/harbor/navigation";
```

## Example

```tsx
<Tabs defaultValue="overview" variant="pill">
  <TabList>
    <Tab value="overview" icon={<ChartIcon />}>Overview</Tab>
    <Tab value="activity">Activity</Tab>
    <Tab value="settings" disabled>Settings</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
  <TabPanel value="settings">…</TabPanel>
</Tabs>
```

## Props (`<Tabs>`)

- **value** — `string`. Controlled active tab value.
- **defaultValue** — `string`. Uncontrolled initial value.
- **onValueChange** — `(v: string) => void`.
- **variant** — `"pill" | "underline" | "card"`. Default `"pill"`.
- **children** — `<TabList>` and `<TabPanel>`s.
- **className** — extra classes on the wrapper.

## Props (`<TabList>`)

- **children** — `<Tab>`s.
- **className** — extra classes. The component picks the layout
  (rounded pill bar, underline border, or stacked card tabs) based on
  the parent `<Tabs variant>`.

## Props (`<Tab>`)

- **value** — `string`. Required. Matches a `<TabPanel value>`.
- **children** — `ReactNode`. Tab label.
- **icon** — `ReactNode`. Leading icon.
- **disabled** — `boolean`. Greys the tab and blocks selection.

## Props (`<TabPanel>`)

- **value** — `string`. Required. Renders only when active.
- **children** — `ReactNode`. Panel content.
- **className** — extra classes (a `mt-4` is added by default).

## Notes

- `<Tab>` and `<TabPanel>` must be descendants of `<Tabs>` — they read
  selection from context and will throw if used standalone.
- The active indicator (pill background or underline) animates between
  tabs via `framer-motion` `layoutId`.
- Only the active panel is mounted; switching unmounts the previous
  panel synchronously, then `<ContentSwap>` fades the new one in.
