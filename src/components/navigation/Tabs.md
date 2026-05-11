# Tabs

`Tabs` switches between related panels without leaving the current page. Harbor
tabs are designed for product surfaces: settings pages, inspectors, dashboards,
playgrounds, account screens, and split workflows where each panel represents a
clear mode or category.

Use tabs for peer views. Use `Sidebar` for major app sections and `SegmentedControl`
for compact value selection.

## Import

```tsx
import { Tabs, TabList, Tab, TabPanel } from "@infinibay/harbor/navigation";
```

## Basic Usage

Use `defaultValue` for local state.

```tsx
<Tabs defaultValue="overview">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="usage">Usage</Tab>
    <Tab value="settings">Settings</Tab>
  </TabList>

  <TabPanel value="overview">Overview content</TabPanel>
  <TabPanel value="usage">Usage content</TabPanel>
  <TabPanel value="settings">Settings content</TabPanel>
</Tabs>
```

## Controlled Tabs

Pass `value` and `onValueChange` when the active tab should sync with route
state, URL search params, or a parent layout.

```tsx
<Tabs value={tab} onValueChange={setTab} variant="underline">
  <TabList>
    <Tab value="code">Code</Tab>
    <Tab value="preview">Preview</Tab>
  </TabList>
  <TabPanel value="code"><CodeEditor /></TabPanel>
  <TabPanel value="preview"><Preview /></TabPanel>
</Tabs>
```

## Variants

`variant` can be `pill`, `underline`, or `card`.

- `pill`: default, good inside dense tools.
- `underline`: good for pages and docs.
- `card`: good when panels sit on a framed surface.

## Props

`Tabs` accepts `value`, `defaultValue`, `onValueChange`, `variant`, `children`,
and `className`.

`Tab` accepts `value`, `children`, optional `icon`, and optional `disabled`.

`TabPanel` accepts `value`, `children`, and `className`.

## Accessibility

Tabs are buttons that expose selected state and disabled state. Keep labels short
and stable; changing tab names after selection makes orientation harder.

If tabs represent routes, keep the URL in sync with the selected value so users
can share and reload the same view.

## Gotchas

`TabPanel` unmounts when inactive. Store important form state above the panel if
users can switch tabs mid-edit.

The initial internal value defaults to `defaultValue` or an empty string. Always
provide a default unless you are controlling the value.

## Related

- `SegmentedControl` for compact option switching.
- `BrowserTabs` for document-style tab strips.
- `ContentSwap` for animated panel transitions.
- `Sidebar` for persistent app navigation.
